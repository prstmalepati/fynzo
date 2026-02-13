import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function Loans() {
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(30);

  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  const payment =
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -months));

  let balance = amount;
  let totalInterest = 0;
  const balances = [];

  for (let i = 0; i < months; i++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance = balance + interest - payment;
    balances.push(Math.max(0, Math.round(balance)));
  }

  const chartData = {
    labels: balances.map((_, i) => `Year ${Math.ceil(i / 12)}`),
    datasets: [
      {
        label: "Remaining balance (€)",
        data: balances.filter((_, i) => i % 12 === 0),
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <h1 className="text-2xl font-bold">Loan Calculator</h1>
        <p className="text-slate-500">
          Calculate payments and see amortization over time.
        </p>
      </div>

      <div className="card grid md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold">Loan amount (€)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold">Interest rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold">Term (years)</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-slate-500">Monthly payment</p>
          <p className="text-xl font-bold text-teal-700">
            €{Math.round(payment).toLocaleString()}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-slate-500">Total interest</p>
          <p className="text-xl font-bold">
            €{Math.round(totalInterest).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card">
        <Line data={chartData} />
      </div>
    </div>
  );
}

