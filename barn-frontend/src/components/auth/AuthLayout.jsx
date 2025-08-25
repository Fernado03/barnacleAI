import React from 'react';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { Fish, Jellyfish, Seaweed } from '../shared/MarineElement';
import logo from '../../assets/barnacle-logo.svg';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  showAnimatedElements = true 
}) => {
  return (
    <div className={`relative w-full min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center overflow-hidden ${DESIGN_TOKENS.spacing.navbar.padding}`}>
      {/* Background Marine Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.1)_0%,transparent_50%)]" />
        
        {/* Floating Marine Elements */}
        {showAnimatedElements && (
          <>
            <div className="absolute top-20 left-20 opacity-20 pointer-events-none">
              <Fish size={60} color="#ffffff" speed={6} />
            </div>
            <div className="absolute bottom-1/4 right-1/4 opacity-15 pointer-events-none">
              <Jellyfish size={80} bellColor="#ffffff" driftSpeed={8} />
            </div>
            <div className="absolute top-1/2 left-1/4 opacity-12 pointer-events-none">
              <Seaweed height={90} color="#ffffff" swaySpeed={5} />
            </div>
          </>
        )}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden min-h-[80vh] max-h-[90vh]">
          
          {/* Left Side - Marine Themed Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-cyan-600 relative overflow-hidden">
            {/* Geometric Background Elements */}
            <div className="absolute inset-0">
              {/* Simplified geometric shapes */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-2xl rotate-12" />
              <div className="absolute top-12 right-12 w-12 h-12 bg-cyan-300/20 rounded-full" />
              <div className="absolute bottom-12 left-12 w-20 h-20 bg-white/8 rounded-full" />
              <div className="absolute bottom-8 right-16 w-14 h-14 bg-cyan-400/15 rounded-xl -rotate-12" />
              
              {/* Marine dotted patterns */}
              <div className="absolute top-16 left-16">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
                  ))}
                </div>
              </div>
              
              {/* Logo area */}
              <div className="absolute top-8 left-12 w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center p-3">
                <img src={logo} alt="BarnaClean Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 py-8">
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
                BarnaClean
                <br />
                <span className="text-cyan-200">Marine Solutions</span>
              </h1>
              <p className="text-lg text-white/90 leading-relaxed max-w-sm">
                Advanced marine technology for vessel optimization and ocean protection
              </p>
            </div>
          </div>
          
          {/* Right Side - Compact Form Container */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-8 overflow-y-auto min-h-[80vh]">
            <div className="w-full max-w-sm">
              {/* Logo/Brand for mobile */}
              <div className="lg:hidden text-center mb-4">
                <img src={logo} alt="BarnaClean Logo" className="w-16 h-16 mx-auto mb-2 object-contain" />
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              </div>
              
              {/* Header */}
              <div className="text-center mb-4">
                <img src={logo} alt="BarnaClean Logo" className="hidden lg:block w-16 h-16 mx-auto mb-3 object-contain" />
                
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {title}
                </h2>
                
                {subtitle && (
                  <p className="text-gray-600 text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {/* Form Content */}
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile decorative elements */}
      <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-16 h-16 bg-cyan-500/10 rounded-full" />
        <div className="absolute bottom-32 left-10 w-12 h-12 bg-blue-500/10 rounded-xl rotate-12" />
      </div>
    </div>
  );
};

export default AuthLayout;