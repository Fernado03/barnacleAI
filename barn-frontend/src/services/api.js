// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('API_BASE_URL loaded:', API_BASE_URL);

// Helper function to get auth token from localStorage or sessionStorage
const getAuthToken = () => {
  // Check localStorage first (remember me), then sessionStorage
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('API Request:', `${API_BASE_URL}${endpoint}`, config);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    
    console.log('API Response:', { status: response.status, data });
    
    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Marine Data API
export const marineDataAPI = {
  // Get all marine data for dashboard
  getAllMarineData: () => apiRequest('/marine-data/all'),
  
  // Individual data types
  getAISData: () => apiRequest('/marine-data/ais'),
  getWeatherData: () => apiRequest('/marine-data/weather'),
  getOceanCurrents: () => apiRequest('/marine-data/ocean-currents'),
  getEnvironmentalData: () => apiRequest('/marine-data/environmental'),
};

// Fleet Management API
export const fleetAPI = {
  // Fleet data
  getFleetData: () => apiRequest('/fleet'),
  getVesselById: (vesselId) => apiRequest(`/fleet/${vesselId}`),
  
  // Vessel management
  updateVesselStatus: (vesselId, statusData) => 
    apiRequest(`/fleet/${vesselId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
  
  // Maintenance
  getMaintenanceSchedule: (vesselId) => apiRequest(`/fleet/${vesselId}/maintenance`),
  scheduleMaintenance: (vesselId, maintenanceData) =>
    apiRequest(`/fleet/${vesselId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    }),
  updateMaintenanceStatus: (maintenanceId, statusData) =>
    apiRequest(`/fleet/maintenance/${maintenanceId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
};

// ESG API
export const esgAPI = {
  // ESG data
  getESGData: () => apiRequest('/esg'),
  getEnvironmentalMetrics: () => apiRequest('/esg/environmental'),
  getSocialMetrics: () => apiRequest('/esg/social'),
  getGovernanceMetrics: () => apiRequest('/esg/governance'),
  getESGBenchmarks: () => apiRequest('/esg/benchmarks'),
  
  // ESG management
  updateESGTargets: (targets) =>
    apiRequest('/esg/targets', {
      method: 'PUT',
      body: JSON.stringify(targets),
    }),
  generateESGReport: (reportConfig) =>
    apiRequest('/esg/reports', {
      method: 'POST',
      body: JSON.stringify(reportConfig),
    }),
};

// Predictions API
export const predictionsAPI = {
  // Models
  getPredictionModels: () => apiRequest('/predictions/models'),
  updateModel: (modelId, modelData) =>
    apiRequest(`/predictions/models/${modelId}`, {
      method: 'PUT',
      body: JSON.stringify(modelData),
    }),
  trainModel: (modelId, trainingData) =>
    apiRequest(`/predictions/models/${modelId}/train`, {
      method: 'POST',
      body: JSON.stringify(trainingData),
    }),
  
  // Predictions
  generatePredictions: (predictionConfig) =>
    apiRequest('/predictions/generate', {
      method: 'POST',
      body: JSON.stringify(predictionConfig),
    }),
  getBiofoulingPrediction: (vesselId, timeframe = '30d') =>
    apiRequest(`/predictions/vessels/${vesselId}/biofouling?timeframe=${timeframe}`),
  getFuelConsumptionPrediction: (vesselId, timeframe = '30d') =>
    apiRequest(`/predictions/vessels/${vesselId}/fuel-consumption?timeframe=${timeframe}`),
  getMaintenancePrediction: (vesselId) =>
    apiRequest(`/predictions/vessels/${vesselId}/maintenance`),
  
  // New ML Model predictions
  generateRealPrediction: (inputData) =>
    apiRequest('/predictions/generate-real', {
      method: 'POST',
      body: JSON.stringify(inputData),
    }),
  
  // Prediction History
  getPredictionHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/predictions/history${queryString ? '?' + queryString : ''}`);
  },
  getPredictionById: (predictionId) =>
    apiRequest(`/predictions/history/${predictionId}`),
  updatePredictionNotes: (predictionId, notes) =>
    apiRequest(`/predictions/history/${predictionId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),
  deletePrediction: (predictionId) =>
    apiRequest(`/predictions/history/${predictionId}`, {
      method: 'DELETE',
    }),
};

// Authentication API (extend existing if needed)
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (userData) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  getProfile: () => apiRequest('/auth/me'),
  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  verifyToken: () => apiRequest('/auth/verify'),
};