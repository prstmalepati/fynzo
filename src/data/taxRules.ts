// =============================================================
// data/taxRules.ts — Tax rules to seed in Firestore
// Path in Firestore: tax_rules/{countryCode}/{year}
// =============================================================
// Run this ONCE via a Cloud Function or admin script to populate Firestore.
// Then calculators read from Firestore instead of hardcoded values.

export interface TaxBracket {
  min: number;
  max: number;  // use 999999999 for Infinity
  rate: number;
}

export interface TaxRuleSet {
  country: string;
  countryCode: string;
  year: number;
  currency: string;
  updatedAt: string;
  source: string;
  brackets: {
    single: TaxBracket[];
    married?: TaxBracket[];
  };
  standardDeduction: {
    single: number;
    married?: number;
  };
  socialSecurity: {
    employeeRate: number;
    wageBase: number;
  };
  medicareOrHealth: {
    rate: number;
    additionalRate?: number;
    additionalThreshold?: number;
  };
  notes: string;
}

// ─── Germany 2025 ──────────────────────────────────────────────
export const GERMANY_2025: TaxRuleSet = {
  country: 'Germany', countryCode: 'DE', year: 2025, currency: 'EUR',
  updatedAt: '2025-01-01', source: 'Bundesfinanzministerium Programmablaufplan 2025',
  brackets: {
    single: [
      { min: 0, max: 12084, rate: 0 },        // Grundfreibetrag 2025
      { min: 12084, max: 17430, rate: 0.14 },  // Progressive zone 1 (14%-23.97%)
      { min: 17430, max: 68430, rate: 0.2397 }, // Progressive zone 2 (23.97%-42%)
      { min: 68430, max: 277826, rate: 0.42 },  // Proportional zone
      { min: 277826, max: 999999999, rate: 0.45 }, // Reichensteuer
    ],
  },
  standardDeduction: { single: 12084 }, // Grundfreibetrag
  socialSecurity: { employeeRate: 0.093, wageBase: 92400 }, // Pension ceiling 2025
  medicareOrHealth: { rate: 0.073, additionalRate: 0.017 }, // Health + avg additional
  notes: 'Solidarity surcharge 5.5% if tax > €18,130. Church tax 8% (BY/BW) or 9% (other).'
};

// ─── US 2025 ───────────────────────────────────────────────────
export const US_2025: TaxRuleSet = {
  country: 'United States', countryCode: 'US', year: 2025, currency: 'USD',
  updatedAt: '2025-01-01', source: 'IRS Revenue Procedure 2024-40',
  brackets: {
    single: [
      { min: 0, max: 11925, rate: 0.10 }, { min: 11925, max: 48475, rate: 0.12 },
      { min: 48475, max: 103350, rate: 0.22 }, { min: 103350, max: 197300, rate: 0.24 },
      { min: 197300, max: 250525, rate: 0.32 }, { min: 250525, max: 626350, rate: 0.35 },
      { min: 626350, max: 999999999, rate: 0.37 },
    ],
    married: [
      { min: 0, max: 23850, rate: 0.10 }, { min: 23850, max: 96950, rate: 0.12 },
      { min: 96950, max: 206700, rate: 0.22 }, { min: 206700, max: 394600, rate: 0.24 },
      { min: 394600, max: 501050, rate: 0.32 }, { min: 501050, max: 751600, rate: 0.35 },
      { min: 751600, max: 999999999, rate: 0.37 },
    ],
  },
  standardDeduction: { single: 15000, married: 30000 },
  socialSecurity: { employeeRate: 0.062, wageBase: 176100 },
  medicareOrHealth: { rate: 0.0145, additionalRate: 0.009, additionalThreshold: 200000 },
  notes: 'FICA = Social Security + Medicare. State taxes vary 0%-13.3%.'
};

// ─── Canada 2025 ───────────────────────────────────────────────
export const CANADA_2025: TaxRuleSet = {
  country: 'Canada', countryCode: 'CA', year: 2025, currency: 'CAD',
  updatedAt: '2025-01-01', source: 'CRA 2025 Tax Rates',
  brackets: {
    single: [
      { min: 0, max: 57375, rate: 0.15 }, { min: 57375, max: 114750, rate: 0.205 },
      { min: 114750, max: 158468, rate: 0.26 }, { min: 158468, max: 220000, rate: 0.29 },
      { min: 220000, max: 999999999, rate: 0.33 },
    ],
  },
  standardDeduction: { single: 16129 }, // Basic Personal Amount
  socialSecurity: { employeeRate: 0.0595, wageBase: 71300 }, // CPP
  medicareOrHealth: { rate: 0.0163 }, // EI
  notes: 'Provincial taxes additional 5%-25%. RRSP contributions deductible.'
};

// ─── India FY 2025-26 ──────────────────────────────────────────
export const INDIA_2025: TaxRuleSet = {
  country: 'India', countryCode: 'IN', year: 2025, currency: 'INR',
  updatedAt: '2025-04-01', source: 'Union Budget 2025-26',
  brackets: {
    single: [ // New Regime (default)
      { min: 0, max: 400000, rate: 0 }, { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 }, { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.20 }, { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: 999999999, rate: 0.30 },
    ],
    married: [ // Old Regime
      { min: 0, max: 250000, rate: 0 }, { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 }, { min: 1000000, max: 999999999, rate: 0.30 },
    ],
  },
  standardDeduction: { single: 75000, married: 50000 },
  socialSecurity: { employeeRate: 0.12, wageBase: 180000 }, // EPF basic salary cap per month
  medicareOrHealth: { rate: 0.04 }, // Health & Education Cess
  notes: 'New regime: rebate u/s 87A for income ≤ ₹12L. Old regime allows 80C/80D deductions. Surcharge applies above ₹50L.'
};

export const ALL_TAX_RULES = [GERMANY_2025, US_2025, CANADA_2025, INDIA_2025];

// Helper: Firestore path for a tax rule
export function taxRulePath(countryCode: string, year: number): string {
  return `tax_rules/${countryCode}/${year}`;
}
