import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react'; // Import the Lottie player

// Register GSAP plugins (important: do this only once in your app, e.g., in App.jsx)
gsap.registerPlugin(ScrollTrigger);

import './Contact.css'; // Import the dedicated CSS for the Contact page


// Import your downloaded Lottie animation JSON files
import emailAnimation from '../assets/lotties/email.json';
import githubAnimation from '../assets/lotties/github.json';
import linkedinAnimation from '../assets/lotties/linkedin.json';
import twitterAnimation from '../assets/lotties/x.json';
// NOTE: Make sure the file paths and names match your project structure.

// Define contact details for rendering the links
const contactDetails = [
  // The 'icon' property now holds the imported Lottie animation data
  { id: 'email', icon: emailAnimation, text: 'your.email@example.com', link: 'rajukumardalimss@gmail.com' },
  { id: 'github', icon: githubAnimation, text: 'GitHub Profile', link: 'https://github.com/RajuKumar077' },
  { id: 'linkedin', icon: linkedinAnimation, text: 'LinkedIn Profile', link: 'https://www.linkedin.com/in/raju-kumar7388/' },
  { id: 'twitter', icon: twitterAnimation, text: 'Twitter', link: 'https://x.com/Rajukumar2580' },
  // Add more contact methods as needed
];

// Contact component now handles its own GSAP animations and relies on the global background
const Contact = React.forwardRef((props, ref) => {
  // Effect for setting up GSAP animations for Contact section content
  useEffect(() => {
    if (!ref.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      defaults: {
        opacity: 0,
        y: 30,
        ease: 'power2.out',
        duration: 0.8,
      },
    });

    tl.from(ref.current.querySelector('.contactTitle'), {});

    tl.from(ref.current.querySelector('.contactText'), {
      delay: 0.2,
    }, "<0.2");

    tl.from(ref.current.querySelectorAll('.contactLinkItem'), {
      y: 20,
      stagger: 0.15,
      duration: 0.6,
    }, "<0.3");

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

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return (
    <section className="contactSection" id="contact" ref={ref}>
      <div className="contactCard">
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
              {/* This is the key change: rendering the Lottie animation */}
              <div className="contactIcon">
                <Lottie
                  animationData={item.icon}
                  loop={true}
                  autoplay={true}
                  style={{ width: 40, height: 40 }} // Adjust size as needed
                />
              </div>
              <span className="contactLinkText">{item.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Contact;