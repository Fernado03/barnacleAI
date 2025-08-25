import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Environment flag to use mock or real API
const USE_MOCK_API = true;

// Mock data generators for development
const generateMockAISData = () => {
  const vessels = [];
  const vesselNames = [
    'MV Pacific Star', 'MV Atlantic Dawn', 'SS Northern Light', 'MV Southern Cross',
    'MS Ocean Explorer', 'MV Baltic Wind', 'SS Arctic Fox', 'MV Mediterranean Pearl'
  ];

  for (let i = 0; i < 8; i++) {
    vessels.push({
      id: `IMO${9234567 + i}`,
      name: vesselNames[i],
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      speed: (Math.random() * 20).toFixed(1),
      course: Math.floor(Math.random() * 360),
      status: ['Under way using engine', 'At anchor', 'Moored', 'Not under command'][Math.floor(Math.random() * 4)],
      lastUpdate: new Date().toISOString(),
      draught: (5 + Math.random() * 10).toFixed(1),
      destination: ['Singapore', 'Rotterdam', 'Los Angeles', 'Shanghai'][Math.floor(Math.random() * 4)]
    });
  }

  return {
    vessels,
    totalMessages: Math.floor(Math.random() * 10000) + 50000,
    activeVessels: vessels.length,
    avgUpdateRate: '30s',
    coverage: '98.5%'
  };
};

const generateMockWeatherData = () => ({
  conditions: [
    {
      location: 'Singapore Strait',
      coordinates: { lat: 1.2966, lng: 103.8522 },
      windSpeed: (10 + Math.random() * 20).toFixed(1),
      windDirection: Math.floor(Math.random() * 360),
      windGust: (15 + Math.random() * 25).toFixed(1),
      waveHeight: (1 + Math.random() * 3).toFixed(1),
      waveDirection: Math.floor(Math.random() * 360),
      wavePeriod: (4 + Math.random() * 8).toFixed(1),
      visibility: (5 + Math.random() * 10).toFixed(1),
      temperature: (25 + Math.random() * 10).toFixed(1),
      humidity: Math.floor(Math.random() * 30) + 60,
      pressure: (1005 + Math.random() * 20).toFixed(1),
      cloudCover: Math.floor(Math.random() * 100),
      precipitation: (Math.random() * 5).toFixed(1),
      lastUpdate: new Date().toISOString()
    },
    {
      location: 'North Sea',
      coordinates: { lat: 56.0, lng: 3.0 },
      windSpeed: (15 + Math.random() * 25).toFixed(1),
      windDirection: Math.floor(Math.random() * 360),
      windGust: (20 + Math.random() * 30).toFixed(1),
      waveHeight: (2 + Math.random() * 4).toFixed(1),
      waveDirection: Math.floor(Math.random() * 360),
      wavePeriod: (5 + Math.random() * 7).toFixed(1),
      visibility: (3 + Math.random() * 12).toFixed(1),
      temperature: (8 + Math.random() * 12).toFixed(1),
      humidity: Math.floor(Math.random() * 25) + 70,
      pressure: (995 + Math.random() * 25).toFixed(1),
      cloudCover: Math.floor(Math.random() * 100),
      precipitation: (Math.random() * 10).toFixed(1),
      lastUpdate: new Date().toISOString()
    }
  ],
  forecast: {
    '24h': { windSpeed: '18.5', waveHeight: '2.1', temperature: '16.2' },
    '48h': { windSpeed: '22.1', waveHeight: '2.8', temperature: '14.7' },
    '72h': { windSpeed: '19.3', waveHeight: '2.3', temperature: '15.9' }
  },
  warnings: [],
  forecastAccuracy: '94.2%'
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
      region: 'English Channel',
      coordinates: { lat: 50.5, lng: 1.0 },
      speed: (0.8 + Math.random() * 2.5).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      temperature: (12 + Math.random() * 6).toFixed(1),
      salinity: (34 + Math.random() * 1.5).toFixed(1),
      depth: '0-50m',
      lastUpdate: new Date().toISOString()
    }
  ],
  modelInfo: {
    resolution: '1/12°',
    updateFrequency: '3 hours',
    dataSource: 'HYCOM Global Ocean Model',
    accuracy: '92%'
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

// Async thunks for fetching marine data
export const fetchAISData = createAsyncThunk(
  'marineData/fetchAISData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockAISData();
      } else {
        const response = await fetch('/api/marine-data/ais');
        if (!response.ok) {
          throw new Error('Failed to fetch AIS data');
        }
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch AIS data');
    }
  }
);

