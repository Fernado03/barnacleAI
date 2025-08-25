import React, { useState } from 'react';
import { FaQuestion, FaKeyboard, FaTimes } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { KeyboardShortcutsHelp } from '../../hooks/useKeyboardShortcuts.jsx';
import Button from './Button';

/**
 * Help System Component
 * Implements Nielsen's Heuristic 10: Help and Documentation
 * Provides accessible help and documentation without being obtrusive
 */
const Help = () => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isShortcutsVisible, setIsShortcutsVisible] = useState(false);

  const helpSections = [
    {
      title: 'Navigation',
      content: [
        'Use the navigation bar at the top to move between pages',
        'Click the logo to return to the home page',
        'Use keyboard shortcuts (Alt+Key) for quick navigation',
        'Breadcrumbs show your current location on non-home pages'
      ]
    },
    {
      title: 'Accessibility Features',
      content: [
        'All interactive elements support keyboard navigation',
        'Screen reader compatible with proper ARIA labels',
        'High contrast mode support for better visibility',
        'Skip links available for keyboard-only users'
      ]
    },
    {
      title: 'Getting Started',
      content: [
        'Start at the Home page to learn about BarnaClean',
        'Visit the About page to learn more about our company',
        'Check the Model page for AI prediction tools',
        'View Statistics for data insights and analytics'
      ]
    }
  ];

  const toggleHelp = () => {
    setIsHelpVisible(!isHelpVisible);
    setIsShortcutsVisible(false);
  };

  const showShortcuts = () => {
    setIsShortcutsVisible(true);
    setIsHelpVisible(false);
  };

  // Listen for ? key to show help
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '?' && !isHelpVisible && !isShortcutsVisible) {
        event.preventDefault();
        setIsShortcutsVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isHelpVisible, isShortcutsVisible]);

  return (
    <>
      {/* Help Button - Fixed position */}
      <button
        onClick={toggleHelp}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl ${DESIGN_TOKENS.animations.transition.fast} focus:outline-none focus:ring-4 focus:ring-blue-300 group`}
        aria-label="Open help and documentation"
        title="Help & Documentation (Press ? for shortcuts)"
      >
        <FaQuestion className="text-xl mx-auto group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Help Panel */}
      {isHelpVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={toggleHelp}>
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Help & Documentation</h2>
              <button
                onClick={toggleHelp}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close help panel"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {helpSections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="small"
                    icon={<FaKeyboard />}
                    onClick={showShortcuts}
                  >
                    View Keyboard Shortcuts
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => window.open('mailto:support@barnaclean.com')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Need more help? Press <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">?</kbd> for keyboard shortcuts or contact our support team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp 
        isVisible={isShortcutsVisible} 
        onClose={() => setIsShortcutsVisible(false)} 
      />
    </>
  );
};

export default Help;