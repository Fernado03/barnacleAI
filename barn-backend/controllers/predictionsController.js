const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');
const Prediction = require('../models/Prediction');

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

// Controller functions
const getPredictionModels = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const models = generateMockPredictionModels();
    
    res.status(200).json({
      success: true,
      data: models,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching prediction models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction models',
      error: error.message
    });
  }
};

const generatePredictions = async (req, res) => {
  try {
    const { vesselIds, timeframe = '30d' } = req.body;
    
    // Validate timeframe
    const validTimeframes = ['7d', '14d', '30d', '60d', '90d'];
    if (!validTimeframes.includes(timeframe)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid timeframe. Must be one of: 7d, 14d, 30d, 60d, 90d'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const predictions = vesselIds ? 
      vesselIds.map(id => generateMockPredictions(id)[0]) :
      generateMockPredictions();
    
    res.status(200).json({
      success: true,
      data: {
        predictions,
        timeframe,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate predictions',
      error: error.message
    });
  }
};

const getBiofoulingPrediction = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const predictions = generateMockPredictions(vesselId);
    if (predictions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }
    
    const biofoulingData = predictions[0].biofouling;
    
    res.status(200).json({
      success: true,
      data: {
        vesselId,
        timeframe,
        ...biofoulingData,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching biofouling prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch biofouling prediction',
      error: error.message
    });
  }
};

const getFuelConsumptionPrediction = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const predictions = generateMockPredictions(vesselId);
    if (predictions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }
    
    const fuelData = predictions[0].fuelConsumption;
    
    res.status(200).json({
      success: true,
      data: {
        vesselId,
        timeframe,
        ...fuelData,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching fuel consumption prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fuel consumption prediction',
      error: error.message
    });
  }
};

const getMaintenancePrediction = async (req, res) => {
  try {
    const { vesselId } = req.params;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const predictions = generateMockPredictions(vesselId);
    if (predictions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }
    
    const maintenanceData = predictions[0].maintenance;
    
    res.status(200).json({
      success: true,
      data: {
        vesselId,
        ...maintenanceData,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance prediction',
      error: error.message
    });
  }
};

const trainModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { trainingData, hyperparameters } = req.body;
    
    if (!trainingData) {
      return res.status(400).json({
        success: false,
        message: 'Training data is required'
      });
    }
    
    // Simulate model training time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const trainingResult = {
      modelId,
      status: 'completed',
      accuracy: 90 + Math.random() * 8,
      trainingSamples: trainingData?.samples || 50000 + Math.random() * 50000,
      trainingTime: '45 minutes',
      hyperparameters,
      performance: {
        precision: 0.85 + Math.random() * 0.1,
        recall: 0.85 + Math.random() * 0.1,
        f1Score: 0.85 + Math.random() * 0.1
      },
      completedAt: new Date().toISOString(),
      trainedBy: req.user?.email || 'system'
    };
    
    res.status(200).json({
      success: true,
      data: trainingResult,
      message: 'Model training completed successfully'
    });
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to train model',
      error: error.message
    });
  }
};

const updateModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { name, status, hyperparameters } = req.body;
    
    // Validate status
    const validStatuses = ['active', 'inactive', 'training', 'deprecated'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, training, deprecated'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const updatedModel = {
      modelId,
      name,
      status,
      hyperparameters,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.email || 'system'
    };
    
    res.status(200).json({
      success: true,
      data: updatedModel,
      message: 'Model updated successfully'
    });
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update model',
      error: error.message
    });
  }
};

