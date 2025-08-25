const { spawn } = require('child_process');
const path = require('path');

/**
 * ML Model Service for Biofouling Prediction
 * Integrates Python ML model with Node.js backend
 */
class MLModelService {
  constructor() {
    this.modelPath = path.join(__dirname, '../../ml-models/models/biofouling/predict_biofouling.py');
  }

  /**
   * Map CSV vessel data to ML model input format
   * @param {Object} vesselData - Raw vessel data from CSV
   * @returns {Object} ML model input format
   */
  mapToMLInput(vesselData) {
    // Calculate antifouling coating age in months
    const coatingAge = this.calculateCoatingAge(vesselData.timestamp, vesselData.last_clean_date);
    
    // Estimate missing values based on typical seawater conditions
    const estimatedDO = this.estimateDissolvedOxygen(vesselData.sea_temperature, vesselData.salinity);
    const estimatedPH = this.estimatePH(vesselData.salinity);
    const estimatedHullRoughness = this.estimateHullRoughness(vesselData.coating, vesselData.vessel_type);

    return {
      seawater_temperature: parseFloat(vesselData.sea_temperature || vesselData.sst_c || 25.0),
      salinity: parseFloat(vesselData.salinity || vesselData.sss_psu || 35.0),
      dissolved_oxygen: estimatedDO,
      ph: estimatedPH,
      current_velocity: parseFloat(vesselData.current_speed || vesselData.curr_speed_mps || 0.5),
      hull_roughness: estimatedHullRoughness,
      antifouling_age: coatingAge,
      vessel_speed: parseFloat(vesselData.vessel_speed || vesselData.mean_speed_knots || 10.0),
      days_since_cleaning: parseInt(vesselData.days_since_clean || 30)
    };
  }

  /**
   * Calculate antifouling coating age in months
   * @param {string} currentDate - Current timestamp
   * @param {string} lastCleanDate - Last cleaning date
   * @returns {number} Age in months
   */
  calculateCoatingAge(currentDate, lastCleanDate) {
    if (!lastCleanDate) return 12; // Default 12 months if no data
    
    const current = new Date(currentDate);
    const lastClean = new Date(lastCleanDate);
    const diffTime = Math.abs(current - lastClean);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    return Math.min(diffMonths, 60); // Cap at 60 months
  }

  /**
   * Estimate dissolved oxygen based on temperature and salinity
   * @param {number} temperature - Water temperature in Celsius
   * @param {number} salinity - Salinity in PSU
   * @returns {number} Estimated dissolved oxygen in mg/L
   */
  estimateDissolvedOxygen(temperature, salinity) {
    // Simplified estimation based on typical seawater conditions
    // Higher temperature and salinity = lower dissolved oxygen
    const temp = parseFloat(temperature) || 25.0;
    const sal = parseFloat(salinity) || 35.0;
    
    // Base oxygen level at 25°C, 35 PSU is ~6.5 mg/L
    let estimatedDO = 9.0 - (temp - 20) * 0.3 - (sal - 30) * 0.1;
    
    return Math.max(3.0, Math.min(12.0, estimatedDO)); // Range 3-12 mg/L
  }

  /**
   * Estimate pH based on salinity (seawater typically 7.5-8.4)
   * @param {number} salinity - Salinity in PSU
   * @returns {number} Estimated pH
   */
  estimatePH(salinity) {
    const sal = parseFloat(salinity) || 35.0;
    // Normal seawater pH is around 8.1, varies slightly with salinity
    let estimatedPH = 8.1 + (sal - 35) * 0.01;
    
    return Math.max(7.5, Math.min(8.4, estimatedPH)); // Range 7.5-8.4
  }

  /**
   * Estimate hull roughness based on coating type and vessel type
   * @param {string} coating - Coating type
   * @param {string} vesselType - Type of vessel
   * @returns {number} Estimated hull roughness in microns
   */
  estimateHullRoughness(coating, vesselType) {
    let baseRoughness = 150; // Default in microns
    
    // Coating type adjustments
    if (coating) {
      const coatingLower = coating.toLowerCase();
      if (coatingLower.includes('epoxy')) baseRoughness = 120;
      else if (coatingLower.includes('silicone')) baseRoughness = 100;
      else if (coatingLower.includes('tin')) baseRoughness = 80;
    }
    
    // Vessel type adjustments
    if (vesselType) {
      const typeLower = vesselType.toLowerCase();
      if (typeLower.includes('container')) baseRoughness += 50;
      else if (typeLower.includes('tanker')) baseRoughness += 30;
      else if (typeLower.includes('bulk')) baseRoughness += 40;
    }
    
    return Math.max(50, Math.min(800, baseRoughness)); // Range 50-800 microns
  }

