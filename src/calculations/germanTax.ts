/**
 * German Income Tax Calculator - 2026 Rates
 * Updated with 2026 Kindergeld (€259/month) and tax brackets
 */

interface TaxInput {
  grossIncome: number;
  filingStatus: 'single' | 'married';
  numberOfChildren: number;
  includeChurchTax: boolean;
  age: number;
}

interface TaxResult {
  grossIncome: number;
  incomeTax: number;
  solidarityTax: number;
  churchTax: number;
  totalTax: number;
  pensionInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  longTermCare: number;
  totalSocialSecurity: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  grundfreibetrag: number;
  kindergeld: number;
  taxZones: TaxZone[];
}

interface TaxZone {
  zone: number;
  name: string;
  range: string;
  rate: string;
  taxAmount: number;
}

// 2026 Constants
const GRUNDFREIBETRAG_2026 = 12084; // Increased from €11,604 in 2025
const KINDERGELD_2026_MONTHLY = 259; // Increased from €250 in 2024/2025
const KINDERGELD_2026_ANNUAL = KINDERGELD_2026_MONTHLY * 12; // €3,108

const SOLI_THRESHOLD = 18130; // Solidarity surcharge threshold
const SOLI_RATE = 0.055; // 5.5%

// Social Security Contribution Limits 2026
const PENSION_LIMIT = 90600; // West Germany
const HEALTH_LIMIT = 62100;

// Social Security Rates 2026 (Employee portion)
const PENSION_RATE = 0.093; // 9.3%
const HEALTH_RATE = 0.093; // ~9.3% average
const UNEMPLOYMENT_RATE = 0.013; // 1.3%
const LONG_TERM_CARE_BASE = 0.018; // 1.8%
const LONG_TERM_CARE_SURCHARGE = 0.002; // +0.2% for childless 23+

export function calculateGermanTax(input: TaxInput): TaxResult {
  const { grossIncome, filingStatus, numberOfChildren, includeChurchTax, age } = input;

  // Apply Grundfreibetrag
  const taxableIncome = Math.max(0, grossIncome - GRUNDFREIBETRAG_2026);

  // Calculate income tax using 2026 formula
  const incomeTax = calculateIncomeTax2026(taxableIncome, filingStatus);

  // Solidarity surcharge (only if income tax > threshold)
  const solidarityTax = incomeTax > SOLI_THRESHOLD 
    ? (incomeTax - SOLI_THRESHOLD) * SOLI_RATE 
    : 0;

  // Church tax (8% in Bayern/BW, 9% elsewhere - using 9% as default)
  const churchTax = includeChurchTax ? incomeTax * 0.09 : 0;

  // Total tax
  const totalTax = incomeTax + solidarityTax + churchTax;

  // Social Security Contributions
  const pensionBase = Math.min(grossIncome, PENSION_LIMIT);
  const healthBase = Math.min(grossIncome, HEALTH_LIMIT);
  
  const pensionInsurance = pensionBase * PENSION_RATE;
  const healthInsurance = healthBase * HEALTH_RATE;
  const unemploymentInsurance = healthBase * UNEMPLOYMENT_RATE;
  
  // Long-term care: +0.2% surcharge for childless people aged 23+
  const longTermCareRate = (numberOfChildren === 0 && age >= 23) 
    ? LONG_TERM_CARE_BASE + LONG_TERM_CARE_SURCHARGE 
    : LONG_TERM_CARE_BASE;
  const longTermCare = healthBase * longTermCareRate;

  const totalSocialSecurity = pensionInsurance + healthInsurance + unemploymentInsurance + longTermCare;

  // Kindergeld (child benefit)
  const kindergeld = numberOfChildren * KINDERGELD_2026_ANNUAL;

  // Net income
  const netIncome = grossIncome - totalTax - totalSocialSecurity + kindergeld;

  // Effective tax rate
  const effectiveTaxRate = (totalTax / grossIncome) * 100;

  // Marginal tax rate
  const marginalTaxRate = calculateMarginalRate(taxableIncome);

  // Tax zones breakdown
  const taxZones = calculateTaxZones(taxableIncome);

  return {
    grossIncome,
    incomeTax,
    solidarityTax,
    churchTax,
    totalTax,
    pensionInsurance,
    healthInsurance,
    unemploymentInsurance,
    longTermCare,
    totalSocialSecurity,
    netIncome,
    effectiveTaxRate,
    marginalTaxRate,
    grundfreibetrag: GRUNDFREIBETRAG_2026,
    kindergeld,
    taxZones
  };
}

