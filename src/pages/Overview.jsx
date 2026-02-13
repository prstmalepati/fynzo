import { useFinance } from "../context/FinanceContext";

export default function Overview() {
  const { accounts, setAccounts } = useFinance();

  const netWorth = accounts.reduce(
    (sum, a) => a.type === "loan" ? sum - a.balance : sum + a.balance,
    0
  );

  function addDemoData() {
    setAccounts([
      { id: 1, name: "Cash", type: "asset", balance: 12000 },
      { id: 2, name: "Investments", type: "asset", balance: 45000 },
      { id: 3, name: "Mortgage", type: "loan", balance: 180000 }
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="card flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Net Worth</h1>
          <p className="text-slate-500">Assets minus liabilities</p>
        </div>
        <div className="text-3xl font-bold text-teal-700">
          €{netWorth.toLocaleString()}
        </div>
      </div>

      {accounts.length === 0 && (
        <div className="card text-center">
          <p className="text-slate-600 mb-4">
            No accounts yet. Add demo data to explore Fynzo.
          </p>
          <button
            onClick={addDemoData}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Add demo data
          </button>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Accounts</h2>
          <ul className="space-y-3">
            {accounts.map(a => (
              <li key={a.id} className="flex justify-between">
                <span>{a.name}</span>
                <span className={a.type === "loan" ? "text-red-600" : "text-green-700"}>
                  €{a.balance.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
