import React from 'react';
import './Experience.css';

const experienceData = [
{
  id: 1,
  title: 'AI/ML Engineer',
  company: 'Wipro · Client: Apple Inc.',
  duration: 'Mar 2025 – Present',
  location: 'Hyderabad (On-site)',
  description: [
    'Designing agentic AI systems using large language models and Model Context Protocol (MCP) to power an enterprise bot for incident-driven semantic search across siloed Apple platforms. ',
    'Building context-aware RAG pipelines and semantic retrieval flows that deliver real-time incident insights, improving response accuracy and reducing time-to-resolution for SRE teams. ',
    'Automating root-cause analysis and ticket intelligence with AI-driven NLG, cutting manual SOP lookups and freeing hundreds of engineering hours annually. ',
    'Unifying cross-functional incident and operations data into a single search layer, boosting data accessibility and reducing manual validation and testing effort. '
  ],
  imageUrl: './wipro.jpg'
},
  {
    id: 3,
    title: 'Intern',
    company: 'Psyliq',
    duration: 'Dec 2023 – Mar 2024',
    location: 'Remote',
    description: [
      'Contributed to projects involving Python programming and SQL, gaining hands-on experience in data handling, problem-solving, and analytics.',
      'Strengthened technical foundations by working on practical applications.'
    ],
    imageUrl: './psyliq.jpg'
  },
  {
    id: 4,
    title: 'Internship Trainee (RPA Specialist)',
    company: 'HighRadius',
    duration: 'Jul 2022 – Nov 2022',
    location: 'Bhubaneswar (On-site)',
    description: [
      'Specialized in building and executing automation workflows using RPA tools.',
      'Analyzed business processes, created workflows, and improved efficiency.',
      'Gained skills in Java, JavaScript, SQL, and handling structured/unstructured data (CSV, XML, JSON).'
    ],
    imageUrl: './Highradius.png'
  },
  {
    id: 5,
    title: 'Winter Intern',
    company: 'HighRadius',
    duration: 'Jan 2022 – Apr 2022',
    location: 'Bhubaneswar (Remote)',
    description: [
      'Worked on a full-stack product development project, covering user requirements, UI/UX, backend design, and machine learning models.',
      'Gained exposure to technologies including Python, Java, MySQL, React.js, Node.js, and data modeling.'
    ],
    imageUrl: './Highradius.png'
  },
];

const Experience = () => {
  return (
    <section id="experience" className="experienceSection">
      <h2 className="experienceTitle">Professional Experience</h2>
      <div className="timelineContainer">
        {experienceData.map((item, index) => (
          <div key={item.id} className={`timelineItem ${index % 2 === 0 ? 'contentLeft' : 'contentRight'}`}>
            <div className="timelineContentWrapper">
              <div className="timelineContent">
                <h3 className="jobTitle">{item.title}</h3>
                <p className="company">{item.company}</p>
                <div className="infoRow">
                  <span className="duration">{item.duration}</span>
                  <span className="location">{item.location}</span>
                </div>
                <ul className="descriptionList">
                  {item.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              </div>
              <div className="timelineImage">
                <img src={item.imageUrl} alt={item.company || 'Project'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
