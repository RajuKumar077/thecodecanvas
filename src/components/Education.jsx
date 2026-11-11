import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { useFinePointer, useReducedMotion } from '../hooks/useReducedMotion';
import { CERT_CATEGORIES, certificates, education } from '../data/portfolio';
import './Education.css';

// react-pdf + pdf.js (~1.4 MB) load only when a certificate is on screen or opened.
const CertThumb = lazy(() => import('./certs/CertThumb'));
const CertificateViewer = lazy(() => import('./certs/CertificateViewer'));

const ALL = 'All';

function CertCover({ cert, preview }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!preview || !cert.pdf) return undefined;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [preview, cert.pdf]);

  return (
    <div ref={ref} className="cert-cover" aria-hidden="true" data-tilt="7">
      <span className="cert-cover__paper">
        <span className="cert-cover__seal t-mono">{cert.category}</span>
        <span className="cert-cover__lines">
          <i />
          <i />
          <i />
        </span>
      </span>
      {cert.image ? <img src={cert.image} alt="" loading="lazy" decoding="async" /> : null}
      {cert.pdf && inView && !failed ? (
        <Suspense fallback={null}>
          <span className={`cert-cover__pdf${ready ? ' is-ready' : ''}`}>
            <CertThumb file={cert.pdf} width={320} onReady={() => setReady(true)} onFail={() => setFailed(true)} />
          </span>
        </Suspense>
      ) : null}
      <span className="cert-cover__type t-mono">{cert.pdf ? 'PDF' : 'IMG'}</span>
    </div>
  );
}

export default function Education() {
  const ref = useRef(null);
  const listRef = useRef(null);
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(ALL);
  const [open, setOpen] = useState(null);

  useSectionReveal(ref, ({ conditions }) => {
    if (!conditions.desktop) return;
    gsap.utils.toArray('.edu-card__media img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.edu-card'), scrub: true } },
      );
    });
  });

  // Soft re-entry when the certificate filter changes.
  useEffect(() => {
    if (reduced || !listRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.cert-card', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power3.out' });
    }, listRef);
    return () => ctx.revert();
  }, [filter, reduced]);

  const shown = filter === ALL ? certificates : certificates.filter((c) => c.category === filter);
  const tabs = [ALL, ...CERT_CATEGORIES];

  return (
    <section id="education" ref={ref} className="section edu" aria-labelledby="education-title">
      <div className="shell">
        <SectionHeading
          id="education"
          titleId="education-title"
          eyebrow="Education & certifications"
          lines={['Always', 'learning.']}
          lede="Formal education, an intensive data-science bootcamp and fifteen industry certifications."
        />

        <ol className="edu-grid">
          {education.map((e) => (
            <li key={e.id} className="edu-card card" data-reveal data-spotlight>
              <a
                className="edu-card__media"
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${e.institution} website (opens in a new tab)`}
                data-cursor="media"
                data-cursor-label="Visit ↗"
              >
                <img src={e.image} alt={`${e.institution} campus`} loading="lazy" decoding="async" />
              </a>
              <div className="edu-card__body">
                <p className="edu-card__when t-mono">{e.duration}</p>
                <h3 className="edu-card__degree">{e.degree}</h3>
                <p className="edu-card__inst">{e.institution}</p>
                <p className="edu-card__desc">{e.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div id="certifications" className="certs">
          <div className="certs__head" data-reveal>
            <h3 className="certs__title">
              Certifications <span className="t-mono">{certificates.length}</span>
            </h3>
            <div className="certs__tabs" role="tablist" aria-label="Filter certifications">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={filter === t}
                  aria-controls="cert-list"
                  className="eco-tab"
                  onClick={() => setFilter(t)}
                >
                  {t}
                  <span className="t-mono">{t === ALL ? certificates.length : certificates.filter((c) => c.category === t).length}</span>
                </button>
              ))}
            </div>
          </div>

          <ul id="cert-list" ref={listRef} className="cert-grid" role="tabpanel">
            {shown.map((c) => {
              const mobilePdf = c.pdf && !finePointer;
              const inner = (
                <>
                  <CertCover cert={c} preview={finePointer} />
                  <span className="cert-card__meta">
                    <span className="cert-card__title">{c.title}</span>
                    <span className="cert-card__cta t-mono">{mobilePdf ? 'Open PDF ↗' : 'View certificate →'}</span>
                  </span>
                </>
              );
              return (
                <li key={c.id} className="cert-card">
                  {mobilePdf ? (
                    <a className="cert-card__hit" href={c.pdf} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="cert-card__hit"
                      onClick={() => setOpen(c)}
                      aria-haspopup="dialog"
                      data-cursor="media"
                      data-cursor-label="View"
                      data-spotlight
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {open ? (
        <Suspense fallback={null}>
          <CertificateViewer key={open.id} cert={open} onClose={() => setOpen(null)} />
        </Suspense>
      ) : null}
    </section>
  );
}
