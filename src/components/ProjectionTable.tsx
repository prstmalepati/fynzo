export function ProjectionTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Year</th>
          <th>Wealth (€)</th>
          <th>Expenses (€)</th>
          <th>FIRE</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.year}>
            <td>{row.year}</td>
            <td>{row.wealth.toLocaleString()}</td>
            <td>{row.expenses.toLocaleString()}</td>
            <td>{row.fireReached ? "✅" : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
