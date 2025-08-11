import React from 'react';
import './About.css';

const About = () => {
  React.useEffect(() => {
    console.log('About.jsx component mounted and rendering.');
  }, []);

  return (
    <section id="about" className="aboutSection">
      <div className="aboutCard">
        <h2 className="aboutTitle">About Me 👋</h2>
        <div className="aboutDivider"></div>
        
        <p className="aboutDescription">
          Hello! I'm <strong>Raju Kumar</strong>, currently working at <strong>Wipro</strong> 💼.  
          My focus is on <strong>Data Analytics</strong> 📊 and advancing expertise in <strong>Generative AI</strong> 🤖.  
          I aim to become a leader in cloud technologies ☁️ and a professional in generative AI solutions.
        </p>

        <p className="aboutDescription">
          I’m passionate about leveraging data to drive insights and build intelligent systems that solve real-world problems.  
          Continuously learning and innovating, I combine technical skills with strategic thinking to deliver impactful results.
        </p>

        <div className="aboutHighlight">
          <span className="highlightIcon">✨</span>
          <p className="highlightText">
            Dedicated to transforming data into actionable intelligence and shaping the future of AI-driven solutions.
          </p>
        </div>

        <p className="aboutDescription">
          Outside of work, I enjoy exploring emerging technologies and collaborating on projects that push the boundaries of innovation.
        </p>
      </div>
    </section>
  );
};

export default About;
