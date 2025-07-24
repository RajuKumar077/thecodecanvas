import React, { useEffect } from 'react';
import './Skills.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Import the images directly from src/assets/certificates
import pythonEssentials1Image from '../assets/certificates/python-essentials-1.1.png';
import fallbackImage from '../assets/certificates/fallback.png'; // Consider replacing with actual thumbnails

// Import the PDF directly.
import sqlIntermediatePdf from '../assets/certificates/sql_intermediate certificate.pdf';
import bcgCertificatePdf from '../assets/certificates/_BCG_completion_certificate.pdf';
import cognizantCertificatePdf from '../assets/certificates/Cognizant_certificate.pdf';
import wellsFargoCertificatePdf from '../assets/certificates/Wells Fargo_completion_certificate.pdf';
import upGradCertificatePdf from '../assets/certificates/UpGrad.pdf';

// Configure the PDF.js Worker for react-pdf
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the PDF.js worker source. This is crucial for react-pdf to function.
// Using import.meta.url ensures the path is resolved correctly in modern module environments.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Define the list of certificates with their details.
// Each certificate can either have an image (src) or a PDF link (pdfLink).
const certificates = [
  {
    id: 1,
    src: pythonEssentials1Image,
    alt: 'Python Essentials 1 Certificate',
    title: 'Python Essentials 1',
  },
  {
    id: 2,
    src: fallbackImage, // Placeholder thumbnail for PDF
    alt: 'SQL Intermediate Certificate',
    title: 'SQL Intermediate Certificate',
    pdfLink: sqlIntermediatePdf,
  },
  {
    id: 3,
    src: fallbackImage, // Placeholder thumbnail for PDF
    alt: 'BCG Strategy Consulting Certificate',
    title: 'BCG Strategy Consulting',
    pdfLink: bcgCertificatePdf,
  },
  {
    id: 4,
    src: fallbackImage, // Placeholder thumbnail for PDF
    alt: 'Cognizant Agile Methodology Certificate',
    title: 'Cognizant Agile Methodology',
    pdfLink: cognizantCertificatePdf,
  },
  {
    id: 5,
    src: fallbackImage, // Placeholder thumbnail for PDF
    alt: 'Wells Fargo Software Engineering Certificate',
    title: 'Wells Fargo Software Engineering',
    pdfLink: wellsFargoCertificatePdf,
  },
  {
    id: 6,
    src: fallbackImage, // Placeholder thumbnail for PDF
    alt: 'UpGrad Data Science Bootcamp Certificate',
    title: 'UpGrad Data Science Bootcamp',
    pdfLink: upGradCertificatePdf,
  },
];

// Framer Motion variants for staggered animation of the certificate grid.
// This controls how the entire grid appears.
const containerVariants = {
  hidden: { opacity: 0 }, // Initial state: invisible
  visible: {
    opacity: 1, // Final state: fully visible
    transition: {
      staggerChildren: 0.08, // Slightly faster stagger for a smoother reveal
      delayChildren: 0.15,   // Slightly less delay before first child starts animating
    },
  },
};

// Framer Motion variants for individual certificate cards.
// This controls how each card animates into view with a subtle, elegant spring.
const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 }, // Initial state: slightly lower, invisible, slightly smaller
  visible: {
    y: 0, // Final state: original Y position
    opacity: 1, // Final state: fully visible
    scale: 1, // Final state: original size
    transition: {
      type: "spring", // Use spring for a natural, elegant feel
      stiffness: 70, // Softer stiffness for a more gentle bounce
      damping: 15, // Higher damping to make it settle quickly and smoothly
      mass: 1, // Standard mass for balanced motion
    },
  },
};

const Skills = () => {
  useEffect(() => {
    // Log messages for debugging and component lifecycle tracking
    console.log('Skills component mounted.');
    console.log('Certificates data loaded:', certificates);
    console.log('Resolved path for Python Essentials 1:', pythonEssentials1Image);
    console.log('Resolved path for SQL Intermediate PDF:', sqlIntermediatePdf);
    console.log('Resolved path for BCG Certificate PDF:', bcgCertificatePdf);
    console.log('Resolved path for Cognizant Certificate PDF:', cognizantCertificatePdf);
    console.log('Resolved path for Wells Fargo Certificate PDF:', wellsFargoCertificatePdf);
    console.log('Resolved path for UpGrad Certificate PDF:', upGradCertificatePdf);
    console.log('Resolved path for Fallback Image:', fallbackImage);

    // Event listener for cursor tracking to enable the premium gradient effect on cards.
    // This updates CSS custom properties (--cursor-x, --cursor-y) based on mouse position.
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.certificate-glass-frame');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Calculate mouse position relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Convert to percentage for CSS custom properties
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        card.style.setProperty('--cursor-x', `${xPercent}%`);
        card.style.setProperty('--cursor-y', `${yPercent}%`);
      });
    };

    // Add the event listener when the component mounts
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return (
    <section className="skills-glass-section">
      {/* Particle layer for dynamic background effect */}
      <div className="particle-layer"></div>

      {/* Main title of the section */}
      <h1 className="skills-title">My Skills & Certifications</h1>

      {/* Conditional rendering based on whether certificates exist */}
      {certificates.length === 0 ? (
        // Message displayed if no certificates are available
        <p className="no-certificates-message">No certificates available. Please add some!</p>
      ) : (
        // Framer Motion div for the certificate grid, enabling staggered animations
        <motion.div
          className="certificate-grid"
          variants={containerVariants} // Apply container animation variants
          initial="hidden" // Start from the 'hidden' state
          whileInView="visible" // Animate to 'visible' when the element enters the viewport
          viewport={{ once: true, amount: 0.2 }} // Trigger animation once when 20% of the element is visible
        >
          {/* Map through the certificates array to render each certificate card */}
          {certificates.map((cert) => (
            // Framer Motion div for each individual certificate card
            <motion.div
              key={cert.id} // Unique key for list rendering
              className="certificate-glass-frame"
              variants={itemVariants} // Apply individual item animation variants
            >
              {cert.pdfLink ? (
                // If the certificate has a PDF link, display a PDF preview
                <div className="pdf-display-wrapper">
                  <Document
                    file={cert.pdfLink} // Source PDF file
                    onLoadError={(error) => {
                      // Log any errors during PDF loading
                      console.error(`Error loading PDF for ${cert.title}:`, error);
                    }}
                    // Options for PDF.js worker and CMap (for text rendering, often not needed for preview)
                    options={{ disableWorker: false, CMapReaderFactory: null }}
                  >
                    <Page
                      pageNumber={1} // Display the first page of the PDF
                      width={200} // Set a fixed width for the preview (CSS will handle responsiveness)
                      renderTextLayer={false} // Disable text layer rendering for a cleaner preview
                      renderAnnotationLayer={false} // Disable annotation layer rendering
                    />
                  </Document>
                  {/* Link to view the full PDF in a new tab */}
                  <div className="view-full-pdf-link">
                    <a href={cert.pdfLink} target="_blank" rel="noopener noreferrer">
                      View Full PDF
                    </a>
                  </div>
                </div>
              ) : (
                // If it's an image-based certificate, display the image
                <img
                  src={cert.src} // Image source
                  alt={cert.alt} // Alt text for accessibility
                  onError={(e) => {
                    // Fallback to a placeholder image if the original image fails to load
                    console.error(`Failed to load image: ${cert.src}`);
                    e.target.src = fallbackImage;
                  }}
                />
              )}
              {/* Title of the certificate */}
              <p className="certificate-title">{cert.title}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Skills;
