const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getPredictionModels,
  generatePredictions,
  getBiofoulingPrediction,
  getFuelConsumptionPrediction,
  getMaintenancePrediction,
  trainModel,
  updateModel,
  // New ML model functions
  generateRealPrediction,
  getPredictionHistory,
  getPredictionById,
  updatePredictionNotes,
  deletePrediction,
  // Route optimization
  optimizeRoute
} = require('../controllers/predictionsController');

// All prediction routes require authentication
router.use(authenticateToken);

// Prediction Models endpoints
router.get('/models', getPredictionModels);
router.put('/models/:modelId', updateModel);
router.post('/models/:modelId/train', trainModel);

// Prediction Generation endpoints
router.post('/generate', generatePredictions);

// ML Model prediction endpoints
router.post('/generate-real', generateRealPrediction);

// Route optimization endpoint
router.post('/optimize-route', optimizeRoute);

// Prediction History endpoints
router.get('/history', getPredictionHistory);
router.get('/history/:predictionId', getPredictionById);
router.put('/history/:predictionId/notes', updatePredictionNotes);
router.delete('/history/:predictionId', deletePrediction);

// Specific prediction endpoints by vessel
router.get('/vessels/:vesselId/biofouling', getBiofoulingPrediction);
router.get('/vessels/:vesselId/fuel-consumption', getFuelConsumptionPrediction);
router.get('/vessels/:vesselId/maintenance', getMaintenancePrediction);

module.exports = router;