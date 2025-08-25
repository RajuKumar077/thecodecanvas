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
        const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

        // Initial state of the elements (hidden or scaled down)
        gsap.set(aboutCardRef.current, { scale: 0.95, autoAlpha: 0 });
        gsap.set(profileImageRef.current, { y: 20, autoAlpha: 0 });
        gsap.set(textContentRef.current.children, { y: 20, autoAlpha: 0 });
        gsap.set(highlightsRef.current.children, { y: 20, autoAlpha: 0 });

        // Animation sequence
        tl.to(aboutCardRef.current, { scale: 1, autoAlpha: 1, duration: 1.2 })
          .to(profileImageRef.current, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.8")
          .fromTo(textContentRef.current.children, { y: 20, autoAlpha: 0 }, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.2,
              duration: 0.8
          }, "-=0.6")
          .fromTo(highlightsRef.current.children, { y: 20, autoAlpha: 0 }, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.15,
              duration: 0.6
          }, "-=0.4");
    }, []);
    
    // Effect for the glowing mouse hover background
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (backgroundAuraRef.current) {
                // Animate the aura to follow the cursor with a slight delay
                // xPercent and yPercent are used to keep the element's center on the cursor
                gsap.to(backgroundAuraRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 1.2,
                    ease: "power2.out"
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
                        <p className="profile-title">Data & AI Specialist</p>
                        <div className="about-highlights-section" ref={highlightsRef}>
                            <div className="highlight-item">
                                <span className="highlight-icon">💼</span>
                                <p className="highlight-text">Currently at Wipro</p>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">📊</span>
                                <p className="highlight-text">Data Analytics</p>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">🤖</span>
                                <p className="highlight-text">Generative AI</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: About Text */}
                    <div className="about-text-column" ref={textContentRef}>
                        <h2 className="about-title">About Me</h2>
                        <p className="about-description">
                            Hello! I am a dedicated professional with a passion for transforming data into actionable insights. 
                            My work is centered on <strong>Data Analytics</strong> and building expertise in <strong>Generative AI</strong>.
                        </p>
                        <p className="about-description">
                            I am driven to become a leader in cloud technologies and a key contributor in the field of 
                            AI solutions. I believe in continuous learning and innovation to solve complex, real-world problems.
                        </p>
                        <p className="about-description">
                            Outside of my professional pursuits, I enjoy exploring new technologies and collaborating on
                            projects that challenge the status quo and push the boundaries of innovation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
