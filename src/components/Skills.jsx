import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { isMobile } from 'react-device-detect';
import './Skills.css';

// Assets
import pythonEssentials1Image from '../assets/certificates/python-essentials-1.1.png';
import fallbackImage from '../assets/certificates/fallback.png';
import oracleGenerativeAiPdf from '../assets/certificates/Oracle Cloud Infrastructure 2025 Certified Generative AI Professional.pdf';
import oracleAiFoundationsPdf from '../assets/certificates/eCertificate.pdf';
import sqlIntermediatePdf from '../assets/certificates/sql_intermediate certificate.pdf';
import bcgCertificatePdf from '../assets/certificates/_BCG_completion_certificate.pdf';
import cognizantCertificatePdf from '../assets/certificates/Cognizant_certificate.pdf';
import wellsFargoCertificatePdf from '../assets/certificates/Wells Fargo_completion_certificate.pdf';
import upGradCertificatePdf from '../assets/certificates/UpGrad.pdf';
import cloudDigitalLeaderPdf from '../assets/certificates/CloudDigitalLeader20250717-26-2kh72s.pdf';
import vertexAiImage from '../assets/certificates/Vertex AI.jpg';
import chatgptPromptEngineeringPdf from '../assets/certificates/ChatGPT & Prompt Engineering Masterclass.pdf';
import pythonForDataSciencePdf from '../assets/certificates/Python For Data Science With Real Exercises.pdf';
import worksoftCertifyPdf from '../assets/certificates/Worksoft Certify for Modern Web Applications.pdf';
import mlEssentialsPdf from '../assets/certificates/Machine Learning Essentials for Business and Technical Decision Makers.pdf';
import uiPathPdf from '../assets/certificates/UiPath.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const certificates = [
    { id: 1, src: fallbackImage, alt: 'Google Cloud Digital Leader Certificate', title: 'Google Cloud Certified - Cloud Digital Leader', pdfLink: cloudDigitalLeaderPdf },
    { id: 2, src: fallbackImage, alt: 'Machine Learning Essentials Certificate', title: 'Machine Learning Essentials for Business and Technical Decision Makers', pdfLink: mlEssentialsPdf },
    { id: 3, src: fallbackImage, alt: 'Oracle Cloud Generative AI Certificate', title: 'Oracle Cloud Infrastructure 2025 Certified – Generative AI Professional', pdfLink: oracleGenerativeAiPdf },
    { id: 4, src: fallbackImage, alt: 'UiPath Certificate', title: 'UiPath – Explore Automation Development', pdfLink: uiPathPdf },
    { id: 5, src: fallbackImage, alt: 'Oracle AI Foundations Certificate', title: 'Oracle Cloud Infrastructure 2025 Certified – AI Foundations Associate', pdfLink: oracleAiFoundationsPdf },
    { id: 6, src: fallbackImage, alt: 'UpGrad Certificate', title: 'UpGrad Data Science Bootcamp', pdfLink: upGradCertificatePdf },
    { id: 7, src: vertexAiImage, alt: 'Vertex AI Certificate', title: 'Google Cloud – Vertex AI Fundamentals' },
    { id: 8, src: fallbackImage, alt: 'ChatGPT & Prompt Engineering Certificate', title: 'ChatGPT & Prompt Engineering Masterclass', pdfLink: chatgptPromptEngineeringPdf },
    { id: 9, src: pythonEssentials1Image, alt: 'Python Essentials 1 Certificate', title: 'Python Essentials 1' },
    { id: 10, src: fallbackImage, alt: 'Worksoft Certificate', title: 'Worksoft Certify for Modern Web Applications', pdfLink: worksoftCertifyPdf },
    { id: 11, src: fallbackImage, alt: 'SQL Intermediate Certificate', title: 'SQL Intermediate Certificate', pdfLink: sqlIntermediatePdf },
    { id: 12, src: fallbackImage, alt: 'Python for Data Science Certificate', title: 'Python for Data Science with Real Exercises', pdfLink: pythonForDataSciencePdf },
    { id: 13, src: fallbackImage, alt: 'BCG Strategy Consulting Certificate', title: 'BCG Strategy Consulting', pdfLink: bcgCertificatePdf },
    { id: 14, src: fallbackImage, alt: 'Cognizant Certificate', title: 'Cognizant Agile Methodology', pdfLink: cognizantCertificatePdf },
    { id: 15, src: fallbackImage, alt: 'Wells Fargo Certificate', title: 'Wells Fargo Software Engineering', pdfLink: wellsFargoCertificatePdf },
];

const Skills = React.forwardRef((props, ref) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.05);
    const [viewerWidth, setViewerWidth] = useState(() => Math.min(window.innerWidth - 160, 1100));
    const viewerRef = useRef(null);

    // Mouse tracking for hover gradient effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const cards = document.querySelectorAll('.certificate-glass-frame');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--cursor-x', `${x}px`);
                card.style.setProperty('--cursor-y', `${y}px`);
            });
        };

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setViewerWidth(Math.min(window.innerWidth - 160, 1100));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    useEffect(() => { 
        document.body.style.overflow = selectedPdf ? 'hidden' : ''; 
        return () => { document.body.style.overflow = ''; }; 
    }, [selectedPdf]);

    const openPdf = (pdfLink) => { setSelectedPdf(pdfLink); setPageNumber(1); setNumPages(null); setScale(1.05); };
    const closePdf = () => setSelectedPdf(null);

    return (
        <section id="skills" className="skillsSection" ref={ref}>
            <h2 className="skillsTitle">My Skills & Certifications</h2>
            {certificates.length === 0 ? (
                <p className="no-certificates-message">No certificates available. Please add some!</p>
            ) : (
                <div className="certificate-grid">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="certificate-glass-frame">
                            <div className="certificate-content">
                                {cert.pdfLink ? (
                                    isMobile ? (
                                        <a href={cert.pdfLink} target="_blank" rel="noopener noreferrer" className="mobile-pdf-link">
                                            <img src={cert.src} alt={cert.alt} className="certificate-image" />
                                            <div className="view-full-pdf-link">Open PDF</div>
                                        </a>
                                    ) : (
                                        <div className="pdf-display-wrapper" onClick={() => openPdf(cert.pdfLink)}>
                                            <Document file={cert.pdfLink} loading={<div className="pdf-thumb-loading">Loading…</div>}>
                                                <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} />
                                            </Document>
                                            <div className="view-full-pdf-link">View Full PDF</div>
                                        </div>
                                    )
                                ) : (
                                    <div className="certificate-image-container">
                                        <img src={cert.src} alt={cert.alt} className="certificate-image" onError={(e) => { e.target.src = fallbackImage; }} />
                                    </div>
                                )}
                                <h3 className="certificate-title">{cert.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPdf && !isMobile && (
                <div className="fullscreen-pdf-viewer">
                    <div className="viewer-backdrop" onClick={closePdf} aria-hidden="true" />
                    <div className="pdf-modal">
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
                            <Document file={selectedPdf} loading={<div className="pdf-loading">Loading PDF…</div>} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                                <Page pageNumber={pageNumber} width={Math.floor(viewerWidth * scale)} />
                            </Document>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
});

export default Skills;
