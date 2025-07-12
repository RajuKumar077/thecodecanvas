import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css'; // Import CSS modules correctly

const icons = [
  { id: 'home', emoji: '🏠', text: 'Home' },
  { id: 'about', emoji: '📁', text: 'About' },
  { id: 'projects', emoji: '💼', text: 'Projects' },
  { id: 'skills', emoji: '📊', text: 'Skills' },
  { id: 'contact', emoji: '✉️', text: 'Contact' },
];

const NavbarIcons = () => {
  const [active, setActive] = useState('home');
  const [sliderStyles, setSliderStyles] = useState({ opacity: 0 }); // Initialize with opacity 0
  const navTabsContainerRef = useRef(null);
  const tabRefs = useRef({}); // Object to store refs for each tab

  // Effect to update slider position when active tab changes or on mount
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

  const handleScrollTo = (id) => {
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