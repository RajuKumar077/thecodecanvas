import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (important: do this only once in your app, e.g., in App.jsx)
gsap.registerPlugin(ScrollTrigger);

import './Contact.css'; // Import the dedicated CSS for the Contact page

// Define contact details for rendering the links
const contactDetails = [
  { id: 'email', icon: '📧', text: 'your.email@example.com', link: 'mailto:your.email@example.com' },
  { id: 'github', icon: '💻', text: 'GitHub Profile', link: 'https://github.com/yourusername' },
  { id: 'linkedin', icon: '👔', text: 'LinkedIn Profile', link: 'https://linkedin.com/in/yourprofile' },
  { id: 'twitter', icon: '🐦', text: 'Twitter', link: 'https://twitter.com/yourhandle' },
  // Add more contact methods as needed
];

// Contact component now handles its own GSAP animations and relies on the global background
const Contact = React.forwardRef((props, ref) => { // Accepts ref from App.jsx

  // Effect for setting up GSAP animations for Contact section content
  useEffect(() => {
    // Ensure GSAP and ScrollTrigger are ready and the ref is attached
    if (!ref.current) return; // Use the passed ref directly

    // Create a GSAP Timeline for the contact section content animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current, // Use the passed ref as the trigger
        start: 'top 80%', // When the top of the section is 80% from the top of the viewport
        toggleActions: 'play none none reverse', // Play on scroll down, reverse on scroll up
        // markers: true, // Uncomment for debugging ScrollTrigger
      },
      defaults: {
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        duration: 0.8,
      }
    });

    // Animate the title
    tl.from(ref.current.querySelector('.contactTitle'), {});

    // Animate the main text description
    tl.from(ref.current.querySelector('.contactText'), {
      delay: 0.2, // Slight delay after title
    }, "<0.2"); // Start 0.2 seconds after the previous animation ends

    // Animate each contact link item with a stagger
    tl.from(ref.current.querySelectorAll('.contactLinkItem'), {
      y: 20, // Move slightly less for individual items
      stagger: 0.15, // Stagger effect for each link
      duration: 0.6,
    }, "<0.3"); // Start 0.3 seconds after the previous animation ends

    // Cursor tracking for gradient move effect on contact link items
    const handleMouseMove = (e) => {
      const linkItems = document.querySelectorAll('.contactLinkItem');
      linkItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        item.style.setProperty('--cursor-x', `${xPercent}%`);
        item.style.setProperty('--cursor-y', `${yPercent}%`);
      });
    };

    // Add the event listener when the component mounts
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function for ScrollTrigger and event listener
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill(); // Clean up GSAP ScrollTrigger
      }
      document.removeEventListener('mousemove', handleMouseMove); // Clean up mousemove listener
    };
  }, [ref]); // Dependency on ref ensures effect re-runs if ref changes (unlikely for a section)

  return (
    <section className="contactSection" id="contact" ref={ref}> {/* Use the passed ref here */}
      {/* The particle-layer is assumed to be a global element, not local to this section */}

      {/* Content for the contact section, layered above the global canvas */}
      <div className="contactCard"> {/* The z-index is handled by CSS */}
        <h2 className="contactTitle">Get In Touch</h2>
        <p className="contactText">
          I'm always open to new opportunities, collaborations, and interesting discussions.
          Feel free to reach out through any of the channels below!
        </p>
        <div className="contactLinks">
          {contactDetails.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="contactLinkItem"
            >
              <span className="contactIcon">{item.icon}</span>
              <span className="contactLinkText">{item.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Contact;
