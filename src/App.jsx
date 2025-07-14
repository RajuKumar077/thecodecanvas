import NavbarIcons from './components/Navbar';
import Home from './components/Home'; // ✅ Make sure this line exists
import './App.css'; // Import App.css for full-page styling
import Skills from './components/Skills';

function App() {
  return (
    <div className="app-container">
      <NavbarIcons />

      {/* Sections with IDs */}
      <section id="home" className="section">
        <Home /> {/* ✅ This will show your actual Home component UI */}
      </section>

      <section id="about" className="section">
        <div className="card">📁 About</div>
      </section>

      <section id="projects" className="section">
        <div className="card">💼 Projects</div>
      </section>

      <section id="skills" className="section">
         <Skills /> 
      </section>

      <section id="contact" className="section">
        <div className="card">✉️ Contact</div>
      </section>
    </div>
  );
}

export default App;
