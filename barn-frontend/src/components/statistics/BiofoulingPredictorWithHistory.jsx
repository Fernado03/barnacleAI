import React, { useState } from 'react';
import { FaTachometerAlt, FaHistory, FaShip, FaChartLine } from 'react-icons/fa';
import BiofoulingPredictor from './BiofoulingPredictor';
import PredictionHistory from './PredictionHistory';

/**
 * Combined BiofoulingPredictorWithHistory Component
 * Combines the Biofouling Predictor and Prediction History into a single tabbed interface
 * Following Nielsen's usability heuristics for intuitive navigation
 */
const BiofoulingPredictorWithHistory = () => {
  const [activeSubTab, setActiveSubTab] = useState('predictor');

  const subTabs = [
    {
      id: 'predictor',
      label: 'New Prediction',
      icon: <FaTachometerAlt />,
      description: 'Generate biofouling predictions',
      component: BiofoulingPredictor
    },
    {
      id: 'history',
      label: 'Prediction History',
      icon: <FaHistory />,
      description: 'View and manage past predictions',
      component: PredictionHistory
    }
  ];

  const currentSubTab = subTabs.find(tab => tab.id === activeSubTab);
  const ActiveSubComponent = currentSubTab?.component;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white flex items-center justify-center gap-2">
          <FaShip className="text-cyan-400" />
          Biofouling Analysis Suite
        </h2>
        <p className="text-cyan-100 text-sm lg:text-base">
          Predict biofouling growth and analyze historical patterns
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20">
        <div className="grid grid-cols-2 gap-2">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`group relative overflow-hidden py-3 px-4 text-center text-sm font-semibold transition-all duration-300 rounded-lg transform hover:scale-105 ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-lg border-2 border-blue-200'
                    : 'bg-white/10 text-white hover:bg-white/25 hover:text-white border-2 border-transparent hover:border-white/30'
                }`}
                title={tab.description}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-lg transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'text-cyan-300 group-hover:text-white'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className={`font-bold transition-colors ${
                    isActive ? 'text-blue-700' : 'text-white group-hover:text-white'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300 ease-in-out">
        {ActiveSubComponent && <ActiveSubComponent />}
      </div>
    </div>
  );
};

export default BiofoulingPredictorWithHistory;