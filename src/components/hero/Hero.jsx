import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../common/MagneticButton';
import InteractiveVisual from './InteractiveVisual';
import ResumeDialog from './ResumeDialog';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const RESUME_URL = '/certificates/resume.pdf';

/** Headline: "I build AI that <word>." — the word rolls through the list (first entry is the static/reduced-motion state). */
const HEADLINE = ['I', 'build', 'AI', 'that'];
const ROTATING = ['ships', 'reasons', 'retrieves', 'scales'];

const Hero = forwardRef(function Hero(_props, forwardedRef) {
  const rootRef = useRef(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const spotEnabled = finePointer && !reduced;

  const setRefs = (node) => {
    rootRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero-intro', { autoAlpha: 1 });
        return;
      }

      // 1–3 · Canvas → visual → typography, each beat on its own.
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.25 });
      tl.set('.hero-intro', { autoAlpha: 1 })
        .from('.viz-aura', { scale: 0.6, autoAlpha: 0, duration: 2.4, stagger: 0.15, ease: 'power2.out' }, 0)
        .from('.viz-galaxy', { scale: 0.7, rotate: -14, autoAlpha: 0, duration: 2.6, ease: 'expo.out' }, 0.2)
        .from('.hero-meta > *', { y: 14, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.35)
        .from('.hero-title .at-word', { yPercent: 110, duration: 1.3, stagger: 0.06 }, 0.5)
        .from('.hero-lede', { y: 18, autoAlpha: 0, duration: 1 }, 1.1)
        .from('.hero-actions > *', { y: 18, autoAlpha: 0, duration: 1, stagger: 0.08 }, 1.25)
        .from('.viz-chip', { y: 14, scale: 0.92, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1.4)
        .from('.hero-foot > *', { autoAlpha: 0, duration: 1, stagger: 0.1 }, 1.7);

      // 6–7 · Scroll hand-off: content lifts and softens, the visual sinks — scrubbed, no pinning.
      // Explicit fromTo + plain opacity: autoAlpha would read the still-hidden intro as 0 and
      // record the wrong start value, leaving the copy near-invisible.
      const exit = { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 };
      gsap.fromTo('.hero-copy', { yPercent: 0, opacity: 1 }, { yPercent: -14, opacity: 0.15, ease: 'none', scrollTrigger: exit });
      gsap.fromTo('.hero-art', { yPercent: 0, scale: 1 }, { yPercent: 12, scale: 0.94, ease: 'none', scrollTrigger: exit });
      gsap.fromTo('.hero-foot', { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: { ...exit, end: '20% top' } });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Rotating keyword: each word rolls up through the mask, then the next rolls in.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.hero-rotator__w');
      gsap.set(words.slice(1), { yPercent: 110 });
      let i = 0;
      const next = () => {
        const out = words[i];
        i = (i + 1) % words.length;
        const incoming = words[i];
        gsap.timeline({ defaults: { duration: 0.9, ease: 'expo.inOut' } })
          .to(out, { yPercent: -110 }, 0)
          .fromTo(incoming, { yPercent: 110 }, { yPercent: 0 }, 0.08);
      };
      gsap.delayedCall(3.4, function loop() {
        next();
        gsap.delayedCall(2.6, loop);
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Cursor spotlight: a soft blue light and a brighter dot-grid follow the pointer.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !spotEnabled) return undefined;
    const p = { x: root.offsetWidth * 0.62, y: root.offsetHeight * 0.48 };
    const apply = () => {
      root.style.setProperty('--sx', `${p.x}px`);
      root.style.setProperty('--sy', `${p.y}px`);
    };
    apply();
    const qx = gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out', onUpdate: apply });
    const qy = gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out', onUpdate: apply });
    const onMove = (e) => {
      const b = root.getBoundingClientRect();
      if (e.clientY > b.bottom) return;
      qx(e.clientX - b.left);
      qy(e.clientY - b.top);
    };
    const on = () => root.classList.add('is-lit');
    const off = () => root.classList.remove('is-lit');
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerenter', on);
    root.addEventListener('pointerleave', off);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerenter', on);
      root.removeEventListener('pointerleave', off);
      gsap.killTweensOf(p);
      root.classList.remove('is-lit');
    };
  }, [spotEnabled]);

  return (
    <section id="home" ref={setRefs} className="hero" aria-label="Introduction">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />

      <div className="hero-intro shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-meta">
              <span className="t-eyebrow">Raju Kumar · AI/ML Engineer</span>
              <span className="hero-status">
                <span className="hero-status__dot" />
                Available for opportunities
              </span>
            </div>

            <h1 className="at hero-title" aria-label={`I build AI that ${ROTATING[0]}.`}>
              <span className="at-line" aria-hidden="true">
                {HEADLINE.map((w) => (
                  <span key={w}>
                    <span className="at-mask">
                      <span className="at-word">{w}</span>
                    </span>{' '}
                  </span>
                ))}
              </span>
              <span className="at-line hero-title__key" aria-hidden="true">
                <span className="at-mask">
                  <span className="at-word">
                    <span className="hero-rotator">
                      {ROTATING.map((w) => (
                        <span key={w} className="hero-rotator__w">
                          {w}
                          <span className="at-accent">.</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
            </h1>

            <p className="hero-lede">LLM agents, RAG and analytics — built for real business problems.</p>

            <div className="hero-actions">
              <MagneticButton href="#projects" variant="primary">
                Explore my work <span className="btn-icon btn-icon--ne">↗</span>
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => setResumeOpen(true)} aria-haspopup="dialog">
                View resume <span className="btn-icon btn-icon--down">↓</span>
              </MagneticButton>
            </div>
          </div>

          <div className="hero-art" data-cursor="lens">
            <InteractiveVisual />
          </div>
        </div>

        <div className="hero-foot">
          <a href="#about" className="hero-scroll">
            <span className="hero-scroll__track" aria-hidden="true">
              <span />
            </span>
            Scroll to explore
          </a>
          <span className="t-eyebrow">01 / Introduction</span>
        </div>
      </div>

      <ResumeDialog open={resumeOpen} onClose={() => setResumeOpen(false)} src={RESUME_URL} />
    </section>
  );
});

export default Hero;
