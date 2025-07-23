import React from 'react';
import './About.css'; // Import the dedicated CSS for the About page

// About component now accepts a 'ref' prop
const About = React.forwardRef((props, ref) => {
  // Add a console log to confirm this component mounts
  React.useEffect(() => {
    console.log('About.jsx component mounted and rendering.');
  }, []);

  return (
    // Pass the ref to the root element of this component
    <section className="aboutSection" ref={ref}>
      <div className="aboutCard">
        <h2 className="aboutTitle">About Me</h2>
        {/* Decorative divider/element */}
        <div className="aboutDivider"></div>
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
        {/* Another decorative element or call to action */}
        <div className="aboutHighlight">
          <span className="highlightIcon">✨</span>
          <p className="highlightText">Committed to crafting engaging and efficient digital solutions.</p>
        </div>
        <p className="aboutDescription">
          Outside of coding, I enjoy [mention a hobby or two, e.g., exploring new tech, hiking, reading sci-fi].
          I'm always eager to learn new technologies and collaborate on exciting projects. Feel free to connect!
        </p>
      </div>
    </section>
  );
});

export default About;
