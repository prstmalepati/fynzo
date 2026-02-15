import { calculateScenarios } from "../calculations/scenarios"
import { calculateFireStats } from "../calculations/fire"
import { WealthProjectionChart } from "../components/charts/WealthProjectionChart.tsx"
import { ProjectionTable } from "../components/ProjectionTable"

export default function Projection() {
  // 1️⃣ INPUTS (later from UI / Firebase)
  const input = {
    startYear: new Date().getFullYear(),
    currentWealth: 120000,
    monthlySavings: 1500,
    annualReturn: 0.07,
    inflationRate: 0.02,
    baseAnnualExpenses: 30000,
    expenseGrowthRate: 0.02,
    years: 35
  }

  // 2️⃣ CALCULATIONS
  const scenarios = calculateScenarios(input)
  const baseScenario = scenarios.base

  const fireStats = calculateFireStats(baseScenario, 35)

  // 3️⃣ RENDER
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        Wealth Projection
      </h1>

      {/* FIRE SUMMARY */}
      {fireStats && (
        <div className="rounded-xl bg-emerald-50 p-4">
          <p><strong>FIRE Year:</strong> {fireStats.fireYear}</p>
          <p><strong>FIRE Age:</strong> {fireStats.fireAge}</p>
          <p><strong>Years to FIRE:</strong> {fireStats.yearsToFire}</p>
        </div>
      )}

      {/* CHART */}
      <div className="rounded-xl bg-white p-4 shadow">
        <WealthProjectionChart data={baseScenario} />
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-white p-4 shadow">
        <ProjectionTable data={baseScenario} />
      </div>
    </div>
  )
}
