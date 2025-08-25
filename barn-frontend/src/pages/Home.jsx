import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import { Fish, Whale, Jellyfish, Seaweed, Coral, Starfish } from '../components/shared/MarineElement';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Marine Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Marine Elements */}
        <div className="absolute top-32 left-10 opacity-15">
          <Fish size={80} color="#60a5fa" speed={8} />
        </div>
        <div className="absolute top-64 right-16 opacity-15">
          <Jellyfish size={120} bellColor="#a78bfa" driftSpeed={10} />
        </div>
        
        {/* Middle Section Marine Elements */}
        <div className="absolute top-1/2 left-8 opacity-15">
          <Seaweed height={100} color="#059669" swaySpeed={6} />
        </div>
        <div className="absolute top-1/2 right-12 opacity-15">
          <Coral size={90} />
        </div>
        
        {/* Bottom Marine Elements */}
        <div className="absolute bottom-32 left-1/4 opacity-15">
          <Starfish size={60} color="#f59e0b" />
        </div>
        <div className="absolute bottom-40 right-1/3 opacity-15">
          <Whale size={200} color="#1e40af" swimSpeed={12} />
        </div>
        
        {/* Additional Floating Fish */}
        <div className="absolute top-1/3 left-1/2 opacity-15">
          <Fish size={60} color="#10b981" speed={6} flip={true} />
        </div>
        <div className="absolute bottom-1/4 left-16 opacity-15">
          <Fish size={70} color="#f472b6" speed={7} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10">
        <Hero />
      </section>

      {/* Services Section */}
      <section className="relative z-10">
        <Services />
      </section>
    </div>
  );
};

export default Home;