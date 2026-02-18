export function calculateFireStats(
  projection: { year: number; fireReached: boolean }[],
  currentAge: number
) {
  const fireRow = projection.find(p => p.fireReached)

  if (!fireRow) return null

  const currentYear = new Date().getFullYear()
  const yearsToFire = fireRow.year - currentYear

  return {
    fireYear: fireRow.year,
    fireAge: currentAge + yearsToFire,
    yearsToFire
  }
}
