import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Tilted spiral galaxy rendered on one 2D canvas — no WebGL, no dependencies.
 *
 *  · two logarithmic-style arms + a dense bulge + a faint halo of field stars
 *  · differential rotation: the core turns faster than the rim, so stars
 *    visibly stream along the arms
 *  · the disc tilts and rolls toward the pointer (fine pointers only)
 *  · colours come from the design tokens (--accent-rgb, --periwinkle-rgb,
 *    --secondary-rgb, --ink-rgb) and are re-read on every theme switch:
 *    dark theme = additive champagne glow on a midnight sky, light theme = ink-on-parchment
 *  · reduced motion: one still frame, no loop, no pointer response
 *  · paused while off-screen or in a background tab
 */

const TAU = Math.PI * 2;

/** Deterministic PRNG — the galaxy is identical on every load. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Colour classes: 0 core · 1 primary · 2 periwinkle · 3 secondary (teal) · 4 dust
const CLASSES = 5;
const LEVEL_ALPHA = [0.42, 0.74]; // dim / normal; level 2 = bright, drawn one by one (twinkle)

function buildStars(count) {
  const rnd = mulberry32(11);
  const gauss = () => rnd() + rnd() + rnd() - 1.5; // ~N(0, 0.5)
  const ARMS = 2;
  const WIND = 7.4; // radians of winding between centre and rim

  const r = new Float32Array(count);
  const th = new Float32Array(count);
  const z = new Float32Array(count);
  const om = new Float32Array(count);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const cls = new Uint8Array(count);
  const level = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    const kind = rnd();
    let rr;
    if (kind < 0.17) {
      // bulge: dense, round, a little thick
      rr = Math.min(0.46, Math.abs(gauss()) * 0.62);
      th[i] = rnd() * TAU;
      z[i] = gauss() * 0.2 * (1 - rr);
    } else if (kind < 0.89) {
      // spiral arms
      rr = 0.05 + Math.pow(rnd(), 1.4) * 0.95;
      const arm = Math.floor(rnd() * ARMS);
      th[i] = (arm * TAU) / ARMS + WIND * Math.pow(rr, 0.72) + gauss() * 0.56;
      z[i] = gauss() * 0.07 * (1.25 - rr);
    } else {
      // faint field stars
      rr = Math.pow(rnd(), 0.7) * 1.06;
      th[i] = rnd() * TAU;
      z[i] = gauss() * 0.16;
    }
    r[i] = rr;
    om[i] = 0.06 + 0.3 * Math.exp(-rr * 3.2); // rad/s
    phase[i] = rnd() * TAU;

    const p = rnd();
    if (rr < 0.2 && p < 0.8) cls[i] = 0;
    else if (p < 0.5) cls[i] = 1;
    else if (p < 0.78) cls[i] = 2;
    else if (p < 0.92) cls[i] = 3;
    else cls[i] = 4;

    const q = rnd();
    level[i] = q < 0.55 ? 0 : q < 0.89 ? 1 : 2;
    size[i] = 0.8 + rnd() * 0.9 + (level[i] === 2 ? 0.7 : 0);
  }

  // Index lists per (class, level) so each bucket is drawn with one fillStyle.
  const buckets = [];
  const bright = [];
  for (let c = 0; c < CLASSES; c++) {
    buckets.push([[], []]);
    bright.push([]);
  }
  for (let i = 0; i < count; i++) {
    if (level[i] === 2) bright[cls[i]].push(i);
    else buckets[cls[i]][level[i]].push(i);
  }
  return { count, r, th, z, om, size, phase, buckets, bright };
}

function readPalette() {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const ch = (name, fallback) => (cs.getPropertyValue(name).trim() || fallback).split(/\s+/).join(',');
  const dark = root.dataset.theme === 'dark';
  const primary = ch('--accent-rgb', '167 125 72');
  const peri = ch('--periwinkle-rgb', '193 161 119');
  const teal = ch('--secondary-rgb', '144 104 58');
  const ink = ch('--ink-rgb', '37 44 56');
  return {
    dark,
    // class → rgb
    rgb: dark
      ? [ink, primary, peri, teal, ink]
      : [primary, primary, peri, teal, ink],
    glow: dark ? peri : primary,
    gain: dark ? 1 : 1.18, // ink-on-paper needs a little more opacity than light-on-night
  };
}

export default function SpiralGalaxy() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const small = window.matchMedia('(max-width: 599px)').matches;
    const stars = buildStars(small ? 4800 : 9500);
    const sx = new Float32Array(stars.count);
    const sy = new Float32Array(stars.count);
    const sk = new Float32Array(stars.count); // perspective gain per star

    let palette = readPalette();
    let w = 1;
    let h = 1;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let time = 0;
    let last = 0;

    // Disc orientation: tilt (about the screen x-axis) and roll (in the screen plane).
    const BASE_TILT = 1.02;
    const BASE_ROLL = -0.36;
    let tilt = BASE_TILT;
    let roll = BASE_ROLL;
    let tiltTarget = BASE_TILT;
    let rollTarget = BASE_ROLL;

    const fit = () => {
      const box = canvas.parentElement.getBoundingClientRect();
      w = Math.max(1, Math.round(box.width));
      h = Math.max(1, Math.round(box.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { dark, rgb, glow, gain } = palette;
      const cx = w / 2;
      const cy = h / 2;
      const S = Math.min(w, h) * 0.5 * 0.95;
      const unit = S / 235;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';

      // Haze + core glow, squashed to the disc plane.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(roll);
      ctx.scale(1, cosT);
      const haze = ctx.createRadialGradient(0, 0, 0, 0, 0, S);
      haze.addColorStop(0, `rgba(${glow},${dark ? 0.22 : 0.1})`);
      haze.addColorStop(0.55, `rgba(${glow},${dark ? 0.07 : 0.035})`);
      haze.addColorStop(1, `rgba(${glow},0)`);
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(0, 0, S, 0, TAU);
      ctx.fill();
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 0.3);
      core.addColorStop(0, `rgba(${dark ? rgb[0] : glow},${dark ? 0.95 : 0.5})`);
      core.addColorStop(0.3, `rgba(${rgb[0]},${dark ? 0.5 : 0.22})`);
      core.addColorStop(1, `rgba(${rgb[0]},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, S * 0.3, 0, TAU);
      ctx.fill();
      ctx.restore();

      // Project every star once.
      const { r, th, z, om, size, phase } = stars;
      for (let i = 0; i < stars.count; i++) {
        const a = th[i] + time * om[i];
        const x = r[i] * Math.cos(a);
        const y = r[i] * Math.sin(a);
        const yy = y * cosT - z[i] * sinT;
        const depth = y * sinT + z[i] * cosT;
        sx[i] = cx + (x * cosR - yy * sinR) * S;
        sy[i] = cy + (x * sinR + yy * cosR) * S;
        sk[i] = 1 + depth * 0.2;
      }

      for (let c = 0; c < CLASSES; c++) {
        for (let l = 0; l < 2; l++) {
          const list = stars.buckets[c][l];
          if (!list.length) continue;
          ctx.fillStyle = `rgba(${rgb[c]},${Math.min(1, LEVEL_ALPHA[l] * gain).toFixed(3)})`;
          for (let n = 0; n < list.length; n++) {
            const i = list[n];
            const s = Math.max(0.7, size[i] * unit * sk[i]);
            ctx.fillRect(sx[i] - s / 2, sy[i] - s / 2, s, s);
          }
        }
        // Bright stars: individual twinkle and a soft halo.
        const bright = stars.bright[c];
        if (bright.length) {
          ctx.fillStyle = `rgb(${rgb[c]})`;
          for (let n = 0; n < bright.length; n++) {
            const i = bright[n];
            const tw = 0.72 + 0.28 * Math.sin(time * 1.7 + phase[i]);
            const s = Math.max(1, size[i] * unit * sk[i]);
            ctx.globalAlpha = 0.16 * tw;
            ctx.fillRect(sx[i] - s * 1.4, sy[i] - s * 1.4, s * 2.8, s * 2.8);
            ctx.globalAlpha = Math.min(1, tw * gain);
            ctx.fillRect(sx[i] - s / 2, sy[i] - s / 2, s, s);
          }
          ctx.globalAlpha = 1;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      time += dt;
      const k = 1 - Math.exp(-dt * 3.2);
      tilt += (tiltTarget - tilt) * k;
      roll += (rollTarget + Math.sin(time * 0.21) * 0.035 - roll) * k;
      draw();
    };
    const start = () => {
      if (raf || reduced) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Pointer: tilt and roll the disc toward the cursor (hero only, fine pointers).
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onMove = (e) => {
      if (!visible) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tiltTarget = BASE_TILT - ny * 0.17;
      rollTarget = BASE_ROLL + nx * 0.24;
    };
    if (fine && !reduced) window.addEventListener('pointermove', onMove, { passive: true });

    const ro = new ResizeObserver(() => {
      fit();
      if (reduced) draw();
    });
    ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : visible && start());
    document.addEventListener('visibilitychange', onVisibility);

    // Re-read token colours whenever the theme flips.
    const themeWatch = new MutationObserver(() => {
      palette = readPalette();
      if (reduced) draw();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    fit();
    if (reduced) {
      time = 14; // a pleasing frozen phase
      draw();
    } else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="viz-galaxy__canvas" aria-hidden="true" />;
}