  /**
   * Call Python ML model for biofouling prediction
   * @param {Object} inputData - ML model input data
   * @returns {Promise<Object>} Prediction result
   */
  async predictBiofouling(inputData) {
    return new Promise((resolve, reject) => {
      try {
        // Validate input data
        const validationError = this.validateMLInput(inputData);
        if (validationError) {
          return reject(new Error(`ML Input validation failed: ${validationError}`));
        }

        // Prepare JSON input for Python script
        const jsonInput = JSON.stringify(inputData);
        
        // Execute Python ML model
        const pythonProcess = spawn('python', [this.modelPath, jsonInput], {
          cwd: path.dirname(this.modelPath)
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Python ML model error:', stderr);
            return reject(new Error(`ML model execution failed with code ${code}: ${stderr}`));
          }

          try {
            const result = JSON.parse(stdout);
            
            if (!result.success) {
              return reject(new Error(`ML model error: ${result.error}`));
            }

            resolve(result);
          } catch (parseError) {
            console.error('Failed to parse ML model output:', stdout);
            reject(new Error(`Failed to parse ML model output: ${parseError.message}`));
          }
        });

        pythonProcess.on('error', (error) => {
          reject(new Error(`Failed to start Python process: ${error.message}`));
        });

        // Set timeout for ML prediction (30 seconds)
        setTimeout(() => {
          pythonProcess.kill();
          reject(new Error('ML model prediction timeout'));
        }, 30000);

      } catch (error) {
        reject(new Error(`ML prediction error: ${error.message}`));
      }
    });
  }

  /**
   * Validate ML model input data
   * @param {Object} inputData - Input data to validate
   * @returns {string|null} Error message or null if valid
   */
  validateMLInput(inputData) {
    const requiredFields = [
      'seawater_temperature',
      'salinity',
      'dissolved_oxygen',
      'ph',
      'current_velocity',
      'hull_roughness',
      'antifouling_age',
      'vessel_speed',
      'days_since_cleaning'
    ];

    for (const field of requiredFields) {
      if (!(field in inputData)) {
        return `Missing required field: ${field}`;
      }
      
      const value = inputData[field];
      if (typeof value !== 'number' || isNaN(value)) {
        return `Invalid numeric value for ${field}: ${value}`;
      }
    }

    // Range validations
    const ranges = {
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

    for (const [field, [min, max]] of Object.entries(ranges)) {
      const value = inputData[field];
      if (value < min || value > max) {
        return `${field} value ${value} out of range [${min}, ${max}]`;
      }
    }

    return null;
  }

  /**
   * Fallback prediction method using rule-based logic
   * @param {Object} inputData - ML model input data
   * @returns {Object} Fallback prediction result
   */
  generateFallbackPrediction(inputData) {
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
      success: true,
      prediction: {
        biofouling_level: Math.round(biofoulingLevel * 100) / 100,
        confidence_score: 0.75, // Lower confidence for fallback method
        risk_category: riskCategory,
        recommended_action: recommendations.join('; '),
        estimated_cleaning_date: estimatedCleaningDate.toISOString()
      },
      model_info: {
        version: '1.0.0-fallback',
        processing_time_ms: 1,
        prediction_method: 'rule_based_fallback'
      }
    };
  }

  /**
   * Enhanced prediction with fallback handling
   * @param {Object} vesselData - Raw vessel data
   * @returns {Promise<Object>} Prediction result with ML or fallback
   */
  async getEnhancedPrediction(vesselData) {
    try {
      // Map vessel data to ML input format
      const mlInput = this.mapToMLInput(vesselData);
      
      // Try ML prediction first
      const result = await this.predictBiofouling(mlInput);
      
      // Add vessel identification to result
      result.vessel_info = {
        vessel_id: vesselData.vessel_id,
        vessel_name: vesselData.name || `MV ${vesselData.vessel_id}`,
        timestamp: new Date().toISOString()
      };
      
      return result;
      
    } catch (error) {
      console.warn(`ML prediction failed for vessel ${vesselData.vessel_id}: ${error.message}. Using fallback.`);
      
      // Fallback to rule-based prediction
      const mlInput = this.mapToMLInput(vesselData);
      const fallbackResult = this.generateFallbackPrediction(mlInput);
      
      // Add vessel identification to fallback result
      fallbackResult.vessel_info = {
        vessel_id: vesselData.vessel_id,
        vessel_name: vesselData.name || `MV ${vesselData.vessel_id}`,
        timestamp: new Date().toISOString()
      };
      
      return fallbackResult;
    }
  }
}

module.exports = new MLModelService();