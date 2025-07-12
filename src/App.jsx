import NavbarIcons from './components/Navbar';
import './App.css'; // Import App.css for full-page styling

function App() {
  return (
    <div className="app-container">
      <NavbarIcons />

      {/* Sections with IDs */}
      <section id="home" className="section">
        <div className="card">🏠 Home</div>
      </section>
      <section id="about" className="section">
        <div className="card">📁 About</div>
      </section>
      <section id="projects" className="section">
        <div className="card">💼 Projects</div>
      </section>
      <section id="skills" className="section">
        <div className="card">📊 Skills</div>
      </section>
      <section id="contact" className="section">
        <div className="card">✉️ Contact</div>
      </section>
    </div>
  );
}

export default App;