const mongoose = require('mongoose');
const freeMaritimeAPIs = require('../services/externalAPIs/freeMaritimeAPIs');
const dynamicShipTracker = require('../services/externalAPIs/dynamicShipTracker');

// Environment flag to use real or mock API
const USE_REAL_API = process.env.USE_REAL_MARINE_DATA === 'true';

// SEA Region bounds based on enriched dataset
const SEA_REGION_BOUNDS = {
  minLat: -8.5586,   // Southernmost point (Timor-Leste)
  maxLat: 21.064,    // Northernmost point 
  minLon: 96.281,    // Westernmost point
  maxLon: 125.578    // Easternmost point (Timor-Leste)
};

// Keep mock data generators as fallback
const generateMockAISData = () => {
  const vessels = [];
  const vesselNames = [
    'MV Brunei Trader', 'MV Cambodia Express', 'SS Jakarta Pioneer', 'MV Malaysia Star',
    'MS Singapore Glory', 'MV Thailand Navigator', 'SS Philippines Dawn', 'MV Vietnam Explorer',
    'MV Myanmar Wind', 'SS Laos River', 'MV Timor Spirit', 'MS SEA Voyager'
  ];

  for (let i = 0; i < 12; i++) {
    // Generate coordinates within SEA region bounds
    const lat = SEA_REGION_BOUNDS.minLat + (Math.random() * (SEA_REGION_BOUNDS.maxLat - SEA_REGION_BOUNDS.minLat));
    const lng = SEA_REGION_BOUNDS.minLon + (Math.random() * (SEA_REGION_BOUNDS.maxLon - SEA_REGION_BOUNDS.minLon));
    
    vessels.push({
      id: `VSL-${String(i + 1).padStart(5, '0')}`,
      name: vesselNames[i],
      lat: lat,
      lng: lng,
      speed: (Math.random() * 20).toFixed(1),
      course: Math.floor(Math.random() * 360),
      status: ['Under way using engine', 'At anchor', 'Moored', 'Not under command'][Math.floor(Math.random() * 4)],
      lastUpdate: new Date().toISOString(),
      draught: (5 + Math.random() * 10).toFixed(1),
      destination: ['Singapore', 'Jakarta', 'Manila', 'Bangkok', 'Ho Chi Minh City', 'Kuala Lumpur'][Math.floor(Math.random() * 6)],
      country: ['Brunei', 'Cambodia', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Philippines', 'Vietnam', 'Myanmar', 'Laos', 'Timor-Leste'][Math.floor(Math.random() * 11)]
    });
  }

  return {
    vessels,
    totalMessages: Math.floor(Math.random() * 10000) + 50000,
    activeVessels: vessels.length,
    avgUpdateRate: '30s',
    coverage: '98.5% (SEA Region)',
    bounds: SEA_REGION_BOUNDS
  };
};

const generateMockWeatherData = () => ({
  conditions: [
    {
      location: 'Strait of Malacca',
      coordinates: { lat: 2.5, lng: 102.5 },
      windSpeed: (10 + Math.random() * 20).toFixed(1),
      windDirection: Math.floor(Math.random() * 360),
      windGust: (15 + Math.random() * 25).toFixed(1),
      waveHeight: (1 + Math.random() * 3).toFixed(1),
      waveDirection: Math.floor(Math.random() * 360),
      wavePeriod: (4 + Math.random() * 8).toFixed(1),
      visibility: (5 + Math.random() * 10).toFixed(1),
      temperature: (26 + Math.random() * 6).toFixed(1),
      humidity: Math.floor(Math.random() * 30) + 65,
      pressure: (1005 + Math.random() * 20).toFixed(1),
      cloudCover: Math.floor(Math.random() * 100),
      precipitation: (Math.random() * 5).toFixed(1),
      lastUpdate: new Date().toISOString()
    },
    {
      location: 'South China Sea (SEA)',
      coordinates: { lat: 12.0, lng: 114.0 },
      windSpeed: (15 + Math.random() * 25).toFixed(1),
      windDirection: Math.floor(Math.random() * 360),
      windGust: (20 + Math.random() * 30).toFixed(1),
      waveHeight: (2 + Math.random() * 4).toFixed(1),
      waveDirection: Math.floor(Math.random() * 360),
      wavePeriod: (5 + Math.random() * 7).toFixed(1),
      visibility: (3 + Math.random() * 12).toFixed(1),
      temperature: (28 + Math.random() * 4).toFixed(1),
      humidity: Math.floor(Math.random() * 25) + 70,
      pressure: (995 + Math.random() * 25).toFixed(1),
      cloudCover: Math.floor(Math.random() * 100),
      precipitation: (Math.random() * 10).toFixed(1),
      lastUpdate: new Date().toISOString()
    },
    {
      location: 'Java Sea',
      coordinates: { lat: -5.5, lng: 110.0 },
      windSpeed: (8 + Math.random() * 18).toFixed(1),
      windDirection: Math.floor(Math.random() * 360),
      windGust: (12 + Math.random() * 22).toFixed(1),
      waveHeight: (1.5 + Math.random() * 2.5).toFixed(1),
      waveDirection: Math.floor(Math.random() * 360),
      wavePeriod: (4 + Math.random() * 6).toFixed(1),
      visibility: (6 + Math.random() * 9).toFixed(1),
      temperature: (29 + Math.random() * 3).toFixed(1),
      humidity: Math.floor(Math.random() * 20) + 75,
      pressure: (1008 + Math.random() * 15).toFixed(1),
      cloudCover: Math.floor(Math.random() * 80),
      precipitation: (Math.random() * 8).toFixed(1),
      lastUpdate: new Date().toISOString()
    }
  ],
  forecast: {
    '24h': { windSpeed: '18.5', waveHeight: '2.1', temperature: '28.2' },
    '48h': { windSpeed: '22.1', waveHeight: '2.8', temperature: '27.7' },
    '72h': { windSpeed: '19.3', waveHeight: '2.3', temperature: '28.9' }
  },
  warnings: [],
  forecastAccuracy: '94.2%',
  region: 'Southeast Asia'
});

const generateMockOceanCurrents = () => ({
  currents: [
    {
      region: 'Malacca Strait',
      coordinates: { lat: 2.5, lng: 102.5 },
      speed: (0.5 + Math.random() * 2).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      temperature: (28 + Math.random() * 4).toFixed(1),
      salinity: (33 + Math.random() * 2).toFixed(1),
      depth: '0-50m',
      lastUpdate: new Date().toISOString()
    },
    {
      region: 'Singapore Strait',
      coordinates: { lat: 1.3, lng: 103.8 },
      speed: (0.8 + Math.random() * 2.5).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      temperature: (29 + Math.random() * 3).toFixed(1),
      salinity: (34 + Math.random() * 1.5).toFixed(1),
      depth: '0-50m',
      lastUpdate: new Date().toISOString()
    },
    {
      region: 'Java Sea',
      coordinates: { lat: -5.5, lng: 110.0 },
      speed: (0.3 + Math.random() * 1.8).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      temperature: (30 + Math.random() * 2).toFixed(1),
      salinity: (33.5 + Math.random() * 1.8).toFixed(1),
      depth: '0-50m',
      lastUpdate: new Date().toISOString()
    },
    {
      region: 'South China Sea',
      coordinates: { lat: 12.0, lng: 114.0 },
      speed: (0.6 + Math.random() * 2.2).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      temperature: (27 + Math.random() * 4).toFixed(1),
      salinity: (34.2 + Math.random() * 1.3).toFixed(1),
      depth: '0-50m',
      lastUpdate: new Date().toISOString()
    }
  ],
  modelInfo: {
    resolution: '1/12°',
    updateFrequency: '3 hours',
    dataSource: 'SEA Regional Ocean Model',
    accuracy: '92%',
    region: 'Southeast Asia Maritime Zone'
  }
});

const generateMockEnvironmentalData = () => {
  const seaTemp = 25 + Math.random() * 8;
  const salinity = 33 + Math.random() * 3;
  
  // Calculate biofouling risk based on environmental factors
  let riskLevel = 'low';
  let riskScore = 0;
  
  if (seaTemp > 25 && seaTemp < 30) riskScore += 30;
  if (seaTemp >= 30) riskScore += 50;
  if (salinity > 34) riskScore += 20;
  if (salinity > 35) riskScore += 30;
  
  if (riskScore > 60) riskLevel = 'high';
  else if (riskScore > 30) riskLevel = 'moderate';

  return {
    biofoulingFactors: {
      seaTemperature: seaTemp.toFixed(1),
      salinity: salinity.toFixed(1),
      dissolvedOxygen: (6 + Math.random() * 3).toFixed(1),
      turbidity: (5 + Math.random() * 15).toFixed(1),
      phLevel: (7.8 + Math.random() * 0.6).toFixed(2),
      nutrients: {
        nitrates: (0.1 + Math.random() * 2).toFixed(2),
        phosphates: (0.05 + Math.random() * 0.5).toFixed(3),
        silicates: (1 + Math.random() * 10).toFixed(1)
      }
    },
    biofoulingRisk: {
      level: riskLevel,
      score: riskScore,
      factors: riskLevel === 'high' ? 
        ['Optimal temperature range', 'High salinity levels', 'Nutrient rich waters'] :
        riskLevel === 'moderate' ? 
        ['Moderate temperature', 'Normal salinity levels'] :
        ['Sub-optimal conditions', 'Low nutrient levels']
    },
    waterQuality: {
      pollutionLevel: Math.random() > 0.7 ? 'moderate' : 'low',
      oilSpills: [],
      plasticDebris: (Math.random() * 50).toFixed(0)
    },
    lastAssessment: new Date().toISOString()
  };
};

// Controller functions with free API integration and SEA region focus
const getAISData = async (req, res) => {
  try {
    console.log('Fetching AIS data for SEA region...', { USE_REAL_API });
    let aisData;
    
    if (USE_REAL_API) {
      // Use free APIs with SEA region query parameters
      const { minLat = SEA_REGION_BOUNDS.minLat, maxLat = SEA_REGION_BOUNDS.maxLat, 
              minLon = SEA_REGION_BOUNDS.minLon, maxLon = SEA_REGION_BOUNDS.maxLon } = req.query;
      
      aisData = await freeMaritimeAPIs.getAISData({
        minLat: parseFloat(minLat),
        maxLat: parseFloat(maxLat),
        minLon: parseFloat(minLon),
        maxLon: parseFloat(maxLon)
      });
      
      // Enhance with dynamic tracking data if available
      const dynamicVessels = dynamicShipTracker.getAllVesselStatuses();
      if (Object.keys(dynamicVessels).length > 0) {
        aisData.dynamicTracking = {
          active: true,
          vessels: dynamicVessels,
          lastUpdate: new Date().toISOString()
        };
      }
    } else {
      // Fallback to mock data with SEA region coordinates
      await new Promise(resolve => setTimeout(resolve, 300));
      aisData = generateMockAISData();
      
      // Include dynamic tracking status
      aisData.dynamicTracking = {
        available: true,
        trackingStats: dynamicShipTracker.getTrackingStats()
      };
    }
    
    res.status(200).json({
      success: true,
      data: aisData,
      timestamp: new Date().toISOString(),
      source: USE_REAL_API ? aisData.source : 'mock',
      region: 'Southeast Asia'
    });
  } catch (error) {
    console.error('Error fetching AIS data:', error.message);
    
    // Always fallback to mock data on error
    const mockData = generateMockAISData();
    res.status(200).json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      region: 'Southeast Asia',
      error: error.message
    });
  }
};

