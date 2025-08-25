import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Environment flag to use mock or real API
const USE_MOCK_API = true;

// Generate mock alerts
const generateMockAlerts = () => [
  {
    id: 'alert-001',
    type: 'warning',
    category: 'biofouling',
    title: 'High Biofouling Detected',
    message: 'MV Fleet Star 3 has biofouling level of 78%. Maintenance recommended.',
    vesselId: 'V003',
    severity: 'medium',
    timestamp: new Date().toISOString(),
    acknowledged: false,
    actionRequired: true,
    source: 'predictive-model'
  },
  {
    id: 'alert-002',
    type: 'error',
    category: 'maintenance',
    title: 'Overdue Maintenance',
    message: 'MV Fleet Star 7 maintenance is 15 days overdue.',
    vesselId: 'V007',
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    acknowledged: false,
    actionRequired: true,
    source: 'maintenance-scheduler'
  }
];

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateMockAlerts();
      } else {
        const response = await fetch('/api/alerts');
        if (!response.ok) throw new Error('Failed to fetch alerts');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'alerts/acknowledge',
  async (alertId, { rejectWithValue }) => {
    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { alertId, acknowledgedAt: new Date().toISOString() };
      } else {
        const response = await fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to acknowledge alert');
        return await response.json();
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  alerts: [],
  unreadCount: 0,
  categories: ['biofouling', 'maintenance', 'fuel', 'weather', 'system'],
  severityLevels: ['low', 'medium', 'high', 'critical'],
  
  // Filtering
  filters: {
    category: 'all',
    severity: 'all',
    acknowledged: 'all',
    timeRange: '24h'
  },
  
  // Settings
  settings: {
    enableNotifications: true,
    enableSound: false,
    autoAcknowledge: false,
    dismissTimeout: 30000
  },
  
  isLoading: false,
  error: null
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const newAlert = action.payload;
      
      // Check if this alert already exists (prevent duplicates)
      const existingAlert = state.alerts.find(alert => 
        alert.title === newAlert.title && 
        alert.message === newAlert.message &&
        alert.category === newAlert.category
      );
      
      // Only add if it doesn't already exist
      if (!existingAlert) {
        const alert = { ...newAlert, id: Date.now().toString() };
        state.alerts.unshift(alert);
        if (!alert.acknowledged) state.unreadCount += 1;
      }
    },
    
    removeAlert: (state, action) => {
      const alertId = action.payload;
      const alertIndex = state.alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        const alert = state.alerts[alertIndex];
        if (!alert.acknowledged) state.unreadCount -= 1;
        state.alerts.splice(alertIndex, 1);
      }
    },
    
    markAsRead: (state, action) => {
      const alertId = action.payload;
      const alert = state.alerts.find(a => a.id === alertId);
      if (alert && !alert.acknowledged) {
        alert.acknowledged = true;
        alert.acknowledgedAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.alerts.forEach(alert => {
        if (!alert.acknowledged) {
          alert.acknowledged = true;
          alert.acknowledgedAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter(a => !a.acknowledged).length;
        state.isLoading = false;
      })
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload.alertId);
        if (alert && !alert.acknowledged) {
          alert.acknowledged = true;
          alert.acknowledgedAt = action.payload.acknowledgedAt;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const {
  addAlert,
  removeAlert,
  markAsRead,
  markAllAsRead,
  setFilters,
  updateSettings,
  clearAlerts
} = alertsSlice.actions;

// Selectors
export const selectAlerts = (state) => state.alerts.alerts;
export const selectUnreadCount = (state) => state.alerts.unreadCount;
export const selectAlertFilters = (state) => state.alerts.filters;
export const selectAlertSettings = (state) => state.alerts.settings;

export const selectFilteredAlerts = (state) => {
  const { alerts, filters } = state.alerts;
  return alerts.filter(alert => {
    if (filters.category !== 'all' && alert.category !== filters.category) return false;
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.acknowledged !== 'all') {
      if (filters.acknowledged === 'read' && !alert.acknowledged) return false;
      if (filters.acknowledged === 'unread' && alert.acknowledged) return false;
    }
    return true;
  });
};

export default alertsSlice.reducer;