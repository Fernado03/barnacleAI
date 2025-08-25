import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { Fish, Crab, Starfish, Seaweed, Anchor } from './MarineElement';

const UnderConstruction = ({ 
  isOpen = false, 
  onClose = null, 
  title = "Under Construction", 
  message = "This feature is currently under development. We're working hard to bring it to you soon!",
  showBackButton = true,
  showCloseButton = true,
  autoCloseDelay = null 
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, handleClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible && showCloseButton) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, handleClose, showCloseButton]);



  const handleBackToHome = () => {
    handleClose();
    navigate('/');
  };

  const handleBackToPrevious = () => {
    handleClose();
    window.history.back();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={showCloseButton ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`
            relative max-w-md w-full mx-auto
            bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-900/95
            backdrop-blur-lg border border-cyan-400/20
            ${DESIGN_TOKENS.borders.radius.lg} ${DESIGN_TOKENS.shadows['2xl']}
            transform transition-all duration-500 ease-out
            animate-in slide-in-from-bottom-4 fade-in
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="under-construction-title"
          aria-describedby="under-construction-message"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Marine Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute top-4 left-4 pointer-events-none">
              <Fish size={60} opacity={0.15} animationSpeed={8} />
            </div>
            <div className="absolute top-8 right-6 pointer-events-none">
              <Starfish size={40} opacity={0.12} />
            </div>
            <div className="absolute bottom-8 left-8 pointer-events-none">
              <Crab size={50} opacity={0.1} />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <Seaweed height={80} opacity={0.08} swaySpeed={6} />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Anchor size={100} opacity={0.05} />
            </div>
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={`
                absolute top-4 right-4 z-20
                w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
                flex items-center justify-center text-white/70 hover:text-white
                ${DESIGN_TOKENS.animations.transition.fast}
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
                cursor-pointer
              `}
              aria-label="Close dialog"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Construction Icon */}
            <div className="mb-6">
              <div className={`
                inline-flex items-center justify-center w-20 h-20 mx-auto
                bg-gradient-to-br ${DESIGN_TOKENS.colors.gradients.primary}
                ${DESIGN_TOKENS.borders.radius.full} ${DESIGN_TOKENS.shadows.lg}
                animate-pulse
              `}>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 
              id="under-construction-title"
              className={`
                ${DESIGN_TOKENS.typography.fontSize['2xl']} ${DESIGN_TOKENS.typography.fontWeight.bold}
                text-white mb-4 leading-tight
              `}
            >
              🚧 {title}
            </h2>

            {/* Message */}
            <p 
              id="under-construction-message"
              className="text-gray-300 mb-8 leading-relaxed"
            >
              {message}
            </p>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-cyan-300 text-sm">
                Working on it...
              </p>
            </div>

            {/* Action Buttons */}
            {showBackButton && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleBackToHome}
                  className={`
                    px-6 py-3 bg-gradient-to-r ${DESIGN_TOKENS.colors.gradients.primary}
                    text-white font-medium ${DESIGN_TOKENS.borders.radius.md}
                    ${DESIGN_TOKENS.animations.transition.fast}
                    ${DESIGN_TOKENS.animations.hover.scale} hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
                    transform-gpu
                  `}
                >
                  🏠 Back to Home
                </button>
                
                <button
                  onClick={handleBackToPrevious}
                  className={`
                    px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20
                    text-white font-medium ${DESIGN_TOKENS.borders.radius.md}
                    ${DESIGN_TOKENS.animations.transition.fast}
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
                  `}
                >
                  ← Go Back
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Follow us on social media for updates on new features!
              </p>
            </div>
          </div>

          {/* Bottom Wave Effect */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 rounded-b-xl"></div>
        </div>
      </div>
    </>
  );
};



export default UnderConstruction;