const getWeatherData = async (req, res) => {
  try {
    console.log('Fetching weather data...', { USE_REAL_API });
    let weatherData;
    
    if (USE_REAL_API) {
      // Use free weather APIs
      weatherData = await freeMaritimeAPIs.getWeatherData();
    } else {
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 200));
      weatherData = generateMockWeatherData();
    }
    
    res.status(200).json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString(),
      source: USE_REAL_API ? weatherData.source : 'mock'
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    const mockData = generateMockWeatherData();
    res.status(200).json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: error.message
    });
  }
};
const getOceanCurrents = async (req, res) => {
  try {
    console.log('Fetching ocean currents...', { USE_REAL_API });
    let currentData;
    
    if (USE_REAL_API) {
      // Use free NOAA APIs
      currentData = await freeMaritimeAPIs.getOceanCurrents();
    } else {
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 400));
      currentData = generateMockOceanCurrents();
    }
    
    res.status(200).json({
      success: true,
      data: currentData,
      timestamp: new Date().toISOString(),
      source: USE_REAL_API ? currentData.source : 'mock'
    });
  } catch (error) {
    console.error('Error fetching ocean current data:', error.message);
    
    const mockData = generateMockOceanCurrents();
    res.status(200).json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: error.message
    });
  }
};

const getEnvironmentalData = async (req, res) => {
  try {
    console.log('Fetching environmental data...', { USE_REAL_API });
    let envData;
    
    if (USE_REAL_API) {
      // Use free environmental APIs
      envData = await freeMaritimeAPIs.getEnvironmentalData();
    } else {
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 350));
      envData = generateMockEnvironmentalData();
    }
    
    res.status(200).json({
      success: true,
      data: envData,
      timestamp: new Date().toISOString(),
      source: USE_REAL_API ? envData.source : 'mock'
    });
  } catch (error) {
    console.error('Error fetching environmental data:', error.message);
    
    const mockData = generateMockEnvironmentalData();
    res.status(200).json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: error.message
    });
  }
};

