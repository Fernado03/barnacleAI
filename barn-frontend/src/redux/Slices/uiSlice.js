import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Theme and appearance
  theme: 'light', // 'light', 'dark', 'auto'
  colorScheme: 'blue', // 'blue', 'teal', 'green', 'purple'
  compactMode: false,
  
  // Dashboard layouts
  dashboardLayouts: {
    captain: {
      widgets: ['performance', 'alerts', 'weather', 'route'],
      layout: 'grid',
      columns: 2
    },
    fleetOperator: {
      widgets: ['fleet-overview', 'maintenance', 'analytics', 'costs'],
      layout: 'grid',
      columns: 3
    },
    analytics: {
      widgets: ['charts', 'kpis', 'predictions', 'reports'],
      layout: 'flexible',
      columns: 2
    }
  },
  
  // Filters and time ranges
  globalFilters: {
    dateRange: {
      start: null,
      end: null,
      preset: '30d' // '7d', '30d', '90d', '1y', 'custom'
    },
    regions: [],
    vesselTypes: [],
    operators: []
  },
  
  // Navigation and layout
  sidebar: {
    collapsed: false,
    pinned: true,
    width: 280
  },
  
  navigation: {
    breadcrumbs: [],
    activeSection: 'home',
    recentPages: []
  },
  
  // Modal and overlay states
  modals: {
    vesselDetails: { open: false, vesselId: null },
    maintenanceSchedule: { open: false, data: null },
    settings: { open: false, tab: 'general' },
    help: { open: false, topic: null }
  },
  
  // Notifications and feedback
  notifications: {
    position: 'top-right',
    duration: 5000,
    showToast: true,
    enableSound: false
  },
  
  // Data display preferences
  dataDisplay: {
    defaultTimeframe: '30d',
    chartType: 'line', // 'line', 'bar', 'area'
    showConfidence: true,
    showTrends: true,
    refreshInterval: 30000,
    autoRefresh: true
  },
  
  // Performance and accessibility
  performance: {
    enableAnimations: true,
    lazyLoading: true,
    cacheSize: 50
  },
  
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    fontSize: 'medium', // 'small', 'medium', 'large'
    keyboardNavigation: true
  },
  
  // Loading states
  loadingStates: {
    global: false,
    dashboard: false,
    navigation: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme and appearance
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload;
    },
    
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
    },
    
    // Dashboard layout management
    updateDashboardLayout: (state, action) => {
      const { dashboard, layout } = action.payload;
      if (state.dashboardLayouts[dashboard]) {
        state.dashboardLayouts[dashboard] = { ...state.dashboardLayouts[dashboard], ...layout };
      }
    },
    
    addDashboardWidget: (state, action) => {
      const { dashboard, widget } = action.payload;
      if (state.dashboardLayouts[dashboard] && !state.dashboardLayouts[dashboard].widgets.includes(widget)) {
        state.dashboardLayouts[dashboard].widgets.push(widget);
      }
    },
    
    removeDashboardWidget: (state, action) => {
      const { dashboard, widget } = action.payload;
      if (state.dashboardLayouts[dashboard]) {
        state.dashboardLayouts[dashboard].widgets = 
          state.dashboardLayouts[dashboard].widgets.filter(w => w !== widget);
      }
    },
    
    reorderDashboardWidgets: (state, action) => {
      const { dashboard, widgets } = action.payload;
      if (state.dashboardLayouts[dashboard]) {
        state.dashboardLayouts[dashboard].widgets = widgets;
      }
    },
    
    // Global filters
    setDateRange: (state, action) => {
      const { start, end, preset } = action.payload;
      state.globalFilters.dateRange = { start, end, preset };
    },
    
    setRegionFilters: (state, action) => {
      state.globalFilters.regions = action.payload;
    },
    
    setVesselTypeFilters: (state, action) => {
      state.globalFilters.vesselTypes = action.payload;
    },
    
    setOperatorFilters: (state, action) => {
      state.globalFilters.operators = action.payload;
    },
    
    clearGlobalFilters: (state) => {
      state.globalFilters = {
        dateRange: { start: null, end: null, preset: '30d' },
        regions: [],
        vesselTypes: [],
        operators: []
      };
    },
    
    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebar.collapsed = action.payload;
    },
    
    toggleSidebarPin: (state) => {
      state.sidebar.pinned = !state.sidebar.pinned;
    },
    
    setSidebarWidth: (state, action) => {
      state.sidebar.width = action.payload;
    },
    
    // Navigation
    setActiveSection: (state, action) => {
      state.navigation.activeSection = action.payload;
    },
    
    updateBreadcrumbs: (state, action) => {
      state.navigation.breadcrumbs = action.payload;
    },
    
    addRecentPage: (state, action) => {
      const page = action.payload;
      state.navigation.recentPages = [
        page,
        ...state.navigation.recentPages.filter(p => p.path !== page.path)
      ].slice(0, 10); // Keep only 10 recent pages
    },
    
    // Modal management
    openModal: (state, action) => {
      const { modal, data } = action.payload;
      if (state.modals[modal]) {
        state.modals[modal] = { open: true, ...data };
      }
    },
    
    closeModal: (state, action) => {
      const modal = action.payload;
      if (state.modals[modal]) {
        state.modals[modal] = { open: false };
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = { open: false };
      });
    },
    
    // Notification preferences
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    
    // Data display preferences
    updateDataDisplaySettings: (state, action) => {
      state.dataDisplay = { ...state.dataDisplay, ...action.payload };
    },
    
    setDefaultTimeframe: (state, action) => {
      state.dataDisplay.defaultTimeframe = action.payload;
    },
    
    setChartType: (state, action) => {
      state.dataDisplay.chartType = action.payload;
    },
    
    toggleAutoRefresh: (state) => {
      state.dataDisplay.autoRefresh = !state.dataDisplay.autoRefresh;
    },
    
    setRefreshInterval: (state, action) => {
      state.dataDisplay.refreshInterval = action.payload;
    },
    
    // Performance settings
    updatePerformanceSettings: (state, action) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    
    toggleAnimations: (state) => {
      state.performance.enableAnimations = !state.performance.enableAnimations;
    },
    
    // Accessibility settings
    updateAccessibilitySettings: (state, action) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    
    toggleHighContrast: (state) => {
      state.accessibility.highContrast = !state.accessibility.highContrast;
    },
    
    setFontSize: (state, action) => {
      state.accessibility.fontSize = action.payload;
    },
    
    // Loading states
    setGlobalLoading: (state, action) => {
      state.loadingStates.global = action.payload;
    },
    
    setDashboardLoading: (state, action) => {
      state.loadingStates.dashboard = action.payload;
    },
    
    setNavigationLoading: (state, action) => {
      state.loadingStates.navigation = action.payload;
    },
    
    // Reset UI state
    resetUIState: () => initialState,
    
    // Bulk update for settings import
    importUISettings: (state, action) => {
      const settings = action.payload;
      Object.keys(settings).forEach(key => {
        if (state[key] && typeof state[key] === 'object') {
          state[key] = { ...state[key], ...settings[key] };
        } else if (state[key] !== undefined) {
          state[key] = settings[key];
        }
      });
    }
  }
});

