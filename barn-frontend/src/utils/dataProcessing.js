/**
 * Data Processing Utilities for BarnaClean Marine Analytics
 * Handles CSV parsing, biofouling calculations, and marine data analysis
 * Follows Jakob Nielsen's Heuristic 1: Visibility of System Status
 */

// Mock CSV data - In production, this would be loaded from actual CSV files
export const DEMO_BIOFOULING_DATA = [
  {
    vessel_id: "VSL_2000",
    mmsi: "300000000",
    imo: "9100000",
    vessel_type: "container",
    hull_area_m2: 3548,
    coating: "epoxy",
    timestamp: "2024-01-01 12:00:00",
    date: "2024-01-01",
    lat: 3.821248,
    lon: 91.850316,
    mean_speed_knots: 8.17,
    vessel_speed: 8.17,
    idle_hours: 1.12,
    idle_time: 1.12,
    stop_duration: 0.0,
    sst_c: 23.65,
    sea_temperature: 23.65,
    sss_psu: 36.51,
    salinity: 36.51,
    chlor_a_mg_m3: 0.717,
    wind_speed_mps: 4.87,
    wind_dir_deg: 273.9,
    wind_direction: 273.9,
    curr_speed_mps: 0.94,
    curr_dir: 177.8,
    current_speed: 0.94,
    current_direction: 177.8,
    ocean_current: 0.94,
    voyage_id: "VG_VSL_2000_2024_2091",
    last_clean_date: "2023-11-18",
    days_since_clean: 44,
    fouling_percent: 82.49,
    fouling_class: "high",
    fuel_consumption_tpd: 0.422
  },
  {
    vessel_id: "VSL_2000",
    mmsi: "300000000",
    imo: "9100000",
    vessel_type: "container",
    hull_area_m2: 3548,
    coating: "epoxy",
    timestamp: "2024-02-12 12:00:00",
    date: "2024-02-12",
    lat: 3.545923,
    lon: 92.218985,
    mean_speed_knots: 0.19,
    vessel_speed: 0.19,
    idle_hours: 18.03,
    idle_time: 18.03,
    stop_duration: 18.03,
    sst_c: 23.07,
    sea_temperature: 23.07,
    sss_psu: 35.22,
    salinity: 35.22,
    chlor_a_mg_m3: 0.03,
    wind_speed_mps: 9.23,
    wind_dir_deg: 323.3,
    wind_direction: 323.3,
    curr_speed_mps: 0.26,
    curr_dir: 13.2,
    current_speed: 0.26,
    current_direction: 13.2,
    ocean_current: 0.26,
    voyage_id: "VG_VSL_2000_2024_1888",
    last_clean_date: "2024-02-12",
    days_since_clean: 0,
    fouling_percent: 0.0,
    fouling_class: "clean",
    fuel_consumption_tpd: 0.05
  },
  {
    vessel_id: "VSL_2000",
    mmsi: "300000000",
    imo: "9100000",
    vessel_type: "container",
    hull_area_m2: 3548,
    coating: "epoxy",
    timestamp: "2024-03-15 12:00:00",
    date: "2024-03-15",
    lat: 2.614948,
    lon: 92.949924,
    mean_speed_knots: 13.43,
    vessel_speed: 13.43,
    idle_hours: 0.05,
    idle_time: 0.05,
    stop_duration: 0.0,
    sst_c: 24.28,
    sea_temperature: 24.28,
    sss_psu: 35.68,
    salinity: 35.68,
    chlor_a_mg_m3: 0.42,
    wind_speed_mps: 10.58,
    wind_dir_deg: 185.6,
    wind_direction: 185.6,
    curr_speed_mps: 1.14,
    curr_dir: 50.3,
    current_speed: 1.14,
    current_direction: 50.3,
    ocean_current: 1.14,
    voyage_id: "VG_VSL_2000_2024_120",
    last_clean_date: "2024-02-12",
    days_since_clean: 32,
    fouling_percent: 57.76,
    fouling_class: "medium",
    fuel_consumption_tpd: 1.962
  }
];

/**
 * Calculate biofouling growth based on environmental factors
 * @param {Object} conditions - Environmental conditions
 * @returns {Object} Prediction results
 */
