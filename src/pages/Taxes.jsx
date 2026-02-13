import { useState } from "react";
import { germanIncomeTax } from "../utils/taxDE";

export default function Taxes() {
  const [gross, setGross] = useState(60000);
  const [married, setMarried] = useState(false);

  const tax = germanIncomeTax(gross, married);
  const net = gross - tax;
  const rate = Math.round((tax / gross) * 100);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h1 className="text-2xl font-bold">German Income Tax Calculator</h1>
        <p className="text-slate-500">
          Simplified estimation based on Einkommensteuer.
        </p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block font-semibold">Gross annual income (€)</label>
          <input
            type="number"
            value={gross}
            onChange={e => setGross(+e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={married}
            onChange={e => setMarried(e.target.checked)}
          />
          <span>Married (splitting tariff)</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-slate-500">Net income</p>
          <p className="text-xl font-bold text-teal-700">
            €{net.toLocaleString()}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-slate-500">Tax paid</p>
          <p className="text-xl font-bold">
            €{tax.toLocaleString()}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-slate-500">Effective rate</p>
          <p className="text-xl font-bold">
            {rate}%
          </p>
        </div>
      </div>
    </div>
  );
}
