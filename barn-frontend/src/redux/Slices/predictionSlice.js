import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Environment flag to use mock or real API
const USE_MOCK_API = true;

// Mock prediction models and data
const generateMockPredictionModels = () => [
  {
    id: 'biofouling-v2.1',
    name: 'Biofouling Growth Predictor',
    type: 'biofouling',
    version: '2.1.3',
    status: 'active',
    accuracy: 94.2,
    lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    trainingSamples: 125000,
    features: ['Sea Temperature', 'Salinity', 'Vessel Speed', 'Time in Port', 'Hull Material'],
    performance: {
      precision: 0.942,
      recall: 0.936,
      f1Score: 0.939,
      mae: 2.1, // Mean Absolute Error
      rmse: 3.4 // Root Mean Square Error
    }
  },
  {
    id: 'fuel-consumption-v1.8',
    name: 'Fuel Consumption Predictor',
    type: 'fuel',
    version: '1.8.2',
    status: 'active',
    accuracy: 91.7,
    lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    trainingSamples: 89000,
    features: ['Biofouling Level', 'Weather Conditions', 'Route Distance', 'Vessel Load'],
    performance: {
      precision: 0.917,
      recall: 0.923,
      f1Score: 0.920,
      mae: 1.8,
      rmse: 2.9
    }
  },
  {
    id: 'maintenance-scheduler-v3.0',
    name: 'Maintenance Predictor',
    type: 'maintenance',
    version: '3.0.1',
    status: 'training',
    accuracy: 88.5,
    lastTrained: new Date().toISOString(),
    trainingSamples: 67000,
    features: ['Operating Hours', 'Environmental Exposure', 'Performance Degradation'],
    performance: {
      precision: 0.885,
      recall: 0.891,
      f1Score: 0.888,
      mae: 3.2,
      rmse: 4.7
    }
  }
];

const generateMockPredictions = (vesselId = null) => {
  const vessels = vesselId ? [vesselId] : ['V001', 'V002', 'V003', 'V004'];
  const predictions = [];
  
  vessels.forEach(vId => {
    // Biofouling predictions
    const biofoulingPredictions = [];
    for (let days = 7; days <= 90; days += 7) {
      const baseLevel = 20 + Math.random() * 60;
      biofoulingPredictions.push({
        timeframe: `${days}d`,
        predicted: (baseLevel + (days / 7) * 2).toFixed(1),
        confidence: (0.85 + Math.random() * 0.14).toFixed(2),
        factors: ['Sea temperature rising', 'Extended time in port'],
        recommendation: baseLevel > 50 ? 'Schedule cleaning' : 'Monitor closely'
      });
    }
    
    // Fuel consumption predictions
    const currentBiofouling = 30 + Math.random() * 40;
    const baseFuel = 85 + Math.random() * 25;
    const fuelPredictions = [];
    
    for (let days = 7; days <= 30; days += 7) {
      const fuelIncrease = (currentBiofouling / 100) * baseFuel * 0.3;
      fuelPredictions.push({
        timeframe: `${days}d`,
        predicted: (baseFuel + fuelIncrease).toFixed(1),
        baseline: baseFuel.toFixed(1),
        increase: fuelIncrease.toFixed(1),
        confidence: (0.88 + Math.random() * 0.11).toFixed(2)
      });
    }
    
    predictions.push({
      vesselId: vId,
      vesselName: `MV Fleet Star ${vId.slice(-1)}`,
      timestamp: new Date().toISOString(),
      biofouling: {
        current: currentBiofouling.toFixed(1),
        predictions: biofoulingPredictions,
        riskLevel: currentBiofouling > 60 ? 'high' : currentBiofouling > 30 ? 'moderate' : 'low'
      },
      fuelConsumption: {
        current: baseFuel.toFixed(1),
        predictions: fuelPredictions,
        potentialSavings: (baseFuel * 0.15).toFixed(1)
      },
      maintenance: {
        nextRequired: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
        urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        estimatedCost: Math.floor(50000 + Math.random() * 200000),
        confidence: (0.82 + Math.random() * 0.16).toFixed(2)
      }
    });
  });
  
  return predictions;
};

