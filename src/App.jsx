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
import Home from './components/Home';

// Removed the import for BackgroundCanvas

// Import your global CSS
import './App.css';

// Define the section IDs here.
const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];

function App() {
  const sectionRefs = useRef([]);
  sectionRefs.current = [];

  const addToSectionRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

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

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    // The main app container. We'll set a background color here instead of the canvas.
    <div className="relative w-full h-full text-white bg-black">
      {/* BackgroundCanvas component has been removed from here */}
      <div className="relative z-10 w-full">
        {/* Navigation Bar */}
        <NavbarIcons sectionIds={sectionIds} />

        {/* Main content sections */}
        <Home ref={addToSectionRefs} />
        <About ref={addToSectionRefs} />
        <Projects ref={addToSectionRefs} />
        <section id="skills" ref={addToSectionRefs} className="section">
          <Skills />
        </section>
        <Contact ref={addToSectionRefs} />
      </div>
    </div>
  );
}

export default App;
