import React, { useEffect, useRef, useState, forwardRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import './Home.css';

gsap.registerPlugin(TextPlugin);

// Importing the resume PDF. Make sure this path is correct in your project.
const myResume = '/certificates/resume.pdf';

const Home = forwardRef((props, ref) => {
  const homeRef = useRef(null);
  const gridRef = useRef(null);
  const [gridCells, setGridCells] = useState([]);
  const cellCount = 300; // Number of cells in the grid

  const widgetRef = useRef(null);
  const searchBarRef = useRef(null);
  const resultsRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const ctaButtonsRef = useRef(null);
  const cursorRef = useRef(null);

  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    // Create grid cells for the background
    const cells = Array.from({ length: cellCount }, (_, i) => ({ id: i }));
    setGridCells(cells);
  }, []);

  // Effect for the interactive grid background animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const cells = Array.from(gridRef.current.children);

      cells.forEach((cell) => {
        const cellRect = cell.getBoundingClientRect();
        const cellX = cellRect.left + cellRect.width / 2;
        const cellY = cellRect.top + cellRect.height / 2;
        const dist = Math.sqrt(
          Math.pow(e.clientX - cellX, 2) + Math.pow(e.clientY - cellY, 2)
        );
        const glowStrength = Math.max(0, 1 - dist / 200);

        gsap.to(cell, {
          backgroundColor: `rgba(0, 198, 255, ${glowStrength * 0.25})`,
          boxShadow: `0 0 ${glowStrength * 15}px rgba(0, 198, 255, ${glowStrength * 0.6})`,
          duration: 0.2,
          ease: 'power1.out',
        });
      });
    };

    const currentGridRef = gridRef.current;
    if (currentGridRef) {
      currentGridRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentGridRef) {
        currentGridRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [gridCells]);

  // Effect for the widget typing and fade-in animation
  useLayoutEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', duration: 0.5 },
      delay: 0.5,
    });

    // Set initial state of elements
    gsap.set(titleRef.current, { autoAlpha: 0, y: 10 });
    gsap.set(roleRef.current, { autoAlpha: 0, y: 10 });
    gsap.set(ctaButtonsRef.current, { autoAlpha: 0, scale: 0.9 });
    gsap.set(resultsRef.current, { height: 0 });

    // Animation sequence
    tl.to(searchBarRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power3.inOut',
    })
      .to(
        cursorRef.current,
        { opacity: 1, duration: 0.1, repeat: 10, yoyo: true },
        '<'
      )
      .to(searchBarRef.current, {
        text: 'Raju Kumar',
        duration: 1.5,
        ease: 'none',
      })
      .to(cursorRef.current, { opacity: 0, duration: 0.1 }, '<+=1.5')
      .to(resultsRef.current, { height: 'auto', duration: 0.5 })
      .to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.2')
      .to(roleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to(
        ctaButtonsRef.current,
        { autoAlpha: 1, scale: 1, duration: 0.8 },
        '-=0.4'
      );
  }, []);

  const handleViewResume = () => {
    setShowResume(true);
  };

  return (
    <section
      id="home"
      className="home-section"
      ref={(el) => {
        homeRef.current = el;
        if (ref) {
          ref.current = el;
        }
      }}
    >
      {/* The Interactive Grid Background */}
      <div className="home-grid-bg" ref={gridRef}>
        {gridCells.map((cell) => (
          <div key={cell.id} className="grid-cell"></div>
        ))}
      </div>

      {/* The Google-style Widget */}
      <div className="google-widget-container" ref={widgetRef}>
        <div className="search-bar-wrapper">
          <div className="google-search-bar" ref={searchBarRef}>
            <span ref={cursorRef} className="cursor">
              |
            </span>
          </div>
        </div>

        <div className="search-results-wrapper" ref={resultsRef}>
          <div className="search-result-item" ref={titleRef}>
            <h1 className="result-title">Raju Kumar</h1>
            <p className="result-url">https://therajukumar.vercel.app/</p>
            <p className="result-snippet">
              <span className="bold">AI/ML Engineer</span> |{' '}
              <span className="bold">LLM & RAG Specialist</span> |{' '}
              <span className="bold">Data Analytics</span>
              <br />
              I build LLM‑driven agents, RAG search, and analytics systems that
              turn complex, siloed data into reliable, actionable insights.
            </p>
          </div>

          <div className="search-result-item" ref={roleRef}>
            <p className="result-snippet">
              AIML Engineer with 1+ year of experience designing agentic AI
              systems, semantic search engines, and automated data analysis
              tools that optimize SRE workflows and decision‑making at scale.{' '}
              {/* from resume */}
            </p>
          </div>
        </div>

        <div className="cta-buttons" ref={ctaButtonsRef}>
          <a href="#projects" className="cta-button google-style">
            Explore My Projects
          </a>
          <button
            onClick={handleViewResume}
            className="cta-button google-style secondary"
          >
            View Resume
          </button>
        </div>
      </div>

      {/* Resume Modal */}
      {showResume && (
        <div
          className="resume-modal-overlay"
          onClick={() => setShowResume(false)}
        >
          <div
            className="resume-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setShowResume(false)}
            >
              &times;
            </button>
            <iframe
              src={myResume}
              title="My Resume"
              className="resume-iframe"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
});

export default Home;
