// Centralized selectors export for easier component imports
// This file provides a single import point for all Redux selectors

// User selectors
export {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading as selectUserLoading,
  selectIsRefreshing,
  selectToken,
  selectRefreshToken,
  selectError as selectUserError,
  selectLoginError,
  selectSignupError,
  selectProfileError,
  selectRememberMe,
  selectLastActivity,
  selectSessionTimeout,
  selectPreferences as selectUserPreferences,
  selectNotificationPreferences,
  selectIsSessionValid,
  selectUserRole,
  selectUserName,
  selectUserInitials
} from '../Slices/userSlice';

// Marine Data selectors
export {
  selectAISData,
  selectWeatherData,
  selectOceanCurrentsData,
  selectEnvironmentalData,
  selectConnectionStatus,
  selectDataQuality,
  selectMarineDataLoading,
  selectMarineDataError,
  selectLastRefresh,
  selectActiveVessels,
  selectVesselById,
  selectWeatherByLocation,
  selectCurrentsByRegion,
  selectBiofoulingRiskLevel,
  selectOverallDataHealth
} from '../Slices/marineDataSlice';

// Fleet selectors
export {
  selectFleetVessels,
  selectFleetSummary,
  selectFleetFilters,
  selectSelectedVessels,
  selectFleetLoading,
  selectFleetError,
  selectFilteredVessels,
  selectVesselsNeedingMaintenance,
  selectFleetPerformanceStats
} from '../Slices/fleetSlice';

// Prediction selectors
export {
  selectPredictionModels,
  selectActiveModel,
  selectPredictions,
  selectCurrentPredictions,
  selectPredictionSettings,
  selectTrainingStatus,
  selectPredictionHistory,
  selectPredictionsLoading,
  selectPredictionsError,
  selectActiveModelDetails,
  selectPredictionsByVessel,
  selectHighRiskVessels,
  selectPredictionsByType,
  selectModelPerformanceStats,
  selectPredictionAccuracy
} from '../Slices/predictionSlice';

// UI selectors
export {
  selectTheme,
  selectColorScheme,
  selectCompactMode,
  selectDashboardLayouts,
  selectGlobalFilters,
  selectSidebar,
  selectNavigation,
  selectModals,
  selectNotificationSettings,
  selectDataDisplaySettings,
  selectPerformanceSettings,
  selectAccessibilitySettings,
  selectLoadingStates,
  selectDashboardLayout,
  selectIsModalOpen,
  selectActiveFilters,
  selectUIPreferences,
  selectIsLoading as selectUILoading
} from '../Slices/uiSlice';

// Alerts selectors
export {
  selectAlerts,
  selectUnreadCount,
  selectAlertFilters,
  selectAlertSettings,
  selectFilteredAlerts
} from '../Slices/alertsSlice';

// ESG selectors
export {
  selectESGData,
  selectESGTargets,
  selectESGSettings,
  selectESGLoading,
  selectESGError,
  selectESGScore,
  selectEnvironmentalScore
} from '../Slices/esgSlice';

// Import all selectors for combined selectors
import {
  selectUser,
  selectIsLoading as selectUserLoading
} from '../Slices/userSlice';

import {
  selectFleetSummary,
  selectFleetLoading,
  selectVesselById,
  selectFleetPerformanceStats
} from '../Slices/fleetSlice';

import {
  selectUnreadCount,
  selectAlerts
} from '../Slices/alertsSlice';

import {
  selectOverallDataHealth,
  selectConnectionStatus,
  selectMarineDataLoading,
  selectDataQuality,
  selectEnvironmentalData
} from '../Slices/marineDataSlice';

import {
  selectESGScore
} from '../Slices/esgSlice';

import {
  selectCurrentPredictions,
  selectModelPerformanceStats,
  selectPredictionsByVessel
} from '../Slices/predictionSlice';

// Combined/Computed selectors for common use cases
export const selectDashboardData = (state) => ({
  user: selectUser(state),
  fleetSummary: selectFleetSummary(state),
  alerts: selectUnreadCount(state),
  marineDataHealth: selectOverallDataHealth(state),
  esgScore: selectESGScore(state),
  connectionStatus: selectConnectionStatus(state)
});

export const selectVesselDetails = (state, vesselId) => ({
  vessel: selectVesselById(state, vesselId),
  predictions: selectPredictionsByVessel(state, vesselId),
  alerts: selectAlerts(state).filter(alert => alert.vesselId === vesselId)
});

export const selectSystemHealth = (state) => ({
  dataHealth: selectOverallDataHealth(state),
  connectionStatus: selectConnectionStatus(state),
  unreadAlerts: selectUnreadCount(state),
  isLoading: selectUserLoading(state) || selectMarineDataLoading(state) || selectFleetLoading(state)
});

export const selectAnalyticsOverview = (state) => ({
  fleetStats: selectFleetPerformanceStats(state),
  predictions: selectCurrentPredictions(state),
  modelPerformance: selectModelPerformanceStats(state),
  dataQuality: selectDataQuality(state),
  environmentalData: selectEnvironmentalData(state)
});

// Helper function to create namespace-specific selectors
export const createNamespacedSelectors = (namespace) => {
  return {
    selectLoading: (state) => state[namespace]?.isLoading || false,
    selectError: (state) => state[namespace]?.error || null,
    selectData: (state) => state[namespace] || null,
    selectLastUpdate: (state) => state[namespace]?.lastUpdate || null
  };
};

// Export action creators for convenience
export { 
  // User actions
  loginUser,
  signupUser,
  logoutUser,
  updateUserProfile,
  refreshAuthToken,
  clearErrors as clearUserErrors,
  updatePreferences as updateUserPreferences
} from '../Slices/userSlice';

export {
  // Marine data actions
  fetchAISData,
  fetchWeatherData,
  fetchOceanCurrentsData,
  fetchEnvironmentalData,
  fetchAllMarineData,
  setConnectionStatus,
  toggleAutoRefresh
} from '../Slices/marineDataSlice';

export {
  // Fleet actions
  fetchFleetData,
  updateVesselStatus,
  scheduleMaintenanceAsync,
  setStatusFilter,
  selectVessel,
  deselectVessel,
  selectAllVessels,
  clearSelection,
  clearSelection as clearFleetSelection
} from '../Slices/fleetSlice';

export {
  // Prediction actions
  fetchPredictionModels,
  generatePredictions,
  trainModel,
  setActiveModel,
  updateSettings as updatePredictionSettings
} from '../Slices/predictionSlice';

export {
  // UI actions
  setTheme,
  toggleSidebar,
  setDateRange,
  setDefaultTimeframe,
  openModal,
  closeModal,
  updateNotificationSettings as updateUINotificationSettings
} from '../Slices/uiSlice';

export {
  // Alert actions
  fetchAlerts,
  acknowledgeAlert,
  addAlert,
  markAllAsRead
} from '../Slices/alertsSlice';

export {
  // ESG actions
  fetchESGData,
  updateESGTargets as updateESGTargetsAsync,
  updateTargets as updateESGTargets,
  updateSettings
} from '../Slices/esgSlice';