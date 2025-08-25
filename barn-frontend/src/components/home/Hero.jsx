import React, { useEffect, useRef, useState } from 'react';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import backgroundImage from '../../assets/background.jpg';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Set visible immediately and use intersection observer for animations
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#1e40af' // Fallback color if image fails to load
      }}
    >
      {/* Gradient Overlay for better content readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-blue-900/40" />
      
      {/* Additional overlay for content areas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/20 rounded-full opacity-60 animate-float" />
        <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-teal-300/30 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-blue-300/30 rounded-full opacity-35 animate-float" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div 
          ref={heroRef}
          className={`max-w-4xl mx-auto text-center space-y-8 transform transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-4'
          }`}
          style={{ minHeight: '400px' }} // Ensure content area has minimum height
        >
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-sm font-semibold border border-white/30 shadow-lg">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
            Marine Innovation
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight">
            <span className="block text-white drop-shadow-2xl">
              Barnaclean
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-relaxed text-white/95 drop-shadow-lg">
            <span className="text-teal-300">Reduce Costs</span>,{' '}
            <span className="text-blue-300">Save Fuel</span>,{' '}
            <span className="text-white">Protect Our Oceans</span>
          </p>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            Revolutionary AI-powered solutions for marine operations. Optimize your vessel's performance while contributing to ocean conservation through intelligent barnacle management.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center">
            <Link 
              to="/demo"
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm group text-lg inline-flex items-center justify-center"
            >
              <span className="mr-2">Get Started</span>
              <FaRocket className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              to="/about"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 group text-lg inline-flex items-center justify-center"
            >
              Learn More
              <FaArrowRight className="ml-2 text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default Hero;