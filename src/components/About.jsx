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
          Hello! I'm <strong>Raju Kumar</strong>, a passionate and results-driven <strong>Developer</strong> 💻 
          with expertise in <strong>Python, Java, SQL, Machine Learning, and Data Analytics</strong> 📊, alongside strong skills in 
          <strong> Tailwind CSS, React, and modern front-end development</strong> 🎨. I thrive on creating dynamic, user-friendly, and impactful 
          digital experiences.
        </p>

        <p className="aboutDescription">
          Currently, I work at <strong>Wipro Technologies</strong> 🏢 in the Quality Engineering & Testing practice, 
          where I focus on delivering high-quality, scalable solutions 🚀. My background also includes 
          <strong> data visualization</strong> (Tableau, Power BI) 📈, <strong>big data technologies</strong> (Hadoop) 💾, and 
          <strong> database management</strong> (MySQL, MongoDB) 🗃️. I enjoy building projects that merge analytics with intelligent automation 🤖.
        </p>

        <div className="aboutHighlight">
          <span className="highlightIcon">✨</span>
          <p className="highlightText">
            Committed to crafting engaging, efficient, and innovative digital solutions that make an impact 🌟.
          </p>
        </div>

        <p className="aboutDescription">
          Beyond coding, I’m an explorer of new technologies 🌐, a continuous learner 📚, and a believer in creating 
          meaningful real-world change through innovation 💡. Always open to exciting collaborations and forward-thinking ideas!
        </p>
      </div>
    </section>
  );
};

export default About;
