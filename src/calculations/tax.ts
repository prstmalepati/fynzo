export const GERMAN_CAPITAL_GAINS_TAX = 0.26375

export function applyCapitalGainsTax(
  previousWealth: number,
  newWealth: number
): number {
  const gain = newWealth - previousWealth

  if (gain <= 0) return newWealth

  const tax = gain * GERMAN_CAPITAL_GAINS_TAX
  return newWealth - tax
}
