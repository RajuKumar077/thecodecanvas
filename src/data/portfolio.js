/* ==========================================================================
   Portfolio content — single source of truth.
   Copy is carried over verbatim from the original sections; only structure
   (ids, grouping) has been added so the UI and the Lab search share it.
   ========================================================================== */

export const profile = {
  name: 'Raju Kumar',
  title: 'AI/ML Engineer & LLM Builder',
  photo: '/certificates/Profile Picture.gif',
  video: '/raju-portrait.mp4',
  resume: '/certificates/resume.pdf',
  highlights: [
    'AI/ML Engineer at Wipro (Apple)',
    'RAG & Semantic Search Systems',
    'Data‑driven SRE & Analytics',
  ],
  about: [
    'I am an AI/ML Engineer focused on building LLM‑powered agents, RAG pipelines, and semantic search engines that help engineering and SRE teams move faster with more reliable insights.',
    'At Wipro, working with Apple’s ecosystem, I design agentic workflows that unify incident data, automate root‑cause analysis, and remove repetitive manual checks, turning scattered information into a single, trustworthy source of truth.',
    'Beyond production systems, I experiment with financial AI projects like FinGPT and CryptoPredictor, explore time series and LLM applications, and enjoy collaborating on ideas that blend data, automation, and real business impact.',
  ],
};

export const experience = [
  {
    id: 'wipro',
    title: 'AI/ML Engineer',
    company: 'Wipro',
    client: 'Client: Apple Inc.',
    duration: 'Mar 2025 – Present',
    location: 'Hyderabad (On-site)',
    logo: '/wipro.jpg',
    current: true,
    description: [
      'Designing agentic AI systems using large language models and Model Context Protocol (MCP) to power an enterprise bot for incident-driven semantic search across siloed Apple platforms.',
      'Building context-aware RAG pipelines and semantic retrieval flows that deliver real-time incident insights, improving response accuracy and reducing time-to-resolution for SRE teams.',
      'Automating root-cause analysis and ticket intelligence with AI-driven NLG, cutting manual SOP lookups and freeing hundreds of engineering hours annually.',
      'Unifying cross-functional incident and operations data into a single search layer, boosting data accessibility and reducing manual validation and testing effort.',
    ],
  },
  {
    id: 'psyliq',
    title: 'Intern',
    company: 'Psyliq',
    duration: 'Dec 2023 – Mar 2024',
    location: 'Remote',
    logo: '/psyliq.jpg',
    description: [
      'Contributed to projects involving Python programming and SQL, gaining hands-on experience in data handling, problem-solving, and analytics.',
      'Strengthened technical foundations by working on practical applications.',
    ],
  },
  {
    id: 'highradius-rpa',
    title: 'Internship Trainee (RPA Specialist)',
    company: 'HighRadius',
    duration: 'Jul 2022 – Nov 2022',
    location: 'Bhubaneswar (On-site)',
    logo: '/Highradius.png',
    description: [
      'Specialized in building and executing automation workflows using RPA tools.',
      'Analyzed business processes, created workflows, and improved efficiency.',
      'Gained skills in Java, JavaScript, SQL, and handling structured/unstructured data (CSV, XML, JSON).',
    ],
  },
  {
    id: 'highradius-winter',
    title: 'Winter Intern',
    company: 'HighRadius',
    duration: 'Jan 2022 – Apr 2022',
    location: 'Bhubaneswar (Remote)',
    logo: '/Highradius.png',
    description: [
      'Worked on a full-stack product development project, covering user requirements, UI/UX, backend design, and machine learning models.',
      'Gained exposure to technologies including Python, Java, MySQL, React.js, Node.js, and data modeling.',
    ],
  },
];

