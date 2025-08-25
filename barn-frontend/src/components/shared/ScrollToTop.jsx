import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when navigation occurs.
 * 
 * Implements user preference for UI scroll behavior:
 * - Statistics, Model, and About pages reset to top
 * - Ensures consistent user experience
 * - Follows usability principles for predictable navigation
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Immediate scroll without animation for faster UX
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;