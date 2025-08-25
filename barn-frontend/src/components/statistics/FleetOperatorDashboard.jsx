import React from 'react';
import { FaShip, FaIndustry, FaExclamationTriangle, FaClock, FaChartLine, FaDownload, FaFilter, FaSort, FaEye, FaTachometerAlt, FaAnchor, FaRoute, FaWrench } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { MetricCard, StatusBadge, DataTable, Alert, SimpleLineChart } from '../shared/Charts';
import Loading from '../shared/Loading';
import { useFleetData } from '../../hooks/queries/useFleetData';
import { FleetPerformanceOverview } from './FleetOverviewSections';

/**
 * Enhanced Fleet Operator Dashboard Component
 * Implements Jakob Nielsen's 10 Usability Heuristics:
 * 1. Visibility of system status - Real-time fleet overview
 * 2. Match between system and real world - Maritime fleet management terminology
 * 3. User control and freedom - Filtering, sorting, and export options
 * 4. Consistency and standards - Consistent data presentation
 * 5. Error prevention - Clear status indicators and alerts
 * 6. Recognition rather than recall - Visual indicators and intuitive layout
 * 7. Flexibility and efficiency - Quick actions and batch operations
 * 8. Aesthetic and minimalist design - Clean, organized dashboard
 * 9. Help users recognize and recover from errors - Alert system
 * 10. Help and documentation - Contextual tooltips and legends
 */

// Memoized table cell components for performance optimization
const VesselNameCell = React.memo(({ name }) => (
  <div className="flex items-center gap-2">
    <FaShip className="text-blue-500 text-sm" />
    <span className="font-medium text-sm truncate">
      {name}
    </span>
  </div>
));

const StatusCell = React.memo(({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'En Route':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Docked':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Idle':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'En Route':
        return <FaRoute className="w-3 h-3" />;
      case 'Maintenance':
        return <FaWrench className="w-3 h-3" />;
      case 'Docked':
        return <FaAnchor className="w-3 h-3" />;
      case 'Idle':
        return <FaClock className="w-3 h-3" />;
      default:
        return <FaShip className="w-3 h-3" />;
    }
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(status)}`}>
      {getStatusIcon(status)}
      <span>{status}</span>
    </div>
  );
});

const FoulingLevelCell = React.memo(({ foulingPercent }) => {
  const foulingLevel = foulingPercent || 0;
  const getFoulingColor = (level) => {
    if (level <= 10) return 'bg-green-500';
    if (level <= 30) return 'bg-yellow-500';
    if (level <= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };
  const getFoulingStatus = (level) => {
    if (level <= 10) return 'Clean';
    if (level <= 30) return 'Low';
    if (level <= 70) return 'Medium';
    return 'High';
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getFoulingColor(foulingLevel)}`}></div>
        <span className="font-semibold">{foulingLevel.toFixed(1)}%</span>
      </div>
      <div className="text-xs text-gray-500">{getFoulingStatus(foulingLevel)}</div>
    </div>
  );
});

const FuelImpactCell = React.memo(({ fuelPenalty }) => {
  const penaltyValue = parseFloat(fuelPenalty?.slice(1, -1) || '0');
  const getImpactColor = (penalty) => {
    if (penalty > 10) return 'text-red-600';
    if (penalty > 5) return 'text-orange-600';
    if (penalty > 2) return 'text-yellow-600';
    return 'text-green-600';
  };
  const getImpactLevel = (penalty) => {
    if (penalty > 10) return 'Critical';
    if (penalty > 5) return 'High';
    if (penalty > 2) return 'Moderate';
    return 'Low';
  };
  return (
    <div className="space-y-1">
      <div className={`font-semibold ${getImpactColor(penaltyValue)}`}>
        {fuelPenalty}
      </div>
      <div className={`text-xs ${getImpactColor(penaltyValue)}`}>
        {getImpactLevel(penaltyValue)} Impact
      </div>
    </div>
  );
});

const RouteLocationCell = React.memo(({ destination, status }) => {
  const isRoute = destination && destination.includes('-');
  return (
    <div className="text-sm">
      <div className="text-gray-700 font-medium truncate">
        {destination || 'Unknown'}
      </div>
      <div className="text-xs text-gray-500">
        {isRoute ? 'Route' : status === 'Docked' ? 'Port' : 'Location'}
      </div>
    </div>
  );
});

