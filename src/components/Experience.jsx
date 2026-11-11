import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { experience } from '../data/portfolio';
import './Experience.css';

/* Outcomes the experience entries already state, set apart typographically.
   Matches are verbatim phrases from data/portfolio.js — nothing is added. */
const OUTCOMES =
  /(improving response accuracy|reducing time-to-resolution|cutting manual SOP lookups|freeing hundreds of engineering hours annually|boosting data accessibility|reducing manual validation and testing effort|improved efficiency)/g;

function withOutcomes(text) {
  return text.split(OUTCOMES).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="xp-metric">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function Experience() {
  const ref = useRef(null);

  useSectionReveal(ref, () => {
    // The rail draws itself as the timeline scrolls past.
    gsap.fromTo(
      '.xp-rail__fill',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.xp-list', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
      },
    );

    // Each node lights up as its role reaches the reading line.
    gsap.utils.toArray('.xp-item').forEach((item) => {
      ScrollTrigger.create({ trigger: item, start: 'top 70%', toggleClass: 'is-lit' });
    });
  });

  return (
    <section id="experience" ref={ref} className="section section--surface xp" aria-labelledby="experience-title">
      <div className="shell">
        <SectionHeading
          id="experience"
          titleId="experience-title"
          eyebrow="Experience"
          lines={['Professional', 'experience.']}
          lede="From RPA and full-stack internships to agentic AI for Apple’s SRE teams."
        />

        <div className="xp-list">
          <span className="xp-rail" aria-hidden="true">
            <span className="xp-rail__fill" />
          </span>

          <ol className="xp-items">
          {experience.map((job) => (
            <li key={job.id} className={`xp-item${job.current ? ' is-current' : ''}`}>
              <div className="xp-when" data-reveal>
                <span className="xp-node" aria-hidden="true" />
                <p className="xp-duration t-mono">{job.duration}</p>
                <p className="xp-location">{job.location}</p>
                {job.current ? <span className="xp-badge t-mono">Current</span> : null}
              </div>

              <article className="xp-card card" data-reveal data-spotlight>
                <header className="xp-card__head">
                  <img className="xp-logo" src={job.logo} alt="" width="56" height="56" loading="lazy" />
                  <div>
                    <h3 className="xp-title">{job.title}</h3>
                    <p className="xp-company">
                      {job.company}
                      {job.client ? <span> · {job.client}</span> : null}
                    </p>
                  </div>
                </header>
                <ul className="xp-points">
                  {job.description.map((d) => (
                    <li key={d.slice(0, 32)}>{withOutcomes(d)}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
