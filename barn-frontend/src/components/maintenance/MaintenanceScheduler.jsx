import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCog, FaClock, FaDollarSign, FaWrench, FaShip, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaTools, FaMapMarkerAlt } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { MetricCard, StatusBadge, Alert, ProgressBar } from '../shared/Charts';
import Loading from '../shared/Loading';
import { useMaritimeNotifications } from '../../hooks/useMaritimeNotifications';

/**
 * MaintenanceScheduler Component  
 * Implements key BarnaClean features mentioned in the document:
 * 
 * 1. "BarnaClean's AI model forecasts barnacle buildup in real time, 
 *    letting operators plan hull cleanings exactly when needed"
 * 2. "By integrating fouling forecasts into maintenance schedules, crews 
 *    can halve unplanned dry-dock visits and save on labor and materials"
 * 3. Hull cleaning optimization and maintenance planning
 * 4. Cost-benefit analysis for maintenance decisions
 */

const MaintenanceScheduler = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState('mv_pacific_star');
  const [scheduleView, setScheduleView] = useState('monthly');
  const [maintenanceData, setMaintenanceData] = useState(null);
  
  // Initialize maritime notifications
  const notifications = useMaritimeNotifications();

  useEffect(() => {
    // Simulate loading maintenance scheduling data
    notifications.system.dataProcessing('Maintenance data', 'loading');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMaintenanceData(generateMaintenanceData());
      
      // Notify when data is loaded
      notifications.system.dataProcessing('Maintenance schedules', 'completed');
      
      // Check for urgent maintenance items
      const urgentItems = generateMaintenanceData().schedule.filter(item => item.priority === 'urgent');
      if (urgentItems.length > 0) {
        notifications.vessel.maintenanceScheduled(
          urgentItems[0].vessel, 
          urgentItems[0].date
        );
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Removed notifications from dependency array to prevent infinite loop

  // Generate mock maintenance scheduling data
  const generateMaintenanceData = () => {
    return {
      vessels: {
        mv_pacific_star: {
          name: 'MV Pacific Star',
          imo: 'IMO9234567',
          lastCleaning: '2024-01-15',
          nextRecommended: '2024-03-20',
          foulingLevel: 42,
          fuelPenalty: 12.5,
          maintenanceScore: 'good',
          estimatedCost: 45000,
          location: 'Singapore'
        },
        mv_atlantic_dawn: {
          name: 'MV Atlantic Dawn',
          imo: 'IMO9345678',
          lastCleaning: '2023-11-28',
          nextRecommended: '2024-02-28',
          foulingLevel: 68,
          fuelPenalty: 18.3,
          maintenanceScore: 'urgent',
          estimatedCost: 52000,
          location: 'Rotterdam'
        },
        mv_indian_ocean: {
          name: 'MV Indian Ocean',
          imo: 'IMO9456789',
          lastCleaning: '2024-02-10',
          nextRecommended: '2024-04-15',
          foulingLevel: 28,
          fuelPenalty: 8.2,
          maintenanceScore: 'excellent',
          estimatedCost: 38000,
          location: 'Mumbai'
        }
      },
      schedule: [
        {
          date: '2024-02-28',
          vessel: 'MV Atlantic Dawn',
          type: 'Hull Cleaning',
          priority: 'urgent',
          cost: 52000,
          duration: '3 days',
          location: 'Rotterdam Dry Dock',
          savings: 180000
        },
        {
          date: '2024-03-15',
          vessel: 'MV Indian Ocean',
          type: 'Inspection',
          priority: 'routine',
          cost: 5000,
          duration: '4 hours',
          location: 'Mumbai Port',
          savings: 0
        },
        {
          date: '2024-03-20',
          vessel: 'MV Pacific Star',
          type: 'Hull Cleaning',
          priority: 'recommended',
          cost: 45000,
          duration: '2 days',
          location: 'Singapore Shipyard',
          savings: 135000
        },
        {
          date: '2024-04-10',
          vessel: 'MV Atlantic Dawn',
          type: 'Coating Repair',
          priority: 'planned',
          cost: 28000,
          duration: '1 day',
          location: 'Hamburg',
          savings: 85000
        }
      ],
      analytics: {
        totalVessels: 3,
        upcomingMaintenance: 4,
        avgFoulingLevel: 46,
        projectedSavings: 400000,
        maintenanceEfficiency: 94.2,
        unplannedReduction: 65
      }
    };
  };

  const vessels = maintenanceData?.vessels || {};
  const currentVessel = vessels[selectedVessel];

  // Handle vessel selection with notification
  const handleVesselSelection = (vesselKey, vesselName) => {
    setSelectedVessel(vesselKey);
    notifications.user.actionCompleted(`Selected vessel: ${vesselName}`);
  };

  // Handle schedule view change with notification
  const handleScheduleViewChange = (view) => {
    setScheduleView(view);
    notifications.user.actionCompleted(`Switched to ${view} view`);
  };

  const priorityColors = {
    urgent: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
    recommended: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
    routine: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
    planned: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' }
  };

  const getMaintenanceScoreColor = (score) => {
    switch (score) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <Loading 
            size="large" 
            text="Loading maintenance schedules..." 
            variant="maritime"
            color="white"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white flex items-center justify-center gap-2">
          <FaCalendarAlt className="text-blue-400" />
          AI-Powered Maintenance Scheduler
        </h2>
        <p className="text-cyan-100 text-sm">
          Optimize hull cleaning schedules and reduce unplanned dry-dock visits
        </p>
      </div>

      {/* Key Benefits Alert */}
      <Alert
        type="success"
        title="Maintenance Optimization Active"
        message="AI forecasting helps plan hull cleanings exactly when needed, reducing unplanned dry-dock visits by 65%"
      />

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Fleet Vessels"
          value={maintenanceData?.analytics.totalVessels.toString()}
          icon={<FaShip className="text-blue-400" />}
          className="bg-white/10 border-white/20"
        />
        <MetricCard
          title="Upcoming Maintenance"
          value={maintenanceData?.analytics.upcomingMaintenance.toString()}
          icon={<FaCalendarAlt className="text-green-400" />}
          className="bg-white/10 border-white/20"
        />
        <MetricCard
          title="Projected Savings"
          value={`$${(maintenanceData?.analytics.projectedSavings / 1000).toFixed(0)}K`}
          icon={<FaDollarSign className="text-yellow-400" />}
          trend="positive"
          className="bg-white/10 border-white/20"
        />
        <MetricCard
          title="Efficiency Score"
          value={`${maintenanceData?.analytics.maintenanceEfficiency}%`}
          icon={<FaChartLine className="text-purple-400" />}
          trend="positive"
          className="bg-white/10 border-white/20"
        />
      </div>

      {/* Vessel Selection & Details */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vessel Selector */}
          <div className="lg:w-1/3">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaShip className="text-cyan-400" />
              Select Vessel
            </h3>
            <div className="space-y-2">
              {Object.entries(vessels).map(([key, vessel]) => (
                <button
                  key={key}
                  onClick={() => handleVesselSelection(key, vessel.name)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedVessel === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-cyan-100 hover:bg-white/20'
                  }`}
                >
                  <div className="font-semibold">{vessel.name}</div>
                  <div className="text-xs opacity-75">{vessel.imo}</div>
                  <div className={`text-xs ${getMaintenanceScoreColor(vessel.maintenanceScore)}`}>
                    Status: {vessel.maintenanceScore.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vessel Details */}
          <div className="lg:w-2/3">
            <h3 className="text-lg font-semibold text-white mb-4">
              {currentVessel?.name} - Maintenance Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <MetricCard
                title="Fouling Level"
                value={`${currentVessel?.foulingLevel}%`}
                icon={<FaWrench className="text-red-400" />}
                trend={currentVessel?.foulingLevel > 50 ? 'negative' : 'positive'}
                className="bg-white/10 border-white/20"
              />
              <MetricCard
                title="Fuel Penalty"
                value={`${currentVessel?.fuelPenalty}%`}
                icon={<FaChartLine className="text-yellow-400" />}
                trend="negative"
                className="bg-white/10 border-white/20"
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-200">Last Cleaning:</span>
                    <span className="text-white">{currentVessel?.lastCleaning}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-200">Next Recommended:</span>
                    <span className="text-green-300 font-semibold">{currentVessel?.nextRecommended}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-200">Current Location:</span>
                    <span className="text-white">{currentVessel?.location}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cyan-200">Estimated Cost:</span>
                    <span className="text-white">${currentVessel?.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-200">Maintenance Status:</span>
                    <StatusBadge 
                      status={currentVessel?.maintenanceScore === 'urgent' ? 'error' : 'success'} 
                      text={currentVessel?.maintenanceScore.toUpperCase()}
                    />
                  </div>
                </div>
              </div>

              {/* Fouling Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cyan-200">Hull Fouling Progress</span>
                  <span className="text-white">{currentVessel?.foulingLevel}% / 100%</span>
                </div>
                <ProgressBar 
                  progress={currentVessel?.foulingLevel} 
                  color={currentVessel?.foulingLevel > 70 ? 'bg-red-500' : currentVessel?.foulingLevel > 40 ? 'bg-yellow-500' : 'bg-green-500'}
                  className="bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            Maintenance Schedule
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleScheduleViewChange('monthly')}
              className={`px-3 py-1 rounded text-sm ${
                scheduleView === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white/20 text-cyan-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleScheduleViewChange('quarterly')}
              className={`px-3 py-1 rounded text-sm ${
                scheduleView === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-white/20 text-cyan-100'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {maintenanceData?.schedule.map((item, index) => {
            const colors = priorityColors[item.priority];
            return (
              <div key={index} className="bg-white/10 rounded-lg p-4 border-l-4" style={{ borderColor: colors.bg.replace('bg-', '') }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaCalendarAlt className="text-blue-400 text-sm" />
                      <span className="text-white font-semibold">{item.date}</span>
                    </div>
                    <div className="text-cyan-200 text-sm">{item.duration}</div>
                  </div>
                  
                  <div>
                    <div className="text-white font-semibold">{item.vessel}</div>
                    <div className="text-cyan-200 text-sm flex items-center gap-1">
                      <FaMapMarkerAlt className="text-xs" />
                      {item.location}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaTools className="text-cyan-400 text-sm" />
                      <span className="text-white font-semibold">{item.type}</span>
                    </div>
                    <StatusBadge 
                      status={item.priority === 'urgent' ? 'error' : item.priority === 'recommended' ? 'warning' : 'success'} 
                      text={item.priority.toUpperCase()}
                    />
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-semibold">${item.cost.toLocaleString()}</div>
                    {item.savings > 0 && (
                      <div className="text-green-400 text-sm">
                        Saves: ${item.savings.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost-Benefit Analysis */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FaDollarSign className="text-green-400" />
          Cost-Benefit Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">$125K</div>
            <div className="text-cyan-100 text-sm">Total Maintenance Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">$400K</div>
            <div className="text-cyan-100 text-sm">Projected Fuel Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">220%</div>
            <div className="text-cyan-100 text-sm">Return on Investment</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-300 font-semibold mb-2">
            <FaCheckCircle />
            Optimization Benefits
          </div>
          <ul className="text-cyan-100 text-sm space-y-1">
            <li>• 65% reduction in unplanned dry-dock visits</li>
            <li>• $275K net savings through optimized scheduling</li>
            <li>• 18% improvement in fuel efficiency</li>
            <li>• Enhanced vessel availability and operational efficiency</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScheduler;