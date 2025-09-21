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

// --- NEW IMPORTS FOR EXPERIENCE AND EDUCATION ---
import Experience from './components/Experience';
import Education from './components/Education';

// Import your global CSS
import './App.css';

// Define the section IDs here.
// The list is updated to include the new 'experience' and 'education' sections.
const sectionIds = ['home', 'about', 'experience', 'education', 'projects', 'skills', 'contact'];

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
    <div className="relative w-full h-full text-white bg-black">
      <div className="relative z-10 w-full">
        {/* Navigation Bar */}
        {/* The Navbar now correctly lists and links to all sections */}
        <NavbarIcons sectionIds={sectionIds} />

        {/* Main content sections */}
        {/* Components with their own internal GSAP animations don't need the 'ref' prop here. */}
        <Home ref={addToSectionRefs} />


        <About />


        <Experience />
        

        <Projects ref={addToSectionRefs} />
        <Skills ref={addToSectionRefs} />
        <Education />
        <Contact ref={addToSectionRefs} />
      </div>
    </div>
  );
}

export default App;
