// src/components/About.jsx

import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(() => {
    console.log('About.jsx component mounted and rendering.');
  }, []);

  return (
    <div className="aboutCard">
      <h2 className="aboutTitle">About Me</h2>
      <p className="aboutDescription">
        Hello! I'm [Your Name], a passionate and driven web developer with a keen interest in creating
        dynamic and user-friendly digital experiences. My journey into development began with a fascination
        for how websites work, evolving into a dedication to crafting robust and aesthetically pleasing applications.
      </p>
      <p className="aboutDescription">
        I specialize in front-end development using React, building responsive and interactive user interfaces.
        I also have experience with modern CSS frameworks like Tailwind CSS to streamline styling and ensure
        a consistent design language across projects. My goal is to combine clean code with intuitive design
        to deliver impactful solutions.
      </p>
      <p className="aboutDescription">
        Outside of coding, I enjoy exploring new tech, hiking, reading sci-fi.
        I'm always eager to learn new technologies and collaborate on exciting projects. Feel free to connect!
      </p>
    </div>
  );
};

export default About;
