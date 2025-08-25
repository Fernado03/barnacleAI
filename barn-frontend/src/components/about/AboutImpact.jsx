import React, { useEffect, useRef, useState } from 'react';
import { IMPACT_STATS } from '../../constants/aboutConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { Turtle, Whale, Anchor, Starfish } from '../shared/MarineElement';

const ImpactCard = ({ value, label, description, index }) => {
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
    0: { gradient: 'from-cyan-400 to-blue-600', border: 'border-cyan-200' },
    1: { gradient: 'from-emerald-400 to-green-600', border: 'border-emerald-200' },
    2: { gradient: 'from-purple-400 to-pink-600', border: 'border-purple-200' },
    3: { gradient: 'from-orange-400 to-red-600', border: 'border-orange-200' }
  };

  const color = colors[index % 4];

  return (
    <div 
      ref={cardRef}
      className={`group relative text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                  transition-all duration-500 ease-out transform hover:-translate-y-2
                  border border-gray-100 hover:${color.border} overflow-hidden
                  ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
      style={{
        animationDelay: `${index * 0.15}s`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Value */}
      <div className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${color.gradient} mb-4 group-hover:scale-105 transition-transform duration-300`}>
        {value}
      </div>
      
      {/* Label */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
        {label}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
        {description}
      </p>
    </div>
  );
};

const ImpactSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-center items-center pt-32 pb-32">
      {/* Background Decorations with Marine Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute bottom-32 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Marine elements */}
        <div className="absolute top-16 left-16">
          <Turtle size={120} opacity={0.12} animationSpeed={8} />
        </div>
        <div className="absolute bottom-24 right-20">
          <Whale size={160} opacity={0.10} animationSpeed={9} />
        </div>
        <div className="absolute top-1/3 right-12">
          <Anchor size={80} opacity={0.18} />
        </div>
        <div className="absolute bottom-1/3 left-20">
          <Starfish size={70} opacity={0.16} animationSpeed={6} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-teal-600 rounded-full mr-2 animate-pulse" />
            OUR IMPACT
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Making a Difference
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our solutions don't just save money—they create real environmental and operational impact that matters.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {IMPACT_STATS.map((stat, index) => (
            <ImpactCard
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;