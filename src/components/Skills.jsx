import React, { useEffect } from 'react';
import './Skills.css';

const certificates = [
  {
    id: 1,
    src: '/assets/certificates/python-essentials-1.1.png',
    alt: 'Python Essentials 1 Certificate',
    title: 'Python Essentials 1',
  },
];

const Skills = () => {
  useEffect(() => {
    console.log('Skills component mounted');
    console.log('Certificates array:', certificates);
  }, []);

  return (
    <section className="skillsSection">
      <div className="skillsCard">
        <h1 className="skillsTitle">My Skills & Certifications</h1>
        {certificates.length === 0 ? (
          <p className="noCertificates">No certificates available</p>
        ) : (
          <div className="certificateGrid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certificateFrame">
                <img
                  src={cert.src}
                  alt={cert.alt}
                  className="certificateImage"
                  onLoad={() => console.log(`Image loaded: ${cert.src}`)}
                  onError={(e) => {
                    console.error(`Failed to load image: ${cert.src}`);
                    e.target.src = '/assets/certificates/fallback.png';
                  }}
                />
                <p className="certificateTitle">{cert.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;