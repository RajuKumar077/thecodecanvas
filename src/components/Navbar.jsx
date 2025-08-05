import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';

const icons = [
    { id: 'home', emoji: '🏠', text: 'Home' },
    { id: 'about', emoji: '📁', text: 'About' },
    { id: 'projects', emoji: '💼', text: 'Projects' },
    { id: 'skills', emoji: '📊', text: 'Skills' },
    { id: 'contact', emoji: '✉️', text: 'Contact' },
];

const NavbarIcons = ({ sectionIds }) => {
    const [active, setActive] = useState('home');
    const [sliderStyles, setSliderStyles] = useState({ opacity: 0 });
    const navTabsContainerRef = useRef(null);
    const tabRefs = useRef({});

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
                    opacity: 1,
                });
            } else {
                setSliderStyles({ opacity: 0 });
            }
        };

        updateSlider();
        window.addEventListener('resize', updateSlider);
        return () => window.removeEventListener('resize', updateSlider);
    }, [active]);

    useEffect(() => {
        const observers = [];
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
        };

        const observerCallback = (entries) => {
            const intersectingEntry = entries.find(entry => entry.isIntersecting);
            if (intersectingEntry && active !== intersectingEntry.target.id) {
                setActive(intersectingEntry.target.id);
            }
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sectionIds.forEach((id) => {
            const sectionElement = document.getElementById(id);
            if (sectionElement) {
                observer.observe(sectionElement);
                observers.push(observer);
            }
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, [sectionIds, active]);
    
    // --- Manual Scrolling Function ---
    const scrollToSection = (targetId, duration = 800) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
            console.error(`Navbar CLICK: Element with ID '${targetId}' NOT FOUND for scrolling.`);
            return;
        }

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    const handleScrollTo = (id) => {
        setActive(id);
        scrollToSection(id);
    };

    return (
        <div className={styles.fixed}>
            <nav className={styles.navContainer}>
                <div ref={navTabsContainerRef} className={styles.navTabs}>
                    <div
                        className={styles.navGlass}
                        style={sliderStyles}
                    ></div>
                    {icons.map((item) => (
                        <button
                            key={item.id}
                            id={`nav-tab-${item.id}`}
                            ref={(el) => (tabRefs.current[item.id] = el)}
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