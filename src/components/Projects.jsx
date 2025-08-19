import React, { useEffect, useRef } from 'react';
import './Projects.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Dummy project data
const projectsData = [
  {
    id: 1,
    title: 'Northwind Insights: Business Intelligence with SQL',
    description: 'A comprehensive business intelligence project using the classic Northwind database. Analyzes sales trends, customer behavior, and inventory patterns through advanced SQL queries and optimized data insights.',
    image: 'src/assets/documents/DBsql.png', // Updated image location
    tags: ['SQL', 'DBeaver', 'Business Intelligence', 'Data Analysis'],
    links: [

      { type: 'GitHub', url: 'https://github.com/RajuKumar077/Northwind-Insights-Unlocking-Business-Intelligence-with-SQL', icon: '💻' },
      { type: 'Presentation', url: 'src/assets/documents/SQL.pdf', icon: '📊' } // Updated PPT location
    ],
    codeEmbed: '',
  },


{
  id: 4,
  title: 'SecurePay: Real-Time Credit Card Fraud Detection',
  description: 'An advanced machine learning project designed to detect fraudulent credit card transactions in real-time. Built with imbalanced dataset handling, feature engineering, and state-of-the-art classification models to safeguard customers and financial institutions from unauthorized transactions.',
  image: 'https://colab.research.google.com/img/colab_favicon_256px.png', // Default Colab logo (replace with custom screenshot if available)
  tags: ['Python', 'Machine Learning', 'Imbalanced Data', 'Fraud Detection', 'LightGBM'],
  links: [
    { type: 'Colab Notebook', url: 'https://colab.research.google.com/drive/1D_Y43yJOFKaNsvGXs1KA5BLAspxbpKWX?usp=sharing', icon: '📓' },
    { type: 'Dataset', url: 'https://drive.google.com/file/d/14QQsG3Z96dXMxg3bl0SdgF9_Bs6gBXrk/view?usp=sharing', icon: '📊' },
    { type: 'Google Drive', url: 'https://drive.google.com/drive/folders/1fkipZr5DINvCx3uOkmDJ4j01V0FbSscT', icon: '🔗' } // Replace with your Drive folder link if public
  ],
  codeEmbed: 'The project applies advanced ML techniques such as Logistic Regression, Random Forest, Gradient Boosting, and LightGBM with hyperparameter tuning. Evaluation emphasizes Recall, Precision, F1-Score, and AUC to ensure accurate fraud detection on a highly imbalanced dataset.',
},

  {
    id: 5,
    title: 'Employee Performance & Workforce Trends',
    description: 'Developed an interactive Tableau dashboard to analyze workforce metrics, including total performance scores, employee count, average sick days, and overtime trends. The dashboard provides insights into performance over time, gender distribution, job title breakdown, salary comparisons by education level, department-wise performance, and overtime patterns, helping organizations make informed HR and operational decisions.',
    image: 'https://public.tableau.com/static/images/Em/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1/1_rss.png', 
    tags: ['Tableau', 'Data Visualization', 'Workforce Analytics', 'Interactive Dashboard'],
    links: [
      { type: 'Live Demo', url: 'https://public.tableau.com/views/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1?:language=en-US&:display_count=n&:origin=viz_share_link', icon: '🔗' }
    ],
    codeEmbed: '',
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
