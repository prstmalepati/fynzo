/**
 * German Income Tax Calculator (2024/2025)
 * Implements the official German tax calculation formulas
 */

// Tax constants for 2024/2025
export const TAX_CONSTANTS = {
  // Basic tax-free allowance (Grundfreibetrag)
  GRUNDFREIBETRAG_SINGLE: 11604,
  GRUNDFREIBETRAG_MARRIED: 23208,
  
  // Kindergeld per child per month (2024)
  KINDERGELD_PER_CHILD: 250,
  
  // Child tax allowance (Kinderfreibetrag) per child per year
  KINDERFREIBETRAG: 6612, // 3306 per parent × 2
  
  // Solidarity surcharge threshold
  SOLI_THRESHOLD_SINGLE: 18130,
  SOLI_THRESHOLD_MARRIED: 36260,
  SOLI_RATE: 0.055,
  
  // Church tax rate (varies by state, using average)
  CHURCH_TAX_RATE: 0.08,
  
  // Social security contributions (approximate, varies by income)
  PENSION_INSURANCE: 0.093, // Rentenversicherung (employee share)
  HEALTH_INSURANCE: 0.073, // Krankenversicherung (employee share, base)
  HEALTH_INSURANCE_ADDITIONAL: 0.017, // Additional contribution (average)
  UNEMPLOYMENT_INSURANCE: 0.013, // Arbeitslosenversicherung
  LONG_TERM_CARE: 0.01775, // Pflegeversicherung (with children)
  LONG_TERM_CARE_CHILDLESS: 0.02025, // Pflegeversicherung (childless, age 23+)
  
  // Income thresholds for social security
  CONTRIBUTION_CEILING_PENSION: 90600, // BBG Rentenversicherung (West)
  CONTRIBUTION_CEILING_HEALTH: 62100, // BBG Krankenversicherung
};

interface TaxInput {
  grossIncome: number; // Annual gross income
  filingStatus: 'single' | 'married';
  numberOfChildren: number;
  includeChurchTax: boolean;
  age: number; // For childless surcharge
}

interface TaxBreakdown {
  // Income
  grossIncome: number;
  taxableIncome: number;
  
  // Allowances
  grundfreibetrag: number;
  kinderfreibetrag: number;
  
  // Tax calculations
  incomeTax: number;
  solidarityTax: number;
  churchTax: number;
  totalTax: number;
  
  // Social security
  pensionInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  longTermCare: number;
  totalSocialSecurity: number;
  
  // Benefits
  kindergeld: number; // Annual
  
  // Net result
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  
  // Tax zones breakdown
  taxZones: {
    zone: number;
    name: string;
    range: string;
    rate: string;
    taxAmount: number;
  }[];
}

export function calculateGermanTax(input: TaxInput): TaxBreakdown {
  const {
    grossIncome,
    filingStatus,
    numberOfChildren,
    includeChurchTax,
    age
  } = input;
  
  // 1. Calculate allowances
  const grundfreibetrag = filingStatus === 'married' 
    ? TAX_CONSTANTS.GRUNDFREIBETRAG_MARRIED 
    : TAX_CONSTANTS.GRUNDFREIBETRAG_SINGLE;
  
  const kinderfreibetrag = numberOfChildren * TAX_CONSTANTS.KINDERFREIBETRAG;
  
  // 2. Calculate taxable income
  // For simplicity, we'll use gross income - grundfreibetrag - kinderfreibetrag
  // In reality, there are more deductions (Werbungskosten, Sonderausgaben, etc.)
  const taxableIncome = Math.max(0, grossIncome - grundfreibetrag - kinderfreibetrag);
  
  // 3. Calculate income tax using German progressive tax formula
  const { incomeTax, taxZones, marginalRate } = calculateProgressiveIncomeTax(
    taxableIncome,
    filingStatus
  );
  
  // 4. Calculate solidarity surcharge (Solidaritätszuschlag)
  const solidarityTax = calculateSolidarityTax(incomeTax, filingStatus);
  
  // 5. Calculate church tax (Kirchensteuer)
  const churchTax = includeChurchTax 
    ? incomeTax * TAX_CONSTANTS.CHURCH_TAX_RATE 
    : 0;
  
  // 6. Total tax
  const totalTax = incomeTax + solidarityTax + churchTax;
  
  // 7. Calculate social security contributions
  const socialSecurity = calculateSocialSecurity(grossIncome, numberOfChildren, age);
  
  // 8. Calculate Kindergeld (child benefit)
  const kindergeld = numberOfChildren * TAX_CONSTANTS.KINDERGELD_PER_CHILD * 12;
  
  // 9. Calculate net income
  // Net = Gross - Taxes - Social Security + Kindergeld
  const netIncome = grossIncome - totalTax - socialSecurity.total + kindergeld;
  
  // 10. Calculate effective tax rate
  const effectiveTaxRate = grossIncome > 0 
    ? (totalTax / grossIncome) * 100 
    : 0;
  
  return {
    grossIncome,
    taxableIncome,
    grundfreibetrag,
    kinderfreibetrag,
    incomeTax,
    solidarityTax,
    churchTax,
    totalTax,
    pensionInsurance: socialSecurity.pension,
    healthInsurance: socialSecurity.health,
    unemploymentInsurance: socialSecurity.unemployment,
    longTermCare: socialSecurity.care,
    totalSocialSecurity: socialSecurity.total,
    kindergeld,
    netIncome,
    effectiveTaxRate,
    marginalTaxRate: marginalRate,
    taxZones
  };
}

