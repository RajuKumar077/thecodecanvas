import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import './Cursor.css';

const INTERACTIVE = 'a[href], button, [role="tab"], summary, [data-cursor]';
const TEXT = 'input, textarea, select, [contenteditable="true"]';

/* Ring geometry per state: [width, height, radius]. */
const SIZES = {
  default: [34, 34, 17],
  link: [58, 58, 29],
  lens: [86, 86, 43],
  media: [96, 96, 48],
  text: [0, 0, 0],
};

/**
 * Context-aware cursor (fine pointers only, off under reduced motion).
 *
 *  · default  — dot + trailing ring that stretches with velocity
 *  · link     — ring swells into a soft blue lens
 *  · stick    — ring wraps pill-shaped controls (buttons, tabs, chips, nav)
 *  · media    — solid disc with a label, from data-cursor="media" + data-cursor-label
 *  · lens     — wide ring over interactive visuals, data-cursor="lens"
 *  · text     — hides so the native I-beam shows in inputs
 *
 * Extra motion layers:
 *  · comet trail — tapered, fading line behind the pointer (canvas)
 *  · click burst — radial sparks on press, alongside the ripple (canvas)
 *  · magnetic    — pill controls ease toward the pointer while hovered
 *
 * Also drives two delegated effects so the page needs no extra listeners:
 *  · [data-spotlight] — sets --mx/--my/--spot-a for a cursor-lit border
 *  · [data-tilt]      — subtle 3D tilt toward the pointer (value = max degrees)
 * Dark surfaces opt in with data-cursor-theme="dark". Modal dialogs restore
 * the native cursor (the top layer would paint over a fixed element).
 */