export const calculateBiofoulingPrediction = (conditions) => {
  const { seaTemperature, salinity, vesselSpeed = 10, idleTime = 0, daysSinceClean = 0 } = conditions;
  
  // Biofouling growth rate calculation (simplified algorithm)
  const tempFactor = Math.max(0, (seaTemperature - 20) / 10); // Optimal growth around 25-30°C
  const salinityFactor = Math.max(0, Math.min(1, (salinity - 30) / 10)); // Optimal salinity 35-40 PSU
  const speedFactor = Math.max(0.1, 1 - (vesselSpeed / 20)); // Lower speed = more growth
  const idleFactor = 1 + (idleTime / 24) * 0.5; // Idle time increases growth
  
  // Base growth rate per day (0-5%)
  const baseGrowthRate = 2.0;
  const environmentalMultiplier = tempFactor * salinityFactor * speedFactor * idleFactor;
  const dailyGrowthRate = baseGrowthRate * environmentalMultiplier;
  
  // Calculate current fouling percentage
  const currentFouling = Math.min(100, daysSinceClean * dailyGrowthRate);
  
  // Classify fouling level
  let foulingClass = 'clean';
  if (currentFouling > 70) foulingClass = 'high';
  else if (currentFouling > 30) foulingClass = 'medium';
  else if (currentFouling > 10) foulingClass = 'low';
  
  // Calculate fuel penalty (up to 30% increase)
  const fuelPenaltyPercent = (currentFouling / 100) * 30;
  const baseFuelConsumption = 2.0; // tpd
  const currentFuelConsumption = baseFuelConsumption * (1 + fuelPenaltyPercent / 100);
  
  // Calculate speed reduction
  const speedReduction = (currentFouling / 100) * 15; // Up to 15% speed reduction
  
  return {
    foulingPercent: Math.round(currentFouling * 100) / 100,
    foulingClass,
    fuelPenaltyPercent: Math.round(fuelPenaltyPercent * 100) / 100,
    fuelConsumption: Math.round(currentFuelConsumption * 100) / 100,
    speedReduction: Math.round(speedReduction * 100) / 100,
    dailyGrowthRate: Math.round(dailyGrowthRate * 100) / 100,
    recommendedCleaning: currentFouling > 80,
    nextPredictedCleaning: Math.ceil((90 - currentFouling) / dailyGrowthRate)
  };
};

/**
 * Process fleet data for dashboard display
 * @param {Array} rawData - Raw vessel data
 * @returns {Object} Processed fleet statistics
 */
export const processFleetData = (rawData = DEMO_BIOFOULING_DATA) => {
  const vessels = rawData.map(record => ({
    id: record.vessel_id,
    name: `Harbour ${record.vessel_id.split('_')[1]}`,
    status: determineVesselStatus(record),
    foulingPercent: record.fouling_percent,
    foulingClass: record.fouling_class,
    fuelPenalty: `+${record.fuel_consumption_tpd.toFixed(1)}/h`,
    destination: getRandomDestination(),
    daysSinceClean: record.days_since_clean,
    location: { lat: record.lat, lon: record.lon },
    environmentalData: {
      seaTemperature: record.sea_temperature,
      salinity: record.salinity,
      windSpeed: record.wind_speed_mps,
      currentSpeed: record.current_speed
    }
  }));
  
  const totalVessels = vessels.length;
  const activeVessels = vessels.filter(v => v.status === 'En Route').length;
  const avgFuelPenalty = vessels.reduce((sum, v) => {
    const fuelPenaltyStr = v.fuelPenalty || '+0.0/h';
    if (fuelPenaltyStr.length > 4) {
      const numericPart = parseFloat(fuelPenaltyStr.slice(1, -2));
      return sum + (numericPart || 0);
    }
    return sum;
  }, 0) / totalVessels;
  const maintenanceFlags = vessels.filter(v => v.foulingClass === 'high').length;
  
  return {
    vessels,
    summary: {
      totalVessels,
      activeVessels,
      idleVessels: totalVessels - activeVessels,
      avgFuelPenalty: `+${avgFuelPenalty.toFixed(1)}/h`,
      maintenanceFlags
    }
  };
};

