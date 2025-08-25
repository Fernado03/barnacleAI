const mongoose = require('mongoose');

// Generate mock ESG data
const generateMockESGData = () => ({
  environmental: {
    carbonFootprint: {
      total: 45200 + Math.random() * 5000,
      perVessel: 3200 + Math.random() * 500,
      reduction: 12.5 + Math.random() * 5,
      target: 50000,
      lastUpdate: new Date().toISOString()
    },
    fuelEfficiency: {
      average: 85.2 + Math.random() * 10,
      improvement: 8.3 + Math.random() * 3,
      target: 90,
      bestPerformer: 'MV Fleet Star 2'
    },
    wasteManagement: {
      recyclingRate: 78.5 + Math.random() * 15,
      wasteReduced: 145 + Math.random() * 50,
      target: 85
    },
    emissions: {
      co2: (45200 + Math.random() * 5000).toFixed(2),
      nox: (890 + Math.random() * 200).toFixed(2),
      sox: (445 + Math.random() * 100).toFixed(2),
      particulates: (67 + Math.random() * 20).toFixed(2)
    }
  },
  social: {
    crewWelfare: {
      satisfactionScore: 8.2 + Math.random() * 1.5,
      trainingHours: 2840 + Math.random() * 500,
      safetyIncidents: Math.floor(Math.random() * 3),
      diversityIndex: 0.72 + Math.random() * 0.2
    },
    communityImpact: {
      localEmployment: 340 + Math.random() * 50,
      communityInvestment: 125000 + Math.random() * 25000,
      volunteering: 145 + Math.random() * 30
    },
    healthSafety: {
      accidentRate: (Math.random() * 2).toFixed(2),
      trainingCompletionRate: (85 + Math.random() * 15).toFixed(1),
      emergencyDrills: Math.floor(Math.random() * 20) + 40
    }
  },
  governance: {
    compliance: {
      regulatoryScore: 94.5 + Math.random() * 4,
      auditResults: 'Excellent',
      violations: Math.floor(Math.random() * 2),
      certifications: ['ISO 14001', 'IMO 2020', 'MLC 2006', 'ISPS Code']
    },
    transparency: {
      reportingScore: 91.2 + Math.random() * 6,
      stakeholderEngagement: 87.5 + Math.random() * 8,
      dataQuality: 95.1 + Math.random() * 3
    },
    riskManagement: {
      riskAssessments: Math.floor(Math.random() * 50) + 120,
      mitigationPlans: Math.floor(Math.random() * 30) + 85,
      incidentResponse: (95 + Math.random() * 5).toFixed(1)
    }
  },
  overall: {
    esgScore: 82.4 + Math.random() * 10,
    rating: ['A+', 'A', 'A-', 'B+'][Math.floor(Math.random() * 4)],
    trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
    lastAssessment: new Date().toISOString(),
    benchmark: {
      industry: 78.5,
      region: 80.2,
      global: 75.8
    }
  }
});

// Controller functions
const getESGData = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const esgData = generateMockESGData();
    
    res.status(200).json({
      success: true,
      data: esgData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching ESG data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ESG data',
      error: error.message
    });
  }
};

const getEnvironmentalMetrics = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const esgData = generateMockESGData();
    
    res.status(200).json({
      success: true,
      data: esgData.environmental,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching environmental metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch environmental metrics',
      error: error.message
    });
  }
};

const getSocialMetrics = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const esgData = generateMockESGData();
    
    res.status(200).json({
      success: true,
      data: esgData.social,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching social metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social metrics',
      error: error.message
    });
  }
};

const getGovernanceMetrics = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const esgData = generateMockESGData();
    
    res.status(200).json({
      success: true,
      data: esgData.governance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching governance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch governance metrics',
      error: error.message
    });
  }
};

const updateESGTargets = async (req, res) => {
  try {
    const { 
      carbonReduction,
      fuelEfficiency,
      recyclingRate,
      safetyIncidents,
      complianceScore
    } = req.body;
    
    // Validate targets
    if (carbonReduction && (carbonReduction < 0 || carbonReduction > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Carbon reduction target must be between 0 and 100'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedTargets = {
      carbonReduction,
      fuelEfficiency,
      recyclingRate,
      safetyIncidents,
      complianceScore,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.email || 'system'
    };
    
    res.status(200).json({
      success: true,
      data: updatedTargets,
      message: 'ESG targets updated successfully'
    });
  } catch (error) {
    console.error('Error updating ESG targets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ESG targets',
      error: error.message
    });
  }
};

const generateESGReport = async (req, res) => {
  try {
    const { period = 'quarterly', includeVesselLevel = true } = req.body;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const esgData = generateMockESGData();
    
    const report = {
      id: Math.random().toString(36).substr(2, 9),
      period,
      includeVesselLevel,
      data: esgData,
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.email || 'system',
      format: 'json',
      summary: {
        overallScore: esgData.overall.esgScore,
        environmentalScore: (esgData.environmental.carbonFootprint.reduction * 3 + 
                            esgData.environmental.fuelEfficiency.improvement * 2 + 
                            esgData.environmental.wasteManagement.recyclingRate) / 6,
        socialScore: (esgData.social.crewWelfare.satisfactionScore * 10 + 
                     esgData.social.healthSafety.trainingCompletionRate) / 2,
        governanceScore: (esgData.governance.compliance.regulatoryScore + 
                         esgData.governance.transparency.reportingScore) / 2
      }
    };
    
    res.status(200).json({
      success: true,
      data: report,
      message: 'ESG report generated successfully'
    });
  } catch (error) {
    console.error('Error generating ESG report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ESG report',
      error: error.message
    });
  }
};

const getESGBenchmarks = async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const benchmarks = {
      industry: {
        environmental: 72.5,
        social: 78.2,
        governance: 85.1,
        overall: 78.5
      },
      region: {
        environmental: 74.8,
        social: 80.1,
        governance: 86.7,
        overall: 80.2
      },
      global: {
        environmental: 68.9,
        social: 76.3,
        governance: 82.1,
        overall: 75.8
      },
      topPerformers: {
        environmental: 95.2,
        social: 92.8,
        governance: 96.5,
        overall: 94.8
      }
    };
    
    res.status(200).json({
      success: true,
      data: benchmarks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching ESG benchmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ESG benchmarks',
      error: error.message
    });
  }
};

module.exports = {
  getESGData,
  getEnvironmentalMetrics,
  getSocialMetrics,
  getGovernanceMetrics,
  updateESGTargets,
  generateESGReport,
  getESGBenchmarks
};