export default function Cursor() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    const labelEl = labelRef.current;
    const html = document.documentElement;
    html.classList.add('has-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const prev = { ...pos };
    const ring = { x: pos.x, y: pos.y, w: 34, h: 34, r: 17 };
    let mode = 'default';
    let label = '';
    let theme = 'light';
    let stickEl = null;
    let stickRadius = 0;
    let mediaSize = 96;
    let stretch = 0;
    let angle = 0;
    let press = 1;
    let down = false;
    let visible = false;
    let dialogOpen = false;
    let needsResolve = false;
    let raf = 0;
    let last = performance.now();
    let frame = 0;

    /* ---------- State resolution ---------- */

    const resolve = (node) => {
      const el0 = node && node.nodeType === 1 ? node : null;
      const dark = !!el0?.closest('[data-cursor-theme="dark"]');
      let m = 'default';
      let l = '';
      let s = null;
      let rad = 0;

      if (el0?.closest(TEXT)) m = 'text';
      else {
        const el = el0?.closest(INTERACTIVE);
        if (el && !el.disabled) {
          if (el.dataset.cursor) {
            m = el.dataset.cursor;
            l = el.dataset.cursorLabel || '';
          } else {
            const b = el.getBoundingClientRect();
            rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
            const pill = b.width <= 360 && b.height <= 72 && (rad >= 8 || el.tagName === 'BUTTON');
            if (pill) {
              m = 'stick';
              s = el;
            } else m = 'link';
          }
        }
      }

      if (m === mode && l === label && s === stickEl && dark === (theme === 'dark')) return;
      mode = m;
      label = l;
      stickEl = s;
      stickRadius = rad;
      theme = dark ? 'dark' : 'light';
      root.dataset.state = m;
      root.dataset.theme = theme;
      syncColors();
      if (labelEl.textContent !== l) {
        labelEl.textContent = l;
        mediaSize = Math.max(SIZES.media[0], labelEl.offsetWidth + 36);
      }
    };

    /* ---------- Tilt + spotlight (delegated) ---------- */

    const tilts = new Map();
    let tiltEl = null;
    let spotEl = null;

    const tiltOf = (el) => {
      let t = tilts.get(el);
      if (!t) {
        gsap.set(el, { transformPerspective: 900 });
        t = {
          rx: gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' }),
          ry: gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' }),
        };
        tilts.set(el, t);
      }
      return t;
    };

    const updateSurfaces = (e) => {
      const target = e.target.nodeType === 1 ? e.target : null;

      const tEl = target?.closest('[data-tilt]') ?? null;
      if (tEl !== tiltEl) {
        if (tiltEl) {
          const t = tiltOf(tiltEl);
          t.rx(0);
          t.ry(0);
        }
        tiltEl = tEl;
      }
      if (tEl) {
        const b = tEl.getBoundingClientRect();
        const max = Number(tEl.dataset.tilt) || 6;
        const t = tiltOf(tEl);
        t.ry(((e.clientX - b.left) / b.width - 0.5) * max * 2);
        t.rx(-((e.clientY - b.top) / b.height - 0.5) * max * 2);
      }

      const sEl = target?.closest('[data-spotlight]') ?? null;
      if (sEl !== spotEl) {
        if (spotEl) gsap.to(spotEl, { '--spot-a': 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        if (sEl) gsap.to(sEl, { '--spot-a': 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        spotEl = sEl;
      }
      if (sEl) {
        const b = sEl.getBoundingClientRect();
        sEl.style.setProperty('--mx', `${e.clientX - b.left}px`);
        sEl.style.setProperty('--my', `${e.clientY - b.top}px`);
      }
    };

    /* ---------- Trail, sparks, magnetic pull ---------- */

    const TRAIL_MS = 420;
    const MAG_PULL = 0.28;
    const MAG_MAX = 10;
    const trail = [];
    const sparks = [];
    const mags = new Map();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let painted = false;

    const fit = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    const clearCanvas = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      painted = false;
    };

    // Trail / spark colour = the cursor's live accent, so it follows the theme.
    let rgb = '167,125,72';
    const syncColors = () => {
      const v = getComputedStyle(root).getPropertyValue('--cur-accent-rgb').trim();
      if (v) rgb = v.split(/\s+/).join(',');
    };
    syncColors();
    const themeWatch = new MutationObserver(syncColors);
    themeWatch.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    const rgbNow = () => rgb;

    const burst = () => {
      const rgb = rgbNow();
      const n = 12;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
        const v = 0.14 + Math.random() * 0.3; // px per ms
        sparks.push({ x: pos.x, y: pos.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1.4 + Math.random() * 1.8, life: 1, rgb });
      }
    };

    const magnetize = (ease) => {
      if (mode === 'stick' && stickEl?.isConnected && !mags.has(stickEl)) mags.set(stickEl, { x: 0, y: 0 });
      const k = ease(0.18);
      mags.forEach((m, el) => {
        const active = el === stickEl && mode === 'stick' && el.isConnected;
        let gx = 0;
        let gy = 0;
        if (active) {
          const b = el.getBoundingClientRect();
          // The rect already includes the current offset — subtract it to get the resting centre.
          const cx = b.left + b.width / 2 - m.x;
          const cy = b.top + b.height / 2 - m.y;
          gx = Math.max(-MAG_MAX, Math.min(MAG_MAX, (pos.x - cx) * MAG_PULL));
          gy = Math.max(-MAG_MAX, Math.min(MAG_MAX, (pos.y - cy) * MAG_PULL));
        }
        m.x += (gx - m.x) * k;
        m.y += (gy - m.y) * k;
        if (!active && Math.abs(m.x) < 0.05 && Math.abs(m.y) < 0.05) {
          el.style.translate = '';
          mags.delete(el);
        } else el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      });
    };

    const paint = (now, dt) => {
      if (mode !== 'text' && !dialogOpen) {
        const l = trail[trail.length - 1];
        if (!l || Math.hypot(pos.x - l.x, pos.y - l.y) > 2) trail.push({ x: pos.x, y: pos.y, t: now });
      }
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();

      if (!trail.length && !sparks.length) {
        if (painted) clearCanvas();
        return;
      }
      painted = true;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const rgb = rgbNow();
      ctx.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
        ctx.strokeStyle = `rgba(${rgb},${(life * 0.4).toFixed(3)})`;
        ctx.lineWidth = 1 + life * 4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      const drag = Math.pow(0.93, dt / 16.667);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt / 650;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= drag;
        s.vy *= drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.fillStyle = `rgba(${s.rgb},${(s.life * 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.4 + s.life * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ---------- Render loop ---------- */

    const setBox = (w, h, r) => {
      if (Math.abs(w - ringEl._w) > 0.1) ringEl.style.width = `${(ringEl._w = w)}px`;
      if (Math.abs(h - ringEl._h) > 0.1) ringEl.style.height = `${(ringEl._h = h)}px`;
      if (Math.abs(r - ringEl._r) > 0.1) ringEl.style.borderRadius = `${(ringEl._r = r)}px`;
    };
    ringEl._w = ringEl._h = ringEl._r = -1;

    const checkDialog = () => {
      const open = !!document.querySelector('dialog[open]');
      if (open === dialogOpen) return;
      dialogOpen = open;
      html.classList.toggle('has-cursor', !open);
      root.classList.toggle('is-suspended', open);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      // rAF timestamps are frame-start times and can precede a performance.now()
      // read in the same frame — clamp so a negative dt can never invert the easing.
      const dt = Math.min(64, Math.max(1, now - last));
      last = Math.max(last, now);
      const ease = (base) => 1 - Math.pow(1 - base, dt / 16.667);

      if (frame++ % 10 === 0) checkDialog();
      if (needsResolve) {
        needsResolve = false;
        resolve(document.elementFromPoint(pos.x, pos.y));
      }

      magnetize(ease);

      let tx = pos.x;
      let ty = pos.y;
      let tw;
      let th;
      let tr;
      if (mode === 'stick' && stickEl?.isConnected) {
        const b = stickEl.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        tx = cx + (pos.x - cx) * 0.1;
        ty = cy + (pos.y - cy) * 0.1;
        tw = b.width + 12;
        th = b.height + 12;
        tr = Math.min(stickRadius + 6, th / 2);
      } else if (mode === 'media') {
        tw = th = mediaSize;
        tr = mediaSize / 2;
      } else {
        [tw, th, tr] = SIZES[mode] ?? SIZES.default;
      }

      const k = ease(mode === 'stick' ? 0.24 : 0.17);
      const ks = ease(0.2);
      ring.x += (tx - ring.x) * k;
      ring.y += (ty - ring.y) * k;
      ring.w += (tw - ring.w) * ks;
      ring.h += (th - ring.h) * ks;
      ring.r += (tr - ring.r) * ks;

      // Velocity stretch along the direction of travel (R·S·R⁻¹, so the shape never spins).
      const dx = pos.x - prev.x;
      const dy = pos.y - prev.y;
      prev.x = pos.x;
      prev.y = pos.y;
      const speed = Math.hypot(dx, dy) / dt;
      const want = mode === 'default' || mode === 'link' ? Math.min(speed * 0.22, 0.42) : 0;
      stretch += (want - stretch) * ease(0.16);
      if (speed > 0.04) angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      press += ((down ? 0.8 : 1) - press) * ease(0.3);

      setBox(ring.w, ring.h, ring.r);
      ringEl.style.transform =
        `translate3d(${ring.x - ring.w / 2}px, ${ring.y - ring.h / 2}px, 0) ` +
        `rotate(${angle}deg) scale(${(1 + stretch) * press}, ${(1 - stretch * 0.45) * press}) rotate(${-angle}deg)`;
      dotEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      paint(now, dt);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      trail.length = 0;
      sparks.length = 0;
      clearCanvas();
    };

    /* ---------- Events ---------- */

    const show = () => {
      if (visible) return;
      visible = true;
      root.classList.add('is-visible');
      start();
    };
    const hide = () => {
      visible = false;
      root.classList.remove('is-visible');
      stop();
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return hide();
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        ring.x = prev.x = pos.x;
        ring.y = prev.y = pos.y;
        resolve(e.target);
        show();
      }
      updateSurfaces(e);
    };
    const onOver = (e) => e.pointerType !== 'touch' && resolve(e.target);
    const onOut = (e) => {
      if (!e.relatedTarget) hide();
    };
    const onDown = (e) => {
      if (e.pointerType === 'touch') return;
      down = true;
      burst();
      const rip = document.createElement('span');
      rip.className = 'cursor__ripple';
      root.appendChild(rip);
      gsap.fromTo(
        rip,
        { x: pos.x, y: pos.y, xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0.55 },
        { scale: 1.8, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => rip.remove() },
      );
    };
    const onUp = () => {
      down = false;
    };
    const onScroll = () => {
      needsResolve = true;
    };
    const onVisibility = () => (document.hidden ? stop() : visible && start());

    const opts = { passive: true };
    window.addEventListener('pointermove', onMove, opts);
    document.addEventListener('pointerover', onOver, opts);
    document.addEventListener('pointerout', onOut, opts);
    window.addEventListener('pointerdown', onDown, opts);
    window.addEventListener('pointerup', onUp, opts);
    window.addEventListener('scroll', onScroll, opts);
    window.addEventListener('blur', hide);
    window.addEventListener('resize', fit);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', fit);
      themeWatch.disconnect();
      mags.forEach((_m, el) => {
        el.style.translate = '';
      });
      mags.clear();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      html.classList.remove('has-cursor');
      tilts.forEach((_t, el) => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: 'rotationX,rotationY,transformPerspective' });
      });
      if (spotEl) spotEl.style.removeProperty('--spot-a');
      root.querySelectorAll('.cursor__ripple').forEach((n) => n.remove());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor" data-state="default" data-theme="light" aria-hidden="true">
      <canvas ref={canvasRef} className="cursor__fx" />
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot">
        <span />
      </div>
    </div>
  );
}
