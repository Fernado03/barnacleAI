import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg';
import { FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import logo from '/assets/logo.png';
import { NAVIGATION_LINKS, LOGIN_BUTTON } from '../../constants/navigationConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import OptimizedImage from './OptimizedImage';
import LoginPromptModal from './LoginPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInitials, getUserDisplayName } from '../../utils/userUtils';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Authentication context
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // User display information
  const userName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);
  const userRole = user?.role || 'Demo User';

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Handle navigation with authentication check
  const handleAuthenticatedNavigation = (path) => {
    if (path === '/statistics' && !isAuthenticated) {
      // Show styled login prompt for Statistics page
      setShowLoginPrompt(true);
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }
    handleNavigation(path);
  };

  // Handle login prompt modal close
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Show all navigation links
  const getVisibleLinks = () => {
    return NAVIGATION_LINKS;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6">
      <div className={`bg-white shadow-xl px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        isMobileMenuOpen ? 'rounded-t-3xl rounded-b-none' : 'rounded-3xl'
      }`}>
        
        {/* LOGO */}
        <div className="flex items-center flex-shrink-0">
          <OptimizedImage
            src={logo}
            alt="BARNACLEAN"
            className="h-10 sm:h-12 md:h-14 object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => handleNavigation('/')}
            loading="eager"
          />
        </div>

        {/* NAV LINKS (Desktop) */}
        <div className="hidden md:flex items-center justify-end space-x-1 lg:space-x-3 xl:space-x-4 text-xs lg:text-sm xl:text-base font-medium flex-1 ml-2 lg:ml-4 xl:ml-8">
          {getVisibleLinks().map((link) => (
            <button
              key={link.id}
              onClick={() => handleAuthenticatedNavigation(link.path)}
              aria-label={`Navigate to ${link.label} page`}
              aria-current={isActivePath(link.path) ? 'page' : undefined}
              className={`relative px-1 lg:px-3 xl:px-4 py-2 rounded-lg ${DESIGN_TOKENS.animations.transition.fast} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 whitespace-nowrap ${                isActivePath(link.path)
                  ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                  : link.path === '/statistics' && !isAuthenticated
                  ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 font-medium opacity-75'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium'
              }`}
            >
              <span className="hidden xl:inline">{link.label}</span>
              <span className="xl:hidden lg:inline hidden">
                {link.label === 'AI Models' ? 'Models' : 
                 link.label === 'Live Demo' ? 'Demo' : 
                 link.label === 'Dashboard' ? 'Stats' :
                 link.label}
              </span>
              <span className="lg:hidden">
                {link.label === 'AI Models' ? 'AI' : 
                 link.label === 'Live Demo' ? 'Demo' : 
                 link.label === 'Dashboard' ? 'Stats' :
                 link.label === 'Pricing' ? 'Price' :
                 link.label === 'About' ? 'About' :
                 link.label === 'Home' ? 'Home' :
                 link.label}
              </span>
              {link.path === '/statistics' && !isAuthenticated && (
                <span className="ml-1 text-xs text-gray-400">🔒</span>
              )}
            </button>
          ))}

          {/* Authentication Section (Desktop) */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1 lg:space-x-2 ml-1 lg:ml-4 xl:ml-6">
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-label="User profile menu"
                  aria-expanded={isProfileMenuOpen}
                  className={`flex items-center space-x-1 lg:space-x-2 xl:space-x-3 p-1 lg:p-2 rounded-lg ${DESIGN_TOKENS.animations.transition.fast} focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-50`}
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-semibold shadow-md">
                    {userInitials || <FaUser className="text-xs lg:text-sm" />}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-700 leading-tight">
                      {userName}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight font-medium">
                      {userRole}
                    </span>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <CgProfile className="text-gray-500" />
                      <span>View Profile</span>
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 lg:space-x-3 ml-2 lg:ml-4 xl:ml-6">
              <button
                onClick={() => handleNavigation(LOGIN_BUTTON.path)}
                className="px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-lg whitespace-nowrap"
              >
                {LOGIN_BUTTON.label}
              </button>
              <button
                onClick={() => handleNavigation('/signup')}
                className="px-3 lg:px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm lg:text-base font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open mobile menu"
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}

        <div 
          ref={mobileMenuRef}
          className={`md:hidden absolute left-0 right-0 top-full bg-white shadow-lg pb-4 transition-transform duration-300 ease-in-out transform ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          } ${isMobileMenuOpen ? 'block' : 'hidden'} rounded-b-3xl mx-4`}
        >

        <div className="flex flex-col space-y-2 py-4 px-4">
          {getVisibleLinks().map((link) => (
            <button
              key={link.id}
              onClick={() => handleAuthenticatedNavigation(link.path)}
              aria-label={`Navigate to ${link.label} page`}
              className={`w-full text-left px-4 py-2 rounded-lg ${DESIGN_TOKENS.animations.transition.fast} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                isActivePath(link.path)
                  ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                  : link.path === '/statistics' && !isAuthenticated
                  ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 font-medium opacity-75'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.path === '/statistics' && !isAuthenticated && (
                  <span className="text-xs text-gray-400">🔒</span>
                )}
              </div>
            </button>
          ))}
          <hr className="my-2 border-gray-200" />
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                  {userInitials || <FaUser className="text-sm" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">
                    {userName}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight font-medium">
                    {userRole}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                <div className="flex items-center space-x-2">
                  <CgProfile className="text-gray-500" />
                  <span>View Profile</span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-2">
                  <FaSignOutAlt className="text-red-500" />
                  <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigation(LOGIN_BUTTON.path)}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                {LOGIN_BUTTON.label}
              </button>
              <button
                onClick={() => handleNavigation('/signup')}
                className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={handleCloseLoginPrompt}
        title="Dashboard Access Required"
        message="You need to log in to access the Dashboard with real-time maritime analytics and vessel insights."
        featureName="Dashboard"
      />
    </header>
  );
};

export default NavBar;
