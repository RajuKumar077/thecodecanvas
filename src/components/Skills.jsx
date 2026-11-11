import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ecosystem, resolveRef } from '../data/portfolio';
import './Skills.css';

gsap.registerPlugin(Flip);

const ALL = 'all';
const flat = ecosystem.flatMap((g) => g.items.map((it) => ({ ...it, group: g.id, groupName: g.name })));
const totalRefs = flat.reduce((n, it) => n + it.refs.length, 0);

/**
 * Technology ecosystem: every chip is backed by evidence from the portfolio
 * itself (experience, projects, education, certificates) — no self-rated bars.
 */
const Skills = forwardRef(function Skills(_props, forwardedRef) {
  const ref = useRef(null);
  const gridRef = useRef(null);
  const panelRef = useRef(null);
  const flipState = useRef(null);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(ALL);
  const [selected, setSelected] = useState(flat[0].name);

  const setRefs = (node) => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useSectionReveal(ref, () => {
    gsap.from('.eco-chip', {
      autoAlpha: 0,
      y: 16,
      duration: 0.7,
      stagger: { each: 0.018, from: 'start' },
      ease: 'power3.out',
      scrollTrigger: { trigger: '.eco-grid', start: 'top 85%', once: true },
    });
  });

  const active = flat.find((t) => t.name === selected) ?? flat[0];
  const evidence = useMemo(() => active.refs.map(resolveRef), [active]);

  // Single-column layouts stack the panel below the chips — bring it into view on select.
  const select = (name) => {
    setSelected(name);
    const panel = panelRef.current;
    if (!panel || window.matchMedia('(min-width: 900px)').matches) return;
    const r = panel.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.6 || r.bottom < 0) {
      panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
  };

  const changeFilter = (id) => {
    if (id === filter) return;
    if (!reduced && gridRef.current) flipState.current = Flip.getState(gridRef.current.querySelectorAll('.eco-chip'));
    setFilter(id);
    const first = id === ALL ? flat[0] : flat.find((t) => t.group === id);
    if (first && id !== ALL && active.group !== id) setSelected(first.name);
  };

  // Animate chips between filter states.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return undefined;
    flipState.current = null;
    const ctx = gsap.context(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: 'power3.inOut',
        absolute: true,
        stagger: 0.012,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.45 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.3 }),
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filter]);

  // Evidence panel crossfade.
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.eco-evidence__body > *', { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.05, ease: 'power2.out' });
    }, ref);
    return () => ctx.revert();
  }, [selected, reduced]);

  const visible = filter === ALL ? flat : flat.filter((t) => t.group === filter);
  const tabs = [{ id: ALL, name: 'All' }, ...ecosystem];

  return (
    <section id="skills" ref={setRefs} className="section section--surface eco" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHeading
          id="skills"
          titleId="skills-title"
          eyebrow="Technology ecosystem"
          lines={['The stack behind', 'the systems.']}
          lede={`${flat.length} technologies across ${ecosystem.length} domains — select any one to see where it appears in my work.`}
        />

        <div className="eco-tabs" role="tablist" aria-label="Filter technologies by domain" data-reveal>
          {tabs.map((t) => {
            const count = t.id === ALL ? flat.length : t.items.length;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`eco-tab-${t.id}`}
                aria-selected={filter === t.id}
                aria-controls="eco-panel"
                className="eco-tab"
                onClick={() => changeFilter(t.id)}
              >
                {t.name}
                <span className="t-mono">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="eco-layout">
          <div
            id="eco-panel"
            ref={gridRef}
            className="eco-grid"
            role="tabpanel"
            aria-labelledby={`eco-tab-${filter}`}
          >
            {visible.map((t) => (
              <button
                key={t.name}
                type="button"
                data-flip-id={t.name}
                className={`eco-chip eco-chip--${t.group}`}
                aria-pressed={selected === t.name}
                onClick={() => select(t.name)}
              >
                <span className="eco-chip__dot" aria-hidden="true" />
                <span className="eco-chip__name">{t.name}</span>
                <span className="eco-chip__count t-mono" aria-label={`${t.refs.length} references`}>
                  ×{t.refs.length}
                </span>
              </button>
            ))}
          </div>

          <aside ref={panelRef} className="eco-evidence card" aria-live="polite" data-reveal data-spotlight>
            <div className="eco-evidence__body">
              <p className="t-eyebrow">{active.groupName}</p>
              <h3 className="eco-evidence__title">{active.name}</h3>
              <p className="eco-evidence__sub">
                Appears in {evidence.length} {evidence.length === 1 ? 'place' : 'places'} across this portfolio:
              </p>
              <ul className="eco-evidence__list">
                {evidence.map((e) => (
                  <li key={e.kind + e.label}>
                    <a href={e.href}>
                      <span className="t-mono">{e.kind}</span>
                      {e.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="eco-evidence__foot t-mono">
              {totalRefs} evidence links · {ecosystem.length} domains
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
});

export default Skills;
