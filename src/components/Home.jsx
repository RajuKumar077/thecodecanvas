import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <section className="homeSection">
      <div className="homeCard">
        <div className="heroContent">
          <h1 className="heroTitle">Hi, I'm Raju Kumar 👋</h1>
          <p className="heroSubtitle">Data Analyst & AI Explorer</p>
          <p className="heroDesc">
            Crafting insights, building intelligent solutions 🚀
          </p>
          <div className="heroButtons">
            <button className="primaryBtn">View Projects</button>
            <button className="secondaryBtn">Contact Me</button>
          </div>
        </div>
        <img src="/assets/react.svg" alt="Profile" className="heroImage" />
      </div>
    </section>
  );
};

export default Home;