// New ML Model Integration Functions
const generateRealPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      seawater_temperature,
      salinity,
      dissolved_oxygen,
      ph,
      current_velocity,
      hull_roughness,
      antifouling_age,
      vessel_speed,
      days_since_cleaning,
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vesselInfo = {},
      location = {}
    } = req.body;

    // Validate required input parameters
    const requiredFields = [
      'seawater_temperature', 'salinity', 'dissolved_oxygen', 'ph',
      'current_velocity', 'hull_roughness', 'antifouling_age', 
      'vessel_speed', 'days_since_cleaning'
    ];

    const missingFields = requiredFields.filter(field => 
      req.body[field] === undefined || req.body[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate numeric ranges
    const validationRanges = {
      seawater_temperature: [0, 45],
      salinity: [0, 50],
      dissolved_oxygen: [0, 20],
      ph: [6.0, 9.0],
      current_velocity: [0, 10],
      hull_roughness: [0, 1000],
      antifouling_age: [0, 60],
      vessel_speed: [0, 50],
      days_since_cleaning: [0, 365]
    };

    const validationErrors = [];
    for (const [field, [min, max]] of Object.entries(validationRanges)) {
      const value = parseFloat(req.body[field]);
      if (isNaN(value) || value < min || value > max) {
        validationErrors.push(`${field} must be a number between ${min} and ${max}`);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Input validation failed',
        errors: validationErrors
      });
    }

    const inputData = {
      seawater_temperature: parseFloat(seawater_temperature),
      salinity: parseFloat(salinity),
      dissolved_oxygen: parseFloat(dissolved_oxygen),
      ph: parseFloat(ph),
      current_velocity: parseFloat(current_velocity),
      hull_roughness: parseFloat(hull_roughness),
      antifouling_age: parseFloat(antifouling_age),
      vessel_speed: parseFloat(vessel_speed),
      days_since_cleaning: parseFloat(days_since_cleaning)
    };

    let predictionResult;
    let predictionMethod = 'ml_model';
    let errorMessage = null;

    try {
      // Try ML model prediction first
      predictionResult = await callPythonMLModel(inputData);
    } catch (mlError) {
      console.warn('ML model prediction failed, falling back to calculation:', mlError.message);
      
      // Fallback to simple calculation
      predictionResult = generateFallbackPrediction(inputData);
      predictionMethod = 'fallback_calculation';
      errorMessage = `ML model unavailable: ${mlError.message}`;
    }

    // Create prediction record in database
    const prediction = new Prediction({
      userId,
      sessionId,
      inputData,
      prediction: predictionResult.prediction,
      modelVersion: predictionResult.model_info?.version || '1.0.0',
      modelType: 'biofouling_predictor',
      predictionMethod,
      vesselInfo,
      location,
      processingTime: predictionResult.model_info?.processing_time_ms || null,
      errorMessage
    });

    await prediction.save();

    res.status(200).json({
      success: true,
      data: {
        predictionId: prediction._id,
        sessionId,
        inputData,
        prediction: predictionResult.prediction,
        modelInfo: {
          version: predictionResult.model_info?.version || '1.0.0',
          method: predictionMethod,
          processingTime: predictionResult.model_info?.processing_time_ms
        },
        metadata: {
          vesselInfo,
          location,
          createdAt: prediction.createdAt
        },
        warning: errorMessage ? 'Prediction generated using fallback method' : null
      },
      message: 'Prediction generated successfully'
    });

  } catch (error) {
    console.error('Error generating real prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prediction',
      error: error.message
    });
  }
};

// Helper function to call Python ML model
const callPythonMLModel = (inputData) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../ml-models/models/biofouling/predict_biofouling.py');
    const inputJson = JSON.stringify(inputData);
    
    const pythonProcess = spawn('python', [pythonScript, inputJson]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.error || 'Python model execution failed'));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse Python model output: ${parseError.message}`));
        }
      } else {
        reject(new Error(`Python process exited with code ${code}. Error: ${stderr}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    // Set timeout for Python execution
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python model execution timeout'));
    }, 30000); // 30 second timeout
  });
};