function calculateIncomeTax2026(taxableIncome: number, filingStatus: 'single' | 'married'): number {
  // For married filing jointly, use income splitting (Splittingtarif)
  if (filingStatus === 'married') {
    const halfIncome = taxableIncome / 2;
    return calculateSingleTax(halfIncome) * 2;
  }
  
  return calculateSingleTax(taxableIncome);
}

function calculateSingleTax(income: number): number {
  // 2026 German Tax Formula (§32a EStG)
  // Zone 1: €0 - €12,084 → 0%
  if (income <= 0) return 0;

  // Zone 2: €12,085 - €17,005 → 14% to ~24% (linear progression)
  if (income <= 17005) {
    const y = (income - 12084) / 10000;
    return (922.98 * y + 1400) * y;
  }

  // Zone 3: €17,006 - €66,760 → ~24% to 42% (linear progression)
  if (income <= 66760) {
    const z = (income - 17005) / 10000;
    return (181.19 * z + 2397) * z + 1025.38;
  }

  // Zone 4: €66,761 - €277,825 → 42%
  if (income <= 277825) {
    return 0.42 * income - 10602.13;
  }

  // Zone 5: €277,826+ → 45%
  return 0.45 * income - 18936.88;
}

function calculateMarginalRate(income: number): number {
  if (income <= 12084) return 0;
  if (income <= 17005) return 14 + ((income - 12084) / (17005 - 12084)) * 10; // 14% to 24%
  if (income <= 66760) return 24 + ((income - 17005) / (66760 - 17005)) * 18; // 24% to 42%
  if (income <= 277825) return 42;
  return 45;
}

function calculateTaxZones(income: number): TaxZone[] {
  const zones: TaxZone[] = [];

  // Zone 1: €0 - €12,084 (0%)
  if (income <= 0) {
    zones.push({
      zone: 1,
      name: 'Grundfreibetrag',
      range: '€0 - €12,084',
      rate: '0%',
      taxAmount: 0
    });
    return zones;
  }

  // Zone 2: €12,085 - €17,005
  if (income > 0) {
    const zone2Income = Math.min(income, 17005);
    const zone2Tax = calculateSingleTax(zone2Income);
    zones.push({
      zone: 2,
      name: 'Progressionszone 1',
      range: '€12,085 - €17,005',
      rate: '14% - 24%',
      taxAmount: zone2Tax
    });
  }

  // Zone 3: €17,006 - €66,760
  if (income > 17005) {
    const zone3Income = Math.min(income, 66760);
    const zone3Tax = calculateSingleTax(zone3Income) - calculateSingleTax(17005);
    zones.push({
      zone: 3,
      name: 'Progressionszone 2',
      range: '€17,006 - €66,760',
      rate: '24% - 42%',
      taxAmount: zone3Tax
    });
  }

  // Zone 4: €66,761 - €277,825
  if (income > 66760) {
    const zone4Income = Math.min(income, 277825);
    const zone4Tax = calculateSingleTax(zone4Income) - calculateSingleTax(66760);
    zones.push({
      zone: 4,
      name: 'Proportionalzone 1',
      range: '€66,761 - €277,825',
      rate: '42%',
      taxAmount: zone4Tax
    });
  }

  // Zone 5: €277,826+
  if (income > 277825) {
    const zone5Tax = calculateSingleTax(income) - calculateSingleTax(277825);
    zones.push({
      zone: 5,
      name: 'Proportionalzone 2 (Reichensteuer)',
      range: '€277,826+',
      rate: '45%',
      taxAmount: zone5Tax
    });
  }

  return zones;
}

export function getMonthlyBreakdown(result: TaxResult) {
  return {
    grossIncome: result.grossIncome / 12,
    incomeTax: result.incomeTax / 12,
    solidarityTax: result.solidarityTax / 12,
    churchTax: result.churchTax / 12,
    totalTax: result.totalTax / 12,
    pensionInsurance: result.pensionInsurance / 12,
    healthInsurance: result.healthInsurance / 12,
    unemploymentInsurance: result.unemploymentInsurance / 12,
    longTermCare: result.longTermCare / 12,
    totalSocialSecurity: result.totalSocialSecurity / 12,
    netIncome: result.netIncome / 12,
    kindergeld: result.kindergeld / 12
  };
}

export { KINDERGELD_2026_MONTHLY, KINDERGELD_2026_ANNUAL, GRUNDFREIBETRAG_2026 };
