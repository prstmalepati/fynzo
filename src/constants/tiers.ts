/**
 * 3-Tier Subscription Model
 * Free → Premium Single → Premium Couples (Partner Card)
 */

export type TierType = 'free' | 'premium' | 'couples';

export interface TierLimits {
  maxAssets: number;
  projectionYears: number;
  bankConnections: number;
  maxScenarios: number;
  users: number;
  exportFrequency: 'daily' | 'weekly' | 'unlimited';
  advancedProjections: boolean;
  couplesProjection: boolean;
  monteCarlo: boolean;
  pdfReports: boolean;
  prioritySupport: boolean;
  liveMarketPrices: boolean;
  csvImport: boolean;
  allTaxCalcs: boolean;
}

export const TIER_LIMITS: Record<TierType, TierLimits> = {
  free: {
    maxAssets: 10,
    projectionYears: 5,
    bankConnections: 0,
    maxScenarios: 0,
    users: 1,
    exportFrequency: 'weekly',
    advancedProjections: false,
    couplesProjection: false,
    monteCarlo: false,
    pdfReports: false,
    prioritySupport: false,
    liveMarketPrices: false,
    csvImport: false,
    allTaxCalcs: false,
  },
  premium: {
    maxAssets: 999,
    projectionYears: 50,
    bankConnections: 10,
    maxScenarios: 10,
    users: 1,
    exportFrequency: 'unlimited',
    advancedProjections: true,
    couplesProjection: false,
    monteCarlo: true,
    pdfReports: true,
    prioritySupport: true,
    liveMarketPrices: true,
    csvImport: true,
    allTaxCalcs: true,
  },
  couples: {
    maxAssets: 999,
    projectionYears: 50,
    bankConnections: 10,
    maxScenarios: 10,
    users: 2,
    exportFrequency: 'unlimited',
    advancedProjections: true,
    couplesProjection: true,
    monteCarlo: true,
    pdfReports: true,
    prioritySupport: true,
    liveMarketPrices: true,
    csvImport: true,
    allTaxCalcs: true,
  },
};

export const TIER_INFO = {
  free: {
    name: 'Free',
    tagline: 'Get started — no card required',
    features: [
      'Up to 10 investments',
      'Basic dashboard & charts',
      '5-year wealth projection',
      '1 tax calculator (your country)',
      'Goal tracker (3 goals)',
      'Weekly data export',
    ],
  },
  premium: {
    name: 'Premium',
    tagline: 'For serious wealth builders',
    features: [
      'Everything in Free',
      'Unlimited investments',
      '50-year projections',
      'All 4 tax calculators (DE, US, CA, IN)',
      'Scenario branching',
      'Live market prices',
      'CSV broker import',
      'PDF reports & analytics',
      'Priority support',
    ],
  },
  couples: {
    name: 'Couples',
    tagline: 'One subscription, two partners',
    features: [
      'Everything in Premium',
      'Partner card — invite your partner',
      'Joint wealth projection',
      'Combined net worth dashboard',
      'Shared goals & scenarios',
      'Individual + merged tax views',
      'Household FIRE calculator',
      'Partner activity feed',
    ],
  },
};

// ─── Purchasing Power Parity Pricing ──────────────────────────
// Prices calibrated to local purchasing power
export const TIER_PRICES: Record<string, { premium: { monthly: number; annual: number }; couples: { monthly: number; annual: number } }> = {
  EUR: { premium: { monthly: 2.99, annual: 29 },    couples: { monthly: 3.99, annual: 39 } },
  USD: { premium: { monthly: 2.99, annual: 29 },    couples: { monthly: 4.49, annual: 44 } },
  GBP: { premium: { monthly: 2.49, annual: 24 },    couples: { monthly: 3.49, annual: 34 } },
  CAD: { premium: { monthly: 3.99, annual: 39 },    couples: { monthly: 5.49, annual: 54 } },
  INR: { premium: { monthly: 149,  annual: 1499 },  couples: { monthly: 199,  annual: 1999 } },
  CHF: { premium: { monthly: 2.99, annual: 29 },    couples: { monthly: 4.49, annual: 44 } },
};

export function getTierPrice(currency: string, tier: 'premium' | 'couples', period: 'monthly' | 'annual'): number {
  const prices = TIER_PRICES[currency] || TIER_PRICES.EUR;
  return prices[tier][period];
}

export function getAnnualSavings(currency: string, tier: 'premium' | 'couples'): number {
  const prices = TIER_PRICES[currency] || TIER_PRICES.EUR;
  const monthly = prices[tier].monthly * 12;
  const annual = prices[tier].annual;
  return Math.round(((monthly - annual) / monthly) * 100);
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', CAD: 'C$', INR: '₹', CHF: 'CHF' };
  return symbols[currency] || '€';
}
