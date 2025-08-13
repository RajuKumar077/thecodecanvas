import React, { useEffect, useRef } from 'react';
import './Projects.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Dummy project data
const projectsData = [
  {
    id: 1,
    title: 'Interactive Portfolio Website',
    description: 'A modern, responsive portfolio built with React and styled with a sleek glassmorphism UI. Features smooth scroll animations and dynamic navigation.',
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
{
  id: 4,
  title: 'Employee Performance & Workforce Trends',
  description: 'Developed an interactive Tableau dashboard to analyze workforce metrics, including total performance scores, employee count, average sick days, and overtime trends. The dashboard provides insights into performance over time, gender distribution, job title breakdown, salary comparisons by education level, department-wise performance, and overtime patterns, helping organizations make informed HR and operational decisions.',
  image: 'https://public.tableau.com/static/images/Em/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1/1_rss.png', // Tableau's preview image
  tags: ['Tableau', 'Data Visualization', 'Workforce Analytics', 'Interactive Dashboard'],
  links: [
    { type: 'Live Demo', url: 'https://public.tableau.com/views/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1?:language=en-US&:display_count=n&:origin=viz_share_link', icon: '🔗' }
  ],
  codeEmbed: '', // No code embed for Tableau
},

];

// Framer Motion variants for staggered animation of the project grid.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Slightly faster stagger for a smoother reveal
      delayChildren: 0.15,   // Slightly less delay before first child starts animating
    },
  },
};

// Framer Motion variants for individual project cards.
const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      mass: 1,
    },
  },
};

// Projects component now accepts a 'ref' prop for GSAP animations
const Projects = React.forwardRef((props, ref) => {
  // We no longer need projectCardRefs for Intersection Observer as Framer Motion handles it
  // const projectCardRefs = useRef([]);

  useEffect(() => {
    // Event listener for cursor tracking to enable the premium gradient effect on cards.
    // This updates CSS custom properties (--cursor-x, --cursor-y) based on mouse position.
    const handleMouseMove = (e) => {
      // Select project cards, similar to how certificate cards are selected in Skills.jsx
      const cards = document.querySelectorAll('.projectCard');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Calculate mouse position relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Convert to percentage for CSS custom properties
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        card.style.setProperty('--cursor-x', `${xPercent}%`);
        card.style.setProperty('--cursor-y', `${yPercent}%`);
      });
    };

    // Add the event listener when the component mounts
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return (
    <section className="projectsSection" id="projects" ref={ref}>
      <h2 className="projectsTitle">My Latest Projects</h2>
      {/* Framer Motion div for the project grid, enabling staggered animations */}
      <motion.div
        className="projectGridContainer" // New class for the grid wrapper
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {projectsData.map((project, index) => (
          // Framer Motion div for each individual project card
          <motion.div
            key={project.id}
            className="projectCard"
            variants={itemVariants} // Apply individual item animation variants
            // The inline style for animationDelay is now handled by staggerChildren in containerVariants
            // ref={el => (projectCardRefs.current[index] = el)} // No longer needed with Framer Motion
          >
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
});

export default Projects;
