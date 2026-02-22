/**
 * Tier Limits and Features
 * Defines what Free and Premium users can access
 */

export type TierType = 'free' | 'premium';

export interface TierLimits {
  maxAssets: number;
  projectionYears: number;
  bankConnections: number;
  maxScenarios: number;
  familyMembers: number;
  exportFrequency: 'daily' | 'weekly' | 'unlimited';
  advancedProjections: boolean;
  monteCarlo: boolean;
  pdfReports: boolean;
  prioritySupport: boolean;
}

export const TIER_LIMITS: Record<TierType, TierLimits> = {
  free: {
    maxAssets: 10,
    projectionYears: 5,
    bankConnections: 0,
    maxScenarios: 0,
    familyMembers: 1,
    exportFrequency: 'weekly',
    advancedProjections: false,
    monteCarlo: false,
    pdfReports: false,
    prioritySupport: false
  },
  premium: {
    maxAssets: 999,
    projectionYears: 50,
    bankConnections: 10,
    maxScenarios: 10,
    familyMembers: 5,
    exportFrequency: 'unlimited',
    advancedProjections: true,
    monteCarlo: true,
    pdfReports: true,
    prioritySupport: true
  }
};

export const TIER_FEATURES = {
  free: [
    'Manual asset entry',
    'Basic net worth tracking',
    'Dashboard with charts',
    '5-year wealth projection',
    'FIRE Calculator (all 4 types)',
    'German Tax Calculator',
    'Basic calculators',
    'Up to 20 assets',
    'CSV export (weekly)'
  ],
  premium: [
    'Everything in Free',
    'Auto bank sync (Germany)',
    'Unlimited assets',
    'Unlimited projections (50+ years)',
    'Advanced "what-if" scenarios',
    'Monte Carlo simulations',
    'Family sharing (5 members)',
    'PDF reports & analytics',
    'Priority email support',
    'Early access to new features'
  ]
};

export const TIER_PRICES = {
  monthly: {
    EUR: 2.99,
    USD: 2.99,
    GBP: 2.99,
    INR: 199,
    CAD: 3.99
  },
  annual: {
    EUR: 29,
    USD: 29,
    GBP: 29,
    INR: 1999,
    CAD: 39
  }
};

/**
 * Get tier price in user's currency
 */
export function getTierPrice(currency: string, period: 'monthly' | 'annual'): number {
  return TIER_PRICES[period][currency as keyof typeof TIER_PRICES.monthly] || TIER_PRICES[period].EUR;
}

/**
 * Calculate savings percentage for annual plan
 */
export function getAnnualSavings(currency: string): number {
  const monthly = TIER_PRICES.monthly[currency as keyof typeof TIER_PRICES.monthly] || TIER_PRICES.monthly.EUR;
  const annual = TIER_PRICES.annual[currency as keyof typeof TIER_PRICES.annual] || TIER_PRICES.annual.EUR;
  
  const monthlyAnnual = monthly * 12;
  const savings = ((monthlyAnnual - annual) / monthlyAnnual) * 100;
  
  return Math.round(savings);
}

/**
 * Feature gate messages for premium features
 */
export const PREMIUM_FEATURE_MESSAGES = {
  bankSync: 'Auto bank sync is a Premium feature. Connect your bank accounts to automatically update your net worth.',
  advancedProjections: 'Advanced projections are available in Premium. Create unlimited "what-if" scenarios and see 50+ year projections.',
  familySharing: 'Family sharing is a Premium feature. Track wealth across your household with up to 5 family members.',
  monteCarlo: 'Monte Carlo simulations are available in Premium. See probability-based projections for more accurate planning.',
  pdfReports: 'PDF report generation is a Premium feature. Export professional reports of your financial situation.',
  unlimitedAssets: 'Free tier is limited to 20 assets. Upgrade to Premium for unlimited assets.',
  scenarios: 'Scenario planning is a Premium feature. Model different life events and compare outcomes.'
};
