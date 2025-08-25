import React, { useState, useEffect } from 'react';
import { FaExpand, FaMapMarkerAlt, FaThermometerHalf, FaTint, FaWind, FaWater, FaShip, FaClock, FaCompass, FaAnchor, FaRoute, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { formatValue, getFoulingStyles } from '../../utils/dataProcessing';
import { REAL_BIOFOULING_DATA } from '../../utils/csvDataLoader'; // Updated import
import { MetricCard, StatusBadge, Alert, ProgressBar } from '../shared/Charts';
import Loading from '../shared/Loading';

/**
 * Enhanced Captain Dashboard Component
 * Implements Jakob Nielsen's 10 Usability Heuristics:
 * 1. Visibility of system status - Real-time vessel status updates
 * 2. Match between system and real world - Marine navigation terminology
 * 3. User control and freedom - Expandable sections and controls
 * 4. Consistency and standards - Maritime industry standards
 * 5. Error prevention - Clear status indicators
 * 6. Recognition rather than recall - Visual indicators and familiar icons
 * 7. Flexibility and efficiency - Quick access to critical information
 * 8. Aesthetic and minimalist design - Clean, organized layout
 * 9. Help users recognize and recover from errors - Status alerts
 * 10. Help and documentation - Tooltips and contextual information
 */

const CaptainDashboard = () => {
  const [vesselData, setVesselData] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate real-time data updates
  useEffect(() => {
    const loadVesselData = () => {
      // Get latest vessel data from real CSV data
      const latestRecord = REAL_BIOFOULING_DATA[REAL_BIOFOULING_DATA.length - 1];
      
      const currentVessel = {
        name: `MV Harbour ${latestRecord.vessel_id.split('_')[1]}`,
        mmsi: latestRecord.mmsi,
        imo: latestRecord.imo,
        status: determineVesselStatus(latestRecord),
        position: {
          lat: latestRecord.lat,
          lon: latestRecord.lon,
          heading: 45, // Simulated heading in degrees
          speed: latestRecord.mean_speed_knots
        },
        destination: {
          port: "Port Klang",
          eta: "2024-08-25 14:30",
          distance: "127 NM"
        },
        environmental: {
          seaTemperature: latestRecord.sea_temperature,
          salinity: latestRecord.salinity,
          windSpeed: latestRecord.wind_speed_mps,
          windDirection: latestRecord.wind_direction,
          currentSpeed: latestRecord.current_speed,
          currentDirection: latestRecord.current_direction
        },
        biofouling: {
          daysSinceClean: latestRecord.days_since_clean,
          foulingPercent: latestRecord.fouling_percent,
          foulingClass: latestRecord.fouling_class,
          fuelConsumption: latestRecord.fuel_consumption_tpd,
          lastCleanDate: latestRecord.last_clean_date
        },
        alerts: generateAlerts(latestRecord)
      };
      
      setVesselData(currentVessel);
    };
    
    loadVesselData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        loadVesselData();
        setRefreshing(false);
      }, 1000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const handleManualRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  if (!vesselData) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <Loading 
            size="large" 
            text="Loading vessel data..." 
            variant="maritime"
            color="white"
          />
        </div>
      </div>
    );
  }
  
  const foulingStyles = getFoulingStyles(vesselData.biofouling.foulingClass);
  
  return (
    <div className="w-full space-y-6">
      {/* Header with vessel status */}
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white flex items-center justify-center gap-2">
          <FaShip className="text-cyan-400" />
          Captain Dashboard
          {refreshing && <span className="text-sm font-normal text-cyan-200">(Updating...)</span>}
        </h2>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <StatusBadge status={vesselData.biofouling.foulingClass} />
          <span className="text-white text-sm font-medium">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={handleManualRefresh}
            className="text-cyan-200 hover:text-white text-sm flex items-center gap-1 transition-colors"
            disabled={refreshing}
          >
            <FaClock className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Active Alerts */}
      {vesselData.alerts.length > 0 && (
        <div className="space-y-2">
          {vesselData.alerts.map((alert, index) => (
            <Alert
              key={index}
              type={alert.type}
              title={alert.title}
              message={alert.message}
            />
          ))}
        </div>
      )}
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Current Speed"
          value={vesselData.position.speed.toFixed(1)}
          unit=" knots"
          color="blue"
          icon={<FaShip />}
        />
        <MetricCard
          title="Fouling Level"
          value={vesselData.biofouling.foulingPercent.toFixed(1)}
          unit="%"
          color={vesselData.biofouling.foulingClass === 'high' ? 'red' : vesselData.biofouling.foulingClass === 'medium' ? 'orange' : 'green'}
          icon={<FaAnchor />}
        />
        <MetricCard
          title="ETA Distance"
          value={vesselData.destination.distance.split(' ')[0]}
          unit=" NM"
          color="purple"
          icon={<FaRoute />}
        />
        <MetricCard
          title="Fuel Rate"
          value={vesselData.biofouling.fuelConsumption.toFixed(2)}
          unit=" tpd"
          color="orange"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ship Information */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaShip className="text-blue-600" />
              Vessel Information
            </h3>
            <button
              onClick={() => handleSectionToggle('vessel')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Expand vessel information"
            >
              <FaExpand className="text-sm" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Vessel Name</label>
                <div className="p-3 bg-white rounded-lg border border-gray-300 font-semibold text-gray-800">
                  {vesselData.name}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                <div className="p-3 bg-white rounded-lg border border-gray-300">
                  <StatusBadge status={vesselData.status.toLowerCase().replace(' ', '_')} size="small" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">MMSI</label>
                <div className="p-3 bg-white rounded-lg border border-gray-300 font-mono text-sm">
                  {vesselData.mmsi}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">IMO</label>
                <div className="p-3 bg-white rounded-lg border border-gray-300 font-mono text-sm">
                  {vesselData.imo}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Destination Port</label>
              <div className="p-3 bg-white rounded-lg border border-gray-300 flex items-center justify-between">
                <span className="font-semibold">{vesselData.destination.port}</span>
                <span className="text-sm text-gray-600">ETA: {vesselData.destination.eta}</span>
              </div>
            </div>
            
            {expandedSection === 'vessel' && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Heading</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-300 flex items-center gap-2">
                      <FaCompass className="text-blue-500" />
                      {vesselData.position.heading.toString().padStart(3, '0')}°
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Distance to Port</label>
                    <div className="p-3 bg-white rounded-lg border border-gray-300 flex items-center gap-2">
                      <FaRoute className="text-green-500" />
                      {vesselData.destination.distance}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation & Position */}
        <div className="space-y-4">
          {/* Position Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Current Position
            </h3>
            <div className="bg-blue-200 rounded-lg h-32 lg:h-40 flex items-center justify-center mb-4">
              <div className="text-center space-y-2">
                <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto" />
                <p className="text-blue-800 font-semibold">Interactive Map</p>
                <p className="text-blue-600 text-sm">Real-time vessel tracking</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <span className="font-medium text-blue-700">Latitude:</span>
                <span className="ml-2 font-mono">{vesselData.position.lat.toFixed(6)}°</span>
              </div>
              <div className="bg-white bg-opacity-50 rounded p-2">
                <span className="font-medium text-blue-700">Longitude:</span>
                <span className="ml-2 font-mono">{vesselData.position.lon.toFixed(6)}°</span>
              </div>
            </div>
          </div>
          
          {/* Environmental Data */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <FaWater className="text-emerald-600" />
                Environmental Data
              </h3>
              <button
                onClick={() => handleSectionToggle('environment')}
                className="text-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <FaExpand className="text-sm" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white bg-opacity-60 rounded-lg py-3 px-2">
                <FaThermometerHalf className="text-red-500 text-lg mx-auto mb-1" />
                <div className="text-xs font-medium text-emerald-700 mb-1">Sea Temp</div>
                <div className="font-bold text-emerald-800">
                  {formatValue(vesselData.environmental.seaTemperature, 'temperature')}
                </div>
              </div>
              <div className="text-center bg-white bg-opacity-60 rounded-lg py-3 px-2">
                <FaTint className="text-blue-500 text-lg mx-auto mb-1" />
                <div className="text-xs font-medium text-emerald-700 mb-1">Salinity</div>
                <div className="font-bold text-emerald-800">
                  {formatValue(vesselData.environmental.salinity, 'salinity')}
                </div>
              </div>
              <div className="text-center bg-white bg-opacity-60 rounded-lg py-3 px-2">
                <FaWind className="text-gray-500 text-lg mx-auto mb-1" />
                <div className="text-xs font-medium text-emerald-700 mb-1">Wind</div>
                <div className="font-bold text-emerald-800">
                  {vesselData.environmental.windSpeed.toFixed(1)} m/s
                </div>
              </div>
            </div>
            
            {expandedSection === 'environment' && (
              <div className="mt-4 pt-4 border-t border-emerald-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaWind className="text-gray-500" />
                      <span className="font-medium text-emerald-700 text-sm">Wind Direction</span>
                    </div>
                    <div className="font-bold text-emerald-800">
                      {vesselData.environmental.windDirection.toFixed(0)}°
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaWater className="text-blue-500" />
                      <span className="font-medium text-emerald-700 text-sm">Current Speed</span>
                    </div>
                    <div className="font-bold text-emerald-800">
                      {vesselData.environmental.currentSpeed.toFixed(2)} m/s
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Biofouling Status */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <FaAnchor className={foulingStyles.color.replace('text-', 'text-')} />
          Hull Condition & Biofouling Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <ProgressBar
              value={vesselData.biofouling.foulingPercent}
              label="Fouling Level"
              foulingClass={vesselData.biofouling.foulingClass}
              height="h-4"
            />
            <div className="text-sm text-gray-600">
              <span className="font-medium">Days since cleaning:</span>
              <span className="ml-2 font-bold">{vesselData.biofouling.daysSinceClean} days</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {formatValue(vesselData.biofouling.fuelConsumption, 'fuel')}
              </div>
              <div className="text-sm text-gray-600">Current Fuel Rate</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Last Hull Cleaning</div>
              <div className="font-bold text-gray-800">
                {new Date(vesselData.biofouling.lastCleanDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const determineVesselStatus = (record) => {
  if (record.mean_speed_knots < 1) return 'At Anchor';
  if (record.fouling_class === 'high') return 'Maintenance Required';
  if (record.mean_speed_knots > 10) return 'Under Way';
  return 'Maneuvering';
};

const generateAlerts = (record) => {
  const alerts = [];
  
  if (record.fouling_class === 'high') {
    alerts.push({
      type: 'warning',
      title: 'Hull Cleaning Required',
      message: `Current fouling level (${record.fouling_percent.toFixed(1)}%) is impacting fuel efficiency. Schedule hull cleaning soon.`
    });
  }
  
  if (record.fuel_consumption_tpd > 3.0) {
    alerts.push({
      type: 'error',
      title: 'High Fuel Consumption',
      message: `Fuel consumption (${record.fuel_consumption_tpd.toFixed(2)} tpd) is above normal operating levels.`
    });
  }
  
  if (record.days_since_clean > 90) {
    alerts.push({
      type: 'warning',
      title: 'Maintenance Overdue',
      message: `Hull cleaning is overdue by ${record.days_since_clean - 90} days.`
    });
  }
  
  return alerts;
};

export default CaptainDashboard;