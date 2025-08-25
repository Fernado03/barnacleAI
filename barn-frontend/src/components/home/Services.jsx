import React, { useEffect, useRef, useState } from 'react';
import { SERVICES_CONTENT, FEATURES_DATA } from '../../constants/servicesConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { FaArrowRight, FaLightbulb, FaCogs, FaRocket } from 'react-icons/fa';
import { Octopus, Dolphin, Turtle, Crab, Seahorse, Sailboat } from '../shared/MarineElement';

/**
 * Feature Card Component with modern design
 */
const FeatureCard = ({ title, description, index, icon }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const colors = {
    0: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', border: 'border-blue-200' },
    1: { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', border: 'border-emerald-200' },
    2: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-600', border: 'border-purple-200' }
  };

  const color = colors[index];

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                  transform transition-all duration-500 ease-out hover:-translate-y-2
                  border border-gray-100 hover:${color.border} overflow-hidden
                  ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
      style={{
        animationDelay: `${index * 0.2}s`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color.bg} text-white mb-6 shadow-lg`}>
        {icon}
      </div>
      
      {/* Step Number */}
      <div className="flex items-center mb-4">
        <span className={`text-sm font-bold ${color.text} bg-gray-50 px-3 py-1 rounded-full`}>
          Step {index + 1}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
        {description}
      </p>
    </div>
  );
};

const Services = () => {
  const icons = [<FaLightbulb className="text-2xl" />, <FaCogs className="text-2xl" />, <FaRocket className="text-2xl" />];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center items-center overflow-hidden pt-32 pb-32">
      {/* Marine Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-20 opacity-15">
          <Octopus size={140} color="#8b5cf6" waveSpeed={7} />
        </div>
        <div className="absolute top-32 left-16 opacity-20">
          <Dolphin size={160} color="#3b82f6" leapSpeed={6} />
        </div>
        <div className="absolute bottom-32 right-24 opacity-25">
          <Turtle size={120} shellColor="#059669" swimSpeed={8} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Crab size={100} color="#f97316" speed={4} />
        </div>
        <div className="absolute top-1/2 right-12 opacity-30">
          <Seahorse size={80} color="#f59e0b" swaySpeed={6} />
        </div>
        <div className="absolute top-3/4 left-1/3 opacity-15">
          <Sailboat size={140} hullColor="#6366f1" sailColor="#ffffff" />
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
            {SERVICES_CONTENT.subtitle}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            {SERVICES_CONTENT.mainHeading}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our innovative approach transforms ideas into powerful solutions through our proven methodology.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES_DATA.map((feature, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < FEATURES_DATA.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
              )}
              
              <FeatureCard
                title={feature.title}
                description={feature.description}
                index={index}
                icon={icons[index]}
              />
            </div>
          ))}
        </div>
        

      </div>
    </div>
  );
};

export default Services;