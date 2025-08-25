import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Keyboard Shortcuts Hook
 * Implements Nielsen's Heuristic 7: Flexibility and Efficiency of Use
 * Provides keyboard accelerators for power users
 */
export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const handleKeyPress = useCallback((event) => {
    // Only trigger on key combinations with Alt key to avoid conflicts
    if (!event.altKey) return;

    // Prevent default behavior for our shortcuts
    const shortcuts = {
      'h': () => navigate('/'),           // Alt+H for Home
      'a': () => navigate('/about'),      // Alt+A for About
      'm': () => navigate('/model'),      // Alt+M for Model
      's': () => navigate('/statistics'), // Alt+S for Statistics
      'l': () => navigate('/login'),      // Alt+L for Login
      'u': () => navigate('/signup'),     // Alt+U for Sign Up
    };

    const shortcut = shortcuts[event.key.toLowerCase()];
    if (shortcut) {
      event.preventDefault();
      shortcut();
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    shortcuts: [
      { key: 'Alt+H', description: 'Navigate to Home' },
      { key: 'Alt+A', description: 'Navigate to About' },
      { key: 'Alt+M', description: 'Navigate to Model' },
      { key: 'Alt+S', description: 'Navigate to Statistics' },
      { key: 'Alt+L', description: 'Navigate to Login' },
    ]
  };
};

/**
 * Skip Links Component
 * Implements accessibility skip navigation for keyboard users
 */
export const SkipLinks = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a 
        href="#main-content" 
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="fixed top-4 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Skip to navigation
      </a>
    </div>
  );
};

/**
 * Keyboard Shortcuts Help Component
 * Shows available shortcuts to users
 */
export const KeyboardShortcutsHelp = ({ isVisible, onClose }) => {
  const { shortcuts } = useKeyboardShortcuts();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close shortcuts help"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{shortcut.description}</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-300">
                {shortcut.key}
              </kbd>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-600">Show this help</span>
            <kbd className="bg-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-300">
              ?
            </kbd>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Press <kbd className="bg-gray-100 px-1 rounded text-xs">Esc</kbd> to close this dialog
        </p>
      </div>
    </div>
  );
};

export default useKeyboardShortcuts;