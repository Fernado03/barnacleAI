import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Environment flag to use mock or real API
const USE_MOCK_API = true;

// Mock fleet data generator
const generateMockFleetData = () => {
  const vessels = [];
  const vesselTypes = ['Container Ship', 'Bulk Carrier', 'Tanker', 'RoRo'];
  const operators = ['Maersk', 'MSC', 'CMA CGM', 'COSCO'];
  
  for (let i = 1; i <= 8; i++) {
    const biofoulingLevel = Math.random() * 100;
    const fuelEfficiency = 85 + Math.random() * 30;
    
    vessels.push({
      id: `V${i.toString().padStart(3, '0')}`,
      imo: `IMO${9000000 + i}`,
      name: `MV Fleet Star ${i}`,
      type: vesselTypes[Math.floor(Math.random() * vesselTypes.length)],
      operator: operators[Math.floor(Math.random() * operators.length)],
      
      status: ['Active', 'In Port', 'Maintenance'][Math.floor(Math.random() * 3)],
      currentPort: ['Singapore', 'Rotterdam', 'Los Angeles'][Math.floor(Math.random() * 3)],
      
      performance: {
        biofoulingLevel: biofoulingLevel.toFixed(1),
        fuelConsumption: fuelEfficiency.toFixed(1),
        speedReduction: (Math.random() * 15).toFixed(1),
        operationalEfficiency: (100 - Math.random() * 15).toFixed(1),
        lastUpdate: new Date().toISOString()
      },
      
      maintenance: {
        status: ['Scheduled', 'Overdue', 'Current'][Math.floor(Math.random() * 3)],
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      
      route: {
        current: `Route ${String.fromCharCode(65 + i % 26)}`,
        distance: Math.floor(Math.random() * 5000) + 1000,
        fuelEstimate: Math.floor(Math.random() * 300) + 100
      }
    });
  }
  
  return {
    vessels,
    summary: {
      totalVessels: vessels.length,
      activeVessels: vessels.filter(v => v.status === 'Active').length,
      inMaintenance: vessels.filter(v => v.status === 'Maintenance').length,
      avgBiofouling: (vessels.reduce((sum, v) => sum + parseFloat(v.performance.biofoulingLevel), 0) / vessels.length).toFixed(1),
      avgFuelEfficiency: (vessels.reduce((sum, v) => sum + parseFloat(v.performance.fuelConsumption), 0) / vessels.length).toFixed(1)
    }
  };
};

// Async thunks
export const fetchFleetData = createAsyncThunk(
  'fleet/fetchFleetData',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generateMockFleetData();
      } else {
        const response = await fetch('/api/fleet');
        if (!response.ok) throw new Error('Failed to fetch fleet data');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVesselStatus = createAsyncThunk(
  'fleet/updateVesselStatus',
  async ({ vesselId, status }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { vesselId, status, timestamp: new Date().toISOString() };
      } else {
        const response = await fetch(`/api/fleet/${vesselId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update vessel status');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scheduleMaintenanceAsync = createAsyncThunk(
  'fleet/scheduleMaintenance',
  async ({ vesselId, maintenanceData }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          vesselId,
          maintenance: {
            ...maintenanceData,
            scheduledDate: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
          }
        };
      } else {
        const response = await fetch(`/api/fleet/${vesselId}/maintenance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(maintenanceData)
        });
        if (!response.ok) throw new Error('Failed to schedule maintenance');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  vessels: [],
  summary: {
    totalVessels: 0,
    activeVessels: 0,
    inMaintenance: 0,
    avgBiofouling: 0,
    avgFuelEfficiency: 0
  },
  
  // Filtering and sorting
  filters: {
    status: 'all', // 'all', 'active', 'maintenance', 'port'
    operator: 'all',
    biofoulingLevel: 'all', // 'all', 'low', 'moderate', 'high'
    maintenanceStatus: 'all'
  },
  
  sortBy: 'name', // 'name', 'biofouling', 'efficiency', 'nextMaintenance'
  sortOrder: 'asc', // 'asc', 'desc'
  
  // Selection and bulk operations
  selectedVessels: [],
  bulkOperationInProgress: false,
  
  // Loading and error states
  isLoading: false,
  error: null,
  lastUpdate: null,
  
  // Route optimization
  routeOptimization: {
    isCalculating: false,
    results: null,
    error: null
  }
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    // Filtering
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    
    setOperatorFilter: (state, action) => {
      state.filters.operator = action.payload;
    },
    
    setBiofoulingFilter: (state, action) => {
      state.filters.biofoulingLevel = action.payload;
    },
    
    setMaintenanceFilter: (state, action) => {
      state.filters.maintenanceStatus = action.payload;
    },
    
    clearAllFilters: (state) => {
      state.filters = {
        status: 'all',
        operator: 'all', 
        biofoulingLevel: 'all',
        maintenanceStatus: 'all'
      };
    },
    
    // Sorting
    setSortBy: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order || 'asc';
    },
    
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    
    // Selection
    selectVessel: (state, action) => {
      const vesselId = action.payload;
      if (!state.selectedVessels.includes(vesselId)) {
        state.selectedVessels.push(vesselId);
      }
    },
    
    deselectVessel: (state, action) => {
      const vesselId = action.payload;
      state.selectedVessels = state.selectedVessels.filter(id => id !== vesselId);
    },
    
    selectAllVessels: (state) => {
      state.selectedVessels = state.vessels.map(vessel => vessel.id);
    },
    
    clearSelection: (state) => {
      state.selectedVessels = [];
    },
    
    // Update vessel data locally
    updateVesselPerformance: (state, action) => {
      const { vesselId, performance } = action.payload;
      const vessel = state.vessels.find(v => v.id === vesselId);
      if (vessel) {
        vessel.performance = { ...vessel.performance, ...performance };
      }
    },
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.routeOptimization.error = null;
    },
    
    // Reset fleet data
    resetFleetData: () => initialState
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Fleet Data
      .addCase(fetchFleetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFleetData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vessels = action.payload.vessels;
        state.summary = action.payload.summary;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchFleetData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Vessel Status
      .addCase(updateVesselStatus.fulfilled, (state, action) => {
        const { vesselId, status } = action.payload;
        const vessel = state.vessels.find(v => v.id === vesselId);
        if (vessel) {
          vessel.status = status;
        }
      })
      
      // Schedule Maintenance
      .addCase(scheduleMaintenanceAsync.fulfilled, (state, action) => {
        const { vesselId, maintenance } = action.payload;
        const vessel = state.vessels.find(v => v.id === vesselId);
        if (vessel) {
          vessel.maintenance = { ...vessel.maintenance, ...maintenance };
        }
      });
  }
});

