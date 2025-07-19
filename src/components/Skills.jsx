import React, { useEffect } from 'react';
import './Skills.css'; // Import the custom CSS file

// Import the images directly from src/assets/certificates
// Ensure these paths are correct relative to Skills.jsx
import pythonEssentials1Image from '../assets/certificates/python-essentials-1.1.png';
import fallbackImage from '../assets/certificates/fallback.png';

const certificates = [
  {
    id: 1,
    src: pythonEssentials1Image,
    alt: 'Python Essentials 1 Certificate',
    title: 'Python Essentials 1',
  },
  // Add more certificates here following the same import pattern:
  // {
  //   id: 2,
  //   src: require('../assets/certificates/another-cert.png'), // Example for another certificate
  //   alt: 'Another Certificate',
  //   title: 'Another Cert Title',
  // },
];

const Skills = () => {
  useEffect(() => {
    console.log('Skills component mounted.');
    console.log('Certificates data loaded:', certificates);
    console.log('Resolved path for Python Essentials 1:', pythonEssentials1Image);
    console.log('Resolved path for Fallback Image:', fallbackImage);
  }, []);

  return (
    // Apply the custom glass section class defined in Skills.css
    <section className="skills-glass-section">
      {/* No need for an extra div like 'container mx-auto px-4' here,
          as 'skills-glass-section' handles its own max-width, margin, and padding. */}

      {/* Apply custom title class from Skills.css */}
      <h1 className="skills-title">My Skills & Certifications</h1>

      {certificates.length === 0 ? (
        // Apply custom message class from Skills.css
        <p className="no-certificates-message">No certificates available. Please add some!</p>
      ) : (
        // Apply custom grid class from Skills.css
        <div className="certificate-grid">
          {certificates.map((cert) => (
            // Apply custom certificate frame class from Skills.css
            // Removed conflicting Tailwind classes like bg-white, rounded-lg, shadow-md, p-6, etc.
            <div key={cert.id} className="certificate-glass-frame">
              <img
                src={cert.src}
                alt={cert.alt}
                // Image styling (width, height, object-fit, borders, shadows) is now handled by Skills.css
                // Removed conflicting Tailwind classes like w-full, h-48, object-contain, mb-4, rounded, border, etc.
                onError={(e) => {
                  console.error(`Failed to load image: ${cert.src}`);
                  e.target.src = fallbackImage; // Use the imported fallback image
                }}
              />
              {/* Apply custom certificate title class from Skills.css */}
              <p className="certificate-title">{cert.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;

