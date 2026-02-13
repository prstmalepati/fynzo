import { useFinance } from "../context/FinanceContext";
import { useState } from "react";

export default function Projection() {
  const { accounts } = useFinance();

  const currentNetWorth = accounts.reduce(
    (sum, a) => a.type === "loan" ? sum - a.balance : sum + a.balance,
    0
  );

  const [monthlyInvestment, setMonthlyInvestment] = useState(800);
  const [returnRate, setReturnRate] = useState(5);
  const [years, setYears] = useState(20);

  function projectNetWorth() {
    let value = currentNetWorth;
    const monthlyRate = returnRate / 100 / 12;
    const months = years * 12;

    for (let i = 0; i < months; i++) {
      value = value * (1 + monthlyRate) + monthlyInvestment;
    }

    return Math.round(value);
  }

  const projected = projectNetWorth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Wealth Projection</h1>
        <p className="text-slate-500">
          Estimate how your net worth could grow over time.
        </p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block font-semibold">Monthly investment (€)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={e => setMonthlyInvestment(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold">Expected annual return (%)</label>
          <input
            type="number"
            value={returnRate}
            onChange={e => setReturnRate(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold">Projection horizon (years)</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="card text-center">
        <p className="text-slate-500">Projected net worth after {years} years</p>
        <p className="text-4xl font-bold text-teal-700 mt-2">
          €{projected.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
