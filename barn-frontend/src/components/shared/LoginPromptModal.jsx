import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { Fish, Starfish, Crab, Seaweed, Anchor } from './MarineElement';

const LoginPromptModal = ({ 
  isOpen = false, 
  onClose = null, 
  title = "Login Required", 
  message = "You need to log in to access this feature. Would you like to continue to the login page?",
  featureName = "this feature"
}) => {
  const navigate = useNavigate();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleCancel}
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
          aria-labelledby="login-prompt-title"
          aria-describedby="login-prompt-message"
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
          <button
            onClick={handleCancel}
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

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Lock Icon */}
            <div className="mb-6">
              <div className={`
                inline-flex items-center justify-center w-20 h-20 mx-auto
                bg-gradient-to-br ${DESIGN_TOKENS.colors.gradients.primary}
                ${DESIGN_TOKENS.borders.radius.full} ${DESIGN_TOKENS.shadows.lg}
                animate-pulse
              `}>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 
              id="login-prompt-title"
              className={`
                ${DESIGN_TOKENS.typography.fontSize['2xl']} ${DESIGN_TOKENS.typography.fontWeight.bold}
                text-white mb-4 leading-tight
              `}
            >
              🔐 {title}
            </h2>

            {/* Message */}
            <p 
              id="login-prompt-message"
              className="text-gray-300 mb-8 leading-relaxed"
            >
              {message}
            </p>

            {/* Feature Info */}
            <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-cyan-300 text-sm font-medium mb-2">
                📊 Feature Access
              </p>
              <p className="text-gray-400 text-xs">
                {featureName} requires authentication to access maritime analytics and vessel data.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleLogin}
                className={`
                  px-6 py-3 bg-gradient-to-r ${DESIGN_TOKENS.colors.gradients.primary}
                  text-white font-medium ${DESIGN_TOKENS.borders.radius.md}
                  ${DESIGN_TOKENS.animations.transition.fast}
                  ${DESIGN_TOKENS.animations.hover.scale} hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
                  transform-gpu
                `}
              >
                🚀 Go to Login
              </button>
              
              <button
                onClick={handleCancel}
                className={`
                  px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20
                  text-white font-medium ${DESIGN_TOKENS.borders.radius.md}
                  ${DESIGN_TOKENS.animations.transition.fast}
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
                `}
              >
                🏠 Stay Here
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                🌊 Join our maritime analytics platform for real-time insights
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

export default LoginPromptModal;