import { useFinance } from "../context/FinanceContext";

export default function Fire() {
  const { transactions, accounts } = useFinance();

  const annualExpenses = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  ) * 12 || 30000;

  const netWorth = accounts.reduce(
    (sum, a) => a.type === "loan" ? sum - a.balance : sum + a.balance,
    0
  );

  const fireNumber = annualExpenses * 25;
  const progress = fireNumber > 0
    ? Math.min(100, Math.round((netWorth / fireNumber) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h1 className="text-2xl font-bold">Financial Independence</h1>
        <p className="text-slate-500">
          Based on the 4% rule (25× annual expenses).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-slate-500">Annual expenses</p>
          <p className="text-xl font-bold">
            €{annualExpenses.toLocaleString()}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-slate-500">FIRE number</p>
          <p className="text-xl font-bold">
            €{fireNumber.toLocaleString()}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-slate-500">Progress</p>
          <p className="text-xl font-bold text-teal-700">
            {progress}%
          </p>
        </div>
      </div>

      <div className="card text-center">
        <p className="text-slate-600">
          You are <strong>{progress}%</strong> financially independent.
        </p>
      </div>
    </div>
  );
}
