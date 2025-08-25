import React from 'react';
import { FaCheck, FaStar, FaShip, FaIndustry, FaCrown } from 'react-icons/fa';

const PricingCard = ({ 
  planKey, 
  plan, 
  isSelected, 
  billingPeriod, 
  onSelect 
}) => {
  const price = billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const monthlyPrice = billingPeriod === 'annual' ? plan.annualPrice / 12 : plan.monthlyPrice;

  // Function to render the correct icon based on iconName
  const renderIcon = (iconName, iconColor) => {
    const iconClass = `text-4xl ${iconColor} mx-auto`;
    
    switch (iconName) {
      case 'FaShip':
        return <FaShip className={iconClass} />;
      case 'FaIndustry':
        return <FaIndustry className={iconClass} />;
      case 'FaCrown':
        return <FaCrown className={iconClass} />;
      default:
        return <FaShip className={iconClass} />; // fallback
    }
  };

  return (
    <div
      onClick={() => onSelect(planKey)}
      className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border transition-all duration-300 cursor-pointer hover:scale-105 ${
        plan.popular 
          ? 'border-green-400 ring-2 ring-green-400 shadow-2xl' 
          : isSelected
            ? 'border-blue-400 ring-2 ring-blue-400'
            : 'border-white/20 hover:border-white/40'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <FaStar className="text-xs" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        {renderIcon(plan.iconName, plan.iconColor)}
        <h3 className="text-2xl font-bold text-white mt-4 mb-2">{plan.name}</h3>
        <p className="text-cyan-100 text-sm mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <div className="text-4xl font-bold text-white">
            ${price.toLocaleString()}
          </div>
          <div className="text-cyan-100 text-sm">
            {billingPeriod === 'annual' ? '/year' : '/month'} • Up to {plan.vesselsIncluded} vessels
          </div>
          {billingPeriod === 'annual' && (
            <div className="text-green-400 text-sm font-semibold">
              ${monthlyPrice.toFixed(0)}/month (billed annually)
            </div>
          )}
        </div>

        <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-6">
          <div className="text-green-300 text-sm font-semibold">
            Expected Savings: {plan.savingsEstimate}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <FaCheck className="text-green-400 flex-shrink-0" />
            <span className="text-cyan-100 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isSelected
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
        }`}
      >
        {isSelected ? 'Selected Plan' : 'Choose Plan'}
      </button>
    </div>
  );
};

export default PricingCard;