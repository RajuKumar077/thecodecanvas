import { forwardRef, useRef, useState } from 'react';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import SectionHeading from './common/SectionHeading';
import MagneticButton from './common/MagneticButton';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { contact } from '../data/portfolio';
import './Contact.css';

import emailAnimation from '../assets/lotties/email.json';
import githubAnimation from '../assets/lotties/github.json';
import linkedinAnimation from '../assets/lotties/linkedin.json';
import twitterAnimation from '../assets/lotties/x.json';
import mediumAnimation from '../assets/lotties/medium.json';

const ICONS = { github: githubAnimation, linkedin: linkedinAnimation, twitter: twitterAnimation, medium: mediumAnimation };

const Contact = forwardRef(function Contact(_props, forwardedRef) {
  const ref = useRef(null);
  const lottieRefs = useRef({});
  const [copied, setCopied] = useState(false);

  const setRefs = (node) => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useSectionReveal(ref, ({ conditions }) => {
    if (!conditions.desktop) return;
    gsap.fromTo(
      '.contact-mail__addr',
      { backgroundSize: '0% 2px' },
      {
        backgroundSize: '100% 2px',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.contact-mail', start: 'top 80%', once: true },
      },
    );
  });

  // Play forward on hover/focus, reverse on leave (one ref per channel).
  const play = (id, dir) => () => {
    const anim = lottieRefs.current[id];
    if (!anim) return;
    anim.setDirection(dir);
    anim.play();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section id="contact" ref={setRefs} className="section section--surface contact" aria-labelledby="contact-title">
      <div className="shell">
        <SectionHeading
          id="contact"
          titleId="contact-title"
          eyebrow="Contact"
          lines={['Let’s build', 'what’s next.']}
          lede={contact.intro}
        />

        <div className="contact-grid">
          <div
            className="contact-mail card"
            data-reveal
            data-spotlight
            onMouseEnter={play('email', 1)}
            onMouseLeave={play('email', -1)}
          >
            <div className="contact-mail__icon" aria-hidden="true">
              <Lottie
                lottieRef={(r) => (lottieRefs.current.email = r)}
                animationData={emailAnimation}
                loop={false}
                autoplay={false}
              />
            </div>
            <p className="t-eyebrow">Email — the fastest way to reach me</p>
            <a className="contact-mail__addr" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <div className="contact-mail__actions">
              <MagneticButton href={`mailto:${contact.email}`} variant="primary">
                Write to me <span className="btn-icon btn-icon--ne">↗</span>
              </MagneticButton>
              <button type="button" className="btn btn--ghost" onClick={copy}>
                <span className="btn-label">{copied ? 'Copied ✓' : 'Copy address'}</span>
              </button>
              <span className="visually-hidden" role="status">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>
          </div>

          <ul className="contact-links">
            {contact.links.map((l) => (
              <li key={l.id} data-reveal>
                <a
                  className="contact-link card"
                  data-spotlight
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={play(l.id, 1)}
                  onMouseLeave={play(l.id, -1)}
                  onFocus={play(l.id, 1)}
                  onBlur={play(l.id, -1)}
                >
                  <span className="contact-link__icon" aria-hidden="true">
                    <Lottie
                      lottieRef={(r) => (lottieRefs.current[l.id] = r)}
                      animationData={ICONS[l.id]}
                      loop={false}
                      autoplay={false}
                    />
                  </span>
                  <span className="contact-link__text">
                    <span className="contact-link__label">{l.label}</span>
                    <span className="contact-link__handle t-mono">{l.handle}</span>
                  </span>
                  <span className="contact-link__arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default Contact;
