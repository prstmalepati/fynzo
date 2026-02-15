export function calculateWealthProjection(input: any) {
  const {
    years,
    isCouple,
    age1,
    age2,
    income1,
    income2,
    bonusIncome,
    otherIncome,
    initialInvestment,
    monthlyInvestment,
    investmentReturn,
    incomeGrowth,
    monthlyExpenses,
    expenseGrowth,
    currentDebt,
    monthlyDebtPayment
  } = input

  let projections = []
  let investmentBalance = initialInvestment
  let debt = currentDebt
  let expenses = monthlyExpenses * 12
  let inc1 = income1
  let inc2 = income2

  for (let year = 1; year <= years; year++) {
    const totalIncome =
      inc1 + (isCouple ? inc2 : 0) + bonusIncome + otherIncome

    const annualDebtPayment = Math.min(monthlyDebtPayment * 12, debt)
    debt -= annualDebtPayment

    const annualSavings =
      totalIncome - expenses - annualDebtPayment

    investmentBalance =
      (investmentBalance + monthlyInvestment * 12) *
      (1 + investmentReturn)

    projections.push({
      year,
      ages: isCouple
        ? `${age1 + year} / ${age2 + year}`
        : `${age1 + year}`,
      totalIncome,
      expenses,
      investmentBalance,
      netWorth: investmentBalance - debt,
      annualSavings,
      savingsRate:
        totalIncome > 0
          ? (annualSavings / totalIncome) * 100
          : 0,
      debt
    })

    inc1 *= 1 + incomeGrowth
    inc2 *= 1 + incomeGrowth
    expenses *= 1 + expenseGrowth
  }

  return projections
}