/* Ordered with the AI work first; `category` is derived from each project's own tags. */
export const projects = [
  {
    id: 'fingpt',
    title: 'FinGPT One',
    subtitle: 'AI-Powered Financial Assistant',
    category: 'Generative AI',
    description:
      'FinGPT One is an intelligent, real-time financial assistant powered by advanced AI. It unifies market analysis, personalized insights, and smart decision-making tools into a single platform. From tracking live stock prices and forecasting trends to interpreting financial news and planning investments, FinGPT One empowers users to make informed, data-driven financial choices with confidence.',
    image: '/FINGPT.png',
    tags: ['Streamlit', 'LangChain', 'HuggingFace', 'Finance', 'Machine Learning', 'Visualization'],
    links: [
      { type: 'Live Demo', url: 'https://fingpt-one.streamlit.app/' },
      { type: 'GitHub', url: 'https://github.com/RajuKumar077/FinGPT-One' },
    ],
  },
  {
    id: 'securepay',
    title: 'SecurePay',
    subtitle: 'Real-Time Credit Card Fraud Detection',
    category: 'Machine Learning',
    description:
      'An advanced machine learning project designed to detect fraudulent credit card transactions in real-time. Built with imbalanced dataset handling, feature engineering, and state-of-the-art classification models to safeguard customers and financial institutions from unauthorized transactions.',
    notes:
      'The project applies advanced ML techniques such as Logistic Regression, Random Forest, Gradient Boosting, and LightGBM with hyperparameter tuning. Evaluation emphasizes Recall, Precision, F1-Score, and AUC to ensure accurate fraud detection on a highly imbalanced dataset.',
    image: 'https://colab.research.google.com/img/colab_favicon_256px.png',
    imageFit: 'contain',
    tags: ['Python', 'Machine Learning', 'Imbalanced Data', 'Fraud Detection', 'LightGBM'],
    links: [
      { type: 'Colab Notebook', url: 'https://colab.research.google.com/drive/1D_Y43yJOFKaNsvGXs1KA5BLAspxbpKWX?usp=sharing' },
      { type: 'Dataset', url: 'https://drive.google.com/file/d/14QQsG3Z96dXMxg3bl0SdgF9_Bs6gBXrk/view?usp=sharing' },
      { type: 'Google Drive', url: 'https://drive.google.com/drive/folders/1fkipZr5DINvCx3uOkmDJ4j01V0FbSscT' },
    ],
  },
  {
    id: 'northwind',
    title: 'Northwind Insights',
    subtitle: 'Business Intelligence with SQL',
    category: 'Business Intelligence',
    description:
      'A comprehensive business intelligence project using the classic Northwind database. Analyzes sales trends, customer behavior, and inventory patterns through advanced SQL queries and optimized data insights.',
    image: '/DBsql.png',
    tags: ['SQL', 'DBeaver', 'Business Intelligence', 'Data Analysis'],
    links: [
      { type: 'GitHub', url: 'https://github.com/RajuKumar077/Northwind-Insights-Unlocking-Business-Intelligence-with-SQL' },
      { type: 'Presentation', url: '/SQL.pdf' },
    ],
  },
  {
    id: 'workforce',
    title: 'Employee Performance & Workforce Trends',
    subtitle: 'Interactive Tableau Dashboard',
    category: 'Data Visualization',
    description:
      'Developed an interactive Tableau dashboard to analyze workforce metrics, including total performance scores, employee count, average sick days, and overtime trends. The dashboard provides insights into performance over time, gender distribution, job title breakdown, salary comparisons by education level, department-wise performance, and overtime patterns, helping organizations make informed HR and operational decisions.',
    image:
      'https://public.tableau.com/static/images/Em/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1/1_rss.png',
    tags: ['Tableau', 'Data Visualization', 'Workforce Analytics', 'Interactive Dashboard'],
    links: [
      {
        type: 'Live Demo',
        url: 'https://public.tableau.com/views/EmployeePerformanceAndWorkforceTrends/EmployeePerformanceDashboard1?:language=en-US&:display_count=n&:origin=viz_share_link',
      },
    ],
  },
];

export const education = [
  {
    id: 'upgrad',
    degree: 'Data Science & Machine Learning Bootcamp',
    institution: 'UpGrad',
    duration: '6 Months',
    description:
      'Completed the Data Scientist Bootcamp with upGrad, gaining expertise in Python, SQL, Data Analytics, and Machine Learning. Acquired practical exposure to AI, Deep Learning, and Data Visualization tools for solving real-world business problems.',
    image: '/upgrad.jpg',
    link: 'https://upgrad.com',
  },
  {
    id: 'kiit',
    degree: 'Bachelor of Technology (B.Tech)',
    institution: 'KIIT University Bhubaneswar',
    duration: '2019 - 2023',
    description:
      'Gained foundational knowledge and skills in Information Technology, with additional exposure to Data Analytics and Artificial Intelligence.',
    image: '/kiit.jpg',
    link: 'https://kiit.ac.in/',
  },
  {
    id: 'dalimss',
    degree: 'High School',
    institution: 'DALIMSS Sunbeam School Rohania',
    duration: '2017 - 2019',
    description: 'Completed my senior secondary education with a focus on Mathematics and Science.',
    image: '/Dalimss.jpg',
    link: 'https://dalimss.com/',
  },
];