// Export actions
export const {
  setTheme,
  setColorScheme,
  toggleCompactMode,
  updateDashboardLayout,
  addDashboardWidget,
  removeDashboardWidget,
  reorderDashboardWidgets,
  setDateRange,
  setRegionFilters,
  setVesselTypeFilters,
  setOperatorFilters,
  clearGlobalFilters,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarPin,
  setSidebarWidth,
  setActiveSection,
  updateBreadcrumbs,
  addRecentPage,
  openModal,
  closeModal,
  closeAllModals,
  updateNotificationSettings,
  updateDataDisplaySettings,
  setDefaultTimeframe,
  setChartType,
  toggleAutoRefresh,
  setRefreshInterval,
  updatePerformanceSettings,
  toggleAnimations,
  updateAccessibilitySettings,
  toggleHighContrast,
  setFontSize,
  setGlobalLoading,
  setDashboardLoading,
  setNavigationLoading,
  resetUIState,
  importUISettings
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectColorScheme = (state) => state.ui.colorScheme;
export const selectCompactMode = (state) => state.ui.compactMode;
export const selectDashboardLayouts = (state) => state.ui.dashboardLayouts;
export const selectGlobalFilters = (state) => state.ui.globalFilters;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectNavigation = (state) => state.ui.navigation;
export const selectModals = (state) => state.ui.modals;
export const selectNotificationSettings = (state) => state.ui.notifications;
export const selectDataDisplaySettings = (state) => state.ui.dataDisplay;
export const selectPerformanceSettings = (state) => state.ui.performance;
export const selectAccessibilitySettings = (state) => state.ui.accessibility;
export const selectLoadingStates = (state) => state.ui.loadingStates;

// Complex selectors
export const selectDashboardLayout = (state, dashboardName) =>
  state.ui.dashboardLayouts[dashboardName];

export const selectIsModalOpen = (state, modalName) =>
  state.ui.modals[modalName]?.open || false;

export const selectActiveFilters = (state) => {
  const filters = state.ui.globalFilters;
  return {
    hasDateRange: filters.dateRange.start && filters.dateRange.end,
    hasRegions: filters.regions.length > 0,
    hasVesselTypes: filters.vesselTypes.length > 0,
    hasOperators: filters.operators.length > 0,
    total: [
      filters.dateRange.start && filters.dateRange.end,
      filters.regions.length > 0,
      filters.vesselTypes.length > 0,
      filters.operators.length > 0
    ].filter(Boolean).length
  };
};

export const selectUIPreferences = (state) => ({
  theme: state.ui.theme,
  colorScheme: state.ui.colorScheme,
  compactMode: state.ui.compactMode,
  sidebarCollapsed: state.ui.sidebar.collapsed,
  autoRefresh: state.ui.dataDisplay.autoRefresh,
  enableAnimations: state.ui.performance.enableAnimations
});

export const selectIsLoading = (state) => 
  state.ui.loadingStates.global || 
  state.ui.loadingStates.dashboard || 
  state.ui.loadingStates.navigation;

export default uiSlice.reducer;