// Get all marine data in one request (for dashboard) with SEA region focus
const getAllMarineData = async (req, res) => {
  try {
    console.log('Fetching all marine data for SEA region...', { USE_REAL_API });
    let allData;
    
    if (USE_REAL_API) {
      // Use free APIs for all data types with SEA region bounds
      const { minLat = SEA_REGION_BOUNDS.minLat, maxLat = SEA_REGION_BOUNDS.maxLat, 
              minLon = SEA_REGION_BOUNDS.minLon, maxLon = SEA_REGION_BOUNDS.maxLon } = req.query;
      
      allData = await freeMaritimeAPIs.getAllMarineData({
        minLat: parseFloat(minLat),
        maxLat: parseFloat(maxLat),
        minLon: parseFloat(minLon),
        maxLon: parseFloat(maxLon)
      });
      
      // Enhance with dynamic ship tracking data
      allData.dynamicShipTracking = {
        available: true,
        activeVessels: dynamicShipTracker.getAllVesselStatuses(),
        trackingStats: dynamicShipTracker.getTrackingStats(),
        lastUpdate: new Date().toISOString()
      };
    } else {
      // Fallback to mock data with SEA region
      await new Promise(resolve => setTimeout(resolve, 500));
      allData = {
        ais: generateMockAISData(),
        weather: generateMockWeatherData(),
        oceanCurrents: generateMockOceanCurrents(),
        environmental: generateMockEnvironmentalData(),
        dynamicShipTracking: {
          available: true,
          demo: true,
          vessels: dynamicShipTracker.getAllVesselStatuses(),
          trackingStats: dynamicShipTracker.getTrackingStats()
        }
      };
    }
    
    // Add SEA region metadata
    allData.regionInfo = {
      name: 'Southeast Asia Maritime Zone',
      bounds: SEA_REGION_BOUNDS,
      countries: ['Brunei', 'Cambodia', 'Indonesia', 'Laos', 'Malaysia', 'Myanmar', 
                  'Philippines', 'Singapore', 'Thailand', 'Timor-Leste', 'Vietnam'],
      majorPorts: ['Port of Singapore', 'Tanjung Priok (Jakarta)', 'Port Klang', 
                   'Laem Chabang', 'Muara Port', 'Sihanoukville Autonomous Port'],
      coordinateRange: {
        latitude: `${SEA_REGION_BOUNDS.minLat}° to ${SEA_REGION_BOUNDS.maxLat}°`,
        longitude: `${SEA_REGION_BOUNDS.minLon}° to ${SEA_REGION_BOUNDS.maxLon}°`
      }
    };
    
    res.status(200).json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString(),
      source: USE_REAL_API ? allData.source : 'mock',
      region: 'Southeast Asia'
    });
  } catch (error) {
    console.error('Error fetching all marine data:', error.message);
    
    // Fallback to mock data on error
    const mockData = {
      ais: generateMockAISData(),
      weather: generateMockWeatherData(),
      oceanCurrents: generateMockOceanCurrents(),
      environmental: generateMockEnvironmentalData(),
      dynamicShipTracking: {
        available: true,
        error: 'Fallback mode - dynamic tracking available',
        trackingStats: dynamicShipTracker.getTrackingStats()
      },
      regionInfo: {
        name: 'Southeast Asia Maritime Zone',
        bounds: SEA_REGION_BOUNDS,
        status: 'Fallback Mode'
      }
    };
    
    res.status(200).json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      region: 'Southeast Asia',
      error: error.message
    });
  }
};

