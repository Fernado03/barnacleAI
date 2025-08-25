const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getESGData,
  getEnvironmentalMetrics,
  getSocialMetrics,
  getGovernanceMetrics,
  updateESGTargets,
  generateESGReport,
  getESGBenchmarks
} = require('../controllers/esgController');

// All ESG routes require authentication
router.use(authenticateToken);

// ESG Data endpoints
router.get('/', getESGData);
router.get('/environmental', getEnvironmentalMetrics);
router.get('/social', getSocialMetrics);
router.get('/governance', getGovernanceMetrics);
router.get('/benchmarks', getESGBenchmarks);

// ESG Management endpoints
router.put('/targets', updateESGTargets);
router.post('/reports', generateESGReport);

module.exports = router;