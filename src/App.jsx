import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (important: do this only once)
gsap.registerPlugin(ScrollTrigger);

// Import all your main components
import NavbarIcons from './components/Navbar';
import Skills from './components/Skills';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Home from './components/Home'; // Import the Home component (now without its own canvas)
import BackgroundCanvas from './components/BackgroundCanvas'; // Import the new BackgroundCanvas component

// Import your global CSS
import './App.css';

// Define the section IDs here. These IDs must match the 'id' attributes
// on the root <section> element of each corresponding component.
const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];

function App() {
  // Ref for the main hero section (Home) - still passed to the Home component
  const heroRef = useRef(null);

  // Ref for collecting all scroll-animated sections.
  // We re-initialize it to an empty array on each render to prevent stale references
  // from hot reloads, ensuring only currently mounted elements are tracked.
  const sectionRefs = useRef([]);
  sectionRefs.current = [];

  // Function to add elements to the sectionRefs array.
  // This is passed as a 'ref' prop to child components (like About, Projects, Skills, Contact)
  // that need to be observed by ScrollTrigger.
  const addToSectionRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  // useEffect hook for setting up GSAP animations for sections (excluding Home's background)
  useEffect(() => {
    // Cleanup function: Kill all existing ScrollTrigger instances when the component unmounts
    // or before re-running the effect.
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // --- Scroll-triggered Fade-in for other sections ---
    const setupScrollAnimations = () => {
      sectionRefs.current.forEach((el, i) => {
        if (el) {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              markers: false,
            },
            y: 30,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power2.out',
          });
        }
      });
    };

    const timeoutId = setTimeout(setupScrollAnimations, 0);

    // Cleanup function for the useEffect hook
    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-container">
      {/* Global Background Canvas - positioned behind all content */}
      <BackgroundCanvas />

      {/* Navigation Bar */}
      <NavbarIcons sectionIds={sectionIds} />

      {/* Main content sections */}
      <Home ref={heroRef} /> {/* Home component now only contains content */}
      <About ref={addToSectionRefs} />
      <Projects ref={addToSectionRefs} />
      <section id="skills" ref={addToSectionRefs} className="section">
        <Skills />
      </section>
      <Contact ref={addToSectionRefs} />
    </div>
  );
}

export default App;
