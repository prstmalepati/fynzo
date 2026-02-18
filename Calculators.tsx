import { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { calculateGermanTax, getMonthlyBreakdown, KINDERGELD_2026_MONTHLY } from '../calculations/germanTax';

export default function Calculators() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  return (
    <SidebarLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Financial Calculators
          </h1>
          <p className="text-slate-600" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Advanced tools for comprehensive financial planning
          </p>
        </div>
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
            {activeCalculator === 'tax-capital-gains' && <GermanCapitalGainsTaxCalculator />}
            {activeCalculator === 'tax-income-germany' && <GermanIncomeTaxCalculator />}
            {activeCalculator === 'debt-payoff' && <DebtPayoffCalculator />}
            {activeCalculator === 'fire' && <FireCalculator />}
          </div>
        )}
      </div>

      {/* Google Fonts */}
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      \`}</style>
    </SidebarLayout>
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
    id: 'tax-capital-gains',
    title: 'German Capital Gains',
    description: 'Calculate your after-tax returns on investments in Germany (26.375% Abgeltungsteuer).',
    color: 'bg-orange-100',
    icon: (
      <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    )
  },
  {
    id: 'tax-income-germany',
    title: 'German Income Tax',
    description: 'Comprehensive German income tax calculator with Grundfreibetrag, Kindergeld, progressive zones, and social security.',
    color: 'bg-red-100',
    icon: (
      <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
  {
    id: 'fire',
    title: 'FIRE Calculator',
    description: 'Calculate your Financial Independence number. Choose from Lean, Fat, Barista, or Coast FIRE.',
    color: 'bg-teal-100',
    icon: (
      <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
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

function GermanCapitalGainsTaxCalculator() {
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


function GermanIncomeTaxCalculator() {
  const currentYear = 2026;
  const [grossIncome, setGrossIncome] = useState(60000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [taxClass, setTaxClass] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [includeChurchTax, setIncludeChurchTax] = useState(false);
  const [age, setAge] = useState(30);
  const [capitalGains, setCapitalGains] = useState<number | ''>(''); // Fixed: empty instead of 0
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  // Calculate Kindergeld automatically (2026 rate: €259/month)
  const kindergeldAnnual = numberOfChildren * KINDERGELD_2026_MONTHLY * 12;
  const kindergeldMonthly = numberOfChildren * KINDERGELD_2026_MONTHLY;

  // Calculate capital gains tax (Abgeltungsteuer)
  const capitalGainsTaxRate = 0.26375; // 25% + 5.5% Soli
  const sparerpauschbetrag = filingStatus === 'married' ? 2000 : 1000;
  const capitalGainsValue = capitalGains === '' ? 0 : capitalGains;
  const taxableCapitalGains = Math.max(0, capitalGainsValue - sparerpauschbetrag);
  const capitalGainsTax = taxableCapitalGains * capitalGainsTaxRate;
  const capitalGainsNet = capitalGainsValue - capitalGainsTax;

  const taxResult = showResults ? calculateGermanTax({
    grossIncome,
    filingStatus,
    numberOfChildren,
    includeChurchTax,
    age
  }) : null;

  const monthly = taxResult ? getMonthlyBreakdown(taxResult) : null;
  const isMonthly = viewMode === 'monthly';

  return (
    <CalculatorCard title={`German Income Tax Calculator ${currentYear}`}>
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filing Status & Children */}
          <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border-2 border-red-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">👥</span> Tax Profile
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Filing Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilingStatus('single')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      filingStatus === 'single'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    👤 Single
                  </button>
                  <button
                    onClick={() => setFilingStatus('married')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      filingStatus === 'married'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    💑 Couple
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Tax Class (Steuerklasse)</label>
                <select
                  value={taxClass}
                  onChange={(e) => setTaxClass(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                >
                  <option value={1}>Class I - Single, no children</option>
                  <option value={2}>Class II - Single parent</option>
                  <option value={3}>Class III - Married, higher income</option>
                  <option value={4}>Class IV - Married, equal income</option>
                  <option value={5}>Class V - Married, lower income</option>
                  <option value={6}>Class VI - Second job</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Number of Children</label>
                <select
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                >
                  <option value={0}>0 - No children</option>
                  <option value={1}>1 child</option>
                  <option value={2}>2 children</option>
                  <option value={3}>3 children</option>
                  <option value={4}>4 children</option>
                  <option value={5}>5+ children</option>
                </select>
                {numberOfChildren > 0 && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                    <div className="font-semibold text-emerald-900">Kindergeld (2026 rate):</div>
                    <div className="text-emerald-700">
                      €{KINDERGELD_2026_MONTHLY}/month per child × {numberOfChildren} = €{kindergeldMonthly}/month
                    </div>
                    <div className="text-emerald-700 font-semibold mt-1">
                      Annual: €{kindergeldAnnual.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Church Tax (8-9%)</label>
                <button
                  onClick={() => setIncludeChurchTax(!includeChurchTax)}
                  className={`w-14 h-7 rounded-full transition-all ${
                    includeChurchTax ? 'bg-red-600' : 'bg-slate-300'
                  } relative`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                    includeChurchTax ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Income & Details */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-slate-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> Income & Details
            </h4>
            <div className="space-y-4">
              <Input label="Annual Gross Income (€)" value={grossIncome} onChange={setGrossIncome} />
              <Input label="Your Age" value={age} onChange={setAge} />
            </div>
          </div>

          {/* Capital Gains - FIXED */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">📈</span> Capital Gains (Kapitalerträge)
            </h4>
            <div className="space-y-4">
              <Input 
                label="Annual Capital Gains (€)" 
                value={capitalGains === '' ? '' : capitalGains}
                onChange={setCapitalGains}
                placeholder="0"
              />
              {capitalGainsValue > 0 && (
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 text-sm">
                  <div className="font-semibold text-amber-900 mb-1">Abgeltungsteuer (26.375%):</div>
                  <div className="text-amber-800">
                    Tax: €{capitalGainsTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-amber-800 font-semibold">
                    After-tax: €{capitalGainsNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-amber-700 mt-2">
                    Note: First €{sparerpauschbetrag.toLocaleString()} is tax-free (Sparerpauschbetrag)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Calculate Tax
          </button>

          {/* View Mode Toggle */}
          {showResults && (
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-slate-200">
              <label className="text-sm font-semibold text-slate-700 mb-3 block">View Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    viewMode === 'annual'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  📅 Annual
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    viewMode === 'monthly'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  💶 Monthly
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {!showResults ? (
            <div className="bg-white rounded-2xl p-12 border-2 border-slate-200 text-center">
              <div className="text-6xl mb-4">🇩🇪</div>
              <h3 className="text-2xl font-bold text-secondary mb-2">Ready to calculate your taxes?</h3>
              <p className="text-slate-600">Fill in your details and click "Calculate Tax" to see your breakdown</p>
            </div>
          ) : (
            <>
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-sm opacity-90 mb-2 font-semibold">{isMonthly ? 'Monthly' : 'Annual'} Net Income</div>
                <div className="text-6xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  €{(isMonthly ? monthly!.netIncome : taxResult!.netIncome).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <div className="text-xs opacity-90 mb-1">Effective Tax Rate</div>
                    <div className="text-2xl font-bold">{taxResult!.effectiveTaxRate.toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <div className="text-xs opacity-90 mb-1">Marginal Tax Rate</div>
                    <div className="text-2xl font-bold">{taxResult!.marginalTaxRate.toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <h4 className="font-bold text-secondary mb-4">💶 Tax Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Gross Income:</span>
                    <span className="font-bold text-secondary">€{(isMonthly ? monthly!.grossIncome : taxResult!.grossIncome).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">- Income Tax:</span>
                    <span className="font-semibold text-red-600">€{(isMonthly ? monthly!.incomeTax : taxResult!.incomeTax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">- Solidarity Tax:</span>
                    <span className="font-semibold text-red-600">€{(isMonthly ? monthly!.solidarityTax : taxResult!.solidarityTax).toLocaleString()}</span>
                  </div>
                  {includeChurchTax && (
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">- Church Tax:</span>
                      <span className="font-semibold text-red-600">€{(isMonthly ? monthly!.churchTax : taxResult!.churchTax).toLocaleString()}</span>
                    </div>
                  )}
                  {capitalGainsValue > 0 && (
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">- Capital Gains Tax:</span>
                      <span className="font-semibold text-red-600">€{(isMonthly ? (capitalGainsTax/12) : capitalGainsTax).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-slate-100 font-bold">
                    <span className="text-slate-700">Total Tax:</span>
                    <span className="text-red-600">€{(isMonthly ? monthly!.totalTax : taxResult!.totalTax).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Social Security */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <h4 className="font-bold text-secondary mb-4">🏥 Social Security Contributions (2026)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Pension Insurance (9.3%):</span>
                    <span className="font-semibold">€{(isMonthly ? monthly!.pensionInsurance : taxResult!.pensionInsurance).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Health Insurance (~9.3%):</span>
                    <span className="font-semibold">€{(isMonthly ? monthly!.healthInsurance : taxResult!.healthInsurance).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Unemployment (1.3%):</span>
                    <span className="font-semibold">€{(isMonthly ? monthly!.unemploymentInsurance : taxResult!.unemploymentInsurance).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Long-term Care (~{numberOfChildren === 0 && age >= 23 ? '2.0' : '1.8'}%):</span>
                    <span className="font-semibold">€{(isMonthly ? monthly!.longTermCare : taxResult!.longTermCare).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-200 font-bold pt-3">
                    <span className="text-slate-700">Total Social Security:</span>
                    <span className="text-secondary">€{(isMonthly ? monthly!.totalSocialSecurity : taxResult!.totalSocialSecurity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Tax Allowances */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-5 border-2 border-emerald-200">
                  <div className="text-xs text-emerald-800 mb-1 font-semibold">Grundfreibetrag (2026)</div>
                  <div className="text-2xl font-bold text-emerald-700">€{taxResult!.grundfreibetrag.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 mt-1">Tax-free allowance</div>
                </div>
                {numberOfChildren > 0 && (
                  <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                    <div className="text-xs text-blue-800 mb-1 font-semibold">Kindergeld ({numberOfChildren} {numberOfChildren === 1 ? 'child' : 'children'})</div>
                    <div className="text-2xl font-bold text-blue-700">€{(isMonthly ? kindergeldMonthly : kindergeldAnnual).toLocaleString()}</div>
                    <div className="text-xs text-blue-600 mt-1">{isMonthly ? 'Monthly' : 'Annual'} child benefit</div>
                  </div>
                )}
              </div>

              {/* Tax Zones */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <h4 className="font-bold text-secondary mb-4">📊 Progressive Tax Zones (2026)</h4>
                <div className="space-y-3">
                  {taxResult!.taxZones.map((zone) => (
                    <div key={zone.zone} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-sm text-secondary">{zone.name}</div>
                        <div className="text-xs text-slate-600">{zone.range} • {zone.rate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-secondary">€{zone.taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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

function FireCalculator() {
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlySavings, setMonthlySavings] = useState(2000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(4);
  
  // Part-time income for Barista FIRE
  const [partTimeIncome, setPartTimeIncome] = useState(20000);
  
  // Coast FIRE settings
  const [coastRetirementAge, setCoastRetirementAge] = useState(65);

  const [selectedFireType, setSelectedFireType] = useState<'lean' | 'fat' | 'barista' | 'coast'>('lean');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Calculate different FIRE numbers
  const leanFireNumber = (annualExpenses * 0.7) / (safeWithdrawalRate / 100);
  const standardFireNumber = annualExpenses / (safeWithdrawalRate / 100);
  const fatFireNumber = (annualExpenses * 2) / (safeWithdrawalRate / 100);
  const baristaExpenses = annualExpenses - partTimeIncome;
  const baristaFireNumber = Math.max(0, baristaExpenses) / (safeWithdrawalRate / 100);
  
  // Coast FIRE calculation
  const yearsToCoastRetirement = coastRetirementAge - currentAge;
  const coastFireNumber = annualExpenses / (safeWithdrawalRate / 100);
  const coastFireTarget = coastFireNumber / Math.pow(1 + expectedReturn / 100, yearsToCoastRetirement);

  // Calculate years to reach each FIRE type
  const calculateYearsToFire = (target: number) => {
    if (currentSavings >= target) return 0;
    
    const monthlyRate = expectedReturn / 100 / 12;
    const monthlyTarget = target;
    
    if (monthlySavings <= 0) return 999;
    
    const months = Math.log((monthlyTarget * monthlyRate + monthlySavings) / (currentSavings * monthlyRate + monthlySavings)) / Math.log(1 + monthlyRate);
    return Math.ceil(months / 12);
  };

  const leanYears = calculateYearsToFire(leanFireNumber);
  const standardYears = calculateYearsToFire(standardFireNumber);
  const fatYears = calculateYearsToFire(fatFireNumber);
  const baristaYears = calculateYearsToFire(baristaFireNumber);
  const coastYears = calculateYearsToFire(coastFireTarget);

  const fireTypes = [
    {
      id: 'lean' as const,
      name: 'Lean FIRE',
      emoji: '🌱',
      description: 'Minimalist lifestyle with 70% of current expenses',
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-300',
      bgColor: 'bg-emerald-50',
      target: leanFireNumber,
      years: leanYears,
      expenses: annualExpenses * 0.7,
      details: 'Live frugally, focus on essentials, lower cost of living'
    },
    {
      id: 'fat' as const,
      name: 'Fat FIRE',
      emoji: '💎',
      description: 'Comfortable lifestyle with 2x current expenses',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-50',
      target: fatFireNumber,
      years: fatYears,
      expenses: annualExpenses * 2,
      details: 'Luxury travel, dining out, no budget constraints'
    },
    {
      id: 'barista' as const,
      name: 'Barista FIRE',
      emoji: '☕',
      description: 'Part-time work covers living expenses',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      target: baristaFireNumber,
      years: baristaYears,
      expenses: baristaExpenses,
      details: 'Portfolio covers most expenses, work for fun/health insurance'
    },
    {
      id: 'coast' as const,
      name: 'Coast FIRE',
      emoji: '🏖️',
      description: 'Stop saving, let investments grow until traditional retirement',
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-300',
      bgColor: 'bg-cyan-50',
      target: coastFireTarget,
      years: coastYears,
      expenses: annualExpenses,
      details: `Reach €${Math.round(coastFireTarget / 1000)}K by age ${currentAge + coastYears}, then coast to ${coastRetirementAge}`
    }
  ];

  const selectedFire = fireTypes.find(f => f.id === selectedFireType)!;

  const handleSaveFireNumber = () => {
    // Save to localStorage for use in Projection
    const fireData = {
      type: selectedFireType,
      number: selectedFire.target,
      expenses: selectedFire.expenses,
      withdrawalRate: safeWithdrawalRate,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('myfynzo_fire_target', JSON.stringify(fireData));
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <CalculatorCard title="FIRE Calculator">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span> Your Current Situation
            </h4>
            <div className="space-y-4">
              <Input label="Annual Expenses (€)" value={annualExpenses} onChange={setAnnualExpenses} />
              <Input label="Current Age" value={currentAge} onChange={setCurrentAge} />
              <Input label="Current Savings (€)" value={currentSavings} onChange={setCurrentSavings} />
              <Input label="Monthly Savings (€)" value={monthlySavings} onChange={setMonthlySavings} />
            </div>
          </div>

          {/* Investment Settings */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Investment Settings
            </h4>
            <div className="space-y-4">
              <Input label="Expected Annual Return (%)" value={expectedReturn} onChange={setExpectedReturn} step={0.1} />
              <Input label="Safe Withdrawal Rate (%)" value={safeWithdrawalRate} onChange={setSafeWithdrawalRate} step={0.1} />
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-xs text-blue-800">
                <strong>4% Rule:</strong> Withdraw 4% of your portfolio annually. Historically safe for 30+ year retirements.
              </div>
            </div>
          </div>

          {/* Barista FIRE Settings */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">☕</span> Barista FIRE Settings
            </h4>
            <div className="space-y-4">
              <Input label="Part-Time Annual Income (€)" value={partTimeIncome} onChange={setPartTimeIncome} />
              <div className="text-sm text-slate-600">
                Income from part-time work that covers some expenses
              </div>
            </div>
          </div>

          {/* Coast FIRE Settings */}
          <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border-2 border-cyan-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">🏖️</span> Coast FIRE Settings
            </h4>
            <div className="space-y-4">
              <Input label="Traditional Retirement Age" value={coastRetirementAge} onChange={setCoastRetirementAge} />
              <div className="text-sm text-slate-600">
                Age when you'll retire without additional saving
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* FIRE Type Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {fireTypes.map((fire) => (
              <button
                key={fire.id}
                onClick={() => setSelectedFireType(fire.id)}
                className={`text-left p-6 rounded-xl border-2 transition-all ${
                  selectedFireType === fire.id
                    ? `${fire.borderColor} shadow-lg scale-105 ${fire.bgColor}`
                    : 'border-slate-200 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-3xl mb-2">{fire.emoji}</div>
                    <h3 className="text-xl font-bold text-secondary mb-1">
                      {fire.name}
                    </h3>
                  </div>
                  {selectedFireType === fire.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-4">{fire.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Target:</span>
                    <span className="font-bold text-secondary">€{Math.round(fire.target / 1000)}K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Years to reach:</span>
                    <span className="font-bold text-primary">
                      {fire.years < 999 ? `${fire.years} years` : '∞'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Annual expenses:</span>
                    <span className="font-bold text-slate-700">€{Math.round(fire.expenses / 1000)}K</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Breakdown for Selected Type */}
          <div className={`bg-gradient-to-br ${selectedFire.color} rounded-2xl p-8 text-white shadow-2xl`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">{selectedFire.emoji}</span>
              <div>
                <h2 className="text-3xl font-bold mb-1">{selectedFire.name}</h2>
                <p className="text-white/90">{selectedFire.details}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="text-sm opacity-90 mb-1">FIRE Number</div>
                <div className="text-3xl font-bold">€{Math.round(selectedFire.target / 1000)}K</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="text-sm opacity-90 mb-1">Years to FIRE</div>
                <div className="text-3xl font-bold">
                  {selectedFire.years < 999 ? selectedFire.years : '∞'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="text-sm opacity-90 mb-1">FIRE Age</div>
                <div className="text-3xl font-bold">
                  {selectedFire.years < 999 ? currentAge + selectedFire.years : 'N/A'}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="text-sm opacity-90 mb-1">Annual Expenses</div>
                <div className="text-3xl font-bold">€{Math.round(selectedFire.expenses / 1000)}K</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Current Progress</span>
                <span>{Math.min(100, (currentSavings / selectedFire.target * 100)).toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentSavings / selectedFire.target * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2 opacity-90">
                <span>€{Math.round(currentSavings / 1000)}K</span>
                <span>€{Math.round(selectedFire.target / 1000)}K</span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveFireNumber}
              className="w-full bg-white text-secondary px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Set as My FIRE Target
            </button>

            {showSaveSuccess && (
              <div className="mt-4 bg-green-500 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>FIRE target saved! It will now be used in your Wealth Projection.</span>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <h3 className="text-xl font-bold text-secondary mb-4">Compare All FIRE Types</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 font-semibold text-slate-700">Type</th>
                    <th className="text-right py-3 font-semibold text-slate-700">Target</th>
                    <th className="text-right py-3 font-semibold text-slate-700">Years</th>
                    <th className="text-right py-3 font-semibold text-slate-700">FIRE Age</th>
                    <th className="text-right py-3 font-semibold text-slate-700">Expenses</th>
                  </tr>
                </thead>
                <tbody>
                  {fireTypes.map((fire) => (
                    <tr 
                      key={fire.id}
                      className={`border-b border-slate-100 ${selectedFireType === fire.id ? fire.bgColor : ''}`}
                    >
                      <td className="py-3">
                        <span className="mr-2">{fire.emoji}</span>
                        {fire.name}
                      </td>
                      <td className="text-right font-semibold">€{Math.round(fire.target / 1000)}K</td>
                      <td className="text-right">{fire.years < 999 ? `${fire.years}y` : '∞'}</td>
                      <td className="text-right">{fire.years < 999 ? currentAge + fire.years : 'N/A'}</td>
                      <td className="text-right">€{Math.round(fire.expenses / 1000)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
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
