import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaRocket, FaShip, FaBrain, FaLeaf, FaChartLine, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../constants/designTokens';
import { MetricCard, StatusBadge, Alert, ProgressBar } from '../components/shared/Charts';
import { Fish, Whale, Octopus, Sailboat, Lighthouse } from '../components/shared/MarineElement';

/**
 * Demo Showcase Page
 * Interactive demonstration of the complete BarnaClean system workflow
 * 
 * Based on BarnaClean document pages 11-12:
 * - Build the interactive map to display the final, optimized route
 * - Show quantified fuel and CO₂ savings
 * - Demonstrate seamless integration of all system components
 * - Showcase the complete AI-driven biofouling prevention workflow
 */

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoData, setDemoData] = useState(null);

  // Generate mock demo data - moved before useEffect to avoid initialization issues
  const generateDemoData = useCallback(() => ({
    vessel: {
      name: 'MV Demo Pacific',
      imo: 'IMO9999999',
      route: 'Singapore → Rotterdam',
      status: 'Under optimization'
    },
    realTime: {
      seaTemp: 28.5,
      salinity: 35.2,
      windSpeed: 12.3,
      waveHeight: 1.8
    },
    predictions: {
      foulingLevel: 42,
      fuelPenalty: 12.5,
      cleaningDate: '2024-03-20'
    },
    savings: {
      fuel: '18.5%',
      cost: '$47,200',
      co2: '21.3%',
      time: '14.2 hours'
    }
  }), []);

  // Demo workflow steps based on BarnaClean system
  const demoSteps = useMemo(() => [
    {
      id: 'data_collection',
      title: 'Step 1: Real-Time Data Collection',
      description: 'Gathering AIS data, marine weather conditions, and oceanographic parameters',
      icon: <FaShip className="text-blue-500" />,
      duration: 3000,
      data: {
        ais_vessels: 247,
        weather_stations: 15,
        data_points: 12450,
        update_frequency: '30 seconds'
      }
    },
    {
      id: 'biofouling_analysis',
      title: 'Step 2: AI Biofouling Prediction',
      description: 'Machine learning model analyzes environmental factors to predict barnacle growth',
      icon: <FaBrain className="text-purple-500" />,
      duration: 4000,
      data: {
        model_accuracy: 94.7,
        prediction_horizon: '90 days',
        environmental_factors: 12,
        growth_risk: 'Moderate'
      }
    },
    {
      id: 'route_optimization',
      title: 'Step 3: A* Route Optimization',
      description: 'Intelligent routing considering weather, currents, and predicted hull drag',
      icon: <FaMapMarkerAlt className="text-green-500" />,
      duration: 5000,
      data: {
        route_distance: '11,847 nm',
        fuel_savings: '18.5%',
        time_reduction: '14.2 hours',
        co2_reduction: '21.3%'
      }
    },
    {
      id: 'maintenance_scheduling',
      title: 'Step 4: Maintenance Optimization',
      description: 'AI schedules hull cleaning exactly when needed to maximize efficiency',
      icon: <FaClock className="text-orange-500" />,
      duration: 3500,
      data: {
        next_cleaning: '2024-03-20',
        cost_savings: '$47,200',
        downtime_reduction: '65%',
        efficiency_gain: '12.8%'
      }
    },
    {
      id: 'results_delivery',
      title: 'Step 5: Results & Impact',
      description: 'Real-time dashboard delivers actionable insights and quantified savings',
      icon: <FaChartLine className="text-cyan-500" />,
      duration: 4000,
      data: {
        total_fuel_savings: '30%',
        cost_reduction: '$275,000',
        co2_prevented: '500+ tons',
        roi: '220%'
      }
    }
  ], []);

  useEffect(() => {
    // Initialize demo data immediately
    setDemoData(generateDemoData());
  }, [generateDemoData]);

  // Auto-advance demo steps when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < demoSteps.length - 1) {
      const currentStepData = demoSteps[currentStep];
      interval = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, currentStepData.duration);
    } else if (currentStep >= demoSteps.length - 1) {
      setIsPlaying(false);
    }
    
    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, demoSteps]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (direction) => {
    if (direction === 'next' && currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 pt-32 pb-32 relative overflow-hidden">
      {/* Marine Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 opacity-15">
          <Fish size={100} color="#60a5fa" speed={6} />
        </div>
        <div className="absolute top-1/3 right-16 opacity-20">
          <Whale size={160} color="#1e40af" swimSpeed={10} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-15">
          <Octopus size={120} color="#8b5cf6" waveSpeed={5} />
        </div>
        <div className="absolute top-2/3 right-1/4 opacity-25">
          <Sailboat size={140} hullColor="#6366f1" sailColor="#ffffff" />
        </div>
        <div className="absolute bottom-20 right-12 opacity-20">
          <Lighthouse size={120} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaRocket className="text-4xl text-cyan-400" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Live Demo
            </h1>
          </div>
          <p className="text-cyan-100 text-lg lg:text-xl max-w-3xl mx-auto">
            Experience the complete AI-driven biofouling prevention workflow
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  isPlaying 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
                {isPlaying ? 'Pause Demo' : 'Start Demo'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleStepChange('prev')}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-1 transition-colors"
                >
                  <FaBackward className="text-sm" />
                  Previous
                </button>
                <button
                  onClick={() => handleStepChange('next')}
                  disabled={currentStep === demoSteps.length - 1}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-1 transition-colors"
                >
                  Next
                  <FaForward className="text-sm" />
                </button>
              </div>
              
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Restart
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                Step {currentStep + 1} of {demoSteps.length}
              </div>
              <div className="w-32">
                <ProgressBar 
                  progress={progress} 
                  color="bg-cyan-500" 
                  className="bg-white/20" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Step Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">{currentStepData.icon}</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {currentStepData.title}
              </h2>
            </div>
            <p className="text-cyan-100 text-lg max-w-3xl mx-auto">
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific Data Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(currentStepData.data).map(([key, value], index) => {
              const formatKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const formatValue = typeof value === 'number' && value < 100 ? `${value}%` : value.toString();
              
              return (
                <MetricCard
                  key={index}
                  title={formatKey}
                  value={formatValue}
                  icon={getIconForMetric(key)}
                  trend={getTrend(key)}
                  className="bg-white/10 border-white/20"
                />
              );
            })}
          </div>
        </div>

        {/* Demo Vessel Status */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaShip className="text-cyan-400" />
            Demo Vessel: {demoData?.vessel.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{demoData?.realTime.seaTemp}°C</div>
              <div className="text-cyan-100 text-sm">Sea Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{demoData?.realTime.salinity} PSU</div>
              <div className="text-cyan-100 text-sm">Salinity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{demoData?.predictions.foulingLevel}%</div>
              <div className="text-cyan-100 text-sm">Fouling Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{demoData?.savings.fuel}</div>
              <div className="text-cyan-100 text-sm">Fuel Savings</div>
            </div>
          </div>
        </div>

        {/* Final Results Summary */}
        {currentStep === demoSteps.length - 1 && (
          <Alert
            type="success"
            title="Demo Complete - BarnaClean Impact Delivered!"
            message={`Demonstrated 30% fuel savings potential with $275K annual cost reduction and 500+ tons CO₂ prevention through AI-driven biofouling management.`}
          />
        )}

        {/* Step Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {demoSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-cyan-400 scale-125'
                      : index < currentStep
                        ? 'bg-green-400'
                        : 'bg-white/30'
                  }`}
                  title={step.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper functions
const getIconForMetric = (key) => {
  const iconMap = {
    ais_vessels: <FaShip className="text-blue-400" />,
    model_accuracy: <FaBrain className="text-purple-400" />,
    fuel_savings: <FaLeaf className="text-green-400" />,
    cost_savings: <FaDollarSign className="text-yellow-400" />,
    co2_reduction: <FaLeaf className="text-green-500" />,
    total_fuel_savings: <FaLeaf className="text-green-400" />,
    default: <FaChartLine className="text-cyan-400" />
  };
  return iconMap[key] || iconMap.default;
};

const getTrend = (key) => {
  const positiveTrends = ['fuel_savings', 'cost_savings', 'co2_reduction', 'model_accuracy', 'efficiency_gain'];
  return positiveTrends.includes(key) ? 'positive' : 'neutral';
};

export default Demo;