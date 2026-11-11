import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Cursor from './components/cursor/Cursor';
import Hero from './components/hero/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Playground from './components/Playground';
import Contact from './components/Contact';
import { SECTIONS } from './data/portfolio';
import './App.css';

const sectionIds = SECTIONS.map((s) => s.id);

/** Each section owns its GSAP choreography (see hooks/useSectionReveal). */
function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar sectionIds={sectionIds} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Playground />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}

export default App;
