export type ProjectionInput = {
  startYear: number
  currentWealth: number
  monthlySavings: number
  annualReturn: number       // e.g. 0.07
  inflationRate: number      // e.g. 0.02
  baseAnnualExpenses: number
  expenseGrowthRate: number  // e.g. 0.02
  years: number
}

export type ProjectionRow = {
  year: number
  wealth: number
  expenses: number
  fireNumber: number
  fireReached: boolean
}

export function calculateWealthProjection(
  input: ProjectionInput
): ProjectionRow[] {
  const rows: ProjectionRow[] = []

  let wealth = input.currentWealth
  const realReturn = input.annualReturn - input.inflationRate

  for (let i = 1; i <= input.years; i++) {
    const year = input.startYear + i

    const expenses =
      input.baseAnnualExpenses *
      Math.pow(1 + input.expenseGrowthRate, i)

    const fireNumber = expenses * 25

    wealth =
      wealth * (1 + realReturn) +
      input.monthlySavings * 12 -
      expenses

    rows.push({
      year,
      wealth: Math.round(wealth),
      expenses: Math.round(expenses),
      fireNumber: Math.round(fireNumber),
      fireReached: wealth >= fireNumber
    })
  }

  return rows
}
