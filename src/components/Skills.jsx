import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import './Skills.css';

// Assets (keeps your same imports — update paths if necessary)
import pythonEssentials1Image from '../assets/certificates/python-essentials-1.1.png';
import fallbackImage from '../assets/certificates/fallback.png';

import sqlIntermediatePdf from '../assets/certificates/sql_intermediate certificate.pdf';
import bcgCertificatePdf from '../assets/certificates/_BCG_completion_certificate.pdf';
import cognizantCertificatePdf from '../assets/certificates/Cognizant_certificate.pdf';
import wellsFargoCertificatePdf from '../assets/certificates/Wells Fargo_completion_certificate.pdf';
import upGradCertificatePdf from '../assets/certificates/UpGrad.pdf';

// Ensure pdf worker is configured
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Cleaned & deduped certificate list (keeps class names intact)
const certificates = [
  { id: 1, src: pythonEssentials1Image, alt: 'Python Essentials 1 Certificate', title: 'Python Essentials 1' },
  { id: 2, src: fallbackImage, alt: 'SQL Intermediate Certificate', title: 'SQL Intermediate Certificate', pdfLink: sqlIntermediatePdf },
  { id: 3, src: fallbackImage, alt: 'BCG Strategy Consulting Certificate', title: 'BCG Strategy Consulting', pdfLink: bcgCertificatePdf },
  { id: 4, src: fallbackImage, alt: 'Cognizant Agile Methodology Certificate', title: 'Cognizant Agile Methodology', pdfLink: cognizantCertificatePdf },
  { id: 5, src: fallbackImage, alt: 'Wells Fargo Software Engineering Certificate', title: 'Wells Fargo Software Engineering', pdfLink: wellsFargoCertificatePdf },
  { id: 6, src: fallbackImage, alt: 'UpGrad Data Science Bootcamp Certificate', title: 'UpGrad Data Science Bootcamp', pdfLink: upGradCertificatePdf },
];

// Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 70, damping: 15, mass: 1 },
  },
};

// Use React.forwardRef to allow App.js to pass a ref to this component
const Skills = React.forwardRef((props, ref) => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.05);
  const [viewerWidth, setViewerWidth] = useState(() => Math.min(window.innerWidth - 160, 1100));
  const viewerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setViewerWidth(Math.min(window.innerWidth - 160, 1100));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse to preserve your cursor-based gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.certificate-glass-frame');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        card.style.setProperty('--cursor-x', `${xPercent}%`);
        card.style.setProperty('--cursor-y', `${yPercent}%`);
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard shortcuts for viewer
  useEffect(() => {
    if (!selectedPdf) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedPdf(null);
      if (e.key === 'ArrowLeft') setPageNumber((p) => Math.max(1, p - 1));
      if (e.key === 'ArrowRight') setPageNumber((p) => Math.min(numPages || p + 1, p + 1));
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)));
      if (e.key === '-') setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(2)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPdf, numPages]);

  // Prevent body scroll while viewer is open
  useEffect(() => {
    document.body.style.overflow = selectedPdf ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPdf]);

  const openPdf = (pdfLink) => {
    setSelectedPdf(pdfLink);
    setPageNumber(1);
    setNumPages(null);
    setScale(1.05);
  };
  const closePdf = () => setSelectedPdf(null);

  return (
    <section id="skills" className="skillsSection" ref={ref}>
      <h2 className="skillsTitle">My Skills & Certifications</h2>
      {certificates.length === 0 ? (
        <p className="no-certificates-message">No certificates available. Please add some!</p>
      ) : (
        <motion.div
          className="certificate-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {certificates.map((cert) => (
            <motion.div key={cert.id} className="certificate-glass-frame" variants={itemVariants}>
              <div className="certificate-content">
                {cert.pdfLink ? (
                  <div
                    className="pdf-display-wrapper"
                    role="button"
                    tabIndex={0}
                    onClick={() => openPdf(cert.pdfLink)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPdf(cert.pdfLink); }}
                    aria-label={`Open ${cert.title} full PDF`}
                  >
                    <Document file={cert.pdfLink} loading={<div className="pdf-thumb-loading">Loading…</div>}>
                      <Page
                        pageNumber={1}
                        width={300} // Increased width for better preview
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                    <div className="view-full-pdf-link">View Full PDF</div>
                  </div>
                ) : (
                  <div className="certificate-image-container">
                    <img src={cert.src} alt={cert.alt} className="certificate-image" onError={(e) => { e.target.src = fallbackImage; }} />
                  </div>
                )}
                <h3 className="certificate-title">{cert.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Fullscreen PDF viewer overlay (animated) */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div className="fullscreen-pdf-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="viewer-backdrop" onClick={closePdf} aria-hidden="true" />
            <motion.div className="pdf-modal" initial={{ y: 30, scale: 0.99 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 120 }}>
              <button className="close-pdf-btn" onClick={closePdf} aria-label="Close PDF">✕</button>
              <div className="pdf-controls">
                <div className="left-controls">
                  <button className="pdf-nav-btn" onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber <= 1} aria-label="Previous page">◀</button>
                  <span className="pdf-page-counter">{pageNumber} / {numPages || '—'}</span>
                  <button className="pdf-nav-btn" onClick={() => setPageNumber((p) => Math.min(numPages || p + 1, p + 1))} disabled={numPages ? pageNumber >= numPages : false} aria-label="Next page">▶</button>
                </div>
                <div className="right-controls">
                  <div className="scale-controls">
                    <button className="pdf-nav-btn" onClick={() => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(2)))} aria-label="Zoom out">−</button>
                    <span className="pdf-scale">{Math.round(scale * 100)}%</span>
                    <button className="pdf-nav-btn" onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))} aria-label="Zoom in">+</button>
                  </div>
                  <a className="download-btn" href={selectedPdf} target="_blank" rel="noopener noreferrer" download>Download</a>
                </div>
              </div>
              <div className="pdf-viewer-container" ref={viewerRef}>
                <Document file={selectedPdf} loading={<div className="pdf-loading">Loading PDF…</div>} onLoadSuccess={({ numPages }) => { setNumPages(numPages); }}>
                  <Page pageNumber={pageNumber} width={Math.floor(viewerWidth * scale)} />
                </Document>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default Skills;