import { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { calculateGermanTax, getMonthlyBreakdown } from '../calculations/germanTax';

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
          </div>
        )}
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>
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
  const currentYear = new Date().getFullYear();
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [taxClassPartner1, setTaxClassPartner1] = useState(1);
  const [taxClassPartner2, setTaxClassPartner2] = useState(4);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [includeChurchTax, setIncludeChurchTax] = useState(false);
  const [bundesland, setBundesland] = useState('Bayern');
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');
  const [showResults, setShowResults] = useState(false);

  // Income inputs
  const [grossIncome, setGrossIncome] = useState(60000);
  const [age, setAge] = useState(30);
  
  // Couple-specific inputs
  const [grossIncomePartner2, setGrossIncomePartner2] = useState(45000);
  const [agePartner2, setAgePartner2] = useState(28);
  
  // Capital gains
  const [capitalGains, setCapitalGains] = useState(0);

  // Kindergeld constants (2024/2025)
  const KINDERGELD_PER_CHILD_MONTHLY = 250;
  const KINDERGELD_PER_CHILD_ANNUAL = KINDERGELD_PER_CHILD_MONTHLY * 12;

  // Church tax rates by Bundesland
  const churchTaxRates: { [key: string]: number } = {
    'Baden-Württemberg': 0.08,
    'Bayern': 0.08,
    'Berlin': 0.09,
    'Brandenburg': 0.09,
    'Bremen': 0.09,
    'Hamburg': 0.09,
    'Hessen': 0.09,
    'Mecklenburg-Vorpommern': 0.09,
    'Niedersachsen': 0.09,
    'Nordrhein-Westfalen': 0.09,
    'Rheinland-Pfalz': 0.09,
    'Saarland': 0.09,
    'Sachsen': 0.09,
    'Sachsen-Anhalt': 0.09,
    'Schleswig-Holstein': 0.09,
    'Thüringen': 0.09,
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  // Calculate Kindergeld automatically
  const kindergeldAnnual = numberOfChildren * KINDERGELD_PER_CHILD_ANNUAL;
  const kindergeldMonthly = numberOfChildren * KINDERGELD_PER_CHILD_MONTHLY;

  // Calculate capital gains tax (Abgeltungsteuer)
  const capitalGainsTaxRate = 0.26375; // 25% + 5.5% Soli
  const sparerpauschbetrag = filingStatus === 'married' ? 2000 : 1000;
  const taxableCapitalGains = Math.max(0, capitalGains - sparerpauschbetrag);
  const capitalGainsTax = taxableCapitalGains * capitalGainsTaxRate;
  const capitalGainsNet = capitalGains - capitalGainsTax;

  const taxResult = showResults ? calculateGermanTax({
    grossIncome: filingStatus === 'married' ? grossIncome + grossIncomePartner2 : grossIncome,
    filingStatus,
    numberOfChildren,
    includeChurchTax,
    age,
  }) : null;

  const monthly = taxResult ? getMonthlyBreakdown(taxResult) : null;
  const isMonthly = viewMode === 'monthly';

  return (
    <CalculatorCard title={`German Income Tax Calculator ${currentYear}`}>
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filing Status & Tax Classes */}
          <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border-2 border-red-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">👥</span> Tax Profile
            </h4>
            <div className="space-y-4">
              {/* Filing Status */}
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

              {/* Tax Class for Single */}
              {filingStatus === 'single' && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Tax Class (Steuerklasse)</label>
                  <select
                    value={taxClassPartner1}
                    onChange={(e) => setTaxClassPartner1(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                  >
                    <option value={1}>Class I - Single, no children</option>
                    <option value={2}>Class II - Single parent</option>
                    <option value={6}>Class VI - Second job</option>
                  </select>
                </div>
              )}

              {/* Tax Classes for Couple */}
              {filingStatus === 'married' && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Partner 1 Tax Class</label>
                    <select
                      value={taxClassPartner1}
                      onChange={(e) => setTaxClassPartner1(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                    >
                      <option value={3}>Class III - Married, higher income</option>
                      <option value={4}>Class IV - Married, equal income</option>
                      <option value={5}>Class V - Married, lower income</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Partner 2 Tax Class</label>
                    <select
                      value={taxClassPartner2}
                      onChange={(e) => setTaxClassPartner2(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                    >
                      <option value={3}>Class III - Married, higher income</option>
                      <option value={4}>Class IV - Married, equal income</option>
                      <option value={5}>Class V - Married, lower income</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <div className="font-semibold text-blue-900 mb-1">💡 Common Combinations:</div>
                    <div className="text-blue-700 space-y-1">
                      <div>• 3/5 - One partner earns significantly more</div>
                      <div>• 4/4 - Both partners earn similar amounts</div>
                    </div>
                  </div>
                </>
              )}

              {/* Children */}
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
                    <div className="font-semibold text-emerald-900">Kindergeld (automatic):</div>
                    <div className="text-emerald-700">
                      €{KINDERGELD_PER_CHILD_MONTHLY}/month per child × {numberOfChildren} = €{kindergeldMonthly}/month
                    </div>
                    <div className="text-emerald-700 font-semibold mt-1">
                      Annual: €{kindergeldAnnual.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Bundesland */}
              {includeChurchTax && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Bundesland (State)</label>
                  <select
                    value={bundesland}
                    onChange={(e) => setBundesland(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white font-medium"
                  >
                    {Object.keys(churchTaxRates).sort().map(state => (
                      <option key={state} value={state}>
                        {state} ({(churchTaxRates[state] * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Church Tax Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Church Tax (Kirchensteuer)
                </label>
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

          {/* Income & Age - Partner 1 */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-2 border-slate-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> {filingStatus === 'married' ? 'Partner 1 ' : ''}Income & Details
            </h4>
            <div className="space-y-4">
              <Input 
                label={`${filingStatus === 'married' ? 'Partner 1 ' : ''}Annual Gross Income (€)`} 
                value={grossIncome} 
                onChange={setGrossIncome} 
              />
              <Input 
                label={`${filingStatus === 'married' ? 'Partner 1 ' : ''}Age`} 
                value={age} 
                onChange={setAge} 
              />
            </div>
          </div>

          {/* Income & Age - Partner 2 (only for couples) */}
          {filingStatus === 'married' && (
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200">
              <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="text-xl">💰</span> Partner 2 Income & Details
              </h4>
              <div className="space-y-4">
                <Input 
                  label="Partner 2 Annual Gross Income (€)" 
                  value={grossIncomePartner2} 
                  onChange={setGrossIncomePartner2} 
                />
                <Input 
                  label="Partner 2 Age" 
                  value={agePartner2} 
                  onChange={setAgePartner2} 
                />
              </div>
            </div>
          )}

          {/* Capital Gains */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200">
            <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-xl">📈</span> Capital Gains (Kapitalerträge)
            </h4>
            <div className="space-y-4">
              <Input 
                label="Annual Capital Gains (€)" 
                value={capitalGains} 
                onChange={setCapitalGains}
              />
              {capitalGains > 0 && (
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

          {/* View Mode Toggle - Only show after calculation */}
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
            /* Placeholder before calculation */
            <div className="bg-white rounded-2xl p-12 border-2 border-slate-200 text-center">
              <div className="text-6xl mb-4">🇩🇪</div>
              <h3 className="text-2xl font-bold text-secondary mb-2">Ready to calculate your taxes?</h3>
              <p className="text-slate-600">Fill in your details and click "Calculate Tax" to see your breakdown</p>
              {filingStatus === 'married' && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  💑 Couple mode active - Enter both partners' incomes for accurate calculation
                </div>
              )}
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
                  {capitalGains > 0 && (
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

              {/* Social Security Breakdown */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <h4 className="font-bold text-secondary mb-4">🏥 Social Security Contributions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Pension Insurance (9.3%):</span>
                    <span className="font-semibold">€{(isMonthly ? monthly!.pensionInsurance : taxResult!.pensionInsurance).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Health Insurance (~9%):</span>
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

              {/* Tax Allowances & Benefits */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-5 border-2 border-emerald-200">
                  <div className="text-xs text-emerald-800 mb-1 font-semibold">Grundfreibetrag</div>
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

              {/* Tax Zones Breakdown */}
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <h4 className="font-bold text-secondary mb-4">📊 Progressive Tax Zones</h4>
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