/* Topic categories are derived from each certificate's title. */
export const CERT_CATEGORIES = ['AI & ML', 'Cloud', 'Data & Programming', 'Automation', 'Professional'];

const C = '/certificates/';
export const certificates = [
  { id: 1, title: 'Google Cloud Certified - Cloud Digital Leader', category: 'Cloud', pdf: `${C}CloudDigitalLeader20250717-26-2kh72s.pdf` },
  { id: 2, title: 'Machine Learning Essentials for Business and Technical Decision Makers', category: 'AI & ML', pdf: `${C}Machine Learning Essentials for Business and Technical Decision Makers.pdf` },
  { id: 3, title: 'Oracle Cloud Infrastructure 2025 Certified – Generative AI Professional', category: 'AI & ML', pdf: `${C}Oracle Cloud Infrastructure 2025 Certified Generative AI Professional.pdf` },
  { id: 4, title: 'UiPath – Explore Automation Development', category: 'Automation', pdf: `${C}UiPath.pdf` },
  { id: 5, title: 'Oracle Cloud Infrastructure 2025 Certified – AI Foundations Associate', category: 'AI & ML', pdf: `${C}eCertificate.pdf` },
  { id: 6, title: 'UpGrad Data Science Bootcamp', category: 'Data & Programming', pdf: `${C}UpGrad.pdf` },
  { id: 7, title: 'Google Cloud – Vertex AI Fundamentals', category: 'Cloud', image: `${C}Vertex AI.jpg` },
  { id: 8, title: 'ChatGPT & Prompt Engineering Masterclass', category: 'AI & ML', pdf: `${C}ChatGPT & Prompt Engineering Masterclass.pdf` },
  { id: 9, title: 'Python Essentials 1', category: 'Data & Programming', image: `${C}python-essentials-1.1.png` },
  { id: 10, title: 'Worksoft Certify for Modern Web Applications', category: 'Automation', pdf: `${C}Worksoft Certify for Modern Web Applications.pdf` },
  { id: 11, title: 'SQL Intermediate Certificate', category: 'Data & Programming', pdf: `${C}sql_intermediate certificate.pdf` },
  { id: 12, title: 'Python for Data Science with Real Exercises', category: 'Data & Programming', pdf: `${C}Python For Data Science With Real Exercises.pdf` },
  { id: 13, title: 'BCG Strategy Consulting', category: 'Professional', pdf: `${C}_BCG_completion_certificate.pdf` },
  { id: 14, title: 'Cognizant Agile Methodology', category: 'Professional', pdf: `${C}Cognizant_certificate.pdf` },
  { id: 15, title: 'Wells Fargo Software Engineering', category: 'Professional', pdf: `${C}Wells Fargo_completion_certificate.pdf` },
];

/* Technology ecosystem — every item is mentioned somewhere in the content above.
   `refs` point at that evidence: experience / project / education / certificate ids. */