export const fetchWeatherData = createAsyncThunk(
  'marineData/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockWeatherData();
      } else {
        const response = await fetch('/api/marine-data/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

export const fetchOceanCurrentsData = createAsyncThunk(
  'marineData/fetchOceanCurrentsData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return generateMockOceanCurrents();
      } else {
        const response = await fetch('/api/marine-data/currents');
        if (!response.ok) {
          throw new Error('Failed to fetch ocean currents data');
        }
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ocean currents data');
    }
  }
);

export const fetchEnvironmentalData = createAsyncThunk(
  'marineData/fetchEnvironmentalData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateMockEnvironmentalData();
      } else {
        const response = await fetch('/api/marine-data/environmental');
        if (!response.ok) {
          throw new Error('Failed to fetch environmental data');
        }
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch environmental data');
    }
  }
);

export const fetchAllMarineData = createAsyncThunk(
  'marineData/fetchAllMarineData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const promises = [
        dispatch(fetchAISData()),
        dispatch(fetchWeatherData()),
        dispatch(fetchOceanCurrentsData()),
        dispatch(fetchEnvironmentalData())
      ];
      
      const results = await Promise.allSettled(promises);
      
      // Check if any requests failed
      const failed = results.filter(result => result.status === 'rejected');
      if (failed.length > 0) {
        console.warn(`${failed.length} data sources failed to load`);
      }
      
      return {
        success: results.filter(result => result.status === 'fulfilled').length,
        total: results.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch marine data');
    }
  }
);

const initialState = {
  // AIS Data
  ais: {
    vessels: [],
    totalMessages: 0,
    activeVessels: 0,
    avgUpdateRate: null,
    coverage: null,
    isLoading: false,
    error: null,
    lastUpdate: null
  },
  
  // Weather Data
  weather: {
    conditions: [],
    forecast: null,
    warnings: [],
    forecastAccuracy: null,
    isLoading: false,
    error: null,
    lastUpdate: null
  },
  
  // Ocean Currents Data
  oceanCurrents: {
    currents: [],
    modelInfo: null,
    isLoading: false,
    error: null,
    lastUpdate: null
  },
  
  // Environmental Data
  environmental: {
    biofoulingFactors: null,
    biofoulingRisk: null,
    waterQuality: null,
    isLoading: false,
    error: null,
    lastUpdate: null
  },
  
  // Connection and refresh management
  connection: {
    status: 'disconnected', // 'connected', 'connecting', 'disconnected', 'error'
    quality: 'good', // 'excellent', 'good', 'poor'
    lastSync: null,
    retryCount: 0,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  },
  
  // Data freshness and quality
  dataQuality: {
    overall: 'good',
    aisQuality: 'good',
    weatherQuality: 'good',
    currentQuality: 'good',
    environmentalQuality: 'good'
  },
  
  // Global loading and error states
  isLoading: false,
  error: null,
  lastRefresh: null
};

