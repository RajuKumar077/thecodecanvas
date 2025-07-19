import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css'; // Import CSS modules correctly

const icons = [
  { id: 'home', emoji: '🏠', text: 'Home' },
  { id: 'about', emoji: '📁', text: 'About' },
  { id: 'projects', emoji: '💼', text: 'Projects' },
  { id: 'skills', emoji: '📊', text: 'Skills' },
  { id: 'contact', emoji: '✉️', text: 'Contact' },
];

// NavbarIcons component now accepts 'sectionIds' prop
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
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is roughly in the middle of the viewport
      threshold: 0, // Trigger as soon as any part of the section is visible
    };

    icons.forEach((item) => {
      const sectionElement = document.getElementById(item.id);
      if (sectionElement) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Only update if the intersecting section is not already active
              // This prevents rapid flickering if multiple sections briefly intersect
              if (active !== entry.target.id) {
                setActive(entry.target.id);
                console.log(`Active section changed to: ${entry.target.id}`);
              }
            }
          });
        }, observerOptions);
        observer.observe(sectionElement);
        observers.push(observer);
      } else {
        console.warn(`Section with ID '${item.id}' not found for IntersectionObserver.`);
      }
    });

    // Cleanup function: disconnect all observers when component unmounts
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleScrollTo = (id) => {
    // When clicking a tab, set active immediately and scroll
    setActive(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
