/* ==========================================================================
   Tiny in-browser retrieval engine for the Lab (BM25, no dependencies).
   Indexes the portfolio's own content so every answer is grounded in it.
   ========================================================================== */

import { certificates, education, experience, profile, projects } from '../data/portfolio';

const STOP = new Set(
  'a an and are as at be by for from has have i in into is it its me my of on or our that the their this to was were will with what which who how do does did can you your about using used use like more most over across'.split(
    ' ',
  ),
);

/* Small, visible alias table — shown in the UI as the "expand" stage. */
export const ALIASES = {
  llm: ['large', 'language', 'model'],
  llms: ['large', 'language', 'model'],
  ml: ['machine', 'learning'],
  ai: ['artificial', 'intelligence'],
  rag: ['retrieval', 'rag'],
  mcp: ['model', 'context', 'protocol'],
  bi: ['business', 'intelligence'],
  sre: ['sre', 'incident'],
  gcp: ['google', 'cloud'],
  oci: ['oracle', 'cloud'],
  viz: ['visualization', 'dashboard'],
};

const stem = (w) => {
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
};

const words = (text) => text.toLowerCase().normalize('NFKD').match(/[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]/g) ?? [];

export const tokenize = (text) => words(text).filter((w) => !STOP.has(w)).map(stem);

/* ---------- Corpus ---------- */

function buildCorpus() {
  const docs = [];
  profile.about.forEach((t, i) => docs.push({ id: `about-${i}`, source: 'About', label: profile.name, href: '#about', text: t }));
  experience.forEach((e) =>
    e.description.forEach((t, i) =>
      docs.push({ id: `${e.id}-${i}`, source: 'Experience', label: `${e.company} · ${e.title}`, href: '#experience', text: t }),
    ),
  );
  projects.forEach((p) => {
    docs.push({
      id: p.id,
      source: 'Project',
      label: p.title,
      href: '#projects',
      text: `${p.title}: ${p.subtitle}. ${p.description} Tags: ${p.tags.join(', ')}.`,
    });
    if (p.notes) docs.push({ id: `${p.id}-notes`, source: 'Project', label: `${p.title} · notes`, href: '#projects', text: p.notes });
  });
  education.forEach((e) =>
    docs.push({ id: e.id, source: 'Education', label: e.institution, href: '#education', text: `${e.degree}, ${e.institution}. ${e.description}` }),
  );
  certificates.forEach((c) =>
    docs.push({ id: `cert-${c.id}`, source: 'Certificate', label: c.category, href: '#certifications', text: `${c.title} certification.` }),
  );
  return docs;
}

/* ---------- Index ---------- */

const K1 = 1.4;
const B = 0.75;

function buildIndex(docs) {
  const df = new Map();
  const entries = docs.map((d) => {
    const toks = tokenize(`${d.label} ${d.text}`);
    const tf = new Map();
    toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    tf.forEach((_v, t) => df.set(t, (df.get(t) || 0) + 1));
    return { ...d, tf, len: toks.length };
  });
  const avgdl = entries.reduce((n, e) => n + e.len, 0) / entries.length;
  return { entries, df, avgdl, N: entries.length };
}

const INDEX = buildIndex(buildCorpus());
export const indexStats = { passages: INDEX.N, terms: INDEX.df.size };

/* ---------- Query ---------- */

export function search(query, k = 3) {
  const t0 = performance.now();
  const raw = words(query).filter((w) => !STOP.has(w));
  const tokens = raw.map(stem);
  const t1 = performance.now();

  const expanded = [];
  raw.forEach((w) => ALIASES[w]?.forEach((a) => !tokens.includes(stem(a)) && expanded.push(stem(a))));
  const terms = [...new Set([...tokens, ...expanded])].filter((t) => INDEX.df.has(t));
  const t2 = performance.now();

  const { entries, df, avgdl, N } = INDEX;
  const scored = [];
  entries.forEach((d) => {
    let score = 0;
    const hits = [];
    terms.forEach((t) => {
      const f = d.tf.get(t);
      if (!f) return;
      const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgdl)));
      hits.push(t);
    });
    if (score > 0) scored.push({ ...d, score, hits });
  });
  const t3 = performance.now();

  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, k);
  const max = results[0]?.score || 1;
  results.forEach((r) => (r.relevance = r.score / max));
  const t4 = performance.now();

  return {
    tokens,
    expanded,
    terms,
    candidates: scored.length,
    results,
    timings: { tokenize: t1 - t0, expand: t2 - t1, retrieve: t3 - t2, rank: t4 - t3 },
  };
}

/** Split text into [{ text, hit }] segments for highlighting matched terms. */
export function highlight(text, terms) {
  const set = new Set(terms);
  return text.split(/(\s+|[,.;:()]+)/).map((part) => ({ text: part, hit: set.has(stem(part.toLowerCase())) }));
}
