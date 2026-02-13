import { useFinance } from "../context/FinanceContext";
import { useState } from "react";

export default function Transactions() {
  const { transactions, setTransactions } = useFinance();

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    note: ""
  });

  function addTransaction(e) {
    e.preventDefault();
    if (!form.amount || !form.category) return;

    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        date: form.date || new Date().toISOString().slice(0,10),
        amount: Number(form.amount),
        category: form.category,
        note: form.note
      }
    ]);

    setForm({ date:"", amount:"", category:"", note:"" });
  }

  const total = transactions.reduce((s,t)=>s+t.amount,0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-slate-500">Track expenses and cashflow</p>
      </div>

      <form onSubmit={addTransaction} className="card grid md:grid-cols-4 gap-4">
        <input
          type="date"
          value={form.date}
          onChange={e=>setForm({...form,date:e.target.value})}
          className="border p-2 rounded-lg"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e=>setForm({...form,amount:e.target.value})}
          className="border p-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e=>setForm({...form,category:e.target.value})}
          className="border p-2 rounded-lg"
        />
        <button className="bg-teal-600 text-white rounded-lg font-semibold">
          Add
        </button>
      </form>

      <div className="card">
        <h2 className="font-semibold mb-3">
          Monthly expenses: €{total.toLocaleString()}
        </h2>

        <ul className="divide-y">
          {transactions.map(t=>(
            <li key={t.id} className="py-3 flex justify-between">
              <span>{t.category}</span>
              <span className="text-red-600">
                €{t.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
