import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactSection = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
      <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
        Contact our team to discuss custom enterprise solutions or get help choosing the right plan for your fleet.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <FaPhone />
          Call Sales: 0128699358
        </button>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <FaEnvelope />
          Contact Enterprise Sales
        </button>
      </div>
      
      <p className="text-cyan-200 text-sm">
        Free trial available • No setup fees • Cancel anytime
      </p>
    </div>
  );
};

export default ContactSection;