import React, { useState, useEffect, useCallback } from 'react';
import { Fish, Whale, Octopus, Seahorse } from '../components/shared/MarineElement';

// Pricing Components
import {
  PricingHeader,
  PricingCard,
  FleetCalculator,
  ContactSection
} from '../components/pricing';

// Constants
import { PRICING_PLANS, FLEET_CALCULATOR_CONFIG } from '../constants/pricingConstants';

/**
 * Pricing Page Component
 * Implements Revenue Streams from BarnaClean Document:
 * 1. Software as a Service (SaaS) - Monthly/Annual subscriptions
 * 2. Fleet-Level Licensing - Based on number of vessels
 * 
 * Features:
 * - Subscription tiers for different company sizes
 * - Fleet licensing calculator
 * - ROI and savings projections
 * - Contact information for enterprise sales
 */

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingPeriod, setBillingPeriod] = useState('annual');
  const [fleetSize, setFleetSize] = useState(5);
  const [calculatedSavings, setCalculatedSavings] = useState(null);

  // Use pricing plans from constants
  const pricingPlans = PRICING_PLANS;

  // Fleet licensing calculator
  const calculateFleetLicensing = useCallback(() => {
    const { basePrice, volumeDiscounts, annualDiscount, fuelCostAssumptions } = FLEET_CALCULATOR_CONFIG;
    
    // Calculate volume discount
    let volumeDiscount = 0;
    if (fleetSize >= volumeDiscounts.tier3.minVessels) {
      volumeDiscount = volumeDiscounts.tier3.discount;
    } else if (fleetSize >= volumeDiscounts.tier2.minVessels) {
      volumeDiscount = volumeDiscounts.tier2.discount;
    } else if (fleetSize >= volumeDiscounts.tier1.minVessels) {
      volumeDiscount = volumeDiscounts.tier1.discount;
    }
    
    const monthlyFleetCost = fleetSize * basePrice * (1 - volumeDiscount);
    const annualFleetCost = monthlyFleetCost * 12 * (1 - annualDiscount);
    
    // Fuel savings calculation
    const { avgFuelConsumptionPerDay, avgFuelPricePerTon, daysPerYear, avgSavingsPercent } = fuelCostAssumptions;
    const avgFuelCostPerVesselPerYear = avgFuelConsumptionPerDay * daysPerYear * avgFuelPricePerTon;
    const totalFuelSavings = fleetSize * avgFuelCostPerVesselPerYear * avgSavingsPercent;
    const roi = ((totalFuelSavings - annualFleetCost) / annualFleetCost) * 100;
    
    setCalculatedSavings({
      monthlyFleetCost,
      annualFleetCost,
      totalFuelSavings,
      roi,
      breakEvenMonths: Math.ceil(annualFleetCost / (totalFuelSavings / 12))
    });
  }, [fleetSize]);

  useEffect(() => {
    calculateFleetLicensing();
  }, [calculateFleetLicensing]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 pt-32 pb-32 relative overflow-hidden">
      {/* Marine Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 opacity-15">
          <Fish size={120} color="#60a5fa" speed={8} />
        </div>
        <div className="absolute top-1/3 right-16 opacity-20">
          <Whale size={180} color="#1e40af" swimSpeed={12} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-15">
          <Octopus size={140} color="#8b5cf6" waveSpeed={7} />
        </div>
        <div className="absolute top-2/3 right-1/4 opacity-25">
          <Seahorse size={100} color="#f59e0b" swaySpeed={6} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <PricingHeader 
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {Object.entries(pricingPlans).map(([planKey, plan]) => (
            <PricingCard
              key={planKey}
              planKey={planKey}
              plan={plan}
              isSelected={selectedPlan === planKey}
              billingPeriod={billingPeriod}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        {/* Fleet Licensing Calculator */}
        <FleetCalculator
          fleetSize={fleetSize}
          setFleetSize={setFleetSize}
          calculatedSavings={calculatedSavings}
        />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </section>
  );
};

export default Pricing;