// Dynamic Ship Tracking Controller Functions

// Start tracking for a specific vessel
const startDynamicTracking = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const options = req.body || {};
    
    if (!vesselId) {
      return res.status(400).json({
        success: false,
        message: 'Vessel ID is required'
      });
    }
    
    const result = dynamicShipTracker.startTracking(vesselId, options);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      message: result.message,
      vessel: result.vessel,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting dynamic tracking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to start dynamic tracking',
      error: error.message
    });
  }
};

// Stop tracking for a specific vessel
const stopDynamicTracking = async (req, res) => {
  try {
    const { vesselId } = req.params;
    
    if (!vesselId) {
      return res.status(400).json({
        success: false,
        message: 'Vessel ID is required'
      });
    }
    
    const result = dynamicShipTracker.stopTracking(vesselId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      message: result.message,
      vessel: result.vessel,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error stopping dynamic tracking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to stop dynamic tracking',
      error: error.message
    });
  }
};

// Get status of a specific vessel
const getVesselStatus = async (req, res) => {
  try {
    const { vesselId } = req.params;
    
    if (!vesselId) {
      return res.status(400).json({
        success: false,
        message: 'Vessel ID is required'
      });
    }
    
    const vessel = dynamicShipTracker.getVesselStatus(vesselId);
    
    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vessel,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting vessel status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get vessel status',
      error: error.message
    });
  }
};