const marineDataSlice = createSlice({
  name: 'marineData',
  initialState,
  reducers: {
    // Connection management
    setConnectionStatus: (state, action) => {
      state.connection.status = action.payload;
      if (action.payload === 'connected') {
        state.connection.lastSync = new Date().toISOString();
        state.connection.retryCount = 0;
      }
    },
    
    setConnectionQuality: (state, action) => {
      state.connection.quality = action.payload;
    },
    
    incrementRetryCount: (state) => {
      state.connection.retryCount += 1;
    },
    
    resetRetryCount: (state) => {
      state.connection.retryCount = 0;
    },
    
    // Auto-refresh management
    toggleAutoRefresh: (state) => {
      state.connection.autoRefresh = !state.connection.autoRefresh;
    },
    
    setRefreshInterval: (state, action) => {
      state.connection.refreshInterval = action.payload;
    },
    
    // Data quality management
    updateDataQuality: (state, action) => {
      const { source, quality } = action.payload;
      state.dataQuality[`${source}Quality`] = quality;
      
      // Calculate overall quality
      const qualities = [
        state.dataQuality.aisQuality,
        state.dataQuality.weatherQuality,
        state.dataQuality.currentQuality,
        state.dataQuality.environmentalQuality
      ];
      
      const qualityScores = qualities.map(q => 
        q === 'excellent' ? 3 : q === 'good' ? 2 : q === 'poor' ? 1 : 0
      );
      
      const avgScore = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
      
      if (avgScore >= 2.5) state.dataQuality.overall = 'excellent';
      else if (avgScore >= 1.5) state.dataQuality.overall = 'good';
      else state.dataQuality.overall = 'poor';
    },
    
    // Clear errors
    clearError: (state, action) => {
      if (action.payload) {
        const source = action.payload;
        if (state[source]) {
          state[source].error = null;
        }
      } else {
        state.error = null;
        state.ais.error = null;
        state.weather.error = null;
        state.oceanCurrents.error = null;
        state.environmental.error = null;
      }
    },
    
    // Update last refresh timestamp
    updateLastRefresh: (state) => {
      state.lastRefresh = new Date().toISOString();
    },
    
    // Reset all marine data
    resetMarineData: () => initialState
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch AIS Data
      .addCase(fetchAISData.pending, (state) => {
        state.ais.isLoading = true;
        state.ais.error = null;
      })
      .addCase(fetchAISData.fulfilled, (state, action) => {
        state.ais.isLoading = false;
        state.ais.vessels = action.payload.vessels;
        state.ais.totalMessages = action.payload.totalMessages;
        state.ais.activeVessels = action.payload.activeVessels;
        state.ais.avgUpdateRate = action.payload.avgUpdateRate;
        state.ais.coverage = action.payload.coverage;
        state.ais.lastUpdate = new Date().toISOString();
        state.ais.error = null;
      })
      .addCase(fetchAISData.rejected, (state, action) => {
        state.ais.isLoading = false;
        state.ais.error = action.payload;
      })
      
      // Fetch Weather Data
      .addCase(fetchWeatherData.pending, (state) => {
        state.weather.isLoading = true;
        state.weather.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.weather.isLoading = false;
        state.weather.conditions = action.payload.conditions;
        state.weather.forecast = action.payload.forecast;
        state.weather.warnings = action.payload.warnings;
        state.weather.forecastAccuracy = action.payload.forecastAccuracy;
        state.weather.lastUpdate = new Date().toISOString();
        state.weather.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.weather.isLoading = false;
        state.weather.error = action.payload;
      })
      
      // Fetch Ocean Currents Data
      .addCase(fetchOceanCurrentsData.pending, (state) => {
        state.oceanCurrents.isLoading = true;
        state.oceanCurrents.error = null;
      })
      .addCase(fetchOceanCurrentsData.fulfilled, (state, action) => {
        state.oceanCurrents.isLoading = false;
        state.oceanCurrents.currents = action.payload.currents;
        state.oceanCurrents.modelInfo = action.payload.modelInfo;
        state.oceanCurrents.lastUpdate = new Date().toISOString();
        state.oceanCurrents.error = null;
      })
      .addCase(fetchOceanCurrentsData.rejected, (state, action) => {
        state.oceanCurrents.isLoading = false;
        state.oceanCurrents.error = action.payload;
      })
      
      // Fetch Environmental Data
      .addCase(fetchEnvironmentalData.pending, (state) => {
        state.environmental.isLoading = true;
        state.environmental.error = null;
      })
      .addCase(fetchEnvironmentalData.fulfilled, (state, action) => {
        state.environmental.isLoading = false;
        state.environmental.biofoulingFactors = action.payload.biofoulingFactors;
        state.environmental.biofoulingRisk = action.payload.biofoulingRisk;
        state.environmental.waterQuality = action.payload.waterQuality;
        state.environmental.lastUpdate = new Date().toISOString();
        state.environmental.error = null;
      })
      .addCase(fetchEnvironmentalData.rejected, (state, action) => {
        state.environmental.isLoading = false;
        state.environmental.error = action.payload;
      })
      
      // Fetch All Marine Data
      .addCase(fetchAllMarineData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.connection.status = 'connecting';
      })
      .addCase(fetchAllMarineData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastRefresh = action.payload.timestamp;
        state.connection.status = 'connected';
        state.connection.lastSync = action.payload.timestamp;
        state.error = null;
      })
      .addCase(fetchAllMarineData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.connection.status = 'error';
      });
  }
});

