import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import NavbarIcons from './components/Navbar';
import Skills from './components/Skills'; // Re-import Skills component
import About from './components/About';   // Re-import About component
import './App.css'; // Ensure App.css is imported for global styles

// Define the section IDs here, consistent with your NavbarIcons component
const sectionIds = ['home', 'about', 'projects', 'skills', 'contact']; 

function App() {
  // Ref for the main hero section
  const heroRef = useRef(null);
  // Ref for collecting all scroll-animated sections
  const sectionRefs = useRef([]);
  // Initialize sectionRefs as an empty array to push elements into
  sectionRefs.current = []; 

  // Function to add elements to the sectionRefs array
  const addToSectionRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Cleanup function for ScrollTrigger instances to prevent duplicates on hot reloads
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // --- Hero Section Animation (on load) ---
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        onComplete: () => console.log('Hero animation set up and running.'),
      });
    } else {
      console.log('heroRef.current is null, hero animation skipped.');
    }

    // --- Scroll-triggered Fade-in for other sections ---
    const setupScrollAnimations = () => {
      console.log('Sections collected for animation:', sectionRefs.current.length, sectionRefs.current);

      sectionRefs.current.forEach((el, i) => {
        if (el) { // Ensure element exists before creating a ScrollTrigger
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 80%', // When the top of the element hits 80% down the viewport
              toggleActions: 'play none none reverse', // Play on scroll down, reverse on scroll up
              markers: false, // Set markers to false for production, or true for debugging
              onEnter: () => console.log(`Section ${el.id} entered.`),
              onLeave: () => console.log(`Section ${el.id} left.`),
              onEnterBack: () => console.log(`Section ${el.id} entered back.`),
              onLeaveBack: () => console.log(`Section ${el.id} left back.`),
            },
            y: 30, // Move up from 30px below
            opacity: 0, // Start fully transparent
            duration: 1,
            delay: i * 0.1, // Stagger the animation for each section
            ease: 'power2.out',
            onComplete: () => console.log(`Section ${el.id} animation complete.`),
          });
        } else {
          console.log(`Section element at index ${i} is null, skipping animation setup.`);
        }
      });
    };

    // Use a setTimeout with 0 delay to ensure setup runs after all current render cycles
    const timeoutId = setTimeout(setupScrollAnimations, 0);

    // Cleanup function for ScrollTrigger instances
    return () => {
      clearTimeout(timeoutId); // Clear the timeout if component unmounts quickly
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="app-container">
      {/* Navigation Bar - Pass sectionIds to NavbarIcons */}
      <NavbarIcons sectionIds={sectionIds} />

      {/* Hero Section - Apply heroRef */}
      <section id="home" ref={heroRef} className="homeSection">
        <div className="homeCard">
          <h1 className="heroTitle">Hello, I'm Your Name!</h1>
          <p className="heroSubtitle">A Passionate Web Developer</p>
          <p className="heroDesc">
            I build beautiful and functional web applications using modern technologies like React and Tailwind CSS.
            Explore my portfolio to see my projects and skills!
          </p>
          <div className="heroButtons">
            <button className="primaryBtn">View My Work</button>
            <button className="secondaryBtn">Contact Me</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About ref={addToSectionRefs} />

      {/* Projects Section */}
      <section id="projects" ref={addToSectionRefs} className="section">
        <div className="card">💼 Projects</div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={addToSectionRefs} className="section">
        <Skills />
      </section>

      {/* Contact Section */}
      <section id="contact" ref={addToSectionRefs} className="section">
        <div className="card">✉️ Contact</div>
      </section>
    </div>
  );
}

export default App;
