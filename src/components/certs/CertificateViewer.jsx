import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const clampScale = (s) => Math.min(3, Math.max(0.5, +s.toFixed(2)));

/**
 * Certificate viewer (lazy-loaded with react-pdf). Native <dialog> provides
 * focus trap, Escape and the backdrop. Keyboard: ← → pages · + − zoom.
 */
export default function CertificateViewer({ cert, onClose }) {
  const dlgRef = useRef(null);
  const bodyRef = useRef(null);
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const dlg = dlgRef.current;
    if (dlg && !dlg.open) dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.floor(entry.contentRect.width - 48))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!cert.pdf) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(1, p - 1));
      if (e.key === 'ArrowRight') setPage((p) => Math.min(pages || p, p + 1));
      if (e.key === '+' || e.key === '=') setScale((s) => clampScale(s + 0.2));
      if (e.key === '-') setScale((s) => clampScale(s - 0.2));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cert.pdf, pages]);

  const src = cert.pdf || cert.image;

  return (
    <dialog
      ref={dlgRef}
      className="cert-viewer"
      aria-labelledby="cert-viewer-title"
      onClose={onClose}
      onClick={(e) => e.target === dlgRef.current && dlgRef.current.close()}
    >
      <div className="cert-viewer__panel">
        <header className="cert-viewer__head">
          <h2 id="cert-viewer-title" className="cert-viewer__title">
            {cert.title}
          </h2>
          <div className="cert-viewer__tools">
            {cert.pdf ? (
              <>
                <div className="cert-viewer__group" role="group" aria-label="Pages">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page">
                    ‹
                  </button>
                  <span className="t-mono" aria-live="polite">
                    {page} / {pages || '—'}
                  </span>
                  <button type="button" onClick={() => setPage((p) => Math.min(pages || p, p + 1))} disabled={!pages || page >= pages} aria-label="Next page">
                    ›
                  </button>
                </div>
                <div className="cert-viewer__group" role="group" aria-label="Zoom">
                  <button type="button" onClick={() => setScale((s) => clampScale(s - 0.2))} aria-label="Zoom out">
                    −
                  </button>
                  <span className="t-mono">{Math.round(scale * 100)}%</span>
                  <button type="button" onClick={() => setScale((s) => clampScale(s + 0.2))} aria-label="Zoom in">
                    +
                  </button>
                </div>
              </>
            ) : null}
            <a className="btn btn--ghost btn--sm" href={src} target="_blank" rel="noopener noreferrer" download>
              <span className="btn-label">Download ↓</span>
            </a>
            <button type="button" className="cert-viewer__close" onClick={() => dlgRef.current.close()} aria-label="Close certificate">
              ×
            </button>
          </div>
        </header>

        <div ref={bodyRef} className="cert-viewer__body">
          {cert.pdf ? (
            <Document
              file={cert.pdf}
              loading={<p className="cert-viewer__status t-mono">Loading certificate…</p>}
              error={<p className="cert-viewer__status t-mono">Couldn’t render this PDF — use Download instead.</p>}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
            >
              <Page pageNumber={page} width={Math.floor(width * scale)} />
            </Document>
          ) : (
            <img className="cert-viewer__img" src={cert.image} alt={cert.title} />
          )}
        </div>
      </div>
    </dialog>
  );
}
