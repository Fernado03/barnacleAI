const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  // Vessel identification
  vesselId: {
    type: String,
    required: true,
    unique: true
  },
  imo: {
    type: String,
    required: true,
    unique: true
  },
  mmsi: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['container', 'bulk_carrier', 'tanker', 'general_cargo', 'roro'],
    required: true
  },

  // Current status and location
  status: {
    type: String,
    enum: ['En Route', 'Docked', 'Maintenance', 'Idle'],
    default: 'Idle'
  },
  currentPort: {
    type: String,
    default: 'Unknown'
  },
  destination: {
    type: String,
    default: 'Unknown'
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  voyageId: {
    type: String
  },
  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },

  // Performance metrics
  performance: {
    biofoulingLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    fuelConsumption: {
      type: Number,
      default: 0
    },
    speedReduction: {
      type: Number,
      default: 0
    },
    operationalEfficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    }
  },

  // Maintenance information
  maintenance: {
    status: {
      type: String,
      enum: ['Current', 'Due', 'Overdue', 'Scheduled'],
      default: 'Current'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low'
    },
    daysSinceClean: {
      type: Number,
      default: 0
    },
    lastCleanDate: {
      type: Date,
      default: Date.now
    },
    nextScheduledMaintenance: {
      type: Date
    }
  },

  // ML Prediction data
  mlPrediction: {
    riskCategory: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low'
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    recommendations: {
      type: String,
      default: 'No recommendations available'
    },
    modelVersion: {
      type: String,
      default: 'v1.0'
    },
    predictionMethod: {
      type: String,
      enum: ['trained_model', 'mock_model', 'csv_aligned_model'],
      default: 'mock_model'
    },
    lastPredictionDate: {
      type: Date,
      default: Date.now
    }
  },

  // Environmental and operational data
  environmental: {
    seaTemperature: { type: Number, default: 25 },
    salinity: { type: Number, default: 35 },
    windSpeed: { type: Number, default: 0 },
    currentSpeed: { type: Number, default: 0 }
  },

  // Vessel specifications
  specifications: {
    length: { type: Number },
    beam: { type: Number },
    draft: { type: Number },
    hullArea: { type: Number },
    coatingType: { type: String }
  },

  // Tracking and metadata
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: String,
    default: 'Fleet Operator'
  },
  lastDataUpdate: {
    type: Date,
    default: Date.now
  },
  
  // CSV data for complete alignment (optional field)
  csvData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
vesselSchema.index({ status: 1 });
vesselSchema.index({ 'performance.biofoulingLevel': 1 });
vesselSchema.index({ 'maintenance.status': 1 });
vesselSchema.index({ 'mlPrediction.riskCategory': 1 });

// Virtual for fouling classification
vesselSchema.virtual('foulingClass').get(function() {
  const level = this.performance.biofoulingLevel;
  if (level > 70) return 'high';
  if (level > 30) return 'medium';
  if (level > 10) return 'low';
  return 'clean';
});

// Virtual for fuel penalty display
vesselSchema.virtual('fuelPenaltyDisplay').get(function() {
  return `+${this.performance.speedReduction.toFixed(1)}%`;
});

// Static methods
vesselSchema.statics.findByStatus = function(status) {
  return this.find({ status, isActive: true });
};

vesselSchema.statics.findByRiskCategory = function(category) {
  return this.find({ 'mlPrediction.riskCategory': category, isActive: true });
};

vesselSchema.statics.findHighFouling = function(threshold = 70) {
  return this.find({ 
    'performance.biofoulingLevel': { $gt: threshold }, 
    isActive: true 
  });
};

// Instance methods
vesselSchema.methods.updatePerformance = function(performanceData) {
  this.performance = { ...this.performance, ...performanceData };
  this.lastDataUpdate = new Date();
  return this.save();
};

vesselSchema.methods.updateStatus = function(newStatus, currentPort = null) {
  this.status = newStatus;
  if (currentPort) this.currentPort = currentPort;
  this.lastDataUpdate = new Date();
  return this.save();
};

vesselSchema.methods.scheduleNextMaintenance = function(days = 90) {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  this.maintenance.nextScheduledMaintenance = nextDate;
  return this.save();
};

// Pre-save middleware
vesselSchema.pre('save', function(next) {
  this.lastDataUpdate = new Date();
  next();
});

module.exports = mongoose.model('Vessel', vesselSchema);