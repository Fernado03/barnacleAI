const mongoose = require('mongoose');

const fleetSummarySchema = new mongoose.Schema({
  // Fleet overview statistics
  totalVessels: {
    type: Number,
    required: true,
    default: 0
  },
  activeVessels: {
    type: Number,
    default: 0
  },
  idleVessels: {
    type: Number,
    default: 0
  },
  dockedVessels: {
    type: Number,
    default: 0
  },
  maintenanceVessels: {
    type: Number,
    default: 0
  },

  // Performance metrics
  avgBiofoulingLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  avgFuelPenalty: {
    type: String,
    default: '+0.0%'
  },
  avgOperationalEfficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },

  // Risk assessment
  highFoulingVessels: {
    type: Number,
    default: 0
  },
  criticalRiskVessels: {
    type: Number,
    default: 0
  },
  maintenanceFlags: {
    type: Number,
    default: 0
  },

  // ML Model metrics
  avgConfidenceScore: {
    type: String,
    default: '0.850'
  },
  modelVersion: {
    type: String,
    default: 'v1.0'
  },
  lastModelUpdate: {
    type: Date,
    default: Date.now
  },

  // Fouling distribution
  foulingDistribution: {
    clean: { type: Number, default: 0 },      // 0-10%
    low: { type: Number, default: 0 },        // 11-30%
    medium: { type: Number, default: 0 },     // 31-70%
    high: { type: Number, default: 0 }        // 70%+
  },

  // Operational status distribution
  statusDistribution: {
    enRoute: { type: Number, default: 0 },
    docked: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    idle: { type: Number, default: 0 }
  },

  // Maintenance metrics
  maintenanceMetrics: {
    overdueVessels: { type: Number, default: 0 },
    scheduledMaintenance: { type: Number, default: 0 },
    emergencyMaintenance: { type: Number, default: 0 },
    avgDaysSinceClean: { type: Number, default: 0 }
  },

  // Data quality and updates
  dataSource: {
    type: String,
    default: 'Dynamic_Generation'
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  calculationVersion: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for fleet health score (0-100)
fleetSummarySchema.virtual('fleetHealthScore').get(function() {
  const efficiency = this.avgOperationalEfficiency || 100;
  const foulingPenalty = this.avgBiofoulingLevel || 0;
  const maintenancePenalty = (this.maintenanceFlags / Math.max(this.totalVessels, 1)) * 20;
  
  return Math.max(0, Math.min(100, efficiency - foulingPenalty * 0.3 - maintenancePenalty));
});

// Virtual for critical alerts count
fleetSummarySchema.virtual('criticalAlertsCount').get(function() {
  return this.highFoulingVessels + this.maintenanceMetrics.overdueVessels + this.criticalRiskVessels;
});

// Static method to calculate and save fleet summary
fleetSummarySchema.statics.calculateFromVessels = async function(vessels) {
  const totalVessels = vessels.length;
  
  if (totalVessels === 0) {
    return this.create({
      totalVessels: 0,
      dataSource: 'Empty_Fleet'
    });
  }

  // Status counts
  const statusCounts = {
    enRoute: vessels.filter(v => v.status === 'En Route').length,
    docked: vessels.filter(v => v.status === 'Docked').length,
    maintenance: vessels.filter(v => v.status === 'Maintenance').length,
    idle: vessels.filter(v => v.status === 'Idle').length
  };

  // Fouling distribution
  const foulingDistribution = {
    clean: vessels.filter(v => (v.performance?.biofoulingLevel || 0) <= 10).length,
    low: vessels.filter(v => {
      const level = v.performance?.biofoulingLevel || 0;
      return level > 10 && level <= 30;
    }).length,
    medium: vessels.filter(v => {
      const level = v.performance?.biofoulingLevel || 0;
      return level > 30 && level <= 70;
    }).length,
    high: vessels.filter(v => (v.performance?.biofoulingLevel || 0) > 70).length
  };

  // Calculate averages
  const avgBiofoulingLevel = vessels.reduce((sum, v) => 
    sum + (v.performance?.biofoulingLevel || 0), 0) / totalVessels;
  
  const avgFuelPenalty = vessels.reduce((sum, v) => 
    sum + (v.performance?.speedReduction || 0), 0) / totalVessels;
  
  const avgOperationalEfficiency = vessels.reduce((sum, v) => 
    sum + (v.performance?.operationalEfficiency || 100), 0) / totalVessels;
  
  const avgConfidenceScore = vessels.reduce((sum, v) => 
    sum + (v.mlPrediction?.confidenceScore || 0), 0) / totalVessels;

  // Risk and maintenance metrics
  const highFoulingVessels = foulingDistribution.high;
  const criticalRiskVessels = vessels.filter(v => 
    v.mlPrediction?.riskCategory === 'Critical').length;
  const overdueVessels = vessels.filter(v => 
    v.maintenance?.status === 'Overdue').length;
  const scheduledMaintenance = vessels.filter(v => 
    v.maintenance?.status === 'Scheduled').length;
  const emergencyMaintenance = vessels.filter(v => 
    v.maintenance?.priority === 'Critical').length;
  
  const avgDaysSinceClean = vessels.reduce((sum, v) => 
    sum + (v.maintenance?.daysSinceClean || 0), 0) / totalVessels;

  // Create summary document
  return this.create({
    totalVessels,
    activeVessels: statusCounts.enRoute,
    idleVessels: statusCounts.idle,
    dockedVessels: statusCounts.docked,
    maintenanceVessels: statusCounts.maintenance,
    
    avgBiofoulingLevel: Math.round(avgBiofoulingLevel * 10) / 10,
    avgFuelPenalty: `+${avgFuelPenalty.toFixed(1)}%`,
    avgOperationalEfficiency: Math.round(avgOperationalEfficiency * 10) / 10,
    
    highFoulingVessels,
    criticalRiskVessels,
    maintenanceFlags: highFoulingVessels + overdueVessels,
    
    avgConfidenceScore: avgConfidenceScore.toFixed(3),
    
    foulingDistribution,
    statusDistribution: statusCounts,
    
    maintenanceMetrics: {
      overdueVessels,
      scheduledMaintenance,
      emergencyMaintenance,
      avgDaysSinceClean: Math.round(avgDaysSinceClean)
    },
    
    dataSource: 'Calculated_From_Vessels',
    lastCalculated: new Date()
  });
};

// Instance method to update summary
fleetSummarySchema.methods.updateFromVessels = async function(vessels) {
  const newSummary = await this.constructor.calculateFromVessels(vessels);
  
  // Update this document with new values
  Object.assign(this, newSummary.toObject());
  this.lastCalculated = new Date();
  
  return this.save();
};

module.exports = mongoose.model('FleetSummary', fleetSummarySchema);