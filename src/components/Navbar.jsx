import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css'; // Import CSS modules correctly

const icons = [
  { id: 'home', emoji: '🏠', text: 'Home' },
  { id: 'about', emoji: '📁', text: 'About' },
  { id: 'projects', emoji: '💼', text: 'Projects' },
  { id: 'skills', emoji: '📊', text: 'Skills' },
  { id: 'contact', emoji: '✉️', text: 'Contact' },
];

const NavbarIcons = ({ sectionIds }) => {
  const [active, setActive] = useState('home');
  const [sliderStyles, setSliderStyles] = useState({ opacity: 0 }); // Initialize with opacity 0
  const navTabsContainerRef = useRef(null);
  const tabRefs = useRef({}); // Object to store refs for each tab

  // Effect to update slider position when active tab changes or on mount/resize
  useEffect(() => {
    const updateSlider = () => {
      const activeTabElement = tabRefs.current[active];
      const container = navTabsContainerRef.current;

      if (activeTabElement && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();

        setSliderStyles({
          width: `${tabRect.width}px`,
          left: `${tabRect.left - containerRect.left}px`,
          opacity: 1, // Show slider when positioned
        });
      } else {
        setSliderStyles({ opacity: 0 }); // Hide slider if no active tab
      }
    };

    // Run initially and on resize
    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [active]);

  // Effect to set up IntersectionObserver for scroll tracking
  useEffect(() => {
    const observers = [];
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -20% 0px', // Adjusted to be less strict
      threshold: 0, // Trigger as soon as any part of the section is visible
    };

    sectionIds.forEach((id) => { 
      const sectionElement = document.getElementById(id);
      if (sectionElement) {
        console.log(`Navbar OBSERVER: Observing section: #${id}`); 
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Only update if the intersecting section is not already active
              if (active !== entry.target.id) {
                setActive(entry.target.id);
                console.log(`Navbar OBSERVER: Active section changed to: ${entry.target.id}`);
              }
            }
          });
        }, observerOptions);
        observer.observe(sectionElement);
        observers.push(observer);
      } else {
        console.warn(`Navbar OBSERVER: Section with ID '${id}' not found for IntersectionObserver.`);
      }
    });

    // Cleanup function: disconnect all observers when component unmounts
    return () => {
      observers.forEach((observer) => observer.disconnect());
      console.log('Navbar OBSERVER: All IntersectionObservers disconnected.');
    };
  }, [sectionIds, active]);

  const handleScrollTo = (id) => {
    setActive(id);
    const target = document.getElementById(id);
    console.log(`Navbar CLICK: Attempting to scroll to ID: ${id}`); // Log the ID being clicked
    if (target) {
      console.log(`Navbar CLICK: Target element found:`, target); // Log the actual DOM element found
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      console.log(`Navbar CLICK: scrollIntoView called for ID: ${id}`); // Confirm scroll method is called
    } else {
      console.error(`Navbar CLICK: Element with ID '${id}' NOT FOUND for scrolling.`); // Error if not found
    }
  };

  return (
    <div className={styles.fixed}>
      <nav className={styles.navContainer}>
        <div ref={navTabsContainerRef} className={styles.navTabs}>
          {/* The Glass Slider */}
          <div
            className={styles.navGlass}
            style={sliderStyles}
          ></div>

          {icons.map((item) => (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              ref={(el) => (tabRefs.current[item.id] = el)} // Store ref by ID
              onClick={() => handleScrollTo(item.id)}
              className={`${styles.navTab} ${active === item.id ? styles.active : ''}`}
            >
              <span className={styles.tabText}>{item.emoji} {item.text}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default NavbarIcons;
