const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  // User and session information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },

  // Input data for prediction
  inputData: {
    seawater_temperature: { type: Number, required: true },
    salinity: { type: Number, required: true },
    dissolved_oxygen: { type: Number, required: true },
    ph: { type: Number, required: true },
    current_velocity: { type: Number, required: true },
    hull_roughness: { type: Number, required: true },
    antifouling_age: { type: Number, required: true },
    vessel_speed: { type: Number, required: true },
    days_since_cleaning: { type: Number, required: true }
  },

  // Prediction results
  prediction: {
    biofouling_level: { type: Number, required: true },
    confidence_score: { type: Number, required: true },
    risk_category: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },
    recommended_action: { type: String, required: true },
    estimated_cleaning_date: { type: Date }
  },

  // Model metadata
  modelVersion: { type: String, required: true },
  modelType: { type: String, default: 'biofouling_predictor' },
  predictionMethod: {
    type: String,
    enum: ['ml_model', 'fallback_calculation'],
    required: true
  },

  // Vessel information
  vesselInfo: {
    name: { type: String },
    type: { type: String },
    length: { type: Number },
    beam: { type: Number },
    draft: { type: Number }
  },

  // Additional metadata
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    port: { type: String }
  },

  // User notes and validation
  userNotes: { type: String, default: '' },
  isValidated: { type: Boolean, default: false },
  validationNotes: { type: String, default: '' },
  
  // Processing information
  processingTime: { type: Number }, // in milliseconds
  errorMessage: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ sessionId: 1 });
predictionSchema.index({ 'vesselInfo.name': 1 });
predictionSchema.index({ 'prediction.risk_category': 1 });

// Static methods for querying
predictionSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 50, skip = 0, sortBy = '-createdAt' } = options;
  return this.find({ userId })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('userId', 'username email');
};

predictionSchema.statics.findByVessel = function(vesselName, options = {}) {
  const { limit = 50, skip = 0 } = options;
  return this.find({ 'vesselInfo.name': new RegExp(vesselName, 'i') })
    .sort('-createdAt')
    .limit(limit)
    .skip(skip);
};

predictionSchema.statics.findByRiskCategory = function(riskCategory, options = {}) {
  const { limit = 50, skip = 0 } = options;
  return this.find({ 'prediction.risk_category': riskCategory })
    .sort('-createdAt')
    .limit(limit)
    .skip(skip);
};

// Instance methods
predictionSchema.methods.updateNotes = function(notes) {
  this.userNotes = notes;
  this.updatedAt = new Date();
  return this.save();
};

predictionSchema.methods.validatePrediction = function(isValid, validationNotes = '') {
  this.isValidated = isValid;
  this.validationNotes = validationNotes;
  this.updatedAt = new Date();
  return this.save();
};

// Virtual for formatted prediction date
predictionSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt ? this.createdAt.toISOString().split('T')[0] : '';
});

// Virtual for risk level numeric value
predictionSchema.virtual('riskLevelNumeric').get(function() {
  const riskLevels = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
  return riskLevels[this.prediction.risk_category] || 0;
});

module.exports = mongoose.model('Prediction', predictionSchema);