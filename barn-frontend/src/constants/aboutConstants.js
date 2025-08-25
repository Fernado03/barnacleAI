import aishah from '/assets/aishah.png';
import asyiqin from '/assets/asyiqin.png';
import beldron from '/assets/beldron.png';
import iyzman from '/assets/iyzman.png';
import fernado from '/assets/fernado.png';

// About constants for the application
export const ABOUT_CONTENT = {
  title: 'About SeaWise',
  mission: 'To provide cutting-edge marine technology solutions that leverage AI and big data to combat biofouling, reduce fuel consumption, and promote sustainable maritime operations.',
  vision: 'To be the global leader in AI-driven marine technology, revolutionizing ship efficiency and environmental stewardship.',
  description: 'SeaWise is an innovative technology company dedicated to developing advanced marine solutions. Our flagship product, BarnaClean, empowers shipping companies with predictive analytics and actionable insights to manage and mitigate biofouling through AI/ML algorithms and real-time marine data.',
  focus: 'SeaWise develops BarnaClean, an AI-powered platform that analyzes marine data to forecast biofouling risk on ship hulls. This enables proactive maintenance scheduling, minimizing drag, and significantly reducing fuel consumption and CO₂ emissions. Our technology promotes sustainable, cost-effective shipping by transforming raw data into actionable insights.',
  subtitle: 'ABOUT SEAWISE COMPANY',
  mainHeading: 'Innovating Marine Technology for Sustainable Shipping'
};

// Service Information section - Updated with BarnaClean process
export const SERVICE_INFO = {
  subtitle: 'ABOUT BARNACLEAN TECHNOLOGY',
  title: 'Our AI-Powered Marine Solution Process',
  description: 'BarnaClean specializes in AI-driven biofouling prediction and route optimization, helping maritime operations achieve up to 30% fuel savings while protecting ocean ecosystems through advanced machine learning and real-time environmental analysis.',
  processSteps: [
    {
      number: '01.',
      title: 'Predict Biofouling Growth',
      description: "AI model forecasts barnacle buildup in real-time using sea temperature, salinity, vessel speed, and idle time data."
    },
    {
      number: '02.',
      title: 'Optimize Route Planning',
      description: 'A* algorithm calculates fuel-efficient paths considering weather, currents, and predicted hull drag from biofouling.'
    },
    {
      number: '03.',
      title: 'Deliver Fuel Savings',
      description: 'Integrated system reduces fuel consumption by up to 30% while minimizing environmental impact and operational costs.'
    }
  ]
};

export const COMPANY_INFO = {
  name: 'SeaWise',
  tagline: 'Navigating Smarter, Sailing Greener.',
  contact: {
    email: 'contact@seawise.com',
    phone: '+60 12-345 6789',
    address: 'Universiti Malaysia Sabah, Kota Kinabalu'
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/seawise',
    twitter: 'https://twitter.com/seawise'
  }
};

// Team members data
export const TEAM_MEMBERS = [
  {
    name: 'Nor Asyiqin Nazirah Binti Rapandi',
    role: 'Team Leader & Frontend Developer',
    bio: 'Technical team leader with expertise in frontend development and project coordination for marine technology solutions.',
    image: asyiqin
  },
  {
    name: 'Beldron Feadrek',
    role: 'Pitcher & Product Presenter',
    bio: 'Leads product presentation and business development initiatives for BarnaClean marine solutions.',
    image: beldron
  },
  {
    name: 'Fernado George Anak Mani',
    role: 'AI/ML Engineer',
    bio: 'Specialist in artificial intelligence and machine learning, developing innovative biofouling prediction algorithms and route optimization systems.',
    image: fernado
  },
  {
    name: 'Iyzman Daniel Bin Mijirun',
    role: 'Backend Developer / Full Stack Engineer',
    bio: 'Full-stack engineer focusing on robust Python (FastAPI) server development and AI engine integration for marine analytics.',
    image: iyzman
  },
  {
    name: 'Siti Nur Aishah Binti Juan',
    role: 'Big Data Analyst / Data Engineer',
    bio: 'Data engineering specialist managing AIS data, marine weather patterns, and oceanographic datasets for predictive analytics.',
    image: aishah
  }
];

// Impact statistics - Updated with BarnaClean metrics
export const IMPACT_STATS = [
  {
    value: '30%',
    label: 'Fuel Savings Achieved',
    description: 'Average fuel consumption reduction through AI-optimized routing and biofouling prevention'
  },
  {
    value: '94.7%',
    label: 'AI Model Accuracy',
    description: 'Biofouling prediction model accuracy with real-time environmental data processing'
  },
  {
    value: '18.5%',
    label: 'Route Efficiency Gain',
    description: 'Improved fuel efficiency through A* algorithm optimization considering weather and currents'
  },
  {
    value: '500K+',
    label: 'Tons CO₂ Prevented',
    description: 'Environmental impact reduction through optimized maritime operations and reduced emissions'
  }
];