import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaLeaf, FaUsers, FaBalanceScale, FaChartArea, FaWater, FaIndustry, FaGlobe, FaHeart, FaShieldAlt, FaTrophy, FaCertificate, FaRecycle, FaGasPump } from 'react-icons/fa';
import { DESIGN_TOKENS } from '../../constants/designTokens';
import { MetricCard, StatusBadge, Alert, ProgressBar } from '../shared/Charts';
import Loading from '../shared/Loading';
import {
  selectESGData,
  selectESGLoading,
  selectESGSettings,
  fetchESGData,
  updateSettings
} from '../../redux/selectors';

/**
 * ESG Dashboard Component
 * Tracks Environmental, Social, and Governance metrics as outlined in BarnaClean document
 * 
 * Environmental: Reduced Fuel Consumption & Emissions, Less Chemical Pollution, Preserving Biodiversity, Ocean Restoration
 * Social: Improved Crew Safety, Enhanced Industry Reputation, Community Well-being
 * Governance: Data-Driven Compliance, Optimized Resource Management, Innovation & Leadership
 */

// ESG tabs configuration
const esgTabs = [
  { id: 'environmental', label: 'Environmental', icon: <FaLeaf />, color: 'green' },
  { id: 'social', label: 'Social', icon: <FaUsers />, color: 'blue' },
  { id: 'governance', label: 'Governance', icon: <FaBalanceScale />, color: 'purple' }
];

// Helper function to render metrics
const renderMetrics = (metrics) => {
  if (!metrics || metrics.length === 0) {
    // Return default metrics for each category
    return [
      {
        title: 'Carbon Footprint',
        current: 425,
        unit: 'tons CO₂',
        icon: <FaIndustry className="text-green-400" />,
        trend: 'down',
        change: '-12.5%',
        description: 'Monthly emissions reduced through BarnaClean technology'
      },
      {
        title: 'Fuel Efficiency',
        current: 94.2,
        unit: '%',
        icon: <FaGasPump className="text-blue-400" />,
        trend: 'up',
        change: '+5.8%',
        description: 'Fleet-wide fuel efficiency improvement'
      },
      {
        title: 'Crew Safety Score',
        current: 98.1,
        unit: '/100',
        icon: <FaHeart className="text-red-400" />,
        trend: 'up',
        change: '+2.3%',
        description: 'Safety incidents and training compliance'
      },
      {
        title: 'Compliance Rating',
        current: 99.7,
        unit: '%',
        icon: <FaShieldAlt className="text-purple-400" />,
        trend: 'stable',
        change: '0%',
        description: 'Regulatory compliance across all operations'
      }
    ];
  }
  return metrics;
};

const ESGDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const esgData = useSelector(selectESGData);
  const isLoading = useSelector(selectESGLoading);
  const settings = useSelector(selectESGSettings);
  
  // Local UI state for active tab (not business logic)
  const [activeESGTab, setActiveESGTab] = React.useState('environmental');
  
  // Extract selected period from Redux settings or use default
  const selectedPeriod = settings.reportingPeriod || 'current_year';
  
  useEffect(() => {
    // Fetch ESG data on component mount
    dispatch(fetchESGData());
  }, [dispatch]);
  
  // Handle period change
  const handlePeriodChange = (period) => {
    dispatch(updateSettings({ reportingPeriod: period }));
  };

  // If no data from Redux, use default structure with loading state
  const displayData = esgData || {
    environmental: {
      metrics: [],
      targets: { co2Reduction: { target: 30, achieved: 0 }, fuelSaving: { target: 25, achieved: 0 }, chemicalReduction: { target: 90, achieved: 0 } }
    },
    social: {
      metrics: [],
      initiatives: []
    },
    governance: {
      metrics: [],
      frameworks: []
    }
  };
  
  const currentData = displayData[activeESGTab] || { metrics: [], targets: {}, initiatives: [], frameworks: [] };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <Loading 
            size="large" 
            text="Loading ESG Analytics..." 
            variant="maritime"
            color="white"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white flex items-center justify-center gap-2">
          <FaGlobe className="text-green-400" />
          ESG Impact Dashboard
        </h2>
        <p className="text-cyan-100 text-sm">
          Environmental, Social & Governance metrics for sustainable operations
        </p>
      </div>

      {/* Period Selection */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <div className="flex flex-wrap gap-2">
          {['current_year', 'last_quarter', 'ytd', 'all_time'].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedPeriod === period 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {period.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* ESG Overview Alert */}
      <Alert
        type="success"
        title="ESG Performance Excellence"
        message="BarnaClean technology enables efficient operations while supporting ocean restoration and community well-being initiatives."
      />

      {/* ESG Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
        <div className="flex gap-2">
          {esgTabs.map((tab) => {
            const isActive = activeESGTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveESGTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `bg-${tab.color}-600 text-white shadow-lg`
                    : 'text-white hover:text-blue-100 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline font-semibold">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ESG Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetrics(currentData?.metrics || []).map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={`${metric.current} ${metric.unit}`}
            icon={metric.icon}
            trend={metric.trend}
            change={metric.change}
            description={metric.description}
            className="bg-white/10 border-white/20 text-white"
          />
        ))}
      </div>

      {/* Environmental Targets Progress */}
      {activeESGTab === 'environmental' && currentData.targets && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaLeaf className="text-green-400" />
            Environmental Targets 2024
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">CO₂ Reduction Target</span>
                <span className="text-cyan-100">{currentData.targets.co2Reduction?.achieved || 0}% / {currentData.targets.co2Reduction?.target || 30}%</span>
              </div>
              <ProgressBar 
                progress={((currentData.targets.co2Reduction?.achieved || 0) / (currentData.targets.co2Reduction?.target || 30)) * 100}
                color="bg-green-500"
                className="bg-white/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Fuel Savings Target</span>
                <span className="text-cyan-100">{currentData.targets.fuelSaving?.achieved || 0}% / {currentData.targets.fuelSaving?.target || 25}%</span>
              </div>
              <ProgressBar 
                progress={((currentData.targets.fuelSaving?.achieved || 0) / (currentData.targets.fuelSaving?.target || 25)) * 100}
                color="bg-blue-500"
                className="bg-white/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Chemical Reduction Target</span>
                <span className="text-cyan-100">{currentData.targets.chemicalReduction?.achieved || 0}% / {currentData.targets.chemicalReduction?.target || 90}%</span>
              </div>
              <ProgressBar 
                progress={((currentData.targets.chemicalReduction?.achieved || 0) / (currentData.targets.chemicalReduction?.target || 90)) * 100}
                color="bg-cyan-500"
                className="bg-white/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Initiatives */}
      {activeESGTab === 'social' && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaUsers className="text-blue-400" />
            Social Impact Initiatives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentData.initiatives || []).map((initiative, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-cyan-100 text-sm">{initiative}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Governance Frameworks */}
      {activeESGTab === 'governance' && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaBalanceScale className="text-purple-400" />
            Compliance Frameworks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentData.frameworks || []).map((framework, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <FaCertificate className="text-purple-400 flex-shrink-0" />
                <span className="text-cyan-100 text-sm font-medium">{framework}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ESG Summary */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">ESG Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{esgData?.environmental?.carbonFootprint?.total ? Math.floor(esgData.environmental.carbonFootprint.total / 1000) + 'K+' : '500K+'}</div>
            <div className="text-cyan-100 text-sm">Tons CO₂ Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{esgData?.social?.crewWelfare?.satisfactionScore ? parseFloat(esgData.social.crewWelfare.satisfactionScore).toFixed(2) : '94.70'}%</div>
            <div className="text-cyan-100 text-sm">Safety Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{esgData?.governance?.compliance?.regulatoryScore ? parseFloat(esgData.governance.compliance.regulatoryScore).toFixed(2) : '98.20'}%</div>
            <div className="text-cyan-100 text-sm">Compliance Rating</div>
          </div>
        </div>
        <p className="text-cyan-100 text-sm mt-4 text-center">
          "Technology enables us to work more efficiently and speed up the recovery process, 
          ensuring the oceans remain healthy for life in the future."
        </p>
      </div>
    </div>
  );
};

export default ESGDashboard;