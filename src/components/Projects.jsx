import React from 'react';
import './Projects.css'; // Import the dedicated CSS for the Projects page

// Dummy project data
const projectsData = [
  {
    id: 1,
    title: 'Interactive Portfolio Website',
    description: 'A modern, responsive portfolio built with React and styled with a sleek glassmorphism UI. Features smooth scroll animations using GSAP and dynamic navigation.',
    image: 'https://placehold.co/600x400/2d3748/e7e7e8?text=Portfolio+Website', // Dummy image
    tags: ['React', 'GSAP', 'CSS Modules', 'Responsive Design'],
    links: [
      { type: 'Live Demo', url: '#', icon: '🔗' },
      { type: 'GitHub', url: '#', icon: '💻' },
    ],
    // Placeholder for "Colab notebook" or "tabule project" code
    codeEmbed: 'This project includes a custom data visualization module. See the [Google Colab Notebook](https://colab.research.google.com/drive/your-notebook-id) for the data processing logic.',
  },
  {
    id: 2,
    title: 'AI Chatbot Integration',
    description: 'Developed a conversational AI chatbot using a large language model API, integrated into a web interface for seamless user interaction. Focus on natural language understanding and response generation.',
    image: 'https://placehold.co/600x400/2d3748/e7e7e8?text=AI+Chatbot', // Dummy image
    tags: ['Python', 'Flask', 'LLM API', 'JavaScript', 'REST API'],
    links: [
      { type: 'Live Demo', url: '#', icon: '🔗' },
      { type: 'GitHub', url: '#', icon: '💻' },
    ],
    codeEmbed: 'The core AI logic is implemented in a Python backend. Explore the [Tabular Data Processing Script](https://github.com/your-repo/your-script.py) for details.',
  },
  {
    id: 3,
    title: 'E-commerce Product Page',
    description: 'Designed and implemented a dynamic product display page for an e-commerce platform, featuring interactive image galleries, product variations, and add-to-cart functionality.',
    image: 'https://placehold.co/600x400/2d3748/e7e7e8?text=E-commerce+Page', // Dummy image
    tags: ['Next.js', 'Tailwind CSS', 'State Management', 'API Integration'],
    links: [
      { type: 'Live Demo', url: '#', icon: '🔗' },
      { type: 'GitHub', url: '#', icon: '💻' },
    ],
    codeEmbed: '', // No specific code embed for this one
  },
];

// Projects component now accepts a 'ref' prop for GSAP animations
const Projects = React.forwardRef((props, ref) => {
  return (
    <section className="projectsSection" id="projects" ref={ref}>
      <h2 className="projectsTitle">My Latest Projects</h2>
      {projectsData.map((project, index) => (
        <div key={project.id} className="projectCard">
          <div className="projectContent">
            <div className="projectImageContainer">
              <img src={project.image} alt={project.title} className="projectImage" />
            </div>
            <div className="projectDescriptionContainer">
              <h3 className="projectTitle">{project.title}</h3>
              <p className="projectText">{project.description}</p>
              <div className="projectTags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="projectTag">{tag}</span>
                ))}
              </div>
              <div className="projectLinks">
                {project.links.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.url} target="_blank" rel="noopener noreferrer" className="projectLink">
                    {link.icon} {link.type}
                  </a>
                ))}
              </div>
              {project.codeEmbed && (
                <p className="projectText" dangerouslySetInnerHTML={{ __html: project.codeEmbed }}></p>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
});

export default Projects;