// Async thunks
export const fetchPredictionModels = createAsyncThunk(
  'predictions/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockPredictionModels();
      } else {
        const response = await fetch('/api/predictions/models');
        if (!response.ok) throw new Error('Failed to fetch prediction models');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generatePredictions = createAsyncThunk(
  'predictions/generate',
  async ({ vesselIds, timeframe = '30d' }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const predictions = vesselIds ? 
          vesselIds.map(id => generateMockPredictions(id)[0]) :
          generateMockPredictions();
        return { predictions, timeframe };
      } else {
        const response = await fetch('/api/predictions/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vesselIds, timeframe })
        });
        if (!response.ok) throw new Error('Failed to generate predictions');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const trainModel = createAsyncThunk(
  'predictions/trainModel',
  async ({ modelId, trainingData }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
          modelId,
          status: 'completed',
          accuracy: 90 + Math.random() * 8,
          trainingSamples: trainingData?.samples || 50000 + Math.random() * 50000,
          trainingTime: '45 minutes',
          completedAt: new Date().toISOString()
        };
      } else {
        const response = await fetch(`/api/predictions/models/${modelId}/train`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trainingData)
        });
        if (!response.ok) throw new Error('Failed to start model training');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Models
  models: [],
  activeModel: null,
  
  // Predictions
  predictions: [],
  currentPredictions: null,
  
  // Model training
  training: {
    inProgress: false,
    modelId: null,
    progress: 0,
    eta: null,
    error: null
  },
  
  // Prediction settings
  settings: {
    defaultTimeframe: '30d',
    confidenceThreshold: 0.8,
    autoUpdate: true,
    updateInterval: 3600000, // 1 hour
    includedFactors: ['biofouling', 'fuel', 'maintenance']
  },
  
  // Historical data
  history: {
    predictions: [],
    accuracy: {
      biofouling: 0,
      fuel: 0,
      maintenance: 0
    },
    trends: []
  },
  
  // Loading and error states
  isLoading: false,
  isGenerating: false,
  error: null,
  lastUpdate: null
};

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    // Model management
    setActiveModel: (state, action) => {
      state.activeModel = action.payload;
    },
    
    // Settings
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    setDefaultTimeframe: (state, action) => {
      state.settings.defaultTimeframe = action.payload;
    },
    
    setConfidenceThreshold: (state, action) => {
      state.settings.confidenceThreshold = action.payload;
    },
    
    toggleAutoUpdate: (state) => {
      state.settings.autoUpdate = !state.settings.autoUpdate;
    },
    
    setIncludedFactors: (state, action) => {
      state.settings.includedFactors = action.payload;
    },
    
    // Predictions management
    clearPredictions: (state) => {
      state.predictions = [];
      state.currentPredictions = null;
    },
    
    updatePredictionStatus: (state, action) => {
      const { vesselId, status } = action.payload;
      const prediction = state.predictions.find(p => p.vesselId === vesselId);
      if (prediction) {
        prediction.status = status;
      }
    },
    
    // Training progress
    updateTrainingProgress: (state, action) => {
      const { progress, eta } = action.payload;
      state.training.progress = progress;
      state.training.eta = eta;
    },
    
    // Historical data
    addToHistory: (state, action) => {
      const { prediction, actual } = action.payload;
      state.history.predictions.push({
        prediction,
        actual,
        timestamp: new Date().toISOString(),
        accuracy: Math.abs(prediction - actual) / prediction
      });
      
      // Keep only last 1000 entries
      if (state.history.predictions.length > 1000) {
        state.history.predictions = state.history.predictions.slice(-1000);
      }
    },
    
    updateAccuracyMetrics: (state, action) => {
      state.history.accuracy = { ...state.history.accuracy, ...action.payload };
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
      state.training.error = null;
    },
    
    // Reset
    resetPredictions: () => initialState
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Models
      .addCase(fetchPredictionModels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPredictionModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
        // Set first active model as default
        if (action.payload.length > 0 && !state.activeModel) {
          state.activeModel = action.payload.find(m => m.status === 'active')?.id || action.payload[0].id;
        }
      })
      .addCase(fetchPredictionModels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Generate Predictions
      .addCase(generatePredictions.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generatePredictions.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.predictions = action.payload.predictions;
        state.currentPredictions = {
          timeframe: action.payload.timeframe,
          generatedAt: new Date().toISOString(),
          count: action.payload.predictions.length
        };
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(generatePredictions.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload;
      })
      
      // Train Model
      .addCase(trainModel.pending, (state, action) => {
        state.training.inProgress = true;
        state.training.modelId = action.meta.arg.modelId;
        state.training.progress = 0;
        state.training.error = null;
      })
      .addCase(trainModel.fulfilled, (state, action) => {
        state.training.inProgress = false;
        state.training.progress = 100;
        
        // Update model with new training results
        const model = state.models.find(m => m.id === action.payload.modelId);
        if (model) {
          model.accuracy = action.payload.accuracy;
          model.lastTrained = action.payload.completedAt;
          model.trainingSamples = action.payload.trainingSamples;
          model.status = 'active';
        }
      })
      .addCase(trainModel.rejected, (state, action) => {
        state.training.inProgress = false;
        state.training.error = action.payload;
      });
  }
});

