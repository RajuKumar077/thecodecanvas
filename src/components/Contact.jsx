import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';

gsap.registerPlugin(ScrollTrigger);

import './Contact.css';

// Import your downloaded Lottie animation JSON files
import emailAnimation from '../assets/lotties/email.json';
import githubAnimation from '../assets/lotties/github.json';
import linkedinAnimation from '../assets/lotties/linkedin.json';
import twitterAnimation from '../assets/lotties/x.json';

const contactDetails = [
  { id: 'email', icon: emailAnimation, text: 'your.email@example.com', link: 'rajukumardalimss@gmail.com' },
  { id: 'github', icon: githubAnimation, text: 'GitHub Profile', link: 'https://github.com/RajuKumar077' },
  { id: 'linkedin', icon: linkedinAnimation, text: 'LinkedIn Profile', link: 'https://www.linkedin.com/in/raju-kumar7388/' },
  { id: 'twitter', icon: twitterAnimation, text: 'Twitter', link: 'https://x.com/Rajukumar2580' },
];

const Contact = React.forwardRef((props, ref) => {
  const rootRef = useRef(ref); // Use a new ref to hold the forwarded ref

  // Create a separate ref for each Lottie instance
  const emailLottieRef = useRef(null);
  const githubLottieRef = useRef(null);
  const linkedinLottieRef = useRef(null);
  const twitterLottieRef = useRef(null);

  // Map each contact item to its dedicated ref
  const lottieRefs = {
    email: emailLottieRef,
    github: githubLottieRef,
    linkedin: linkedinLottieRef,
    twitter: twitterLottieRef,
  };

  // Effect for GSAP animations (unchanged)
  useEffect(() => {
    // Check if the ref has been assigned before using it
    const currentRef = rootRef.current.current;
    if (!currentRef) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: currentRef,
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

    tl.from(currentRef.querySelector('.contactTitle'), {});
    tl.from(currentRef.querySelector('.contactText'), { delay: 0.2 }, "<0.2");
    tl.from(currentRef.querySelectorAll('.contactLinkItem'), {
      y: 20,
      stagger: 0.15,
      duration: 0.6,
    }, "<0.3");

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
  }, [rootRef]); // Depend on the rootRef

  return (
    <section className="contactSection" id="contact" ref={ref}>
      <div className="contactCard">
        <h2 className="contactTitle">Get In Touch</h2>
        <p className="contactText">
          I'm always open to new opportunities, collaborations, and interesting discussions.
          Feel free to reach out through any of the channels below!
        </p>
        <div className="contactLinks">
          {contactDetails.map((item) => {
            const lottieRef = lottieRefs[item.id]; // Get the correct ref for the current item

            const handleMouseEnter = () => {
              if (lottieRef.current) {
                lottieRef.current.setDirection(1);
                lottieRef.current.play();
              }
            };

            const handleMouseLeave = () => {
              if (lottieRef.current) {
                lottieRef.current.setDirection(-1);
                lottieRef.current.play();
              }
            };

            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contactLinkItem"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="contactIcon">
                  <Lottie
                    lottieRef={lottieRef} // Assign the unique ref
                    animationData={item.icon}
                    loop={false}
                    autoplay={false}
                    style={{ width: 70, height: 70 }}
                    speed={0.5}
                  />
                </div>
                <span className="contactLinkText">{item.text}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Contact;