import { useRef } from 'react';
import gsap from 'gsap';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { profile } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './About.css';

const [lead, ...rest] = profile.about;
const EMPHASIS = new Set(['AI/ML', 'Engineer']);

export default function About() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useSectionReveal(ref, ({ conditions }) => {
    // Lead paragraph "reads itself": words ink in as the paragraph scrolls through.
    gsap.fromTo(
      '.about-lead__w',
      { '--p': 0 },
      {
        '--p': 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-lead',
          start: conditions.desktop ? 'top 78%' : 'top 85%',
          end: conditions.desktop ? 'bottom 45%' : 'bottom 60%',
          scrub: 0.5,
        },
      },
    );

    if (conditions.desktop) {
      gsap.fromTo(
        '.about-portrait__img',
        { yPercent: -6, scale: 1.12 },
        {
          yPercent: 6,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: '.about-portrait', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
  });

  return (
    <section id="about" ref={ref} className="section about" aria-labelledby="about-title">
      <div className="shell">
        <SectionHeading id="about" titleId="about-title" eyebrow="About" lines={['Data in.', 'Decisions out.']} />

        <div className="about-grid">
          <aside className="about-profile" aria-label="Profile">
            <figure className="about-portrait" data-reveal="scale" data-cursor="lens" data-tilt="6">
              {/* Looping muted clip (~190 KB) instead of the 4.7 MB GIF; reduced-motion users get a still first frame. */}
              <video
                className="about-portrait__img"
                src={profile.video}
                aria-label="Portrait of Raju Kumar"
                width="696"
                height="704"
                muted
                playsInline
                loop={!reduced}
                autoPlay={!reduced}
                preload={reduced ? 'auto' : 'metadata'}
              />
            </figure>
            <div className="about-id" data-reveal>
              <h3 className="about-id__name">{profile.name}</h3>
              <p className="about-id__title t-mono">{profile.title}</p>
            </div>
            <ul className="about-highlights">
              {profile.highlights.map((h, i) => (
                <li key={h} data-reveal>
                  <span className="t-mono">{String(i + 1).padStart(2, '0')}</span>
                  {h}
                </li>
              ))}
            </ul>
          </aside>

          <div className="about-copy">
            <p className="about-lead">
              {lead.split(' ').map((w, i) => (
                <span key={i} className="about-lead__w" data-em={EMPHASIS.has(w) ? '' : undefined}>
                  {w}{' '}
                </span>
              ))}
            </p>
            <div className="about-more">
              {rest.map((p) => (
                <p key={p.slice(0, 24)} data-reveal>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
