import React from 'react';
import './Education.css';

const educationData = [
  {
    id: 1,
    degree: 'Data Science & Machine Learning Bootcamp',
    institution: 'UpGrad',
    duration: '6 Months',
    description: 'Completed the Data Scientist Bootcamp with upGrad, gaining expertise in Python, SQL, Data Analytics, and Machine Learning. Acquired practical exposure to AI, Deep Learning, and Data Visualization tools for solving real-world business problems.',
    image: './upgrad.jpg',
    link: 'https://upgrad.com' 
  },
  {
    id: 2,
    degree: 'Bachelor of Technology (B.Tech)',
    institution: 'KIIT University Bhubaneswar',
    duration: '2019 - 2023',
    description: 'Gained foundational knowledge and skills in Information Technology, with additional exposure to Data Analytics and Artificial Intelligence.',
    image: './kiit.jpg',
    link: 'https://kiit.ac.in/' 
  },
  {
    id: 3,
    degree: 'High School',
    institution: 'DALIMSS Sunbeam School Rohania',
    duration: '2017 - 2019',
    description: 'Completed my senior secondary education with a focus on Mathematics and Science.',
    image: './Dalimss.jpg',
    link: 'https://dalimss.com/'
  },
];

const Education = () => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--cursor-x', `${x}px`);
    card.style.setProperty('--cursor-y', `${y}px`);
  };

  return (
    <section id="education" className="educationSection">
      <h2 className="educationTitle">My Educational Journey</h2>
      <div className="cardGridContainer">
        {educationData.map((item) => (
          <div
            key={item.id}
            className="educationCard"
            onMouseMove={handleMouseMove}
          >
            <div className="cardContent">
              <h3 className="cardDegree">{item.degree}</h3>
              <p className="cardInstitution">{item.institution}</p>
              <p className="cardDuration">{item.duration}</p>
              <p className="cardDescription">{item.description}</p>
            </div>
            <div className="cardImageContainer">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="imageLink">
                <img
                  src={item.image}
                  alt={`${item.institution} building`}
                  className="cardImage"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;