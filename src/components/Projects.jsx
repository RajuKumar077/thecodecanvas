import { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { projects } from '../data/portfolio';
import './Projects.css';

const isExternal = (url) => /^https?:/.test(url);

/** Cursor-lit media frame: a soft highlight follows the pointer (CSS vars only, no re-render). */
const onMediaMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
};

const Projects = forwardRef(function Projects(_props, forwardedRef) {
  const ref = useRef(null);
  const setRefs = (node) => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useSectionReveal(ref, ({ conditions }) => {
    if (!conditions.desktop) return;
    const cards = gsap.utils.toArray('.work-card');

    // Sticky offset per card: stack under the nav, but never hide a tall card's bottom.
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;
    const measure = () =>
      cards.forEach((card, i) => {
        const ideal = nav + 16 + i * 14;
        const fit = window.innerHeight - card.offsetHeight - 24;
        card.style.setProperty('--stick', `${Math.min(ideal, fit)}px`);
      });
    measure();
    const ro = new ResizeObserver(measure);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener('resize', measure);

    // Stacked cards: as the next card slides over, the previous one recedes.
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector('.work-card__inner'), {
        scale: 0.94,
        autoAlpha: 0.55,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
      });
    });

    // Media drifts inside its frame for depth.
    cards.forEach((card) => {
      gsap.fromTo(
        card.querySelector('.work-media img'),
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

    // Returned from the matchMedia callback → runs on revert / breakpoint change.
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      cards.forEach((c) => c.style.removeProperty('--stick'));
    };
  });

  return (
    <section id="projects" ref={setRefs} className="section work" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHeading
          id="projects"
          titleId="projects-title"
          eyebrow="Selected work"
          lines={['Projects that ship', 'insight.']}
          lede="Generative AI, machine learning and analytics — each with its notebook, repository or live demo."
        />

        <ol className="work-list">
          {projects.map((p, i) => (
            <li key={p.id} className="work-card" style={{ '--i': i }}>
              <article className="work-card__inner card" aria-labelledby={`work-${p.id}`}>
                <div className="work-copy">
                  <p className="work-meta t-mono">
                    <span className="work-index">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p.category}</span>
                  </p>
                  <h3 id={`work-${p.id}`} className="work-title">
                    {p.title}
                    <span>{p.subtitle}</span>
                  </h3>
                  <p className="work-desc">{p.description}</p>

                  {p.notes ? (
                    <div className="work-notes">
                      <p className="t-eyebrow">Technical notes</p>
                      <p>{p.notes}</p>
                    </div>
                  ) : null}

                  <ul className="work-tags" aria-label="Technologies">
                    {p.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="work-links">
                    {p.links.map((l) => (
                      <a
                        key={l.type}
                        className="link-arrow"
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${l.type} — ${p.title}${isExternal(l.url) ? ' (opens in a new tab)' : ''}`}
                      >
                        {l.type}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Large pointer target for the primary link; the same link is in the text
                    list above, so this duplicate is skipped by keyboard and screen readers. */}
                <a
                  className={`work-media${p.imageFit === 'contain' ? ' is-contain' : ''}`}
                  href={p.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  data-cursor="media"
                  data-cursor-label={`${p.links[0].type} ↗`}
                  data-tilt="5"
                  onPointerMove={onMediaMove}
                >
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                  <span className="work-media__glare" />
                </a>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
});

export default Projects;
