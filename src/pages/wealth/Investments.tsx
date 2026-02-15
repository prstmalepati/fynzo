export default function Investments() {
  const investments = [
    { name: "ETF Portfolio", value: 260000, return: 8.2 },
    { name: "Stocks", value: 78000, return: 6.4 },
    { name: "Crypto", value: 50000, return: 12.1 }
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Investments</h1>

      {investments.map(inv => (
        <div
          key={inv.name}
          className="flex justify-between rounded-lg bg-white p-4 shadow"
        >
          <span>{inv.name}</span>
          <span>
            €{inv.value.toLocaleString()}
            <span className="ml-2 text-green-600">
              ▲ {inv.return}%
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}