// Export actions
export const {
  setActiveModel,
  updateSettings,
  setDefaultTimeframe,
  setConfidenceThreshold,
  toggleAutoUpdate,
  setIncludedFactors,
  clearPredictions,
  updatePredictionStatus,
  updateTrainingProgress,
  addToHistory,
  updateAccuracyMetrics,
  clearError,
  resetPredictions
} = predictionsSlice.actions;

// Selectors
export const selectPredictionModels = (state) => state.predictions.models;
export const selectActiveModel = (state) => state.predictions.activeModel;
export const selectPredictions = (state) => state.predictions.predictions;
export const selectCurrentPredictions = (state) => state.predictions.currentPredictions;
export const selectPredictionSettings = (state) => state.predictions.settings;
export const selectTrainingStatus = (state) => state.predictions.training;
export const selectPredictionHistory = (state) => state.predictions.history;
export const selectPredictionsLoading = (state) => state.predictions.isGenerating;
export const selectPredictionsError = (state) => state.predictions.error;

// Complex selectors
export const selectActiveModelDetails = (state) => {
  const activeId = state.predictions.activeModel;
  return state.predictions.models.find(model => model.id === activeId);
};

export const selectPredictionsByVessel = (state, vesselId) =>
  state.predictions.predictions.find(p => p.vesselId === vesselId);

export const selectHighRiskVessels = (state) =>
  state.predictions.predictions.filter(p => p.biofouling.riskLevel === 'high');

export const selectPredictionsByType = (state, type) => {
  return state.predictions.predictions.map(p => ({
    vesselId: p.vesselId,
    vesselName: p.vesselName,
    prediction: p[type],
    timestamp: p.timestamp
  }));
};

export const selectModelPerformanceStats = (state) => {
  const models = state.predictions.models;
  if (models.length === 0) return null;
  
  return {
    avgAccuracy: (models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1),
    bestModel: models.reduce((best, current) => current.accuracy > best.accuracy ? current : best),
    activeModels: models.filter(m => m.status === 'active').length,
    totalSamples: models.reduce((sum, m) => sum + m.trainingSamples, 0)
  };
};

export const selectPredictionAccuracy = (state) => {
  const history = state.predictions.history.predictions;
  if (history.length === 0) return null;
  
  const recent = history.slice(-100); // Last 100 predictions
  const avgAccuracy = recent.reduce((sum, h) => sum + (1 - h.accuracy), 0) / recent.length;
  
  return {
    overall: (avgAccuracy * 100).toFixed(1),
    sampleSize: recent.length,
    trend: recent.length > 50 ? 
      recent.slice(-25).reduce((sum, h) => sum + (1 - h.accuracy), 0) / 25 > 
      recent.slice(-50, -25).reduce((sum, h) => sum + (1 - h.accuracy), 0) / 25 ? 'improving' : 'declining' 
      : 'stable'
  };
};

export default predictionsSlice.reducer;