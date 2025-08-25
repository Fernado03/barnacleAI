const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getAISData,
  getWeatherData,
  getOceanCurrents,
  getEnvironmentalData,
  getAllMarineData,
  // Dynamic Ship Tracking imports
  startDynamicTracking,
  stopDynamicTracking,
  getVesselStatus,
  getAllVesselStatuses,
  startAllTracking,
  stopAllTracking,
  getTrackingStats
} = require('../controllers/marineDataController');

// All marine data routes require authentication
router.use(authenticateToken);

// Traditional Marine Data endpoints
router.get('/ais', getAISData);
router.get('/weather', getWeatherData);
router.get('/ocean-currents', getOceanCurrents);
router.get('/environmental', getEnvironmentalData);
router.get('/all', getAllMarineData);

// Dynamic Ship Tracking endpoints
// Individual vessel tracking control
router.post('/tracking/vessel/:vesselId/start', startDynamicTracking);
router.post('/tracking/vessel/:vesselId/stop', stopDynamicTracking);
router.get('/tracking/vessel/:vesselId/status', getVesselStatus);

// Fleet tracking control
router.post('/tracking/fleet/start', startAllTracking);
router.post('/tracking/fleet/stop', stopAllTracking);
router.get('/tracking/vessels', getAllVesselStatuses);
router.get('/tracking/stats', getTrackingStats);

// Legacy endpoints (for backward compatibility)
router.get('/dynamic-tracking/vessels', getAllVesselStatuses);
router.get('/dynamic-tracking/statistics', getTrackingStats);

module.exports = router;