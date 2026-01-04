import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import './About.css';

const About = () => {
  // GSAP Refs for animating elements
  const aboutSectionRef = useRef(null);
  const aboutCardRef = useRef(null);
  const profileImageRef = useRef(null);
  const textContentRef = useRef(null);
  const highlightsRef = useRef(null);
  const backgroundAuraRef = useRef(null);

  useLayoutEffect(() => {
    // Timeline for the staggered entrance animation
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

    // Initial state of the elements (hidden or scaled down)
    gsap.set(aboutCardRef.current, { scale: 0.95, autoAlpha: 0 });
    gsap.set(profileImageRef.current, { y: 20, autoAlpha: 0 });
    gsap.set(textContentRef.current.children, { y: 20, autoAlpha: 0 });
    gsap.set(highlightsRef.current.children, { y: 20, autoAlpha: 0 });

    // Animation sequence
    tl.to(aboutCardRef.current, { scale: 1, autoAlpha: 1, duration: 1.2 })
      .to(
        profileImageRef.current,
        { y: 0, autoAlpha: 1, duration: 0.8 },
        '-=0.8'
      )
      .fromTo(
        textContentRef.current.children,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.2,
          duration: 0.8,
        },
        '-=0.6'
      )
      .fromTo(
        highlightsRef.current.children,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.15,
          duration: 0.6,
        },
        '-=0.4'
      );
  }, []);

  // Effect for the glowing mouse hover background
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (backgroundAuraRef.current) {
        gsap.to(backgroundAuraRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="about" className="about-section" ref={aboutSectionRef}>
      {/* New glowing background aura element */}
      <div className="background-aura" ref={backgroundAuraRef}></div>

      <div className="about-card" ref={aboutCardRef}>
        <div className="about-content-wrapper">
          {/* Left Column: Profile */}
          <div className="about-profile-column">
            <div className="profile-image-container" ref={profileImageRef}>
              <img
                src="/certificates/Profile Picture.gif"
                alt="Raju Kumar Profile"
                className="profile-image"
              />
            </div>
            <h3 className="profile-name">Raju Kumar</h3>
            <p className="profile-title">AI/ML Engineer & LLM Builder</p>
            <div className="about-highlights-section" ref={highlightsRef}>
              <div className="highlight-item">
                <span className="highlight-icon">💼</span>
                <p className="highlight-text">AI/ML Engineer at Wipro (Apple)</p>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🔎</span>
                <p className="highlight-text">RAG & Semantic Search Systems</p>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">📈</span>
                <p className="highlight-text">Data‑driven SRE & Analytics</p>
              </div>
            </div>
          </div>

          {/* Right Column: About Text */}
          <div className="about-text-column" ref={textContentRef}>
            <h2 className="about-title">About Me</h2>
            <p className="about-description">
              I am an <strong>AI/ML Engineer</strong> focused on building LLM‑powered
              agents, RAG pipelines, and semantic search engines that help
              engineering and SRE teams move faster with more reliable insights. 
            </p>
            <p className="about-description">
              At Wipro, working with Apple&apos;s ecosystem, I design agentic workflows
              that unify incident data, automate root‑cause analysis, and remove
              repetitive manual checks, turning scattered information into a
              single, trustworthy source of truth. 
            </p>
            <p className="about-description">
              Beyond production systems, I experiment with financial AI projects
              like FinGPT and CryptoPredictor, explore time series and LLM
              applications, and enjoy collaborating on ideas that blend data,
              automation, and real business impact. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
