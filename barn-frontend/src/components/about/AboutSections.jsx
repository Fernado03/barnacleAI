import React from 'react';
import AboutHero from './AboutHero';
import AboutServices from './AboutServices';
import AboutTeam from './AboutTeam';
import AboutImpact from './AboutImpact';

/**
 * Main AboutSections Component
 */
const AboutSections = () => {
  return (
    <div className="w-full">
      <AboutHero />
      <AboutServices />
      <AboutTeam />
      <AboutImpact />
    </div>
  );
};

export default AboutSections;