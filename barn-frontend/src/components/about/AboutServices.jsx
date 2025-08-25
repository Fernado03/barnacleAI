import React, { useEffect, useRef, useState } from 'react';
import { SERVICE_INFO } from '../../constants/aboutConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { FaLightbulb, FaCogs, FaRocket } from 'react-icons/fa';
import { Jellyfish, Crab, Seaweed, Fish } from '../shared/MarineElement';

/**
 * Modern Process Step Card Component
 */
const ProcessStepCard = ({ step, index, icon }) => {
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

  const color = colors[index % 3];

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                  transform transition-all duration-500 ease-out hover:-translate-y-2
                  border border-gray-100 hover:${color.border} overflow-hidden
                  h-full flex flex-col
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
          {step.number}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
        {step.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors flex-grow">
        {step.description}
      </p>
    </div>
  );
};

const ServiceInfoSection = () => {
  const icons = [<FaLightbulb className="text-2xl" />, <FaCogs className="text-2xl" />, <FaRocket className="text-2xl" />];

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center items-center pt-32 pb-32">
      {/* Background Decorations with Marine Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Marine elements */}
        <div className="absolute top-24 right-24">
          <Jellyfish size={120} opacity={0.12} animationSpeed={7} />
        </div>
        <div className="absolute bottom-32 left-24">
          <Crab size={90} opacity={0.15} animationSpeed={5} />
        </div>
        <div className="absolute top-1/2 left-12">
          <Seaweed height={100} opacity={0.14} animationSpeed={4} />
        </div>
        <div className="absolute bottom-1/4 right-1/3">
          <Fish size={80} opacity={0.16} animationSpeed={6} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
            {SERVICE_INFO.subtitle}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            {SERVICE_INFO.title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our innovative process that transforms challenges into powerful solutions through proven methodologies.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SERVICE_INFO.processSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < SERVICE_INFO.processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
              )}
              
              <ProcessStepCard
                step={step}
                index={index}
                icon={icons[index % icons.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceInfoSection;