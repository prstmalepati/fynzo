import React from "react"

type KPIProps = {
  startingNetWorth: number
  endingNetWorth: number
  totalSavings: number
  fireAge?: number
}

export default function ProjectionKPIs({
  startingNetWorth,
  endingNetWorth,
  totalSavings,
  fireAge,
}: KPIProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
      <KPI label="Starting Net Worth" value={startingNetWorth} />
      <KPI label="Ending Net Worth" value={endingNetWorth} />
      <KPI label="Total Savings" value={totalSavings} />
      {fireAge && <KPI label="FIRE Age" value={fireAge} />}
    </div>
  )
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: "1rem", borderRadius: "12px", background: "#f8fafc" }}>
      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
        €{value.toLocaleString()}
      </div>
    </div>
  )
}
