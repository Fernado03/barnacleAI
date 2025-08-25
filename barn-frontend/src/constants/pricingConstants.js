export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    iconName: 'FaShip',
    iconColor: 'text-blue-500',
    description: 'Perfect for small shipping companies',
    monthlyPrice: 299,
    annualPrice: 2990,
    vesselsIncluded: 3,
    features: [
      'Biofouling Prediction Model',
      'Basic Route Optimization',
      'Fuel Savings Dashboard',
      'Email Support',
      'Monthly Reports',
      'API Access (Limited)'
    ],
    popular: false,
    savingsEstimate: '15-20% fuel reduction'
  },
  professional: {
    name: 'Professional',
    iconName: 'FaIndustry',
    iconColor: 'text-green-500',
    description: 'Ideal for medium-sized fleets',
    monthlyPrice: 799,
    annualPrice: 7990,
    vesselsIncluded: 10,
    features: [
      'Advanced AI Prediction Models',
      'Full Route Optimization (A*)',
      'Real-time Weather Integration',
      'ESG Impact Tracking',
      'Priority Support',
      'Weekly Analytics Reports',
      'Full API Access',
      'Custom Integrations'
    ],
    popular: true,
    savingsEstimate: '20-30% fuel reduction'
  },
  enterprise: {
    name: 'Enterprise',
    iconName: 'FaCrown',
    iconColor: 'text-purple-500',
    description: 'For large fleet operations',
    monthlyPrice: 1999,
    annualPrice: 19990,
    vesselsIncluded: 25,
    features: [
      'Complete BarnaClean Suite',
      'Multi-fleet Management',
      'Advanced Predictive Analytics',
      'Custom AI Model Training',
      'Dedicated Account Manager',
      '24/7 Premium Support',
      'Real-time Monitoring',
      'Compliance Reporting',
      'White-label Options'
    ],
    popular: false,
    savingsEstimate: '25-35% fuel reduction'
  }
};

export const FLEET_CALCULATOR_CONFIG = {
  basePrice: 150, // Per vessel per month
  volumeDiscounts: {
    tier1: { minVessels: 5, discount: 0.1 },
    tier2: { minVessels: 10, discount: 0.15 },
    tier3: { minVessels: 20, discount: 0.2 }
  },
  annualDiscount: 0.1, // 10% annual discount
  fuelCostAssumptions: {
    avgFuelConsumptionPerDay: 50, // tons
    avgFuelPricePerTon: 600, // USD
    daysPerYear: 365,
    avgSavingsPercent: 0.25 // 25% average savings
  }
};