// Fallback prediction calculation
const generateFallbackPrediction = (inputData) => {
  const {
    seawater_temperature,
    salinity,
    dissolved_oxygen,
    ph,
    current_velocity,
    hull_roughness,
    antifouling_age,
    vessel_speed,
    days_since_cleaning
  } = inputData;

  // Simple biofouling calculation based on key factors
  let biofoulingScore = 0;
  
  // Temperature factor (higher temp = more biofouling)
  biofoulingScore += Math.max(0, (seawater_temperature - 15) * 2);
  
  // Time since cleaning factor (major contributor)
  biofoulingScore += (days_since_cleaning / 30) * 25;
  
  // Hull roughness factor
  biofoulingScore += (hull_roughness / 100) * 10;
  
  // Antifouling age factor
  biofoulingScore += (antifouling_age / 12) * 15;
  
  // Speed factor (slower = more biofouling)
  biofoulingScore += Math.max(0, (15 - vessel_speed) * 1.5);
  
  // Current velocity factor (lower current = more biofouling)
  biofoulingScore += Math.max(0, (3 - current_velocity) * 5);
  
  // Dissolved oxygen factor (lower oxygen = more biofouling)
  biofoulingScore += Math.max(0, (8 - dissolved_oxygen) * 2);
  
  // Cap the score and convert to percentage
  const biofoulingLevel = Math.min(100, Math.max(0, biofoulingScore));
  
  // Determine risk category
  let riskCategory = 'Low';
  if (biofoulingLevel >= 75) riskCategory = 'Critical';
  else if (biofoulingLevel >= 50) riskCategory = 'High';
  else if (biofoulingLevel >= 25) riskCategory = 'Medium';
  
  // Generate recommendations
  const recommendations = [];
  if (biofoulingLevel >= 75) {
    recommendations.push('Immediate hull cleaning required');
    recommendations.push('Emergency inspection recommended');
  } else if (biofoulingLevel >= 50) {
    recommendations.push('Schedule hull cleaning within 1-2 weeks');
    recommendations.push('Monitor performance indicators closely');
  } else if (biofoulingLevel >= 25) {
    recommendations.push('Schedule inspection within 2-4 weeks');
    recommendations.push('Continue regular monitoring');
  } else {
    recommendations.push('Maintain current cleaning schedule');
    recommendations.push('Monitor antifouling coating condition');
  }
  
  // Estimate cleaning date
  const currentDate = new Date();
  const daysUntilCleaning = biofoulingLevel >= 75 ? 3 :
                           biofoulingLevel >= 50 ? 14 :
                           biofoulingLevel >= 25 ? 45 : 90;
  const estimatedCleaningDate = new Date(currentDate.getTime() + daysUntilCleaning * 24 * 60 * 60 * 1000);
  
  return {
    prediction: {
      biofouling_level: Math.round(biofoulingLevel * 100) / 100,
      confidence_score: 0.75, // Lower confidence for fallback method
      risk_category: riskCategory,
      recommended_action: recommendations.join('; '),
      estimated_cleaning_date: estimatedCleaningDate.toISOString()
    },
    model_info: {
      version: '1.0.0-fallback',
      processing_time_ms: 1
    }
  };
};

// Get prediction history for a user
const getPredictionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      vesselName,
      riskCategory,
      startDate,
      endDate,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = { userId };
    
    if (vesselName) {
      query['vesselInfo.name'] = new RegExp(vesselName, 'i');
    }
    
    if (riskCategory) {
      query['prediction.risk_category'] = riskCategory;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [predictions, total] = await Promise.all([
      Prediction.find(query)
        .sort(sortBy)
        .limit(parseInt(limit))
        .skip(skip)
        .populate('userId', 'username email'),
      Prediction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        predictions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRecords: total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction history',
      error: error.message
    });
  }
};

// Get specific prediction by ID
const getPredictionById = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const userId = req.user.id;

    const prediction = await Prediction.findOne({
      _id: predictionId,
      userId
    }).populate('userId', 'username email');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });

  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
};

// Update prediction notes
const updatePredictionNotes = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    const prediction = await Prediction.findOneAndUpdate(
      { _id: predictionId, userId },
      { 
        userNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
      message: 'Notes updated successfully'
    });

  } catch (error) {
    console.error('Error updating prediction notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prediction notes',
      error: error.message
    });
  }
};

// Delete prediction
const deletePrediction = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const userId = req.user.id;

    const prediction = await Prediction.findOneAndDelete({
      _id: predictionId,
      userId
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prediction deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete prediction',
      error: error.message
    });
  }
};

