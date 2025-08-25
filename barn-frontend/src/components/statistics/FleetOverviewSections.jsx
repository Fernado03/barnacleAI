import React from 'react';
import { FaShip, FaRoute, FaExclamationTriangle, FaClock, FaTachometerAlt, FaChartLine, FaIndustry } from 'react-icons/fa';

// Memoized Fleet Performance Overview Component
export const FleetPerformanceOverview = React.memo(({ fleetData }) => {
  if (!fleetData?.vessels) return null;

  // Use consistent property names from transformed data
  const foulingDistribution = [
    { label: 'Clean (0-10%)', color: 'bg-green-500', count: fleetData.vessels.filter(v => (v.foulingPercent || 0) <= 10).length },
    { label: 'Low (11-30%)', color: 'bg-yellow-500', count: fleetData.vessels.filter(v => (v.foulingPercent || 0) > 10 && (v.foulingPercent || 0) <= 30).length },
    { label: 'Medium (31-70%)', color: 'bg-orange-500', count: fleetData.vessels.filter(v => (v.foulingPercent || 0) > 30 && (v.foulingPercent || 0) <= 70).length },
    { label: 'High (70%+)', color: 'bg-red-500', count: fleetData.vessels.filter(v => (v.foulingPercent || 0) > 70).length }
  ];

  const operationalStatus = [
    { label: 'En Route', status: 'En Route', color: 'bg-green-500' },
    { label: 'Docked', status: 'Docked', color: 'bg-blue-500' },
    { label: 'Maintenance', status: 'Maintenance', color: 'bg-orange-500' },
    { label: 'Idle', status: 'Idle', color: 'bg-gray-500' }
  ].map(statusType => {
    const count = fleetData.vessels.filter(v => v.status === statusType.status).length;
    const percentage = fleetData.vessels.length ? ((count / fleetData.vessels.length) * 100).toFixed(1) : '0.0';
    return { ...statusType, count, percentage };
  });

  const criticalAlerts = (() => {
    // Use consistent property names and calculations
    const highFouling = fleetData.vessels.filter(v => (v.foulingPercent || 0) > 70);
    const longOverdue = fleetData.vessels.filter(v => (v.daysSinceClean || 0) > 120);
    const highFuelPenalty = fleetData.vessels.filter(v => {
      const penalty = parseFloat(v.fuelPenalty?.slice(1, -1) || '0');
      return penalty > 8;
    });
    
    return [
      { label: 'High Fouling Vessels', count: highFouling.length, color: 'bg-red-500', icon: <FaShip /> },
      { label: 'Overdue Cleaning', count: longOverdue.length, color: 'bg-orange-500', icon: <FaClock /> },
      { label: 'High Fuel Impact', count: highFuelPenalty.length, color: 'bg-purple-500', icon: <FaTachometerAlt /> }
    ];
  })();

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600" />
          Fleet Performance Overview
        </h3>
        <div className="text-sm text-gray-500 font-medium">
          Current snapshot of fleet condition
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fouling Level Distribution */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <FaShip className="text-blue-500 text-lg" />
            <h4 className="font-semibold text-gray-700 text-base">Fouling Level Distribution</h4>
          </div>
          <div className="space-y-3">
            {foulingDistribution.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </div>
                <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-right">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Operational Status */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <FaRoute className="text-green-500 text-lg" />
            <h4 className="font-semibold text-gray-700 text-base">Operational Status</h4>
          </div>
          <div className="space-y-3">
            {operationalStatus.map((statusType, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusType.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{statusType.label}</span>
                </div>
                <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-right">{statusType.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Critical Alerts */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-red-500 text-lg" />
            <h4 className="font-semibold text-gray-700 text-base">Attention Required</h4>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg transition-all hover:shadow-sm ${
                alert.count > 0 
                  ? 'bg-red-50 border border-red-200 hover:bg-red-100' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${alert.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{alert.label}</span>
                  </div>
                  <span className={`text-xl font-bold min-w-[2rem] text-right ${
                    alert.count > 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>{alert.count}</span>
                </div>
                {alert.count > 0 && (
                  <div className="mt-3 pt-2 border-t border-red-200">
                    <div className="text-xs text-red-600 font-medium">
                      Immediate attention recommended
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

FleetPerformanceOverview.displayName = 'FleetPerformanceOverview';