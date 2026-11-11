import { SECTIONS, contact, profile } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './Footer.css';

export default function Footer() {
  const reduced = useReducedMotion();
  const toTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#home');
  };

  return (
    <footer className="site-foot" data-cursor-theme="dark">
      <div className="shell">
        <div className="site-foot__cta">
          <p className="site-foot__cta-title">Have a problem worth solving with AI? Let’s talk.</p>
          <a className="site-foot__cta-btn" href={`mailto:${contact.email}`}>
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="site-foot__top">
          <p className="site-foot__word" aria-hidden="true">
            thecodecanvas<span>.</span>
          </p>
          <a href="#home" className="site-foot__top-btn" onClick={toTop}>
            <span aria-hidden="true">↑</span> Back to top
          </a>
        </div>

        <div className="site-foot__grid">
          <div>
            <p className="site-foot__name">{profile.name}</p>
            <p className="site-foot__role">{profile.title}</p>
            <a className="site-foot__mail" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="site-foot__h t-mono">Index</p>
            <ul>
              {SECTIONS.filter((s) => s.id !== 'home').map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="site-foot__h t-mono">Elsewhere</p>
            <ul>
              {contact.links.map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  Resume (PDF) ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-foot__base t-mono">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React, Vite &amp; GSAP</span>
        </div>
      </div>
    </footer>
  );
}