// Export actions
export const {
  setConnectionStatus,
  setConnectionQuality,
  incrementRetryCount,
  resetRetryCount,
  toggleAutoRefresh,
  setRefreshInterval,
  updateDataQuality,
  clearError,
  updateLastRefresh,
  resetMarineData
} = marineDataSlice.actions;

// Selectors
export const selectAISData = (state) => state.marineData.ais;
export const selectWeatherData = (state) => state.marineData.weather;
export const selectOceanCurrentsData = (state) => state.marineData.oceanCurrents;
export const selectEnvironmentalData = (state) => state.marineData.environmental;
export const selectConnectionStatus = (state) => state.marineData.connection;
export const selectDataQuality = (state) => state.marineData.dataQuality;
export const selectMarineDataLoading = (state) => state.marineData.isLoading;
export const selectMarineDataError = (state) => state.marineData.error;
export const selectLastRefresh = (state) => state.marineData.lastRefresh;

// Complex selectors
export const selectActiveVessels = (state) => state.marineData.ais.vessels || [];
export const selectVesselById = (state, vesselId) => 
  state.marineData.ais.vessels?.find(vessel => vessel.id === vesselId);

export const selectWeatherByLocation = (state, location) =>
  state.marineData.weather.conditions?.find(condition => condition.location === location);

export const selectCurrentsByRegion = (state, region) =>
  state.marineData.oceanCurrents.currents?.find(current => current.region === region);

export const selectBiofoulingRiskLevel = (state) => 
  state.marineData.environmental.biofoulingRisk?.level || 'unknown';

export const selectOverallDataHealth = (state) => {
  const { ais, weather, oceanCurrents, environmental, connection } = state.marineData;
  
  const sourceHealth = [
    ais.error ? 'error' : ais.isLoading ? 'loading' : 'healthy',
    weather.error ? 'error' : weather.isLoading ? 'loading' : 'healthy',
    oceanCurrents.error ? 'error' : oceanCurrents.isLoading ? 'loading' : 'healthy',
    environmental.error ? 'error' : environmental.isLoading ? 'loading' : 'healthy'
  ];
  
  const errorCount = sourceHealth.filter(status => status === 'error').length;
  const loadingCount = sourceHealth.filter(status => status === 'loading').length;
  
  if (errorCount === 4) return 'critical';
  if (errorCount >= 2) return 'degraded';
  if (loadingCount >= 2) return 'loading';
  if (connection.status === 'connected') return 'healthy';
  
  return 'unknown';
};

export default marineDataSlice.reducer;