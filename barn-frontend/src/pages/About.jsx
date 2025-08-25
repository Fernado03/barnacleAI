import React from 'react'
import AboutSections from '../components/about/AboutSections'
import { DESIGN_TOKENS } from '../constants/designTokens'
import { MantaRay, Shark, Whale, Lighthouse, Anchor, Submarine, Fish, Jellyfish, Starfish, Seaweed } from '../components/shared/MarineElement'

const About = () => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Enhanced Marine Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-12">
          <MantaRay size={180} opacity={0.15} animationSpeed={8} />
        </div>
        <div className="absolute top-1/3 right-16">
          <Shark size={200} opacity={0.2} animationSpeed={7} />
        </div>
        <div className="absolute bottom-32 left-1/4">
          <Whale size={240} opacity={0.1} animationSpeed={10} />
        </div>
        <div className="absolute top-2/3 right-8">
          <Lighthouse size={160} opacity={0.25} />
        </div>
        <div className="absolute bottom-20 right-1/3">
          <Anchor size={100} opacity={0.3} />
        </div>
        <div className="absolute top-1/2 left-8">
          <Submarine size={180} opacity={0.15} />
        </div>
        {/* Additional enhanced elements */}
        <div className="absolute top-1/4 left-1/3">
          <Fish size={120} opacity={0.2} animationSpeed={6} />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <Jellyfish size={140} opacity={0.18} animationSpeed={7} />
        </div>
        <div className="absolute top-3/4 left-16">
          <Starfish size={80} opacity={0.25} animationSpeed={5} />
        </div>
        <div className="absolute top-1/6 right-1/3">
          <Seaweed height={120} opacity={0.2} animationSpeed={4} />
        </div>
      </div>
      
      <div className="relative z-10">
        <AboutSections />
      </div>
    </div>
  )
}

export default About