import React from "react"

type Row = {
  age: number
  netWorth: number
  investments: number
  savings: number
}

type Props = {
  rows: Row[]
}

export default function ProjectionTable({ rows }: Props) {
  return (
    <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <Th>Age</Th>
            <Th>Net Worth</Th>
            <Th>Investments</Th>
            <Th>Savings</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <Td>{r.age}</Td>
              <Td>€{r.netWorth.toLocaleString()}</Td>
              <Td>€{r.investments.toLocaleString()}</Td>
              <Td>€{r.savings.toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: "0.75rem", fontSize: "0.75rem", color: "#475569" }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
      {children}
    </td>
  )
}