function calculateProgressiveIncomeTax(
  taxableIncome: number,
  filingStatus: 'single' | 'married'
): { incomeTax: number; taxZones: any[]; marginalRate: number } {
  
  // For married couples, split income (Ehegattensplitting)
  const income = filingStatus === 'married' ? taxableIncome / 2 : taxableIncome;
  
  let tax = 0;
  let marginalRate = 0;
  const taxZones = [];
  
  // Zone 1: €0 - €11,604 = 0%
  if (income <= 11604) {
    taxZones.push({
      zone: 1,
      name: 'Nullzone',
      range: '€0 - €11,604',
      rate: '0%',
      taxAmount: 0
    });
    marginalRate = 0;
  }
  
  // Zone 2: €11,605 - €17,005 = 14% - 24% (linear progression)
  else if (income <= 17005) {
    const y = (income - 11604) / 10000;
    tax = (922.98 * y + 1400) * y;
    marginalRate = 14 + (y * 10); // Approximate marginal rate
    
    taxZones.push({
      zone: 1,
      name: 'Nullzone',
      range: '€0 - €11,604',
      rate: '0%',
      taxAmount: 0
    });
    taxZones.push({
      zone: 2,
      name: 'Progressionszone 1',
      range: '€11,605 - €17,005',
      rate: '14% - 24%',
      taxAmount: tax
    });
  }
  
  // Zone 3: €17,006 - €66,760 = 24% - 42% (linear progression)
  else if (income <= 66760) {
    const y2 = (17005 - 11604) / 10000;
    const tax2 = (922.98 * y2 + 1400) * y2;
    
    const z = (income - 17005) / 10000;
    const tax3 = (181.19 * z + 2397) * z + 1025.38;
    tax = tax2 + tax3;
    marginalRate = 24 + (z * 1.8); // Approximate
    
    taxZones.push({
      zone: 1,
      name: 'Nullzone',
      range: '€0 - €11,604',
      rate: '0%',
      taxAmount: 0
    });
    taxZones.push({
      zone: 2,
      name: 'Progressionszone 1',
      range: '€11,605 - €17,005',
      rate: '14% - 24%',
      taxAmount: tax2
    });
    taxZones.push({
      zone: 3,
      name: 'Progressionszone 2',
      range: '€17,006 - €66,760',
      rate: '24% - 42%',
      taxAmount: tax3
    });
  }
  
  // Zone 4: €66,761 - €277,825 = 42%
  else if (income <= 277825) {
    const y2 = (17005 - 11604) / 10000;
    const tax2 = (922.98 * y2 + 1400) * y2;
    
    const z = (66760 - 17005) / 10000;
    const tax3 = (181.19 * z + 2397) * z + 1025.38;
    
    const tax4 = (income - 66760) * 0.42;
    tax = tax2 + tax3 + tax4;
    marginalRate = 42;
    
    taxZones.push({
      zone: 1,
      name: 'Nullzone',
      range: '€0 - €11,604',
      rate: '0%',
      taxAmount: 0
    });
    taxZones.push({
      zone: 2,
      name: 'Progressionszone 1',
      range: '€11,605 - €17,005',
      rate: '14% - 24%',
      taxAmount: tax2
    });
    taxZones.push({
      zone: 3,
      name: 'Progressionszone 2',
      range: '€17,006 - €66,760',
      rate: '24% - 42%',
      taxAmount: tax3
    });
    taxZones.push({
      zone: 4,
      name: 'Proportionalzone 1',
      range: '€66,761 - €277,825',
      rate: '42%',
      taxAmount: tax4
    });
  }
  
  // Zone 5: €277,826+ = 45% (Reichensteuer)
  else {
    const y2 = (17005 - 11604) / 10000;
    const tax2 = (922.98 * y2 + 1400) * y2;
    
    const z = (66760 - 17005) / 10000;
    const tax3 = (181.19 * z + 2397) * z + 1025.38;
    
    const tax4 = (277825 - 66760) * 0.42;
    const tax5 = (income - 277825) * 0.45;
    tax = tax2 + tax3 + tax4 + tax5;
    marginalRate = 45;
    
    taxZones.push({
      zone: 1,
      name: 'Nullzone',
      range: '€0 - €11,604',
      rate: '0%',
      taxAmount: 0
    });
    taxZones.push({
      zone: 2,
      name: 'Progressionszone 1',
      range: '€11,605 - €17,005',
      rate: '14% - 24%',
      taxAmount: tax2
    });
    taxZones.push({
      zone: 3,
      name: 'Progressionszone 2',
      range: '€17,006 - €66,760',
      rate: '24% - 42%',
      taxAmount: tax3
    });
    taxZones.push({
      zone: 4,
      name: 'Proportionalzone 1',
      range: '€66,761 - €277,825',
      rate: '42%',
      taxAmount: tax4
    });
    taxZones.push({
      zone: 5,
      name: 'Proportionalzone 2 (Reichensteuer)',
      range: '€277,826+',
      rate: '45%',
      taxAmount: tax5
    });
  }
  
  // For married couples, multiply by 2 (Splitting)
  const finalTax = filingStatus === 'married' ? tax * 2 : tax;
  
  return {
    incomeTax: Math.round(finalTax * 100) / 100,
    taxZones,
    marginalRate
  };
}

