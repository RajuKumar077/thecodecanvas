import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ThemeSwitch from './ThemeSwitch';
import { SECTIONS } from '../../data/portfolio';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

const LINKS = SECTIONS.filter((s) => s.id !== 'home');

export default function Navbar({ sectionIds }) {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ opacity: 0 });
  const navRef = useRef(null);
  const listRef = useRef(null);
  const progressRef = useRef(null);
  const linkRefs = useRef({});
  const reduced = useReducedMotion();

  // Scroll-spy: the section crossing a line ~35% down the viewport is "active"
  // (a mid-screen line reads late when a section heading is already at the top).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-35% 0px -65% 0px' },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  // Compact, frosted state once the page leaves the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sliding pill under the active link.
  useLayoutEffect(() => {
    const update = () => {
      const link = linkRefs.current[active];
      const list = listRef.current;
      if (!link || !list) return setIndicator((s) => ({ ...s, opacity: 0 }));
      const l = list.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      setIndicator({ opacity: 1, width: r.width, transform: `translateX(${r.left - l.left}px)` });
    };
    update();
    document.fonts?.ready.then(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [active]);

  // Entrance. Animate the inner bar, never the <header>: a transform on the
  // header would become the containing block for the fixed mobile sheet.
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.site-nav__bar', { y: -24, autoAlpha: 0, duration: 1, ease: 'power3.out', delay: 0.15, clearProps: 'transform' });
    }, navRef);
    return () => ctx.revert();
  }, [reduced]);

  // Reading-progress hairline (position feedback, so it stays on under reduced motion).
  useLayoutEffect(() => {
    const bar = progressRef.current;
    if (!bar) return undefined;
    const setX = gsap.quickSetter(bar, 'scaleX');
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setX(self.progress),
    });
    setX(st.progress);
    return () => st.kill();
  }, []);

  // Mobile menu: lock scroll + close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <header ref={navRef} className={`site-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="site-nav__bar shell">
        <a href="#home" className="site-nav__brand" onClick={go('home')} aria-label="Raju Kumar — back to top">
          <span className="site-nav__mark" aria-hidden="true">RK</span>
          <span className="site-nav__name">Raju Kumar</span>
        </a>

        <nav className="site-nav__links" aria-label="Primary">
          <div ref={listRef} className="site-nav__pill">
            <span className="site-nav__indicator" style={indicator} aria-hidden="true" />
            <ul>
              {LINKS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    ref={(el) => (linkRefs.current[id] = el)}
                    onClick={go(id)}
                    aria-current={active === id ? 'true' : undefined}
                    className={active === id ? 'is-active' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <ThemeSwitch />

        <a href="#contact" className="btn btn--primary btn--sm site-nav__cta" onClick={go('contact')}>
          <span className="btn-label">Let’s talk</span>
        </a>

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <span ref={progressRef} className="site-nav__progress" aria-hidden="true" />
      <div id="mobile-menu" className="site-nav__sheet" hidden={!open}>
        <ol>
          {SECTIONS.map(({ id, label }, i) => (
            <li key={id} style={{ '--i': i }}>
              <a href={`#${id}`} onClick={go(id)} aria-current={active === id ? 'true' : undefined}>
                <span className="t-mono">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
