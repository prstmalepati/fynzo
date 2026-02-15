export function ProjectionSummary({ projections }: any) {
  if (!projections.length) return null

  const start = projections[0].netWorth
  const end = projections.at(-1).netWorth

  return (
    <div className="grid grid-cols-3 gap-4">
      <SummaryCard label="Start" value={start} />
      <SummaryCard label="End" value={end} />
      <SummaryCard label="Growth" value={end - start} />
    </div>
  )
}
