export function ProjectionTimeline({ projections }: any) {
  return (
    <div className="space-y-3">
      {projections.map(p => (
        <div
          key={p.year}
          className={`rounded-lg border-l-4 p-4 ${
            p.annualSavings >= 0
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <div className="flex justify-between">
            <strong>Year {p.year}</strong>
            <span>
              Net Worth €{Math.round(p.netWorth).toLocaleString()}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            Age(s): {p.ages} · Savings: €{Math.round(p.annualSavings)}
          </div>
        </div>
      ))}
    </div>
  )
}
