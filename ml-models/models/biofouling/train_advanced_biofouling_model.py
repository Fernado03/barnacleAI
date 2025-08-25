#!/usr/bin/env python3
"""
Advanced Biofouling Prediction Model Training with Real Data
Uses the enriched SEA maritime dataset to train and compare multiple ML models,
perform feature importance analysis, and identify the best performing model.

SVR model removed to reduce training time.
"""

import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
import pickle
import os
from typing import Dict, List, Tuple, Any

# Machine Learning imports
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, f_regression, mutual_info_regression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, explained_variance_score
from sklearn.inspection import permutation_importance

# ML Models
from sklearn.ensemble import (
    RandomForestRegressor, 
    GradientBoostingRegressor, 
    ExtraTreesRegressor,
    AdaBoostRegressor
)
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.tree import DecisionTreeRegressor
# SVR removed to reduce training time

# Advanced models
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False

warnings.filterwarnings('ignore')

class AdvancedBiofoulingTrainer:
    """Advanced biofouling prediction model trainer using real maritime data"""
    
    def __init__(self, csv_path: str, random_state: int = 42):
        self.csv_path = csv_path
        self.random_state = random_state
        np.random.seed(random_state)
        
        # Core features for biofouling prediction based on memory specifications
        self.core_features = [
            'sst_c',                    # Sea surface temperature (seawater_temperature)
            'sss_psu',                  # Sea surface salinity (salinity) 
            'chlor_a_mg_m3',           # Dissolved oxygen proxy
            'curr_speed_mps',          # Current velocity
            'vessel_speed',            # Vessel speed
            'days_since_clean_clean',  # Days since cleaning (from memory: use col 40)
            'wind_speed_mps',          # Environmental factor
            'hull_area_m2',            # Hull roughness proxy
            'idle_hours'               # Operational factor
        ]
        
        # Derived features to engineer
        self.derived_features = [
            'temp_salinity_interaction',
            'speed_current_ratio', 
            'environmental_stress_index',
            'operational_efficiency'
        ]
        
        self.models = {}
        self.results = {}
        self.feature_importance = {}
        
    def load_and_preprocess_data(self) -> pd.DataFrame:
        """Load and preprocess the CSV dataset"""
        print(f"Loading data from {self.csv_path}...")
        
        # Load data
        df = pd.read_csv(self.csv_path)
        print(f"Loaded {len(df)} records with {len(df.columns)} columns")
        
        # Basic data cleaning
        print("Preprocessing data...")
        
        # Handle missing values for core features
        for feature in self.core_features:
            if feature in df.columns:
                df[feature] = pd.to_numeric(df[feature], errors='coerce')
                # Use median for numerical imputation, but ensure no NaN remains
                median_val = df[feature].median()
                if pd.isna(median_val):
                    # If median is NaN (all values missing), use reasonable defaults
                    default_values = {
                        'sst_c': 27.0,
                        'sss_psu': 35.0,
                        'chlor_a_mg_m3': 1.0,
                        'curr_speed_mps': 0.5,
                        'vessel_speed': 10.0,
                        'days_since_clean_clean': 90.0,
                        'wind_speed_mps': 5.0,
                        'hull_area_m2': 1000.0,
                        'idle_hours': 12.0
                    }
                    fill_value = default_values.get(feature, 0.0)
                else:
                    fill_value = median_val
                df[feature].fillna(fill_value, inplace=True)
        
        # Ensure target variable is numeric
        df['fouling_percent'] = pd.to_numeric(df['fouling_percent'], errors='coerce')
        
        # Remove records with missing target
        df = df.dropna(subset=['fouling_percent'])
        
        # Filter for reasonable ranges
        df = df[
            (df['fouling_percent'] >= 0) & 
            (df['fouling_percent'] <= 100) &
            (df['sst_c'] > 0) & (df['sst_c'] < 40) &
            (df['sss_psu'] > 20) & (df['sss_psu'] < 50) &
            (df['days_since_clean_clean'] >= 0) & (df['days_since_clean_clean'] <= 365)
        ]
        
        print(f"After preprocessing: {len(df)} records")
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Engineer additional features for improved prediction"""
        print("Engineering features...")
        
        # Temperature-salinity interaction
        df['temp_salinity_interaction'] = df['sst_c'] * df['sss_psu'] / 1000
        
        # Speed to current ratio (avoid division by zero)
        df['speed_current_ratio'] = df['vessel_speed'] / (df['curr_speed_mps'] + 0.1)
        
        # Environmental stress index
        df['environmental_stress_index'] = (
            abs(df['sst_c'] - 27) * 2 +  # Optimal temp around 27°C
            abs(df['sss_psu'] - 35) * 3 +  # Optimal salinity around 35 PSU
            df['wind_speed_mps'] * 0.5
        )
        
        # Operational efficiency score
        df['operational_efficiency'] = (
            df['vessel_speed'] * 2 - 
            df['idle_hours'] * 0.5 - 
            df['days_since_clean_clean'] * 0.1
        )
        
        # Ensure no NaN values in engineered features
        for feature in self.derived_features:
            if feature in df.columns:
                df[feature].fillna(df[feature].median(), inplace=True)
                # Double-check for any remaining NaN
                if df[feature].isna().any():
                    df[feature].fillna(0.0, inplace=True)
        
        return df
    
    def prepare_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """Prepare feature matrix and target vector"""
        
        # Combine core and derived features
        all_features = self.core_features + self.derived_features
        
        # Ensure all features exist
        available_features = [f for f in all_features if f in df.columns]
        print(f"Using {len(available_features)} features: {available_features}")
        
        # Final NaN check and cleaning
        feature_df = df[available_features].copy()
        
        # Check for any remaining NaN values
        nan_counts = feature_df.isna().sum()
        if nan_counts.sum() > 0:
            print(f"Warning: Found NaN values in features: {nan_counts[nan_counts > 0].to_dict()}")
            # Fill any remaining NaN with median or 0
            for col in feature_df.columns:
                if feature_df[col].isna().any():
                    median_val = feature_df[col].median()
                    fill_val = median_val if not pd.isna(median_val) else 0.0
                    feature_df[col].fillna(fill_val, inplace=True)
        
        # Final verification
        assert not feature_df.isna().any().any(), "NaN values still present after cleaning!"
        
        X = feature_df.values
        y = df['fouling_percent'].values
        
        print(f"Feature matrix shape: {X.shape}")
        print(f"NaN check - X contains NaN: {np.isnan(X).any()}, y contains NaN: {np.isnan(y).any()}")
        
        return X, y, available_features
    
    def setup_models(self):
        """Setup all models to train and compare"""
        
        models = {
            'Random Forest': RandomForestRegressor(
                n_estimators=100, 
                random_state=self.random_state,
                n_jobs=-1
            ),
            'Gradient Boosting': GradientBoostingRegressor(
                n_estimators=100,
                random_state=self.random_state
            ),
            'Extra Trees': ExtraTreesRegressor(
                n_estimators=100,
                random_state=self.random_state,
                n_jobs=-1
            ),
            'Ridge': Ridge(random_state=self.random_state),
            'Lasso': Lasso(random_state=self.random_state),
            'ElasticNet': ElasticNet(random_state=self.random_state),
            'Decision Tree': DecisionTreeRegressor(random_state=self.random_state),
            'AdaBoost': AdaBoostRegressor(random_state=self.random_state)
        }
        
        # Add advanced models if available
        if XGBOOST_AVAILABLE:
            models['XGBoost'] = xgb.XGBRegressor(
                n_estimators=100,
                random_state=self.random_state,
                verbosity=0
            )
        
        if LIGHTGBM_AVAILABLE:
            models['LightGBM'] = lgb.LGBMRegressor(
                n_estimators=100,
                random_state=self.random_state,
                verbosity=-1
            )
        
        self.models = models
    
    def evaluate_model(self, model, X_train, X_test, y_train, y_test, model_name: str) -> Dict:
        """Evaluate a single model and return comprehensive metrics"""
        
        # Train model
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)
        
        # Calculate metrics
        metrics = {
            'model_name': model_name,
            'train_r2': r2_score(y_train, y_pred_train),
            'test_r2': r2_score(y_test, y_pred_test),
            'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
            'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
            'train_mae': mean_absolute_error(y_train, y_pred_train),
            'test_mae': mean_absolute_error(y_test, y_pred_test),
            'explained_variance': explained_variance_score(y_test, y_pred_test),
            'overfitting_score': r2_score(y_train, y_pred_train) - r2_score(y_test, y_pred_test)
        }
        
        # Cross-validation score
        try:
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
            metrics['cv_mean'] = cv_scores.mean()
            metrics['cv_std'] = cv_scores.std()
        except Exception as e:
            print(f"CV failed for {model_name}: {e}")
            metrics['cv_mean'] = 0
            metrics['cv_std'] = 0
        
        return metrics
    
    def calculate_feature_importance(self, model, X_test, y_test, feature_names: List[str]) -> Dict:
        """Calculate feature importance using multiple methods"""
        
        importance_scores = {}
        
        # Model-specific feature importance
        if hasattr(model, 'feature_importances_'):
            importance_scores['model_importance'] = dict(zip(feature_names, model.feature_importances_))
        elif hasattr(model, 'coef_'):
            importance_scores['model_importance'] = dict(zip(feature_names, np.abs(model.coef_)))
        
        # Permutation importance
        try:
            perm_importance = permutation_importance(
                model, X_test, y_test, 
                n_repeats=5, 
                random_state=self.random_state
            )
            importance_scores['permutation_importance'] = dict(
                zip(feature_names, perm_importance.importances_mean)
            )
        except Exception as e:
            print(f"Permutation importance failed: {e}")
        
        return importance_scores
    
    def optimize_best_models(self, X_train, y_train, X_test, y_test, feature_names: List[str], top_n=3):
        """Optimize hyperparameters for the best performing models"""
        
        print(f"\nOptimizing top {top_n} models...")
        
        # Simplified parameter grids to avoid timeout
        param_grids = {
            'Random Forest': {
                'n_estimators': [100, 200],
                'max_depth': [10, 20],
                'min_samples_split': [2, 5]
            },
            'Extra Trees': {
                'n_estimators': [100, 200],
                'max_depth': [10, 20],
                'min_samples_split': [2, 5]
            },
            'XGBoost': {
                'n_estimators': [100, 200],
                'learning_rate': [0.1, 0.15],
                'max_depth': [5, 7]
            } if XGBOOST_AVAILABLE else {}
        }
        
        # Get top models by test R² (only those that trained successfully)
        successful_results = {name: result for name, result in self.results.items() 
                            if 'metrics' in result and 'test_r2' in result['metrics']}
        
        if not successful_results:
            print("No successful models to optimize!")
            return {}
        
        top_models = sorted(
            [(name, result['metrics']['test_r2']) for name, result in successful_results.items()],
            key=lambda x: x[1], 
            reverse=True
        )[:top_n]
        
        optimized_results = {}
        
        for model_name, test_r2 in top_models:
            if model_name in param_grids and param_grids[model_name]:
                print(f"  Optimizing {model_name} (current R²: {test_r2:.4f})...")
                
                try:
                    search = GridSearchCV(
                        self.models[model_name],
                        param_grids[model_name],
                        cv=3,
                        scoring='r2',
                        n_jobs=1,  # Reduce parallelism to avoid memory issues
                        verbose=0
                    )
                    
                    search.fit(X_train, y_train)
                    
                    # Evaluate optimized model
                    optimized_metrics = self.evaluate_model(
                        search.best_estimator_, X_train, X_test, y_train, y_test, 
                        f"{model_name} (Optimized)"
                    )
                    
                    optimized_results[f"{model_name} (Optimized)"] = {
                        'metrics': optimized_metrics,
                        'best_params': search.best_params_,
                        'model': search.best_estimator_
                    }
                    
                    print(f"    Optimization complete. New R²: {optimized_metrics['test_r2']:.4f}")
                    
                except Exception as e:
                    print(f"    Optimization failed for {model_name}: {e}")
            else:
                print(f"  Skipping {model_name} (no parameter grid or not trainable)")
        
        return optimized_results
    
    def train_and_evaluate_all(self) -> Dict:
        """Main training and evaluation pipeline"""
        
        # Load and preprocess data
        df = self.load_and_preprocess_data()
        df = self.engineer_features(df)
        
        print(f"\nDataset summary:")
        print(f"Total samples: {len(df)}")
        print(f"Fouling percentage range: {df['fouling_percent'].min():.1f}% - {df['fouling_percent'].max():.1f}%")
        print(f"Mean fouling: {df['fouling_percent'].mean():.1f}%")
        print(f"Std fouling: {df['fouling_percent'].std():.1f}%")
        
        # Prepare features
        X, y, feature_names = self.prepare_features(df)
        
        print(f"\nFeature matrix shape: {X.shape}")
        print(f"Features: {feature_names}")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=self.random_state
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")
        
        # Setup and train models
        self.setup_models()
        
        print(f"\nTraining {len(self.models)} models...")
        
        for model_name, model in self.models.items():
            print(f"  Training {model_name}...")
            
            try:
                # Use scaled or unscaled data based on model type
                if model_name in ['Ridge', 'Lasso', 'ElasticNet']:
                    X_tr, X_te = X_train_scaled, X_test_scaled
                else:
                    X_tr, X_te = X_train, X_test
                
                metrics = self.evaluate_model(model, X_tr, X_te, y_train, y_test, model_name)
                
                # Calculate feature importance
                importance = self.calculate_feature_importance(model, X_te, y_test, feature_names)
                
                self.results[model_name] = {
                    'metrics': metrics,
                    'importance': importance,
                    'model': model
                }
                
                print(f"    Test R²: {metrics['test_r2']:.4f}, RMSE: {metrics['test_rmse']:.2f}")
                
            except Exception as e:
                print(f"    Error training {model_name}: {e}")
                continue
        
        # Optimize best models
        optimized_results = self.optimize_best_models(X_train, y_train, X_test, y_test, feature_names)
        
        # Combine results
        final_results = {
            'base_results': self.results,
            'optimized_results': optimized_results,
            'feature_names': feature_names,
            'scaler': scaler,
            'data_info': {
                'n_samples': len(df),
                'n_features': len(feature_names),
                'train_size': len(X_train),
                'test_size': len(X_test),
                'target_stats': {
                    'mean': float(y.mean()),
                    'std': float(y.std()),
                    'min': float(y.min()),
                    'max': float(y.max())
                }
            }
        }
        
        return final_results
    
    def analyze_feature_importance(self, results: Dict) -> Dict:
        """Comprehensive feature importance analysis"""
        
        print("\nAnalyzing feature importance...")
        
        feature_scores = {}
        for feature in results['feature_names']:
            feature_scores[feature] = []
        
        # Collect importance scores from all models
        all_results = {**results['base_results'], **results['optimized_results']}
        
        for model_name, result in all_results.items():
            if 'importance' in result:
                for importance_type, importance_dict in result['importance'].items():
                    for feature, score in importance_dict.items():
                        feature_scores[feature].append(score)
        
        # Calculate summary statistics
        feature_importance_summary = {}
        for feature, scores in feature_scores.items():
            if scores:
                feature_importance_summary[feature] = {
                    'mean_importance': np.mean(scores),
                    'std_importance': np.std(scores),
                    'max_importance': np.max(scores),
                    'count': len(scores)
                }
        
        # Rank features
        ranked_features = sorted(
            feature_importance_summary.items(),
            key=lambda x: x[1]['mean_importance'],
            reverse=True
        )
        
        return {
            'feature_importance_summary': feature_importance_summary,
            'ranked_features': ranked_features
        }
    
    def generate_report(self, results: Dict, feature_analysis: Dict) -> str:
        """Generate comprehensive training report"""
        
        report = []
        report.append("=" * 80)
        report.append("BIOFOULING PREDICTION MODEL TRAINING REPORT")
        report.append("=" * 80)
        report.append(f"Training Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Dataset: {os.path.basename(self.csv_path)}")
        report.append(f"Total Samples: {results['data_info']['n_samples']:,}")
        report.append(f"Features Used: {results['data_info']['n_features']}")
        report.append(f"Train/Test Split: {results['data_info']['train_size']:,}/{results['data_info']['test_size']:,}")
        
        # Target variable statistics
        stats = results['data_info']['target_stats']
        report.append(f"Fouling Range: {stats['min']:.1f}% - {stats['max']:.1f}%")
        report.append(f"Mean Fouling: {stats['mean']:.1f}% ± {stats['std']:.1f}%")
        report.append("")
        
        # Find best model
        all_results = {**results['base_results'], **results['optimized_results']}
        best_model = max(all_results.items(), key=lambda x: x[1]['metrics']['test_r2'])
        best_name, best_result = best_model
        best_metrics = best_result['metrics']
        
        report.append("BEST MODEL PERFORMANCE")
        report.append("-" * 40)
        report.append(f"Model: {best_name}")
        report.append(f"Test R²: {best_metrics['test_r2']:.4f}")
        report.append(f"Test RMSE: {best_metrics['test_rmse']:.2f}%")
        report.append(f"Test MAE: {best_metrics['test_mae']:.2f}%")
        report.append(f"Cross-validation R²: {best_metrics['cv_mean']:.4f} ± {best_metrics['cv_std']:.4f}")
        report.append(f"Explained Variance: {best_metrics['explained_variance']:.4f}")
        report.append(f"Overfitting Score: {best_metrics['overfitting_score']:.4f}")
        report.append("")
        
        # Top 10 models comparison
        report.append("MODEL COMPARISON (Top 10)")
        report.append("-" * 40)
        
        model_scores = [(name, result['metrics']['test_r2'], result['metrics']['test_rmse']) 
                       for name, result in all_results.items()]
        model_scores.sort(key=lambda x: x[1], reverse=True)
        
        report.append(f"{'Rank':<4} {'Model':<25} {'Test R²':<10} {'RMSE':<8}")
        report.append("-" * 50)
        
        for i, (name, r2, rmse) in enumerate(model_scores[:10], 1):
            report.append(f"{i:<4} {name:<25} {r2:<10.4f} {rmse:<8.2f}")
        
        report.append("")
        
        # Feature importance
        report.append("FEATURE IMPORTANCE ANALYSIS")
        report.append("-" * 40)
        
        report.append(f"{'Rank':<4} {'Feature':<30} {'Importance':<12} {'Std':<8}")
        report.append("-" * 58)
        
        for i, (feature, importance_data) in enumerate(feature_analysis['ranked_features'], 1):
            report.append(f"{i:<4} {feature:<30} {importance_data['mean_importance']:<12.6f} {importance_data['std_importance']:<8.6f}")
        
        report.append("")
        
        # Feature insights
        report.append("KEY INSIGHTS & RECOMMENDATIONS")
        report.append("-" * 40)
        
        top_features = feature_analysis['ranked_features'][:5]
        report.append("Top 5 Most Influential Features:")
        for i, (feature, _) in enumerate(top_features, 1):
            report.append(f"  {i}. {feature}")
        
        report.append("")
        report.append("Feature Insights:")
        
        feature_insights = {
            'days_since_clean_clean': "Time since cleaning is the primary driver of biofouling accumulation",
            'sst_c': "Sea surface temperature affects organism growth rates and metabolism",
            'sss_psu': "Salinity influences marine organism survival in different environments",
            'vessel_speed': "Higher speeds reduce organism settlement through hydrodynamic forces",
            'curr_speed_mps': "Current velocity affects nutrient transport and organism settlement",
            'temp_salinity_interaction': "Combined temperature-salinity effects on biological activity",
            'environmental_stress_index': "Environmental conditions impact fouling organism survival",
            'operational_efficiency': "Vessel operational patterns influence fouling accumulation"
        }
        
        for feature, _ in top_features:
            if feature in feature_insights:
                report.append(f"• {feature}: {feature_insights[feature]}")
        
        report.append("")
        report.append("RECOMMENDATIONS:")
        report.append("1. Monitor days since cleaning as the primary indicator")
        report.append("2. Consider environmental conditions (temperature, salinity) in planning")
        report.append("3. Optimize vessel speed and operational patterns")
        report.append("4. Use ensemble methods (Random Forest, XGBoost) for best accuracy")
        report.append("5. Regular model retraining with new data recommended")
        
        return "\n".join(report)
    
    def save_best_model(self, results: Dict, output_dir: str = "."):
        """Save the best performing model"""
        
        # Find best model
        all_results = {**results['base_results'], **results['optimized_results']}
        best_name, best_result = max(all_results.items(), key=lambda x: x[1]['metrics']['test_r2'])
        
        model_data = {
            'model': best_result['model'],
            'scaler': results['scaler'],
            'feature_names': results['feature_names'],
            'metrics': best_result['metrics'],
            'model_name': best_name
        }
        
        model_path = os.path.join(output_dir, 'best_biofouling_model.pkl')
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"\nBest model ({best_name}) saved to: {model_path}")
        return model_path


def main():
    """Main training pipeline"""
    
    # Configuration
    csv_path = r"c:\Users\Fernado\Desktop\barnacle\demo_biofouling_demo_SEA_all_countries_enriched.csv"
    
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at {csv_path}")
        sys.exit(1)
    
    print("Advanced Biofouling Prediction Model Training")
    print("=" * 50)
    
    # Initialize trainer
    trainer = AdvancedBiofoulingTrainer(csv_path)
    
    # Train and evaluate all models
    results = trainer.train_and_evaluate_all()
    
    # Analyze feature importance
    feature_analysis = trainer.analyze_feature_importance(results)
    
    # Generate report
    report = trainer.generate_report(results, feature_analysis)
    
    # Save report
    report_path = "biofouling_model_training_report.txt"
    with open(report_path, 'w') as f:
        f.write(report)
    
    print(f"\nTraining complete! Report saved to: {report_path}")
    print(report)
    
    # Save best model
    model_path = trainer.save_best_model(results)
    
    return results, feature_analysis

if __name__ == "__main__":
    results, feature_analysis = main()