function calculateSolidarityTax(incomeTax: number, filingStatus: 'single' | 'married'): number {
  const threshold = filingStatus === 'married' 
    ? TAX_CONSTANTS.SOLI_THRESHOLD_MARRIED 
    : TAX_CONSTANTS.SOLI_THRESHOLD_SINGLE;
  
  if (incomeTax <= threshold) {
    return 0;
  }
  
  // Solidarity surcharge is 5.5% of income tax
  return Math.round(incomeTax * TAX_CONSTANTS.SOLI_RATE * 100) / 100;
}

function calculateSocialSecurity(
  grossIncome: number,
  numberOfChildren: number,
  age: number
): {
  pension: number;
  health: number;
  unemployment: number;
  care: number;
  total: number;
} {
  // Pension insurance
  const pensionBase = Math.min(grossIncome, TAX_CONSTANTS.CONTRIBUTION_CEILING_PENSION);
  const pension = pensionBase * TAX_CONSTANTS.PENSION_INSURANCE;
  
  // Health insurance
  const healthBase = Math.min(grossIncome, TAX_CONSTANTS.CONTRIBUTION_CEILING_HEALTH);
  const health = healthBase * (TAX_CONSTANTS.HEALTH_INSURANCE + TAX_CONSTANTS.HEALTH_INSURANCE_ADDITIONAL);
  
  // Unemployment insurance
  const unemployment = pensionBase * TAX_CONSTANTS.UNEMPLOYMENT_INSURANCE;
  
  // Long-term care insurance (higher for childless people age 23+)
  const careRate = (numberOfChildren === 0 && age >= 23) 
    ? TAX_CONSTANTS.LONG_TERM_CARE_CHILDLESS 
    : TAX_CONSTANTS.LONG_TERM_CARE;
  const care = healthBase * careRate;
  
  return {
    pension: Math.round(pension * 100) / 100,
    health: Math.round(health * 100) / 100,
    unemployment: Math.round(unemployment * 100) / 100,
    care: Math.round(care * 100) / 100,
    total: Math.round((pension + health + unemployment + care) * 100) / 100
  };
}

export function getMonthlyBreakdown(annual: TaxBreakdown) {
  return {
    grossIncome: Math.round(annual.grossIncome / 12 * 100) / 100,
    incomeTax: Math.round(annual.incomeTax / 12 * 100) / 100,
    solidarityTax: Math.round(annual.solidarityTax / 12 * 100) / 100,
    churchTax: Math.round(annual.churchTax / 12 * 100) / 100,
    totalTax: Math.round(annual.totalTax / 12 * 100) / 100,
    pensionInsurance: Math.round(annual.pensionInsurance / 12 * 100) / 100,
    healthInsurance: Math.round(annual.healthInsurance / 12 * 100) / 100,
    unemploymentInsurance: Math.round(annual.unemploymentInsurance / 12 * 100) / 100,
    longTermCare: Math.round(annual.longTermCare / 12 * 100) / 100,
    totalSocialSecurity: Math.round(annual.totalSocialSecurity / 12 * 100) / 100,
    kindergeld: Math.round(annual.kindergeld / 12 * 100) / 100,
    netIncome: Math.round(annual.netIncome / 12 * 100) / 100,
  };
}