/**
 * Generate time series data for charts
 * @param {Array} rawData - Raw historical data
 * @returns {Array} Time series data points
 */
export const generateTimeSeriesData = (rawData = DEMO_BIOFOULING_DATA) => {
  return rawData.map(record => ({
    date: record.date,
    foulingPercent: record.fouling_percent,
    fuelConsumption: record.fuel_consumption_tpd,
    speedReduction: calculateSpeedReduction(record.fouling_percent),
    environmentalScore: calculateEnvironmentalScore(record)
  }));
};

/**
 * Calculate environmental score based on conditions
 * @param {Object} record - Data record
 * @returns {number} Environmental score (0-100)
 */
const calculateEnvironmentalScore = (record) => {
  const tempScore = Math.max(0, 100 - Math.abs(record.sea_temperature - 25) * 4);
  const salinityScore = Math.max(0, 100 - Math.abs(record.salinity - 35) * 2);
  const currentScore = Math.max(0, 100 - record.current_speed * 20);
  
  return Math.round((tempScore + salinityScore + currentScore) / 3);
};

/**
 * Calculate speed reduction based on fouling percentage
 * @param {number} foulingPercent - Current fouling percentage
 * @returns {number} Speed reduction percentage
 */
const calculateSpeedReduction = (foulingPercent) => {
  return Math.round((foulingPercent / 100) * 15 * 100) / 100; // Up to 15% reduction
};

/**
 * Determine vessel status based on data
 * @param {Object} record - Vessel data record
 * @returns {string} Vessel status
 */
const determineVesselStatus = (record) => {
  if (record.vessel_speed < 1) return 'Idle';
  if (record.fouling_class === 'high') return 'Maintenance';
  if (record.vessel_speed > 10) return 'En Route';
  return 'Docked';
};

/**
 * Get random destination for demo purposes
 * @returns {string} Port destination
 */
const getRandomDestination = () => {
  const ports = [
    'Port Klang',
    'Tanjung Pelepas Port',
    'Bintulu Port',
    'Kuantan Port',
    'Penang Port',
    'Johor Port'
  ];
  return ports[Math.floor(Math.random() * ports.length)];
};

/**
 * Format number with appropriate units
 * @param {number} value - Numeric value
 * @param {string} unit - Unit type
 * @returns {string} Formatted string
 */
export const formatValue = (value, unit) => {
  // Handle undefined or null values
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  // Ensure value is a number
  const numValue = Number(value);
  
  switch (unit) {
    case 'temperature':
      return `${numValue.toFixed(1)}°C`;
    case 'salinity':
      return `${numValue.toFixed(1)} PSU`;
    case 'speed':
      return `${numValue.toFixed(1)} knots`;
    case 'percentage':
      return `${numValue.toFixed(1)}%`;
    case 'fuel':
      return `${numValue.toFixed(2)} tpd`;
    default:
      return numValue.toString();
  }
};

/**
 * Get fouling status color and styling
 * @param {string} foulingClass - Fouling classification
 * @returns {Object} Style configuration
 */
export const getFoulingStyles = (foulingClass) => {
  const styles = {
    clean: {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600'
    },
    low: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600'
    },
    medium: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    },
    high: {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600'
    }
  };
  
  return styles[foulingClass] || styles.clean;
};

/**
 * Validate environmental input data
 * @param {Object} data - Input data to validate
 * @returns {Object} Validation result
 */
export const validateEnvironmentalData = (data) => {
  const errors = {};
  
  if (!data.seaTemperature || data.seaTemperature < -2 || data.seaTemperature > 40) {
    errors.seaTemperature = 'Sea temperature must be between -2°C and 40°C';
  }
  
  if (!data.salinity || data.salinity < 0 || data.salinity > 45) {
    errors.salinity = 'Salinity must be between 0 and 45 PSU';
  }
  
  if (data.vesselSpeed !== undefined && (data.vesselSpeed < 0 || data.vesselSpeed > 30)) {
    errors.vesselSpeed = 'Vessel speed must be between 0 and 30 knots';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};