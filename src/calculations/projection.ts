import { calculateWealthProjection } from './wealthProjection';
import { calculateFireStats } from './fire';

interface ProjectionInput {
  years: number;
  isCouple: boolean;
  age1: number;
  age2?: number;
  income1: number;
  income2?: number;
  bonusIncome: number;
  otherIncome: number;
  initialInvestment: number;
  monthlyInvestment: number;
  investmentReturn: number;
  incomeGrowth?: number;
  monthlyExpenses: number;
  expenseGrowth: number;
  currentDebt: number;
  monthlyDebtPayment: number;
}

export function calculateProjection(inputs: ProjectionInput) {
  // Default income growth to 3% if not provided
  const incomeGrowth = inputs.incomeGrowth || 0.03;
  
  // Calculate the wealth projection timeline
  const timeline = calculateWealthProjection({
    ...inputs,
    incomeGrowth
  });

  // Add calendar years to timeline based on current year
  const currentYear = new Date().getFullYear();
  const timelineWithYears = timeline.map((row, index) => ({
    ...row,
    calendarYear: currentYear + index + 1 // Year 1 is next year
  }));

  // Calculate start and end metrics
  const netWorthStart = timelineWithYears[0]?.netWorth || 0;
  const netWorthEnd = timelineWithYears[timelineWithYears.length - 1]?.netWorth || 0;
  
  // Calculate total savings across all years
  const totalSavings = timelineWithYears.reduce((sum, row) => sum + row.annualSavings, 0);

  // FIRE calculation: Assume 4% safe withdrawal rate
  const safeWithdrawalRate = 0.04;
  const annualExpenses = inputs.monthlyExpenses * 12;
  const fireNumber = annualExpenses / safeWithdrawalRate;
  
  // Mark which year FIRE is reached and add calendar year
  const timelineWithFire = timelineWithYears.map(row => ({
    ...row,
    fireReached: row.netWorth >= fireNumber,
    fireNumber,
    year: row.calendarYear // Use calendar year for FIRE stats
  }));

  // Calculate FIRE stats
  const fireStats = calculateFireStats(timelineWithFire, inputs.age1);

  return {
    timeline: timelineWithFire,
    netWorthEnd,
    netWorthStart,
    totalSavings,
    fire: {
      fireNumber,
      fireAge: fireStats?.fireAge,
      fireYear: fireStats?.fireYear,
      yearsToFire: fireStats?.yearsToFire
    }
  };
}
