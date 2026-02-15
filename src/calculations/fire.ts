export function calculateFireStats(
  projection: { year: number; fireReached: boolean }[],
  currentAge: number
) {
  const fireRow = projection.find(p => p.fireReached)

  if (!fireRow) return null

  const yearsToFire = fireRow.year - new Date().getFullYear()

  return {
    fireYear: fireRow.year,
    fireAge: currentAge + yearsToFire,
    yearsToFire
  }
}
