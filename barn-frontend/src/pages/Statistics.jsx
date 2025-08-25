import React, { useState } from 'react';
import { FaChartBar, FaShip, FaIndustry, FaTachometerAlt, FaUser, FaCog, FaInfoCircle, FaChartLine, FaMap, FaGlobe, FaBroadcastTower, FaCalendarAlt } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../constants/designTokens';
import BiofoulingPredictorWithHistory from '../components/statistics/BiofoulingPredictorWithHistory';
import CaptainDashboard from '../components/statistics/CaptainDashboard';
import FleetOperatorDashboard from '../components/statistics/FleetOperatorDashboard';
import MarineAnalyticsDashboard from '../components/statistics/MarineAnalyticsDashboard';
import RouteOptimizer from '../components/routing/RouteOptimizer';
import ESGDashboard from '../components/sustainability/ESGDashboard';
import RealTimeDataDashboard from '../components/data/RealTimeDataDashboard';
import MaintenanceScheduler from '../components/maintenance/MaintenanceScheduler';
import { Alert } from '../components/shared/Charts';

/**
 * Complete Statistics Page with Tab Navigation
 * Implements Jakob Nielsen's 10 Usability Heuristics:
 * 1. Visibility of system status - Clear tab states and loading indicators
 * 2. Match between system and real world - Marine dashboard terminology
 * 3. User control and freedom - Easy tab navigation and dashboard switching
 * 4. Consistency and standards - Consistent tab design and behavior
 * 5. Error prevention - Clear navigation and user guidance
 * 6. Recognition rather than recall - Visual tab indicators and icons
 * 7. Flexibility and efficiency - Quick dashboard switching for different user roles
 * 8. Aesthetic and minimalist design - Clean, organized layout
 * 9. Help users recognize and recover from errors - Error states and guidance
 * 10. Help and documentation - Contextual help and tooltips
 */

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('fleet');
  
  // Tab configuration following Nielsen's Heuristic 2: Match between system and real world
  const tabs = [
    {
      id: 'fleet',
      label: 'Fleet Operations',
      icon: <FaIndustry />,
      description: 'Fleet management and performance analytics',
      component: FleetOperatorDashboard,
      userRole: 'Fleet Manager'
    },
    {
      id: 'captain',
      label: 'Captain View',
      icon: <FaShip />,
      description: 'Vessel status and navigation data',
      component: CaptainDashboard,
      userRole: 'Ship Captain'
    },
    {
      id: 'route',
      label: 'Route Optimizer',
      icon: <FaMap />,
      description: 'AI-powered route optimization with fuel savings',
      component: RouteOptimizer,
      userRole: 'Navigation Officer'
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: <FaCalendarAlt />,
      description: 'Hull cleaning optimization and maintenance scheduling',
      component: MaintenanceScheduler,
      userRole: 'Maintenance Manager'
    },
    {
      id: 'realtime',
      label: 'Live Data',
      icon: <FaBroadcastTower />,
      description: 'Real-time AIS, weather, and oceanographic data',
      component: RealTimeDataDashboard,
      userRole: 'Data Analyst'
    },
    {
      id: 'esg',
      label: 'ESG Impact',
      icon: <FaGlobe />,
      description: 'Environmental, Social & Governance metrics',
      component: ESGDashboard,
      userRole: 'Sustainability Officer'
    },
    {
      id: 'biofouling',
      label: 'Biofouling Analysis',
      icon: <FaTachometerAlt />,
      description: 'AI-powered prediction and history management',
      component: BiofoulingPredictorWithHistory,
      userRole: 'Marine Engineer'
    },
    {
      id: 'analytics',
      label: 'Advanced Analytics',
      icon: <FaChartLine />,
      description: 'Data visualization and trends',
      component: MarineAnalyticsDashboard,
      userRole: 'Data Analyst'
    }
  ];
  
  // Nielsen Heuristic 3: User control and freedom
  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  };
  
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = currentTab?.component;
  
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaChartBar className="text-4xl text-cyan-400" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-cyan-100 text-lg lg:text-xl max-w-3xl mx-auto">
            Comprehensive marine analytics and vessel performance optimization
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 mb-8 border border-white/20 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-3 px-3 lg:py-4 lg:px-4 text-center text-xs lg:text-sm font-semibold transition-all duration-300 rounded-xl transform hover:scale-105 ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-xl border-2 border-blue-200'
                      : 'bg-white/10 text-white hover:bg-white/25 hover:text-white border-2 border-transparent hover:border-white/30'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  title={tab.description}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className={`text-xl lg:text-2xl transition-all duration-300 ${
                      isActive ? 'text-blue-600' : 'text-cyan-300 group-hover:text-white'
                    }`}>
                      {tab.icon}
                    </span>
                    <div className="space-y-1">
                      <div className={`font-bold text-xs lg:text-sm transition-colors ${
                        isActive ? 'text-blue-700' : 'text-white group-hover:text-white'
                      }`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs font-medium transition-colors ${
                        isActive ? 'text-blue-500' : 'text-cyan-200 group-hover:text-cyan-100'
                      }`}>
                        {tab.userRole}
                      </div>
                    </div>
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
        
        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Active Dashboard Component */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="transition-all duration-300 ease-in-out">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20 mt-8">
          <div className="flex items-center justify-between text-sm text-cyan-100">
            <div className="flex items-center gap-4">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <span>Data refresh: Every 30s</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCog className="text-cyan-300" />
              <button className="text-white hover:text-cyan-200 font-medium transition-colors">
                Dashboard Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;