const MLRiskActionCell = React.memo(({ mlPrediction }) => {
  const recommendations = mlPrediction?.recommendations || 'No recommendations available';
  const mainAction = recommendations.includes('Immediate hull cleaning') ? 'Hull cleaning required' :
                    recommendations.includes('Emergency inspection') ? 'Emergency inspection' :
                    recommendations.includes('Schedule cleaning') ? 'Schedule cleaning' :
                    recommendations.includes('Monitor') ? 'Monitor condition' : 'Review status';
  
  const confidence = mlPrediction?.confidenceScore || 0;
  const riskCategory = mlPrediction?.riskCategory || 'Unknown';
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-1 max-w-[220px]">
      <div className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium ${getRiskColor(riskCategory)}`}>
        {riskCategory} Risk
      </div>
      <div className="text-sm text-gray-700 font-medium truncate">
        {mainAction}
      </div>
      <div className="text-xs text-gray-500">
        {(confidence * 100).toFixed(0)}% confidence
      </div>
    </div>
  );
});

const DaysSinceCleanCell = React.memo(({ daysSinceClean }) => {
  const getTimeColor = (days) => {
    if (days > 120) return 'text-red-600';
    if (days > 60) return 'text-orange-600';
    if (days > 30) return 'text-yellow-600';
    return 'text-green-600';
  };
  const getTimeStatus = (days) => {
    if (days > 120) return 'Critical';
    if (days > 60) return 'Overdue';
    if (days > 30) return 'Due Soon';
    return 'Good';
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <FaClock className="text-gray-400 text-sm" />
        <span className={`font-semibold ${getTimeColor(daysSinceClean)}`}>
          {daysSinceClean} days
        </span>
      </div>
      <div className={`text-xs ${getTimeColor(daysSinceClean)}`}>
        {getTimeStatus(daysSinceClean)}
      </div>
    </div>
  );
});

const VesselActionsCell = React.memo(({ vessel }) => (
  <div className="flex items-center gap-2">
    <button
      className="text-blue-600 hover:text-blue-800 text-sm p-1 hover:bg-blue-50 rounded"
      title="View Details"
    >
      <FaEye />
    </button>
    {vessel.foulingClass === 'high' && (
      <button
        className="text-orange-600 hover:text-orange-800 text-sm p-1 hover:bg-orange-50 rounded"
        title="Schedule Maintenance"
      >
        <FaWrench />
      </button>
    )}
  </div>
));

const FleetOperatorDashboard = () => {
  // TanStack Query hooks for backend integration
  const { 
    data: fleetResponse, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useFleetData();
  
  // Local UI state - separate filters for different categories
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState('all');
  const [selectedFoulingFilter, setSelectedFoulingFilter] = React.useState('all');
  const [showExportOptions, setShowExportOptions] = React.useState(false);
  
  // Transform vessels data - optimized with separate memos for better performance
  const transformedVessels = React.useMemo(() => {
    if (!fleetResponse?.data?.vessels) return [];
    
    return fleetResponse.data.vessels.map(vessel => {
      const biofoulingLevel = parseFloat(vessel.performance?.biofoulingLevel || 0);
      const daysSinceClean = vessel.maintenance?.daysSinceClean || 0;
      
      // Determine proper status based on backend data
      let vesselStatus = vessel.status || 'Idle';
      if (vessel.status === 'Active') vesselStatus = 'En Route';
      else if (vessel.status === 'Docked') vesselStatus = 'Docked';
      else if (vessel.status === 'Maintenance') vesselStatus = 'Maintenance';
      
      // Calculate fouling classification based on backend data
      const foulingClass = biofoulingLevel > 70 ? 'high' : 
                          biofoulingLevel > 30 ? 'medium' : 
                          biofoulingLevel > 10 ? 'low' : 'clean';
      
      const fuelPenaltyValue = vessel.performance?.speedReduction || 0;
      
      return {
        id: vessel.id || vessel._id,
        name: vessel.name || 'Unknown Vessel',
        status: vesselStatus,
        foulingPercent: biofoulingLevel,
        foulingClass: foulingClass,
        fuelPenalty: `+${fuelPenaltyValue.toFixed(1)}%`,
        destination: vessel.route?.current || vessel.currentPort || 'Unknown',
        daysSinceClean: daysSinceClean,
        location: vessel.route?.location || { lat: 0, lon: 0 },
        mlPrediction: vessel.mlPrediction || {
          riskCategory: 'Unknown',
          confidenceScore: 0.0,
          recommendations: 'No ML data available',
          modelVersion: 'unknown',
          predictionMethod: 'unknown'
        }
      };
    });
  }, [fleetResponse?.data?.vessels]);
  
  // Calculate fleet summary statistics - separate memo for better performance
  const fleetSummary = React.useMemo(() => {
    if (!transformedVessels.length) return null;
    
    const summary = fleetResponse?.data?.summary;
    const statusCounts = {
      enRoute: transformedVessels.filter(v => v.status === 'En Route').length,
      idle: transformedVessels.filter(v => v.status === 'Idle').length,
      docked: transformedVessels.filter(v => v.status === 'Docked').length,
      maintenance: transformedVessels.filter(v => v.status === 'Maintenance').length
    };
    
    const highFoulingVessels = transformedVessels.filter(v => v.foulingClass === 'high').length;
    
    return {
      totalVessels: summary?.totalVessels || transformedVessels.length,
      activeVessels: summary?.activeVessels || statusCounts.enRoute,
      idleVessels: summary?.idleVessels || statusCounts.idle,
      dockedVessels: summary?.dockedVessels || statusCounts.docked,
      maintenanceVessels: summary?.maintenanceVessels || statusCounts.maintenance,
      maintenanceFlags: summary?.maintenanceFlags || (highFoulingVessels + statusCounts.maintenance),
      highFoulingVessels,
      avgFuelPenalty: summary?.avgFuelPenalty || `+${(transformedVessels.reduce((sum, v) => {
        const penalty = parseFloat(v.fuelPenalty.slice(1, -1)) || 0;
        return sum + penalty;
      }, 0) / Math.max(transformedVessels.length, 1)).toFixed(1)}%`,
      avgConfidenceScore: summary?.avgConfidenceScore || 
        (transformedVessels.reduce((sum, v) => sum + (v.mlPrediction?.confidenceScore || 0), 0) / transformedVessels.length).toFixed(3)
    };
  }, [transformedVessels, fleetResponse?.data?.summary]);
  
  // Combined fleet data object
  const fleetData = React.useMemo(() => {
    if (!transformedVessels.length || !fleetSummary) return null;
    
    return {
      vessels: transformedVessels,
      summary: fleetSummary
    };
  }, [transformedVessels, fleetSummary]);
  // Debounced filter values to reduce expensive filtering operations
  const [debouncedStatusFilter, setDebouncedStatusFilter] = React.useState(selectedStatusFilter);
  const [debouncedFoulingFilter, setDebouncedFoulingFilter] = React.useState(selectedFoulingFilter);
  
  // Debounce filter updates
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedStatusFilter(selectedStatusFilter);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [selectedStatusFilter]);
  
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFoulingFilter(selectedFoulingFilter);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [selectedFoulingFilter]);
  
  // Filter vessels based on debounced criteria - optimized filtering
  const filteredVessels = React.useMemo(() => {
    if (!fleetData?.vessels) return [];
    
    return fleetData.vessels.filter(vessel => {
      // Apply operational status filter
      if (debouncedStatusFilter !== 'all') {
        const statusMatches = {
          enroute: vessel.status === 'En Route',
          docked: vessel.status === 'Docked',
          maintenance: vessel.status === 'Maintenance',
          idle: vessel.status === 'Idle'
        };
        if (!statusMatches[debouncedStatusFilter]) return false;
      }
      
      // Apply fouling level filter
      if (debouncedFoulingFilter !== 'all') {
        const foulingLevel = vessel.foulingPercent || 0;
        const foulingMatches = {
          clean: foulingLevel <= 10,
          low: foulingLevel > 10 && foulingLevel <= 30,
          medium: foulingLevel > 30 && foulingLevel <= 70,
          high: foulingLevel > 70
        };
        if (!foulingMatches[debouncedFoulingFilter]) return false;
      }
      
      return true;
    });
  }, [fleetData?.vessels, debouncedStatusFilter, debouncedFoulingFilter]);
  
  // Generate alerts for fleet management - memoized for performance
  const fleetAlerts = React.useMemo(() => {
    if (!fleetData) return [];
    
    const alerts = [];
    
    // Use high fouling vessels count from summary
    const criticalVessels = fleetData.summary?.highFoulingVessels || 0;
    if (criticalVessels > 0) {
      alerts.push({
        type: 'error',
        title: `${criticalVessels} Vessel${criticalVessels > 1 ? 's' : ''} Need Immediate Attention`,
        message: 'Hull cleaning required to prevent further fuel penalties and operational delays.'
      });
    }
    
    const avgFuelPenaltyStr = fleetData?.summary?.avgFuelPenalty;
    if (avgFuelPenaltyStr && typeof avgFuelPenaltyStr === 'string' && avgFuelPenaltyStr.length > 2) {
      const avgFuelPenalty = parseFloat(avgFuelPenaltyStr.slice(1, -2));
      if (avgFuelPenalty > 2.0) {
        alerts.push({
          type: 'warning',
          title: 'Fleet Fuel Efficiency Alert',
          message: `Average fuel penalty (${avgFuelPenaltyStr}) is above recommended threshold.`
        });
      }
    }
    
    return alerts;
  }, [fleetData?.summary?.highFoulingVessels, fleetData?.summary?.avgFuelPenalty]);
  
  // Export functionality placeholder
  const handleExport = () => {
    // In a real app, this would trigger file download
    setShowExportOptions(false);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <Loading 
            size="large" 
            text="Loading Fleet data..." 
            variant="maritime"
            color="white"
          />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto" />
          <p className="text-red-600">Error loading fleet data: {error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const tableColumns = [
    {
      key: 'name',
      label: 'Vessel Name',
      render: (value) => <VesselNameCell name={value} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusCell status={value} />
    },
    {
      key: 'foulingPercent',
      label: 'Fouling Level',
      render: (value) => <FoulingLevelCell foulingPercent={value} />
    },
    {
      key: 'fuelPenalty',
      label: 'Fuel Impact',
      render: (value) => <FuelImpactCell fuelPenalty={value} />
    },
    {
      key: 'destination',
      label: 'Route/Location',
      render: (value, vessel) => <RouteLocationCell destination={value} status={vessel.status} />
    },
    {
      key: 'recommendations',
      label: 'ML Risk & Action',
      render: (_, vessel) => <MLRiskActionCell mlPrediction={vessel.mlPrediction} />
    },
    {
      key: 'daysSinceClean',
      label: 'Days Since Clean',
      render: (value) => <DaysSinceCleanCell daysSinceClean={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, vessel) => <VesselActionsCell vessel={vessel} />
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center justify-center gap-2">
          <FaIndustry className="text-cyan-400" />
          Fleet Operator Dashboard
          {isRefetching && <span className="text-sm font-normal text-cyan-200">(Updating...)</span>}
        </h2>
        <div className="flex items-center justify-center gap-6 text-cyan-100 text-sm">
          <div className="flex items-center gap-2">
            <FaShip className="text-cyan-300" />
            <span>{fleetData?.summary?.totalVessels || 0} Total Vessels</span>
          </div>
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-300" />
            <span>{fleetData?.summary?.highFoulingVessels || 0} Need Attention</span>
          </div>
        </div>
      </div>
      
      {/* Fleet Alerts */}
      {fleetAlerts.map((alert, index) => (
        <Alert
          key={index}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />
      ))}
      
      {/* Fleet Performance Overview */}
      <FleetPerformanceOverview fleetData={fleetData} />
      
      {/* Controls and Filters */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Operational Status Filter */}
            <div className="flex items-center gap-2">
              <FaRoute className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Status ({fleetData?.vessels?.length || 0})</option>
                <option value="enroute">En Route ({fleetData?.vessels?.filter(v => v.status === 'En Route').length || 0})</option>
                <option value="docked">Docked ({fleetData?.vessels?.filter(v => v.status === 'Docked').length || 0})</option>
                <option value="maintenance">Maintenance ({fleetData?.vessels?.filter(v => v.status === 'Maintenance').length || 0})</option>
                <option value="idle">Idle ({fleetData?.vessels?.filter(v => v.status === 'Idle').length || 0})</option>
              </select>
            </div>
            
            {/* Fouling Level Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Fouling:</span>
              <select
                value={selectedFoulingFilter}
                onChange={(e) => setSelectedFoulingFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Levels ({fleetData?.vessels?.length || 0})</option>
                <option value="clean">Clean ({fleetData?.vessels?.filter(v => (v.foulingPercent || 0) <= 10).length || 0})</option>
                <option value="low">Low ({fleetData?.vessels?.filter(v => (v.foulingPercent || 0) > 10 && (v.foulingPercent || 0) <= 30).length || 0})</option>
                <option value="medium">Medium ({fleetData?.vessels?.filter(v => (v.foulingPercent || 0) > 30 && (v.foulingPercent || 0) <= 70).length || 0})</option>
                <option value="high">High ({fleetData?.vessels?.filter(v => (v.foulingPercent || 0) > 70).length || 0})</option>
              </select>
            </div>
            
            {/* Clear Filters Button */}
            {(selectedStatusFilter !== 'all' || selectedFoulingFilter !== 'all') && (
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                  setSelectedFoulingFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              disabled={isRefetching}
            >
              <FaIndustry />
              {isRefetching ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <FaDownload />
                Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => handleExport()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    PDF Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Vessel Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={tableColumns}
          data={filteredVessels}
          sortable={true}
        />
      </div>
      
      {filteredVessels.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FaShip className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vessels match the current filter criteria.</p>
          <button
            onClick={() => {
              setSelectedStatusFilter('all');
              setSelectedFoulingFilter('all');
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FleetOperatorDashboard;