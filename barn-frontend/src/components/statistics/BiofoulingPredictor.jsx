import React, { useState } from 'react';
import { FaChartBar, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaShip, FaClock } from 'react-icons/fa';
import { predictionsAPI } from '../../services/api';
import { ProgressBar, StatusBadge, Alert, MetricCard } from '../shared/Charts';

/**
 * Enhanced BiofoulingPredictor Component
 * Implements Jakob Nielsen's 10 Usability Heuristics:
 * 1. Visibility of system status - Real-time prediction updates
 * 2. Match between system and real world - Marine terminology
 * 3. User control and freedom - Reset/clear functionality
 * 4. Consistency and standards - Consistent input patterns
 * 5. Error prevention - Input validation
 * 6. Recognition rather than recall - Clear labels and units
 * 7. Flexibility and efficiency - Quick presets for common scenarios
 * 8. Aesthetic and minimalist design - Clean, focused interface
 * 9. Help users recognize and recover from errors - Clear error messages
 * 10. Help and documentation - Tooltips and guidance
 */

const BiofoulingPredictor = () => {
  
  const [formData, setFormData] = useState({
    seawater_temperature: 25.0,
    salinity: 35.0,
    dissolved_oxygen: 8.0,
    ph: 8.1,
    current_velocity: 0.5,
    hull_roughness: 150,
    antifouling_age: 12,
    vessel_speed: 12.0,
    days_since_cleaning: 30
  });
  
  const [vesselInfo, setVesselInfo] = useState({
    name: '',
    type: '',
    length: '',
    beam: '',
    draft: ''
  });
  
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    port: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  
  // Nielsen Heuristic 1: Visibility of System Status
  // Generate prediction on button click instead of real-time
  const generatePrediction = async () => {
    try {
      setIsCalculating(true);
      setErrors({});
      
      const inputData = {
        ...formData,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vesselInfo,
        location
      };
      
      const response = await predictionsAPI.generateRealPrediction(inputData);
      
      if (response.success) {
        const result = response.data;
        setPrediction(result);

        
        // Show alert for high risk conditions
        if (result.prediction.risk_category === 'High' || result.prediction.risk_category === 'Critical') {
          setShowAlert(true);
        }
      } else {
        throw new Error(response.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setErrors({ general: error.message || 'Failed to generate prediction. Please try again.' });
      setPrediction(null);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Nielsen Heuristic 2: Match between system and real world
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };
  
  const handleVesselInfoChange = (field, value) => {
    setVesselInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  

  
  // Nielsen Heuristic 3: User control and freedom
  const handleReset = () => {
    setFormData({
      seawater_temperature: 25.0,
      salinity: 35.0,
      dissolved_oxygen: 8.0,
      ph: 8.1,
      current_velocity: 0.5,
      hull_roughness: 150,
      antifouling_age: 12,
      vessel_speed: 12.0,
      days_since_cleaning: 30
    });
    setVesselInfo({
      name: '',
      type: '',
      length: '',
      beam: '',
      draft: ''
    });
    setLocation({
      latitude: '',
      longitude: '',
      port: ''
    });
    setPrediction(null);
    setShowAlert(false);
    setErrors({});
  };
  
  // Nielsen Heuristic 7: Flexibility and efficiency
  const presets = {
    tropical: { 
      seawater_temperature: 28.0, 
      salinity: 36.0, 
      dissolved_oxygen: 7.0,
      ph: 8.2,
      label: 'Tropical Waters' 
    },
    temperate: { 
      seawater_temperature: 22.0, 
      salinity: 34.0, 
      dissolved_oxygen: 9.0,
      ph: 8.0,
      label: 'Temperate Waters' 
    },
    arctic: { 
      seawater_temperature: 5.0, 
      salinity: 32.0, 
      dissolved_oxygen: 12.0,
      ph: 7.8,
      label: 'Arctic Waters' 
    }
  };
  
  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      ...presets[preset]
    }));
  };
  
  // Removed unused styles variable
  
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white flex items-center justify-center gap-2">
          <FaShip className="text-cyan-400" />
          Biofouling Growth Predictor
        </h2>
      </div>
      
      {/* Alert for high fouling */}
      {showAlert && prediction && (
        <Alert
          type="warning"
          title="Cleaning Recommended"
          message={`Hull cleaning is recommended. Current fouling level: ${prediction.prediction?.biofouling_level}%. Risk category: ${prediction.prediction?.risk_category}`}
          onDismiss={() => setShowAlert(false)}
        />
      )}
      
      {/* General Error Alert */}
      {errors.general && (
        <Alert
          type="error"
          title="Prediction Error"
          message={errors.general}
          onDismiss={() => setErrors({})}
        />
      )}
      
      {/* Quick Presets */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Environmental Presets</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs transition-colors border border-white/30"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section - Left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Environmental Conditions */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-5 border border-white/10">
            <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-cyan-300" />
              Environmental Conditions
            </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seawater Temperature */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Seawater Temperature (°C)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Optimal growth: 25-30°C"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="45"
                value={formData.seawater_temperature}
                onChange={(e) => handleInputChange('seawater_temperature', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="25.0"
              />
            </div>
            
            {/* Salinity */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Salinity (PSU)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Optimal growth: 34-38 PSU"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="50"
                value={formData.salinity}
                onChange={(e) => handleInputChange('salinity', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="35.0"
              />
            </div>
            
            {/* Dissolved Oxygen */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Dissolved Oxygen (mg/L)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Affects marine life and biofouling growth"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="20"
                value={formData.dissolved_oxygen}
                onChange={(e) => handleInputChange('dissolved_oxygen', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="8.0"
              />
            </div>
            
            {/* pH Level */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                pH Level
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Optimal marine pH: 7.8-8.2"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="6.0"
                max="9.0"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="8.1"
              />
            </div>
            
            {/* Current Velocity */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Current Velocity (m/s)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Higher currents reduce fouling"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="10"
                value={formData.current_velocity}
                onChange={(e) => handleInputChange('current_velocity', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="0.5"
              />
            </div>
            
            {/* Hull Roughness */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Hull Roughness (μm)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Surface roughness affects fouling attachment"
                />
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                max="1000"
                value={formData.hull_roughness}
                onChange={(e) => handleInputChange('hull_roughness', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="150"
              />
            </div>
            
            {/* Antifouling Age */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Antifouling Age (months)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Age of antifouling coating"
                />
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                max="60"
                value={formData.antifouling_age}
                onChange={(e) => handleInputChange('antifouling_age', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="12"
              />
            </div>
            
            {/* Vessel Speed */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Vessel Speed (knots)
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Lower speeds increase fouling risk"
                />
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="50"
                value={formData.vessel_speed}
                onChange={(e) => handleInputChange('vessel_speed', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="12.0"
              />
            </div>
            
            {/* Days Since Cleaning */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 flex items-center gap-1">
                Days Since Hull Cleaning
                <FaInfoCircle 
                  className="text-cyan-300 text-xs cursor-help" 
                  title="Fouling accumulates over time"
                />
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                max="365"
                value={formData.days_since_cleaning}
                onChange={(e) => handleInputChange('days_since_cleaning', e.target.value)}
                className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-cyan-400 transition-all duration-200 bg-white/90 shadow-sm border-gray-300 focus:border-cyan-500 text-gray-800"
                placeholder="30"
              />
            </div>
          </div>
          
          </div>
          
          {/* Vessel Information */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-5 border border-white/10">
            <h4 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              <FaShip className="text-cyan-300" />
              Vessel Information (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-1">Vessel Name</label>
                <input 
                  type="text"
                  value={vesselInfo.name}
                  onChange={(e) => handleVesselInfoChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white/90 text-gray-800 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  placeholder="Enter vessel name"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Vessel Type</label>
                <input 
                  type="text"
                  value={vesselInfo.type}
                  onChange={(e) => handleVesselInfoChange('type', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white/90 text-gray-800 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  placeholder="e.g., Container ship"
                />
              </div>
            </div>
          </div>
          
          
          {/* Generate Prediction Button */}
          <div>
            <button
              onClick={generatePrediction}
              disabled={isCalculating}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Generating Prediction...
                </span>
              ) : (
                'Generate ML Prediction'
              )}
            </button>
          </div>
        </div>
        
        
        {/* Prediction Results - Right side */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md rounded-xl p-6 border-2 border-green-400/30 shadow-2xl">
              <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-2">
                <FaChartBar className="text-green-400" />
                Prediction Results
              </h3>
              
              {isCalculating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent mb-4"></div>
                    <p className="text-green-100 font-medium">Analyzing...</p>
                  </div>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  {/* Biofouling Level - Main Result */}
                  <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl p-6 border border-blue-400/50">
                    <div className="text-center">
                      <div className="text-blue-200 text-sm font-medium mb-2">BIOFOULING LEVEL</div>
                      <div className="text-5xl font-bold text-white mb-3">
                        {prediction.prediction?.biofouling_level}%
                      </div>
                      <StatusBadge status={prediction.prediction?.risk_category?.toLowerCase() || 'low'} />
                      <div className="mt-4">
                        <ProgressBar progress={prediction.prediction?.biofouling_level || 0} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Confidence Score */}
                  <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-4 border border-cyan-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-cyan-300" />
                      <span className="text-cyan-100 font-medium text-sm">CONFIDENCE</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(prediction.prediction?.confidence_score * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Risk Category */}
                  <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FaExclamationTriangle className="text-orange-300" />
                      <span className="text-orange-100 font-medium text-sm">RISK LEVEL</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {prediction.prediction?.risk_category}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {prediction.prediction?.recommended_action && (
                    <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-400/40">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-yellow-300 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-200 mb-2 text-sm">RECOMMENDATIONS</h4>
                          <p className="text-yellow-100 text-xs leading-relaxed">
                            {prediction.prediction.recommended_action}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Model Information */}
                  <div className="bg-gray-600/20 backdrop-blur-md rounded-lg p-4 border border-gray-400/30">
                    <h4 className="font-semibold text-gray-200 mb-3 text-sm">MODEL INFO</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Method:</span>
                        <span className="text-white font-medium">{prediction.modelInfo?.method || 'ML Model'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Version:</span>
                        <span className="text-white font-medium">{prediction.modelInfo?.version || '1.0.0'}</span>
                      </div>
                      {prediction.modelInfo?.processingTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time:</span>
                          <span className="text-white font-medium">{prediction.modelInfo.processingTime}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Warning if fallback method was used */}
                  {prediction.warning && (
                    <div className="bg-orange-500/20 backdrop-blur-md rounded-lg p-4 border border-orange-500/40">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-orange-200 mb-1 text-sm">NOTICE</h4>
                          <p className="text-orange-100 text-xs">
                            {prediction.warning}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaChartBar className="text-green-300/50 text-4xl mx-auto mb-4" />
                  <p className="text-green-100/70 text-sm">
                    Generate a prediction to see results
                  </p>
                </div>
              )}
              
              {/* Reset Button */}
              {prediction && (
                <div className="mt-6 pt-4 border-t border-green-400/30">
                  <button
                    onClick={handleReset}
                    className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/30 transition-colors text-sm"
                  >
                    Reset Form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Information Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-cyan-300 text-lg mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">How It Works</h3>
            <p className="text-cyan-100 text-sm mb-3">
              Our advanced ML model analyzes environmental and operational parameters to predict biofouling risk. 
              The model considers water temperature, salinity, dissolved oxygen, pH levels, current velocity, hull condition, 
              antifouling coating age, vessel speed, and cleaning history to provide accurate predictions with confidence scores.
            </p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
              <FaClock className="text-cyan-300" />
              <span className="text-white text-sm font-medium">
                All predictions are automatically saved to your history for future reference and analysis.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiofoulingPredictor;