import { useEffect, useRef } from 'react';

/**
 * Accessible resume viewer built on the native <dialog> element:
 * focus trapping, Escape-to-close and the backdrop come for free.
 */
export default function ResumeDialog({ open, onClose, src }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="resume-dialog"
      aria-labelledby="resume-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="resume-dialog__panel">
        <header className="resume-dialog__head">
          <h2 id="resume-dialog-title" className="t-eyebrow">Resume — Raju Kumar</h2>
          <div className="resume-dialog__actions">
            <a className="btn btn--ghost btn--sm" href={src} download>
              <span className="btn-label">Download PDF ↓</span>
            </a>
            <button type="button" className="resume-dialog__close" onClick={onClose} aria-label="Close resume">
              ×
            </button>
          </div>
        </header>
        {open && <iframe className="resume-dialog__frame" src={src} title="Resume of Raju Kumar" />}
      </div>
    </dialog>
  );
}
