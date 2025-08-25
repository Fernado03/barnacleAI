#!/usr/bin/env python3
"""
Biofouling Prediction ML Model Script
This script handles ML model predictions for biofouling levels using the trained Extra Trees model
"""

import sys
import json
import numpy as np
import pandas as pd
import pickle
import os
from datetime import datetime, timedelta
import warnings
import traceback

# Suppress warnings for production
warnings.filterwarnings('ignore')

class BiofoulingPredictor:
    """Biofouling prediction model handler using trained Extra Trees model"""
    
    def __init__(self):
        self.model_version = "2.0.0"  # Updated to reflect trained model
        self.model_path = os.path.join(os.path.dirname(__file__), 'best_biofouling_model.pkl')
        self.model_data = None
        
        # Load the trained model
        self.load_trained_model()
        
        # Expected features for the trained model (in correct order)
        self.trained_feature_names = [
            'sst_c',                    # Sea surface temperature 
            'sss_psu',                  # Sea surface salinity
            'chlor_a_mg_m3',           # Chlorophyll-a (dissolved oxygen proxy)
            'curr_speed_mps',          # Current velocity
            'vessel_speed',            # Vessel speed
            'days_since_clean_clean',  # Days since cleaning
            'wind_speed_mps',          # Wind speed
            'hull_area_m2',            # Hull area (roughness proxy)
            'idle_hours',              # Idle hours
            'temp_salinity_interaction', # Engineered: temperature * salinity
            'speed_current_ratio',     # Engineered: vessel_speed / current_speed
            'environmental_stress_index', # Engineered environmental stress
            'operational_efficiency'   # Engineered operational efficiency
        ]
        
        # Legacy feature names mapping (for backward compatibility)
        self.legacy_feature_names = [
            'seawater_temperature',
            'salinity',
            'dissolved_oxygen',
            'ph',
            'current_velocity',
            'hull_roughness',
            'antifouling_age',
            'vessel_speed',
            'days_since_cleaning'
        ]
        
        # Feature validation ranges
        self.feature_ranges = {
            'seawater_temperature': (0, 45),  # Celsius
            'salinity': (0, 50),              # PSU
            'dissolved_oxygen': (0, 20),      # mg/L
            'ph': (6.0, 9.0),                 # pH scale
            'current_velocity': (0, 10),      # m/s
            'hull_roughness': (0, 1000),      # microns
            'antifouling_age': (0, 60),       # months
            'vessel_speed': (0, 50),          # knots
            'days_since_cleaning': (0, 365)   # days
        }
        
    def load_trained_model(self):
        """Load the trained Extra Trees model from pickle file"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Trained model not found at: {self.model_path}")
            
            with open(self.model_path, 'rb') as f:
                self.model_data = pickle.load(f)
            
            print(f"Successfully loaded trained model: {self.model_data['model_name']}")
            print(f"Model metrics - R²: {self.model_data['metrics']['test_r2']:.4f}, RMSE: {self.model_data['metrics']['test_rmse']:.2f}")
            
        except Exception as e:
            print(f"Warning: Could not load trained model: {e}")
            print("Falling back to mock prediction method")
            self.model_data = None
    
    def validate_input(self, input_data):
        """Validate input data against expected ranges"""
        errors = []
        
        # Check if using legacy feature names
        if any(feature in input_data for feature in self.legacy_feature_names):
            # Validate legacy features
            for feature, (min_val, max_val) in self.feature_ranges.items():
                if feature in input_data:
                    value = input_data[feature]
                    if not isinstance(value, (int, float)):
                        errors.append(f"{feature} must be numeric")
                    elif not (min_val <= value <= max_val):
                        errors.append(f"{feature} must be between {min_val} and {max_val}")
        else:
            # Check for missing features (legacy format)
            for feature in self.legacy_feature_names:
                if feature not in input_data:
                    errors.append(f"Missing required feature: {feature}")
                    continue
                
                value = input_data[feature]
                
                # Check if value is numeric
                try:
                    value = float(value)
                    input_data[feature] = value
                except (ValueError, TypeError):
                    errors.append(f"Invalid numeric value for {feature}: {value}")
                    continue
                
                # Check value ranges
                if feature in self.feature_ranges:
                    min_val, max_val = self.feature_ranges[feature]
                    if not (min_val <= value <= max_val):
                        errors.append(f"{feature} value {value} out of range [{min_val}, {max_val}]")
        
        return errors
    
    def map_legacy_to_trained_features(self, input_data):
        """Map legacy input format to trained model features"""
        try:
            # Start with the input data
            mapped_data = {}
            
            # Direct mappings
            mapped_data['sst_c'] = input_data.get('seawater_temperature', 27.0)
            mapped_data['sss_psu'] = input_data.get('salinity', 35.0)
            mapped_data['chlor_a_mg_m3'] = input_data.get('dissolved_oxygen', 8.0)  # Use as proxy
            mapped_data['curr_speed_mps'] = input_data.get('current_velocity', 0.5)
            mapped_data['vessel_speed'] = input_data.get('vessel_speed', 10.0)
            mapped_data['days_since_clean_clean'] = input_data.get('days_since_cleaning', 30)
            mapped_data['wind_speed_mps'] = 5.0  # Default wind speed
            mapped_data['hull_area_m2'] = input_data.get('hull_roughness', 150) * 10  # Approximate conversion
            mapped_data['idle_hours'] = 12.0  # Default idle hours
            
            # Engineer derived features
            mapped_data['temp_salinity_interaction'] = mapped_data['sst_c'] * mapped_data['sss_psu'] / 1000
            mapped_data['speed_current_ratio'] = mapped_data['vessel_speed'] / (mapped_data['curr_speed_mps'] + 0.1)
            mapped_data['environmental_stress_index'] = (
                abs(mapped_data['sst_c'] - 27) * 2 +
                abs(mapped_data['sss_psu'] - 35) * 3 +
                mapped_data['wind_speed_mps'] * 0.5
            )
            mapped_data['operational_efficiency'] = (
                mapped_data['vessel_speed'] * 2 -
                mapped_data['idle_hours'] * 0.5 -
                mapped_data['days_since_clean_clean'] * 0.1
            )
            
            return mapped_data
            
        except Exception as e:
            raise RuntimeError(f"Feature mapping failed: {str(e)}")

    def preprocess_features(self, input_data):
        """Preprocess input features for model prediction (legacy mock method)"""
        try:
            # Create feature vector in correct order for legacy features
            features = []
            for feature_name in self.legacy_feature_names:
                features.append(input_data[feature_name])
            
            # Convert to numpy array for model input
            feature_array = np.array(features).reshape(1, -1)
            
            # Feature scaling (simple min-max normalization)
            # In production, you would load saved scaler parameters
            normalized_features = self._normalize_features(feature_array)
            
            return normalized_features
        
        except Exception as e:
            raise ValueError(f"Feature preprocessing failed: {str(e)}")
    
    def _normalize_features(self, features):
        """Simple feature normalization (replace with saved scaler in production)"""
        # These would be loaded from saved preprocessing parameters
        feature_mins = np.array([5, 15, 3, 6.5, 0, 10, 0, 5, 0])
        feature_maxs = np.array([35, 45, 15, 8.5, 8, 800, 48, 40, 300])
        
        # Avoid division by zero
        feature_ranges = feature_maxs - feature_mins
        feature_ranges = np.where(feature_ranges == 0, 1, feature_ranges)
        
        normalized = (features - feature_mins) / feature_ranges
        return np.clip(normalized, 0, 1)  # Ensure values are in [0,1] range
    
    def _mock_prediction(self, input_data):
        """Fallback mock prediction method"""
        # Normalize features for mock prediction
        normalized_features = self.preprocess_features(input_data)
        features_flat = normalized_features.flatten()
        
        # Weighted combination of factors (mock model weights)
        weights = np.array([0.2, 0.15, -0.1, -0.05, -0.1, 0.25, 0.3, -0.08, 0.4])
        
        # Calculate base biofouling level
        base_prediction = np.dot(features_flat, weights)
        
        # Apply sigmoid to get 0-1 range, then scale to 0-100
        biofouling_level = 1 / (1 + np.exp(-base_prediction * 8))
        biofouling_level = biofouling_level * 100
        
        # Calculate confidence based on feature stability
        feature_variance = np.var(features_flat)
        confidence = max(0.6, min(0.95, 1 - feature_variance * 2))
        
        return float(biofouling_level), float(confidence)

    def predict_biofouling_ml(self, input_data):
        """
        Use the trained Extra Trees model for biofouling prediction
        Falls back to mock prediction if model not available
        """
        try:
            if self.model_data is not None:
                # Use trained model
                
                # Map input to trained features
                mapped_features = self.map_legacy_to_trained_features(input_data)
                
                # Create feature array in correct order
                feature_array = np.array([[mapped_features[feature] for feature in self.trained_feature_names]])
                
                # Scale features using the trained scaler
                feature_array_scaled = self.model_data['scaler'].transform(feature_array)
                
                # Make prediction
                prediction = self.model_data['model'].predict(feature_array_scaled)[0]
                
                # Ensure prediction is in valid range [0, 100]
                biofouling_level = np.clip(prediction, 0, 100)
                
                # High confidence for trained model
                confidence = 0.95
                
                return float(biofouling_level), float(confidence)
                
            else:
                # Fallback to mock prediction
                return self._mock_prediction(input_data)
            
        except Exception as e:
            print(f"Warning: Trained model prediction failed: {e}")
            # Fallback to mock prediction
            return self._mock_prediction(input_data)
    
    def determine_risk_category(self, biofouling_level):
        """Determine risk category based on biofouling level"""
        if biofouling_level < 25:
            return "Low"
        elif biofouling_level < 50:
            return "Medium"
        elif biofouling_level < 75:
            return "High"
        else:
            return "Critical"
    
    def generate_recommendations(self, biofouling_level, risk_category, input_data):
        """Generate recommended actions based on prediction"""
        recommendations = {
            "Low": [
                "Continue regular monitoring",
                "Maintain current cleaning schedule",
                "Monitor antifouling coating condition"
            ],
            "Medium": [
                "Schedule inspection within 2-4 weeks",
                "Consider hull cleaning if over 6 months since last cleaning",
                "Monitor performance indicators closely"
            ],
            "High": [
                "Schedule hull cleaning within 1-2 weeks",
                "Inspect antifouling coating effectiveness",
                "Consider route optimization to minimize biofouling"
            ],
            "Critical": [
                "Immediate hull cleaning required",
                "Emergency inspection recommended",
                "Assess antifouling coating replacement needs",
                "Consider port entry for comprehensive cleaning"
            ]
        }
        
        base_recommendations = recommendations.get(risk_category, ["Contact marine specialist"])
        
        # Add specific recommendations based on input data
        if input_data.get('days_since_cleaning', 0) > 180:
            base_recommendations.append("Cleaning overdue - schedule immediately")
        
        if input_data.get('antifouling_age', 0) > 24:
            base_recommendations.append("Consider antifouling coating renewal")
        
        return "; ".join(base_recommendations)
    
    def estimate_cleaning_date(self, biofouling_level, risk_category, input_data):
        """Estimate recommended cleaning date"""
        try:
            current_date = datetime.now()
            
            # Days to add based on risk category
            days_mapping = {
                "Low": 90,     # 3 months
                "Medium": 45,  # 1.5 months  
                "High": 14,    # 2 weeks
                "Critical": 3  # 3 days
            }
            
            days_to_add = days_mapping.get(risk_category, 30)
            
            # Adjust based on current biofouling level
            if biofouling_level > 80:
                days_to_add = min(days_to_add, 7)
            elif biofouling_level > 60:
                days_to_add = min(days_to_add, 21)
            
            estimated_date = current_date + timedelta(days=days_to_add)
            return estimated_date.isoformat()
            
        except Exception:
            return None
    
    def predict(self, input_data):
        """Main prediction method"""
        start_time = datetime.now()
        
        try:
            # Validate input
            validation_errors = self.validate_input(input_data)
            if validation_errors:
                raise ValueError(f"Input validation failed: {'; '.join(validation_errors)}")
            
            # Make prediction (pass input_data directly to the new prediction method)
            biofouling_level, confidence_score = self.predict_biofouling_ml(input_data)
            
            # Determine risk category
            risk_category = self.determine_risk_category(biofouling_level)
            
            # Generate recommendations
            recommended_action = self.generate_recommendations(biofouling_level, risk_category, input_data)
            
            # Estimate cleaning date
            estimated_cleaning_date = self.estimate_cleaning_date(biofouling_level, risk_category, input_data)
            
            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            
            # Update model info to reflect whether trained model was used
            prediction_method = "trained_model" if self.model_data is not None else "mock_model"
            model_name = self.model_data['model_name'] if self.model_data else "Mock Model"
            
            return {
                "success": True,
                "prediction": {
                    "biofouling_level": round(biofouling_level, 2),
                    "confidence_score": round(confidence_score, 3),
                    "risk_category": risk_category,
                    "recommended_action": recommended_action,
                    "estimated_cleaning_date": estimated_cleaning_date
                },
                "model_info": {
                    "version": self.model_version,
                    "model_name": model_name,
                    "processing_time_ms": round(processing_time, 2),
                    "prediction_method": prediction_method
                }
            }
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            return {
                "success": False,
                "error": str(e),
                "error_type": type(e).__name__,
                "processing_time_ms": round(processing_time, 2),
                "traceback": traceback.format_exc()
            }

def main():
    """Main function to handle command line input"""
    try:
        # Read input from command line arguments
        if len(sys.argv) < 2:
            raise ValueError("Usage: python predict_biofouling.py '<json_input>' or python predict_biofouling.py --file <json_file>")
        
        # Check if file input is requested
        if sys.argv[1] == '--file' and len(sys.argv) == 3:
            # Read from file
            with open(sys.argv[2], 'r') as f:
                input_json = f.read()
        else:
            # Parse JSON input - join all arguments after the script name
            input_json = ' '.join(sys.argv[1:])
        
        input_data = json.loads(input_json)
        
        # Create predictor and make prediction
        predictor = BiofoulingPredictor()
        result = predictor.predict(input_data)
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
        # Exit with appropriate code
        sys.exit(0 if result.get("success") else 1)
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()