export const ecosystem = [
  {
    id: 'ai',
    name: 'AI & LLM Systems',
    summary: 'Agents, retrieval and language generation.',
    items: [
      { name: 'Large Language Models', refs: ['exp:wipro', 'cert:3', 'cert:5'] },
      { name: 'Agentic AI', refs: ['exp:wipro'] },
      { name: 'Model Context Protocol', refs: ['exp:wipro'] },
      { name: 'RAG Pipelines', refs: ['exp:wipro'] },
      { name: 'Semantic Search', refs: ['exp:wipro'] },
      { name: 'NLG', refs: ['exp:wipro'] },
      { name: 'LangChain', refs: ['proj:fingpt'] },
      { name: 'Hugging Face', refs: ['proj:fingpt'] },
      { name: 'Prompt Engineering', refs: ['cert:8'] },
    ],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    summary: 'Classical models, evaluation and imbalanced data.',
    items: [
      { name: 'LightGBM', refs: ['proj:securepay'] },
      { name: 'Gradient Boosting', refs: ['proj:securepay'] },
      { name: 'Random Forest', refs: ['proj:securepay'] },
      { name: 'Logistic Regression', refs: ['proj:securepay'] },
      { name: 'Imbalanced Data', refs: ['proj:securepay'] },
      { name: 'Deep Learning', refs: ['edu:upgrad'] },
      { name: 'Time Series', refs: ['about'] },
    ],
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    summary: 'Querying, modelling and visual storytelling.',
    items: [
      { name: 'Python', refs: ['exp:psyliq', 'exp:highradius-winter', 'proj:securepay', 'cert:9', 'cert:12'] },
      { name: 'SQL', refs: ['exp:psyliq', 'exp:highradius-rpa', 'proj:northwind', 'cert:11'] },
      { name: 'MySQL', refs: ['exp:highradius-winter'] },
      { name: 'DBeaver', refs: ['proj:northwind'] },
      { name: 'Tableau', refs: ['proj:workforce'] },
      { name: 'Data Visualization', refs: ['proj:workforce', 'proj:fingpt', 'edu:upgrad'] },
      { name: 'Data Modeling', refs: ['exp:highradius-winter'] },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Platforms',
    summary: 'Managed AI and cloud foundations.',
    items: [
      { name: 'Google Cloud', refs: ['cert:1', 'cert:7'] },
      { name: 'Vertex AI', refs: ['cert:7'] },
      { name: 'Oracle Cloud Infrastructure', refs: ['cert:3', 'cert:5'] },
      { name: 'Streamlit', refs: ['proj:fingpt'] },
    ],
  },
  {
    id: 'eng',
    name: 'Engineering & Automation',
    summary: 'Full-stack building blocks and process automation.',
    items: [
      { name: 'Java', refs: ['exp:highradius-rpa', 'exp:highradius-winter'] },
      { name: 'JavaScript', refs: ['exp:highradius-rpa'] },
      { name: 'React.js', refs: ['exp:highradius-winter'] },
      { name: 'Node.js', refs: ['exp:highradius-winter'] },
      { name: 'RPA', refs: ['exp:highradius-rpa', 'cert:4'] },
      { name: 'UiPath', refs: ['cert:4'] },
      { name: 'Worksoft Certify', refs: ['cert:10'] },
      { name: 'CSV · XML · JSON', refs: ['exp:highradius-rpa'] },
    ],
  },
];

export const contact = {
  intro:
    'I’m always open to new opportunities, collaborations, and interesting discussions. Feel free to reach out through any of the channels below!',
  email: 'rajukumardalimss@gmail.com',
  links: [
    { id: 'github', label: 'GitHub', handle: 'RajuKumar077', url: 'https://github.com/RajuKumar077' },
    { id: 'linkedin', label: 'LinkedIn', handle: 'raju-kumar7388', url: 'https://www.linkedin.com/in/raju-kumar7388/' },
    { id: 'twitter', label: 'X / Twitter', handle: '@Rajukumar2580', url: 'https://x.com/Rajukumar2580' },
    { id: 'medium', label: 'Medium', handle: '@rajukumardalimss', url: 'https://medium.com/@rajukumardalimss' },
  ],
};

/* Navigation + section numbering (keep ids stable — they are public anchors). */
export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Stack' },
  { id: 'education', label: 'Education' },
  { id: 'playground', label: 'Lab' },
  { id: 'contact', label: 'Contact' },
];

export const sectionIndex = (id) => String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0');

/* Resolve an ecosystem ref ("proj:fingpt") to a display label + anchor. */
export function resolveRef(ref) {
  const [kind, key] = ref.split(':');
  if (kind === 'exp') {
    const e = experience.find((x) => x.id === key);
    return { kind: 'Experience', label: `${e.company} — ${e.title}`, href: '#experience' };
  }
  if (kind === 'proj') {
    const p = projects.find((x) => x.id === key);
    return { kind: 'Project', label: p.title, href: '#projects' };
  }
  if (kind === 'edu') {
    const e = education.find((x) => x.id === key);
    return { kind: 'Education', label: e.degree, href: '#education' };
  }
  if (kind === 'cert') {
    const c = certificates.find((x) => String(x.id) === key);
    return { kind: 'Certificate', label: c.title, href: '#certifications' };
  }
  return { kind: 'About', label: 'Exploring time series & LLM applications', href: '#about' };
}