// Get all vessel statuses
const getAllVesselStatuses = async (req, res) => {
  try {
    const vessels = dynamicShipTracker.getAllVesselStatuses();
    const stats = dynamicShipTracker.getTrackingStats();
    
    res.status(200).json({
      success: true,
      data: {
        vessels,
        stats,
        region: 'Southeast Asia',
        bounds: SEA_REGION_BOUNDS
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting all vessel statuses:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get vessel statuses',
      error: error.message
    });
  }
};

// Start tracking all vessels
const startAllTracking = async (req, res) => {
  try {
    const options = req.body || {};
    const results = dynamicShipTracker.startAllTracking(options);
    
    res.status(200).json({
      success: true,
      message: 'Started tracking for all vessels',
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting all tracking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to start tracking for all vessels',
      error: error.message
    });
  }
};

// Stop tracking all vessels
const stopAllTracking = async (req, res) => {
  try {
    const results = dynamicShipTracker.stopAllTracking();
    
    res.status(200).json({
      success: true,
      message: 'Stopped tracking for all vessels',
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error stopping all tracking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to stop tracking for all vessels',
      error: error.message
    });
  }
};

// Get tracking statistics and system info
const getTrackingStats = async (req, res) => {
  try {
    const stats = dynamicShipTracker.getTrackingStats();
    
    res.status(200).json({
      success: true,
      data: {
        ...stats,
        region: 'Southeast Asia',
        dataSource: 'SEA Enriched Dataset (96,624 rows)',
        features: [
          'Real-time position interpolation',
          'Biofouling progression tracking',
          'Multi-country route simulation',
          'Port-to-port navigation',
          'Environmental data integration'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting tracking stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get tracking statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAISData,
  getWeatherData,
  getOceanCurrents,
  getEnvironmentalData,
  getAllMarineData,
  // Dynamic Ship Tracking exports
  startDynamicTracking,
  stopDynamicTracking,
  getVesselStatus,
  getAllVesselStatuses,
  startAllTracking,
  stopAllTracking,
  getTrackingStats
};