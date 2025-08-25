import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

const PricingHeader = ({ billingPeriod, setBillingPeriod }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <FaDollarSign className="text-4xl text-green-400" />
        <h1 className="text-4xl lg:text-5xl font-bold text-white">
          Pricing Plans
        </h1>
      </div>
      <p className="text-cyan-100 text-lg lg:text-xl max-w-3xl mx-auto mb-6">
        Choose the perfect plan for your fleet and start saving fuel today
      </p>
      
      {/* Billing Toggle */}
      <div className="inline-flex bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            billingPeriod === 'monthly' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-white hover:text-blue-100'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('annual')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            billingPeriod === 'annual' 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'text-white hover:text-blue-100'
          }`}
        >
          Annual (Save 17%)
        </button>
      </div>
    </div>
  );
};

export default PricingHeader;