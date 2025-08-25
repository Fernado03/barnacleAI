import React from 'react';
import { ABOUT_CONTENT } from '../../constants/aboutConstants';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { Fish, Coral, Seaweed, Starfish } from '../shared/MarineElement';
import handshakeImage from '/assets/handshakes.png';

const AboutHero = () => {
  return (
    <section className={`w-full min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 text-white flex flex-col justify-center items-center ${DESIGN_TOKENS.spacing.section.padding} ${DESIGN_TOKENS.spacing.section.paddingX} ${DESIGN_TOKENS.spacing.navbar.padding}`}>
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="hidden md:flex items-center justify-center p-8">
            <div className="relative w-full max-w-lg h-96 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-2xl border-2 border-dashed border-teal-300/40 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              {/* Marine background elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-12 left-8">
                  <Fish size={80} opacity={0.15} animationSpeed={8} />
                </div>
                <div className="absolute bottom-16 right-12">
                  <Coral size={70} opacity={0.2} animationSpeed={6} />
                </div>
                <div className="absolute top-1/3 right-8">
                  <Seaweed height={90} opacity={0.18} animationSpeed={5} />
                </div>
                <div className="absolute bottom-8 left-16">
                  <Starfish size={60} opacity={0.22} animationSpeed={7} />
                </div>
              </div>
              
              <img src={handshakeImage} alt="Cargo Company" className="relative z-10 object-cover w-full h-full rounded-md shadow-lg"/>
            </div>
          </div>
          <div className="flex flex-col justify-center items-start max-w-4xl">
            <p className="font-semibold text-teal-300 tracking-[0.2em] uppercase text-2xl md:text-3xl">
              {ABOUT_CONTENT.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-8 text-yellow-400">
              {ABOUT_CONTENT.mainHeading}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed"> how BarnaClean is revolutionizing industrial operations through innovative technology and sustainable practices.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;