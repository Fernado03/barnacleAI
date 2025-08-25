import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Environment flag to use mock or real API
const USE_MOCK_API = true;

// Generate mock ESG data
const generateMockESGData = () => ({
  environmental: {
    carbonFootprint: {
      total: 45200 + Math.random() * 5000,
      perVessel: 3200 + Math.random() * 500,
      reduction: 12.5 + Math.random() * 5,
      target: 50000,
      lastUpdate: new Date().toISOString()
    },
    fuelEfficiency: {
      average: 85.2 + Math.random() * 10,
      improvement: 8.3 + Math.random() * 3,
      target: 90,
      bestPerformer: 'MV Fleet Star 2'
    },
    wasteManagement: {
      recyclingRate: 78.5 + Math.random() * 15,
      wasteReduced: 145 + Math.random() * 50,
      target: 85
    }
  },
  social: {
    crewWelfare: {
      satisfactionScore: 8.2 + Math.random() * 1.5,
      trainingHours: 2840 + Math.random() * 500,
      safetyIncidents: Math.floor(Math.random() * 3),
      diversityIndex: 0.72 + Math.random() * 0.2
    },
    communityImpact: {
      localEmployment: 340 + Math.random() * 50,
      communityInvestment: 125000 + Math.random() * 25000,
      volunteering: 145 + Math.random() * 30
    }
  },
  governance: {
    compliance: {
      regulatoryScore: 94.5 + Math.random() * 4,
      auditResults: 'Excellent',
      violations: 0,
      certifications: ['ISO 14001', 'IMO 2020', 'MLC 2006']
    },
    transparency: {
      reportingScore: 91.2 + Math.random() * 6,
      stakeholderEngagement: 87.5 + Math.random() * 8,
      dataQuality: 95.1 + Math.random() * 3
    }
  },
  overall: {
    esgScore: 82.4 + Math.random() * 10,
    rating: 'A-',
    trend: 'improving',
    lastAssessment: new Date().toISOString()
  }
});

export const fetchESGData = createAsyncThunk(
  'esg/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockESGData();
      } else {
        const response = await fetch('/api/esg');
        if (!response.ok) throw new Error('Failed to fetch ESG data');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateESGTargets = createAsyncThunk(
  'esg/updateTargets',
  async (targets, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { targets, updatedAt: new Date().toISOString() };
      } else {
        const response = await fetch('/api/esg/targets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targets)
        });
        if (!response.ok) throw new Error('Failed to update ESG targets');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: {
    environmental: null,
    social: null,
    governance: null,
    overall: null
  },
  
  targets: {
    carbonReduction: 15,
    fuelEfficiency: 90,
    recyclingRate: 85,
    safetyIncidents: 0,
    complianceScore: 95
  },
  
  reports: [],
  
  settings: {
    reportingPeriod: 'quarterly',
    includeVesselLevel: true,
    autoGenerate: false
  },
  
  isLoading: false,
  error: null,
  lastUpdate: null
};

const esgSlice = createSlice({
  name: 'esg',
  initialState,
  reducers: {
    updateTargets: (state, action) => {
      state.targets = { ...state.targets, ...action.payload };
    },
    
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    addReport: (state, action) => {
      state.reports.unshift(action.payload);
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchESGData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchESGData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchESGData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateESGTargets.fulfilled, (state, action) => {
        state.targets = { ...state.targets, ...action.payload.targets };
      });
  }
});

export const { updateTargets, updateSettings, addReport, clearError } = esgSlice.actions;

// Selectors
export const selectESGData = (state) => state.esg.data;
export const selectESGTargets = (state) => state.esg.targets;
export const selectESGSettings = (state) => state.esg.settings;
export const selectESGLoading = (state) => state.esg.isLoading;
export const selectESGError = (state) => state.esg.error;

export const selectESGScore = (state) => state.esg.data.overall?.esgScore || 0;
export const selectEnvironmentalScore = (state) => {
  const env = state.esg.data.environmental;
  if (!env) return 0;
  
  const carbonScore = Math.max(0, (1 - env.carbonFootprint.total / env.carbonFootprint.target) * 100);
  const fuelScore = (env.fuelEfficiency.average / env.fuelEfficiency.target) * 100;
  const wasteScore = (env.wasteManagement.recyclingRate / env.wasteManagement.target) * 100;
  
  return ((carbonScore + fuelScore + wasteScore) / 3).toFixed(1);
};

export default esgSlice.reducer;