// Route optimization with AI model
const optimizeRoute = async (req, res) => {
  try {
    const {
      start_port,
      end_port,
      vessel_data = {},
      weather_data,
      optimization_type = 'balanced'
    } = req.body;

    // Validate required parameters
    if (!start_port || !end_port) {
      return res.status(400).json({
        success: false,
        message: 'Start port and end port are required'
      });
    }

    // Add user info to vessel data
    const enhancedVesselData = {
      ...vessel_data,
      user_id: req.user?.id,
      requested_by: req.user?.email
    };

    // Prepare optimization parameters
    const optimizationParams = {
      start_port,
      end_port,
      vessel_data: enhancedVesselData,
      weather_data,
      optimization_type
    };

    try {
      // Call Python route optimization model
      const result = await callPythonRouteOptimizer(optimizationParams);
      
      if (result.success === false) {
        throw new Error(result.error || 'Route optimization failed');
      }

      // Log the optimization request
      console.log(`Route optimization completed: ${start_port} to ${end_port} for user ${req.user?.email}`);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Route optimization completed successfully',
        timestamp: new Date().toISOString()
      });

    } catch (pythonError) {
      console.error('Python route optimization error:', pythonError.message);
      
      // Fallback to basic route calculation
      const fallbackRoute = generateFallbackRoute(start_port, end_port, enhancedVesselData);
      
      res.status(200).json({
        success: true,
        data: fallbackRoute,
        message: 'Route optimization completed using fallback algorithm',
        warning: 'AI model temporarily unavailable, using basic optimization',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during route optimization',
      error: error.message
    });
  }
};

// Call Python route optimization model
const callPythonRouteOptimizer = (params) => {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const path = require('path');
    
    // Path to the Python route optimization script
    const pythonScript = path.join(__dirname, '../../../ml-models/models/route_optimization/ai_route_optimizer.py');
    
    // Prepare arguments for Python script
    const args = [
      '--start', params.start_port,
      '--end', params.end_port,
      '--vessel-type', params.vessel_data?.type || 'container',
      '--speed', (params.vessel_data?.speed || 12).toString(),
      '--optimization', params.optimization_type || 'balanced'
    ];
    
    const pythonProcess = spawn('python', [pythonScript, ...args]);
    
    let outputData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(outputData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${errorData}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    // Send timeout after 30 seconds
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Route optimization timeout - process took too long'));
    }, 30000);
  });
};

// Fallback route calculation for when Python model is unavailable
const generateFallbackRoute = (startPort, endPort, vesselData) => {
  // SEA region major ports with coordinates
  const seaPorts = {
    'singapore': { lat: 1.2845, lon: 103.84, name: 'Port of Singapore' },
    'jakarta': { lat: -6.1045, lon: 106.8865, name: 'Tanjung Priok (Jakarta)' },
    'manila': { lat: 14.6042, lon: 121.0, name: 'Manila Bay' },
    'bangkok': { lat: 13.0827, lon: 100.883, name: 'Laem Chabang' },
    'klang': { lat: 3.0319, lon: 101.4, name: 'Port Klang' }
  };
  
  const start = seaPorts[startPort.toLowerCase()] || seaPorts['singapore'];
  const end = seaPorts[endPort.toLowerCase()] || seaPorts['manila'];
  
  // Simple distance calculation
  const distance = calculateHaversineDistance(start.lat, start.lon, end.lat, end.lon);
  const speed = vesselData.speed || 12; // knots
  const timeHours = distance / (speed * 1.852); // convert to km/h
  
  return {
    route_id: `fallback_${startPort}_to_${endPort}_${Date.now()}`,
    start_port: startPort,
    end_port: endPort,
    waypoints: [
      { lat: start.lat, lon: start.lon, name: start.name },
      { lat: end.lat, lon: end.lon, name: end.name }
    ],
    metrics: {
      total_distance_km: Math.round(distance),
      total_fuel_tons: Math.round(distance * 0.05), // rough estimate
      total_time_hours: Math.round(timeHours * 100) / 100,
      safety_score: 75,
      fuel_cost_usd: Math.round(distance * 0.05 * 600),
      environmental_impact: Math.round(distance * 0.05 * 3.17)
    },
    optimization_type: 'fallback',
    generated_at: new Date().toISOString(),
    confidence_score: 0.6,
    algorithm: 'Basic Distance Calculation'
  };
};

// Helper function for distance calculation
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
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
};