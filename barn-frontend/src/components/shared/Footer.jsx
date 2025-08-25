import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FOOTER_CONTENT, 
  NAVIGATION_LINKS, 
  SUPPORT_LINKS, 
  COPYRIGHT 
} from '../../constants/footerConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import UnderConstruction from './UnderConstruction';

// Social Media Icons Component
const SocialIcon = ({ platform, url, ariaLabel }) => {
  const getIcon = () => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-2.498 0-4.526-2.033-4.526-4.53s2.028-4.531 4.526-4.531c2.498 0 4.531 2.033 4.531 4.531s-2.033 4.53-4.531 4.53zm3.568 0c-2.498 0-4.531-2.033-4.531-4.53s2.033-4.531 4.531-4.531 4.531 2.033 4.531 4.531-2.033 4.53-4.531 4.53z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`
        w-10 h-10 rounded-full bg-gradient-to-br ${DESIGN_TOKENS.colors.gradients.primary}
        flex items-center justify-center text-white
        ${DESIGN_TOKENS.animations.transition.fast}
        ${DESIGN_TOKENS.animations.hover.scale} hover:shadow-lg
        transform-gpu
      `}
    >
      {getIcon()}
    </a>
  );
};

// Footer Link Component
const FooterLink = ({ link, className = '', onUnderConstruction }) => {
  // List of existing/implemented routes
  const implementedRoutes = ['/', '/about', '/login', '/signup', '/statistics', '/model', '/demo', '/pricing', '/profile'];
  
  const baseClasses = `
    text-gray-300 hover:text-white transition-colors duration-300
    hover:translate-x-1 transform ${DESIGN_TOKENS.animations.transition.fast}
    cursor-pointer
    ${className}
  `;

  const handleClick = (e) => {
    // Check if this is an unimplemented route
    if (!implementedRoutes.includes(link.url)) {
      e.preventDefault();
      onUnderConstruction(link.name);
    }
  };

  if (link.internal) {
    return (
      <Link 
        to={link.url} 
        className={baseClasses}
        onClick={handleClick}
      >
        <span className="flex items-center">
          <span className="w-2 h-0.5 bg-cyan-400 mr-2 opacity-70"></span>
          {link.name}
        </span>
      </Link>
    );
  }

  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={baseClasses}
    >
      <span className="flex items-center">
        <span className="w-2 h-0.5 bg-cyan-400 mr-2 opacity-70"></span>
        {link.name}
      </span>
    </a>
  );
};

// Footer Section Component
const FooterSection = ({ title, links, className = '', onUnderConstruction }) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-6 relative">
      {title}
      <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
    </h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <FooterLink link={link} onUnderConstruction={onUnderConstruction} />
        </li>
      ))}
    </ul>
  </div>
);

// Main Footer Component
const Footer = () => {
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  const handleUnderConstruction = (featureName) => {
    setSelectedFeature(featureName);
    setShowUnderConstruction(true);
  };

  const handleCloseUnderConstruction = () => {
    setShowUnderConstruction(false);
    setSelectedFeature('');
  };
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Simplified Marine Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Main Footer Content */}
      <div className={`
        relative z-10 ${DESIGN_TOKENS.spacing.container.maxWidth} 
        ${DESIGN_TOKENS.spacing.container.centerX} 
        ${DESIGN_TOKENS.spacing.section.paddingX}
        py-12
      `}>
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                {FOOTER_CONTENT.brandName}
              </h2>
              <p className="text-cyan-300 text-sm font-medium tracking-wide uppercase">
                {FOOTER_CONTENT.tagline}
              </p>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {FOOTER_CONTENT.description}
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="text-gray-300 text-sm">
                Phone: <a href={`tel:${FOOTER_CONTENT.contact.phone}`} className="text-cyan-300 hover:text-white transition-colors">
                  {FOOTER_CONTENT.contact.phone}
                </a>
              </div>
              <div className="text-gray-300 text-sm">
                Team: <span className="text-cyan-300">{FOOTER_CONTENT.contact.team}</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 pt-2">
              {FOOTER_CONTENT.socialMedia.map((social, index) => (
                <SocialIcon
                  key={index}
                  platform={social.icon}
                  url={social.url}
                  ariaLabel={social.ariaLabel}
                />
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <FooterSection 
            title={NAVIGATION_LINKS.title}
            links={NAVIGATION_LINKS.links}
            onUnderConstruction={handleUnderConstruction}
          />

          {/* Support Links */}
          <FooterSection 
            title={SUPPORT_LINKS.title}
            links={SUPPORT_LINKS.links}
            onUnderConstruction={handleUnderConstruction}
          />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {COPYRIGHT.text}
            </p>
          </div>
        </div>
      </div>
      
      {/* Under Construction Popup */}
      <UnderConstruction
        isOpen={showUnderConstruction}
        onClose={handleCloseUnderConstruction}
        title={`${selectedFeature} - Under Construction`}
        message={`The "${selectedFeature}" feature is currently under development. We're working hard to bring you the best marine analytics experience!`}
        showBackButton={false}
      />
    </footer>
  );
};

export default Footer;