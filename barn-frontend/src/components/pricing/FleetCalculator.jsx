import React from 'react';
import { FaCalculator, FaDollarSign, FaRocket, FaStar, FaCheck } from 'react-icons/fa';
import { MetricCard } from '../shared/Charts';
import { useMaritimeNotifications } from '../../hooks/useMaritimeNotifications';

const FleetCalculator = ({ fleetSize, setFleetSize, calculatedSavings }) => {
  const notifications = useMaritimeNotifications();

  // Handle fleet size change with notification
  const handleFleetSizeChange = (newSize) => {
    setFleetSize(newSize);
    notifications.fleet.reportGenerated(`Fleet calculation updated for ${newSize} vessels`);
  };

  // Prevent from ROI to be displayed
  // Notify when significant savings are calculated
  /*
  useEffect(() => {
    if (calculatedSavings && calculatedSavings.roi > 200) {
      notifications.user.actionCompleted(
        `Excellent ROI calculated: ${calculatedSavings.roi.toFixed(0)}% return on investment`
      );
    }
  }, [calculatedSavings]); // Remove notifications from dependencies to prevent infinite loop
  */
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FaCalculator className="text-cyan-400" />
          Fleet Licensing Calculator
        </h2>
        <p className="text-cyan-100">
          Calculate your custom fleet pricing and potential savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Number of Vessels in Fleet
            </label>
            <input 
              type="number"
              min="1"
              max="100"
              value={fleetSize}
              onChange={(e) => handleFleetSizeChange(parseInt(e.target.value) || 1)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-cyan-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Monthly Cost"
              value={`$${calculatedSavings?.monthlyFleetCost.toLocaleString()}`}
              icon={<FaDollarSign className="text-green-400" />}
              className="bg-white/10 border-white/20"
            />
            <MetricCard
              title="Annual Cost"
              value={`$${calculatedSavings?.annualFleetCost.toLocaleString()}`}
              icon={<FaDollarSign className="text-blue-400" />}
              className="bg-white/10 border-white/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Projected Annual Savings</h3>
          
          <MetricCard
            title="Fuel Cost Savings"
            value={`$${calculatedSavings?.totalFuelSavings.toLocaleString()}`}
            icon={<FaRocket className="text-green-500" />}
            trend="positive"
            className="bg-white/10 border-white/20"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="ROI"
              value={`${calculatedSavings?.roi.toFixed(0)}%`}
              icon={<FaStar className="text-yellow-400" />}
              trend="positive"
              className="bg-white/10 border-white/20"
            />
            <MetricCard
              title="Break-even"
              value={`${calculatedSavings?.breakEvenMonths} months`}
              icon={<FaCheck className="text-green-400" />}
              className="bg-white/10 border-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetCalculator;