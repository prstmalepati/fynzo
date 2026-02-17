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

  // Calculate start and end metrics
  const netWorthStart = timeline[0]?.netWorth || 0;
  const netWorthEnd = timeline[timeline.length - 1]?.netWorth || 0;
  
  // Calculate total savings across all years
  const totalSavings = timeline.reduce((sum, row) => sum + row.annualSavings, 0);

  // FIRE calculation: Assume 4% safe withdrawal rate
  const safeWithdrawalRate = 0.04;
  const annualExpenses = inputs.monthlyExpenses * 12;
  const fireNumber = annualExpenses / safeWithdrawalRate;
  
  // Mark which year FIRE is reached
  const timelineWithFire = timeline.map(row => ({
    ...row,
    fireReached: row.netWorth >= fireNumber,
    fireNumber
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