// Export actions
export const {
  setStatusFilter,
  setOperatorFilter,
  setBiofoulingFilter,
  setMaintenanceFilter,
  clearAllFilters,
  setSortBy,
  toggleSortOrder,
  selectVessel,
  deselectVessel,
  selectAllVessels,
  clearSelection,
  updateVesselPerformance,
  clearError,
  resetFleetData
} = fleetSlice.actions;

// Selectors
export const selectFleetVessels = (state) => state.fleet.vessels;
export const selectFleetSummary = (state) => state.fleet.summary;
export const selectFleetFilters = (state) => state.fleet.filters;
export const selectSelectedVessels = (state) => state.fleet.selectedVessels;
export const selectFleetLoading = (state) => state.fleet.isLoading;
export const selectFleetError = (state) => state.fleet.error;

// Complex selectors
export const selectFilteredVessels = (state) => {
  const { vessels, filters, sortBy, sortOrder } = state.fleet;
  
  let filtered = vessels.filter(vessel => {
    if (filters.status !== 'all' && vessel.status.toLowerCase() !== filters.status) return false;
    if (filters.operator !== 'all' && vessel.operator !== filters.operator) return false;
    if (filters.biofoulingLevel !== 'all') {
      const level = parseFloat(vessel.performance.biofoulingLevel);
      if (filters.biofoulingLevel === 'low' && level > 30) return false;
      if (filters.biofoulingLevel === 'moderate' && (level <= 30 || level > 70)) return false;
      if (filters.biofoulingLevel === 'high' && level <= 70) return false;
    }
    return true;
  });
  
  // Sort
  filtered.sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'biofouling':
        aVal = parseFloat(a.performance.biofoulingLevel);
        bVal = parseFloat(b.performance.biofoulingLevel);
        break;
      case 'efficiency':
        aVal = parseFloat(a.performance.operationalEfficiency);
        bVal = parseFloat(b.performance.operationalEfficiency);
        break;
      case 'nextMaintenance':
        aVal = new Date(a.maintenance.nextService);
        bVal = new Date(b.maintenance.nextService);
        break;
      default:
        aVal = a.name;
        bVal = b.name;
    }
    
    if (sortOrder === 'desc') [aVal, bVal] = [bVal, aVal];
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
  
  return filtered;
};

export const selectVesselById = (state, vesselId) =>
  state.fleet.vessels.find(vessel => vessel.id === vesselId);

export const selectVesselsNeedingMaintenance = (state) =>
  state.fleet.vessels.filter(vessel => 
    vessel.maintenance.status === 'Overdue' || 
    parseFloat(vessel.performance.biofoulingLevel) > 70
  );

export const selectFleetPerformanceStats = (state) => {
  const vessels = state.fleet.vessels;
  if (vessels.length === 0) return null;
  
  const biofoulingLevels = vessels.map(v => parseFloat(v.performance.biofoulingLevel));
  const efficiencies = vessels.map(v => parseFloat(v.performance.operationalEfficiency));
  
  return {
    avgBiofouling: (biofoulingLevels.reduce((sum, val) => sum + val, 0) / vessels.length).toFixed(1),
    maxBiofouling: Math.max(...biofoulingLevels).toFixed(1),
    avgEfficiency: (efficiencies.reduce((sum, val) => sum + val, 0) / vessels.length).toFixed(1),
    minEfficiency: Math.min(...efficiencies).toFixed(1)
  };
};

export default fleetSlice.reducer;