import React, { useEffect } from 'react';
import gsap from 'gsap';

const Home = React.forwardRef((props, ref) => {
  // GSAP animation for text content (remains here as it's specific to Home's content)
  useEffect(() => {
    if (ref.current) {
      gsap.from(ref.current.querySelector('.homeCard'), {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5 // Delay slightly to let the global background appear
      });
    }
  }, [ref]);

  return (
    <section id="home" ref={ref} className="homeSection relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Content for the hero section, layered above the global canvas */}
      <div className="homeCard relative z-10 text-center text-white p-6 md:p-10 rounded-xl shadow-lg bg-black bg-opacity-40 max-w-3xl mx-auto">
        <h1 className="heroTitle text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Hello, I'm <span className="text-blue-300">Your Name!</span>
        </h1>
        <p className="heroSubtitle text-xl md:text-2xl font-medium mb-6 text-gray-200">
          A Passionate Data Analyst & Web Developer
        </p>
        <p className="heroDesc text-base md:text-lg mb-8 text-gray-300">
          I transform complex datasets into actionable insights and build intuitive web applications to visualize them. Explore my portfolio to see how data comes to life!
        </p>
        <div className="heroButtons flex flex-col sm:flex-row justify-center gap-4">
          <button className="primaryBtn px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
            View My Work
          </button>
          <button className="secondaryBtn px-8 py-3 bg-transparent border-2 border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
});

export default Home;
