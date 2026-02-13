import { useFinance } from "../context/FinanceContext";
import { useState } from "react";

export default function Budgets() {
  const { budgets, setBudgets } = useFinance();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  function addBudget() {
    if (!category || !amount) return;
    setBudgets({ ...budgets, [category]: Number(amount) });
    setCategory("");
    setAmount("");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <p className="text-slate-500">
          Model expense limits and savings scenarios
        </p>
      </div>

      <div className="card grid grid-cols-3 gap-4">
        <input
          placeholder="Category"
          value={category}
          onChange={e=>setCategory(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="number"
          placeholder="Monthly limit"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <button
          onClick={addBudget}
          className="bg-teal-600 text-white rounded-lg font-semibold"
        >
          Add
        </button>
      </div>

      <div className="card">
        <ul className="space-y-3">
          {Object.entries(budgets).map(([cat,val])=>(
            <li key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span>€{val.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
