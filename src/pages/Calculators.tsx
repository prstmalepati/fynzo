import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Calculators() {
  const navigate = useNavigate();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-secondary group-hover:text-primary transition-colors" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Financial Calculators
              </h1>
              <p className="text-slate-600 mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Quick tools for everyday financial decisions
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Calculator Grid */}
        {!activeCalculator && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className={`w-14 h-14 ${calc.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {calc.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  {calc.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {calc.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Active Calculator */}
        {activeCalculator && (
          <div>
            <button
              onClick={() => setActiveCalculator(null)}
              className="mb-6 flex items-center gap-2 text-primary hover:text-teal-800 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all calculators
            </button>

            {activeCalculator === 'compound-interest' && <CompoundInterestCalculator />}
            {activeCalculator === 'retirement' && <RetirementCalculator />}
            {activeCalculator === 'savings-rate' && <SavingsRateCalculator />}
            {activeCalculator === 'rule-72' && <Rule72Calculator />}
            {activeCalculator === 'tax-germany' && <GermanTaxCalculator />}
            {activeCalculator === 'debt-payoff' && <DebtPayoffCalculator />}
          </div>
        )}
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

// Calculator Definitions
const calculators = [
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    description: 'See how your investments grow exponentially over time with compound returns.',
    color: 'bg-blue-100',
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    id: 'retirement',
    title: 'Retirement Savings',
    description: 'Calculate how much you need to save monthly to reach your retirement goals.',
    color: 'bg-emerald-100',
    icon: (
      <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'savings-rate',
    title: 'Savings Rate',
    description: 'Discover what percentage of your income you\'re saving and how it affects your FIRE timeline.',
    color: 'bg-purple-100',
    icon: (
      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'rule-72',
    title: 'Rule of 72',
    description: 'Quickly estimate how long it takes for your money to double at different interest rates.',
    color: 'bg-amber-100',
    icon: (
      <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'tax-germany',
    title: 'German Capital Gains',
    description: 'Calculate your after-tax returns on investments in Germany (26.375% Abgeltungsteuer).',
    color: 'bg-red-100',
    icon: (
      <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    )
  },
  {
    id: 'debt-payoff',
    title: 'Debt Payoff',
    description: 'Create a plan to eliminate debt and see how extra payments shorten your timeline.',
    color: 'bg-teal-100',
    icon: (
      <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
];

// Individual Calculator Components
function CompoundInterestCalculator() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);

  const finalAmount = initial * Math.pow(1 + rate / 100, years) + 
                      monthly * 12 * ((Math.pow(1 + rate / 100, years) - 1) / (rate / 100));

  return (
    <CalculatorCard title="Compound Interest Calculator">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Column - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-slate-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> Investment Details
            </h4>
            <div className="space-y-4">
              <Input label="Initial Investment (€)" value={initial} onChange={setInitial} />
              <Input label="Monthly Contribution (€)" value={monthly} onChange={setMonthly} />
              <Input label="Annual Return (%)" value={rate} onChange={setRate} step={0.1} />
              <Input label="Years" value={years} onChange={setYears} />
            </div>
          </div>
        </div>

        {/* Results Column - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
            <div className="text-sm opacity-90 mb-2 font-semibold">Future Value</div>
            <div className="text-6xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur">
                <span className="opacity-90">Total Contributions:</span>
                <span className="font-bold text-lg">€{(initial + monthly * 12 * years).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur">
                <span className="opacity-90">Investment Gains:</span>
                <span className="font-bold text-lg">€{(finalAmount - initial - monthly * 12 * years).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200">
              <div className="text-xs text-slate-600 mb-1 font-semibold">Effective Rate</div>
              <div className="text-2xl font-bold text-blue-600">{((finalAmount / (initial + monthly * 12 * years) - 1) * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200">
              <div className="text-xs text-slate-600 mb-1 font-semibold">Gain Multiple</div>
              <div className="text-2xl font-bold text-blue-600">{(finalAmount / (initial + monthly * 12 * years)).toFixed(2)}x</div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [returnRate, setReturnRate] = useState(7);

  const years = retirementAge - currentAge;
  const monthlyNeeded = ((targetAmount - currentSavings * Math.pow(1 + returnRate / 100, years)) / 
                        (12 * ((Math.pow(1 + returnRate / 100, years) - 1) / (returnRate / 100))));

  return (
    <CalculatorCard title="Retirement Savings Calculator">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border-2 border-emerald-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span> Retirement Goals
            </h4>
            <div className="space-y-4">
              <Input label="Current Age" value={currentAge} onChange={setCurrentAge} />
              <Input label="Retirement Age" value={retirementAge} onChange={setRetirementAge} />
              <Input label="Target Amount (€)" value={targetAmount} onChange={setTargetAmount} />
              <Input label="Current Savings (€)" value={currentSavings} onChange={setCurrentSavings} />
              <Input label="Expected Return (%)" value={returnRate} onChange={setReturnRate} step={0.1} />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white shadow-2xl">
            <div className="text-sm opacity-90 mb-2 font-semibold">Monthly Savings Needed</div>
            <div className="text-6xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{monthlyNeeded > 0 ? monthlyNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur">
                <span className="opacity-90">Years to Retirement:</span>
                <span className="font-bold text-lg">{years} years</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur">
                <span className="opacity-90">Annual Savings:</span>
                <span className="font-bold text-lg">€{(monthlyNeeded * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border-2 border-emerald-200">
              <div className="text-xs text-slate-600 mb-1 font-semibold">Total to Save</div>
              <div className="text-2xl font-bold text-emerald-600">€{(monthlyNeeded * 12 * years).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border-2 border-emerald-200">
              <div className="text-xs text-slate-600 mb-1 font-semibold">Savings Rate</div>
              <div className="text-2xl font-bold text-emerald-600">{((monthlyNeeded * 12 / 60000) * 100).toFixed(0)}%</div>
              <div className="text-xs text-slate-500 mt-1">of €60K income</div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

function SavingsRateCalculator() {
  const [income, setIncome] = useState(60000);
  const [expenses, setExpenses] = useState(36000);

  const savingsRate = ((income - expenses) / income) * 100;
  const yearsToFire = Math.log(1 / (1 - savingsRate / 100)) / Math.log(1.07); // Assuming 7% return

  return (
    <CalculatorCard title="Savings Rate Calculator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input label="Annual Income (€)" value={income} onChange={setIncome} />
          <Input label="Annual Expenses (€)" value={expenses} onChange={setExpenses} />
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
            <div className="text-sm opacity-90 mb-2">Your Savings Rate</div>
            <div className="text-5xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-sm opacity-90">
              You save €{(income - expenses).toLocaleString()} per year
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Estimated Years to FIRE</div>
            <div className="text-3xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {yearsToFire.toFixed(1)} years
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on 7% annual return and 4% withdrawal rate
            </p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

function Rule72Calculator() {
  const [rate, setRate] = useState(7);

  const yearsToDouble = 72 / rate;

  return (
    <CalculatorCard title="Rule of 72 Calculator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input label="Annual Return Rate (%)" value={rate} onChange={setRate} step={0.1} />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="font-semibold text-amber-900 mb-2">What is the Rule of 72?</h4>
            <p className="text-sm text-amber-800">
              A quick formula to estimate how long it takes for your money to double. 
              Simply divide 72 by your expected annual return rate.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-8 text-white">
          <div className="text-sm opacity-90 mb-2">Years to Double Your Money</div>
          <div className="text-5xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
            {yearsToDouble.toFixed(1)} years
          </div>
          <div className="space-y-2 text-sm opacity-90">
            <p>At {rate}% annual return:</p>
            <p>• €10,000 → €20,000 in {yearsToDouble.toFixed(1)} years</p>
            <p>• €50,000 → €100,000 in {yearsToDouble.toFixed(1)} years</p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

function GermanTaxCalculator() {
  const [capitalGain, setCapitalGain] = useState(10000);
  const TAX_RATE = 0.26375; // German Abgeltungsteuer

  const tax = capitalGain * TAX_RATE;
  const afterTax = capitalGain - tax;

  return (
    <CalculatorCard title="German Capital Gains Tax Calculator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input label="Capital Gain (€)" value={capitalGain} onChange={setCapitalGain} />
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-semibold text-red-900 mb-2">German Abgeltungsteuer</h4>
            <p className="text-sm text-red-800 mb-2">
              Capital gains in Germany are taxed at a flat rate of 26.375% (25% + 5.5% solidarity surcharge).
            </p>
            <p className="text-xs text-red-700">
              Note: This doesn't include church tax (8-9%) if applicable.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-white">
            <div className="text-sm opacity-90 mb-2">Tax Owed</div>
            <div className="text-5xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm opacity-90">
              {TAX_RATE * 100}% of €{capitalGain.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">After-Tax Gain</div>
            <div className="text-3xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{afterTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

function DebtPayoffCalculator() {
  const [debt, setDebt] = useState(20000);
  const [interestRate, setInterestRate] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  const monthlyRate = interestRate / 100 / 12;
  const monthsToPayoff = debt > 0 && monthlyPayment > debt * monthlyRate 
    ? Math.log(monthlyPayment / (monthlyPayment - debt * monthlyRate)) / Math.log(1 + monthlyRate)
    : 0;
  const totalPaid = monthlyPayment * monthsToPayoff;
  const totalInterest = totalPaid - debt;

  return (
    <CalculatorCard title="Debt Payoff Calculator">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input label="Total Debt (€)" value={debt} onChange={setDebt} />
          <Input label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} step={0.1} />
          <Input label="Monthly Payment (€)" value={monthlyPayment} onChange={setMonthlyPayment} />
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 text-white">
            <div className="text-sm opacity-90 mb-2">Time to Debt Freedom</div>
            <div className="text-5xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {monthsToPayoff > 0 ? (monthsToPayoff / 12).toFixed(1) : '∞'} years
            </div>
            <p className="text-sm opacity-90">
              {monthsToPayoff > 0 ? `${Math.ceil(monthsToPayoff)} months` : 'Payment too low'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Paid:</span>
              <span className="font-semibold text-secondary">€{totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Interest Paid:</span>
              <span className="font-semibold text-red-600">€{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}

// Reusable Components
function CalculatorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h2 className="text-3xl font-bold text-secondary mb-8" style={{ fontFamily: "'Crimson Pro', serif" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <span className="text-primary">●</span>
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          step={step}
          className="w-full px-4 py-3.5 pr-10 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white font-medium text-secondary hover:border-slate-300"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
