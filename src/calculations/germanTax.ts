// German Tax Calculator for 2026
// Includes income tax, solidarity surcharge, church tax, and Kindergeld

interface TaxResult {
  grossSalary: number;
  incomeTax: number;
  solidarity: number;
  churchTax: number;
  kindergeld: number;
  netSalary: number;
}

export function calculateGermanTax(
  grossSalary: number,
  taxClass: number,
  bundesland: string,
  hasChurchTax: boolean,
  children: number
): TaxResult {
  // 2026 rates
  const KINDERGELD_PER_CHILD = 259; // €259 per child per month (2026)
  const SOLIDARITY_RATE = 0.055; // 5.5% on income tax
  const CHURCH_TAX_RATE = 
    (bundesland === 'Bayern' || bundesland === 'Baden-Württemberg') ? 0.08 : 0.09;

  // Calculate income tax (simplified German progressive tax)
  let incomeTax = 0;
  
  if (grossSalary <= 11604) {
    // Tax-free allowance (Grundfreibetrag 2026)
    incomeTax = 0;
  } else if (grossSalary <= 17005) {
    // First bracket
    const y = (grossSalary - 11604) / 10000;
    incomeTax = (922.98 * y + 1400) * y;
  } else if (grossSalary <= 66760) {
    // Second bracket
    const z = (grossSalary - 17005) / 10000;
    incomeTax = (181.19 * z + 2397) * z + 869.32;
  } else if (grossSalary <= 277825) {
    // Third bracket
    incomeTax = 0.42 * grossSalary - 10602.13;
  } else {
    // Top bracket
    incomeTax = 0.45 * grossSalary - 18936.88;
  }

  // Adjust for tax class
  if (taxClass === 2) {
    incomeTax *= 0.95; // Single parent reduction
  } else if (taxClass === 3) {
    incomeTax *= 0.6; // Married, higher earner
  } else if (taxClass === 5) {
    incomeTax *= 1.4; // Married, lower earner
  } else if (taxClass === 6) {
    incomeTax *= 1.2; // Second job
  }

  // Calculate solidarity surcharge
  // Only paid if income tax > €18,130 (2026)
  let solidarity = 0;
  if (incomeTax > 18130) {
    solidarity = (incomeTax - 18130) * SOLIDARITY_RATE;
  }

  // Calculate church tax
  const churchTax = hasChurchTax ? incomeTax * CHURCH_TAX_RATE : 0;

  // Calculate Kindergeld (child benefit)
  const kindergeld = children * KINDERGELD_PER_CHILD * 12; // Annual amount

  // Calculate net salary
  const netSalary = grossSalary - incomeTax - solidarity - churchTax + kindergeld;

  return {
    grossSalary,
    incomeTax: Math.max(0, incomeTax),
    solidarity: Math.max(0, solidarity),
    churchTax: Math.max(0, churchTax),
    kindergeld,
    netSalary: Math.max(0, netSalary)
  };
}

// Export for use in Calculators
export default calculateGermanTax;
