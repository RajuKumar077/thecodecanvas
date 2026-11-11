import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import SectionHeading from './common/SectionHeading';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { highlight, indexStats, search } from '../lib/retrieval';
import './Playground.css';

const SUGGESTIONS = ['RAG pipelines for SRE incidents', 'fraud detection with LightGBM', 'Tableau dashboards', 'LLM certifications', 'MCP agents'];
const fmt = (ms) => `${ms < 0.01 ? '<0.01' : ms.toFixed(2)} ms`;

/**
 * Engineering Playground — a working retrieval demo, not a mock.
 * BM25 over this site's own content, executed client-side, with each
 * pipeline stage exposed so visitors can see how grounding works.
 */
export default function Playground() {
  const ref = useRef(null);
  const consoleRef = useRef(null);
  const reduced = useReducedMotion();
  const [query, setQuery] = useState(SUGGESTIONS[0]);
  const deferred = useDeferredValue(query);
  const run = useMemo(() => search(deferred, 3), [deferred]);

  useSectionReveal(ref, ({ conditions }) => {
    if (!conditions.desktop) return;
    gsap.from('.lab-console', {
      y: 60,
      scale: 0.97,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.lab-console', start: 'top 85%', once: true },
    });
  });

  // Each run: stages light up in sequence, then results stagger in.
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo('.lab-stage', { '--lit': 0 }, { '--lit': 1, duration: 0.25, stagger: 0.09, ease: 'power2.out' })
        .fromTo('.lab-hit', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out' }, 0.2)
        .fromTo('.lab-hit__bar i', { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out' }, 0.25);
    }, consoleRef);
    return () => ctx.revert();
  }, [run, reduced]);

  const stages = [
    { key: 'tokenize', name: 'Tokenize', out: run.tokens.length ? run.tokens.join(' · ') : '—' },
    { key: 'expand', name: 'Expand', out: run.expanded.length ? `+ ${run.expanded.join(' · ')}` : 'no aliases' },
    { key: 'retrieve', name: 'Retrieve · BM25', out: `${run.candidates} / ${indexStats.passages} passages` },
    { key: 'rank', name: 'Rank · top-k', out: `${run.results.length} grounded` },
  ];

  return (
    <section id="playground" ref={ref} className="section lab" aria-labelledby="playground-title">
      <div className="shell">
        <SectionHeading
          id="playground"
          titleId="playground-title"
          eyebrow="Engineering playground"
          lines={['Ask this portfolio', 'anything.']}
          lede="The retrieval half of a RAG pipeline, running live in your browser. Type a question — every answer is pulled from, and linked to, the content on this page."
        />

        <div ref={consoleRef} className="lab-console" data-cursor-theme="dark" data-spotlight>
          <div className="lab-console__bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <p className="t-mono">retrieval.js — BM25 · k1 1.4 · b 0.75</p>
          </div>

          <div className="lab-console__grid">
            <div className="lab-left">
              <form className="lab-query" role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="lab-q" className="t-eyebrow">
                  Query
                </label>
                <div className="lab-query__field">
                  <span className="t-mono" aria-hidden="true">
                    ›
                  </span>
                  <input
                    id="lab-q"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. semantic search"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <div className="lab-suggest" aria-label="Example queries">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" aria-pressed={query === s} onClick={() => setQuery(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </form>

              <ol className="lab-pipeline" aria-label="Pipeline stages">
                {stages.map((s, i) => (
                  <li key={s.key} className="lab-stage">
                    <span className="lab-stage__n t-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="lab-stage__name">{s.name}</span>
                    <span className="lab-stage__time t-mono">{fmt(run.timings[s.key])}</span>
                    <span className="lab-stage__out t-mono">{s.out}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lab-right" aria-live="polite">
              <p className="t-eyebrow lab-right__head">
                Retrieved context <span>{indexStats.passages} passages · {indexStats.terms} terms indexed</span>
              </p>

              {run.results.length ? (
                <ol className="lab-hits">
                  {run.results.map((r) => (
                    <li key={r.id} className="lab-hit">
                      <div className="lab-hit__top">
                        <span className="lab-hit__src t-mono">{r.source}</span>
                        <a href={r.href} className="lab-hit__label">
                          {r.label} →
                        </a>
                        <span className="lab-hit__score t-mono">{r.score.toFixed(2)}</span>
                      </div>
                      <p className="lab-hit__text">
                        {highlight(r.text, r.hits).map((seg, i) => (seg.hit ? <mark key={i}>{seg.text}</mark> : seg.text))}
                      </p>
                      <span className="lab-hit__bar" aria-hidden="true">
                        <i style={{ width: `${Math.round(r.relevance * 100)}%` }} />
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="lab-empty">
                  No grounded match{deferred.trim() ? ` for “${deferred.trim()}”` : ''}. A real RAG system should say so rather than guess —
                  try one of the examples.
                </p>
              )}
            </div>
          </div>

          <p className="lab-console__foot t-mono">
            Runs entirely client-side · no LLM · no network calls · timings measured live with performance.now()
          </p>
        </div>
      </div>
    </section>
  );
}
