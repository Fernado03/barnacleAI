// Footer constants for the BarnaClean application - Simplified
export const FOOTER_CONTENT = {
  // Company branding
  brandName: 'BarnaClean',
  tagline: 'AI-Driven Marine Analytics',
  description: 'Revolutionary biofouling prevention system for 30% fuel savings and sustainable shipping operations.',
  
  // Essential contact information
  contact: {
    phone: '0128699358',
    email: 'seawise@marinehack2025.com',
    team: 'SeaWise Team'
  },
  
  // Essential social media only
  socialMedia: [
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://linkedin.com/company/barnaclean',
      ariaLabel: 'Connect with us on LinkedIn'
    },
    {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/barnaclean',
      ariaLabel: 'View our GitHub repository'
    }
  ]
};

// Essential navigation links
export const NAVIGATION_LINKS = {
  title: 'Quick Navigation',
  links: [
    {
      name: 'Dashboard',
      url: '/statistics',
      internal: true
    },
    {
      name: 'AI Models',
      url: '/model',
      internal: true
    },
    {
      name: 'Live Demo',
      url: '/demo',
      internal: true
    },
    {
      name: 'Pricing Plans',
      url: '/pricing',
      internal: true
    },
    {
      name: 'About',
      url: '/about',
      internal: true
    }
  ]
};

// Contact and support
export const SUPPORT_LINKS = {
  title: 'Support',
  links: [
    {
      name: 'Contact Team',
      url: 'tel:0128699358',
      internal: false
    },
    {
      name: 'Documentation',
      url: '/about',
      internal: true
    }
  ]
};

// Copyright information - Simplified
export const COPYRIGHT = {
  text: `© ${new Date().getFullYear()} BarnaClean by SeaWise. All rights reserved.`
};