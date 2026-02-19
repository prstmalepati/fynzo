import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';
import { calculateGermanTax } from '../calculations/germanTax';

export default function Calculators() {
  const { formatAmount, formatCompact, currency } = useCurrency();
  const [activeCalculator, setActiveCalculator] = useState('fire');

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Financial Calculators
          </h1>
          <p className="text-slate-600">
            Tools to plan your financial future
          </p>
        </div>

        {/* Calculator Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { id: 'fire', label: '🔥 FIRE Calculator', color: 'orange' },
            { id: 'compound', label: '📈 Compound Interest', color: 'blue' },
            { id: 'tax', label: '🇩🇪 German Tax', color: 'red' },
            { id: 'retirement', label: '👴 Retirement', color: 'purple' },
            { id: 'debt', label: '💳 Debt Payoff', color: 'green' }
          ].map(calc => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeCalculator === calc.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-primary'
              }`}
            >
              {calc.label}
            </button>
          ))}
        </div>

        {/* Calculator Content */}
        {activeCalculator === 'fire' && <FIRECalculator formatAmount={formatAmount} formatCompact={formatCompact} currency={currency} />}
        {activeCalculator === 'compound' && <CompoundInterestCalculator formatAmount={formatAmount} formatCompact={formatCompact} currency={currency} />}
        {activeCalculator === 'tax' && <GermanTaxCalculator formatAmount={formatAmount} />}
        {activeCalculator === 'retirement' && <RetirementCalculator formatAmount={formatAmount} formatCompact={formatCompact} currency={currency} />}
        {activeCalculator === 'debt' && <DebtPayoffCalculator formatAmount={formatAmount} currency={currency} />}

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}

// ============================================================================
// FIRE CALCULATOR
// ============================================================================
function FIRECalculator({ formatAmount, formatCompact, currency }: any) {
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlySavings, setMonthlySavings] = useState(3000);
  const [expectedReturn, setExpectedReturn] = useState(7);

  const leanFIRE = annualExpenses * 20;
  const regularFIRE = annualExpenses * 25;
  const fatFIRE = annualExpenses * 30;
  const baristaFIRE = annualExpenses * 25 * 0.5;

  const calculateYearsToFIRE = (target: number) => {
    if (currentSavings >= target) return 0;
    
    let balance = currentSavings;
    let years = 0;
    const monthlyReturn = expectedReturn / 100 / 12;

    while (balance < target && years < 100) {
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyReturn) + monthlySavings;
      }
      years++;
    }

    return years;
  };

  const yearsToRegularFIRE = calculateYearsToFIRE(regularFIRE);
  const currentAge = 35;
  const fireAge = currentAge + yearsToRegularFIRE;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-6">Your Numbers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Expenses ({currency})
            </label>
            <input
              type="number"
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Savings ({currency})
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Monthly Savings ({currency})
            </label>
            <input
              type="number"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Lean FIRE</div>
          <div className="text-3xl font-bold mb-2">{formatCompact(leanFIRE)}</div>
          <div className="text-xs opacity-75 mb-4">{formatAmount(leanFIRE)}</div>
          <div className="text-xs opacity-90">Minimal lifestyle</div>
          <div className="text-sm mt-2 opacity-90">{calculateYearsToFIRE(leanFIRE)} years away</div>
        </div>

        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl ring-4 ring-primary/20">
          <div className="text-sm opacity-90 mb-2">Regular FIRE ⭐</div>
          <div className="text-3xl font-bold mb-2">{formatCompact(regularFIRE)}</div>
          <div className="text-xs opacity-75 mb-4">{formatAmount(regularFIRE)}</div>
          <div className="text-xs opacity-90">Comfortable living</div>
          <div className="text-sm mt-2 font-bold">{yearsToRegularFIRE} years away</div>
          <div className="text-xs opacity-75">Age {fireAge}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Fat FIRE</div>
          <div className="text-3xl font-bold mb-2">{formatCompact(fatFIRE)}</div>
          <div className="text-xs opacity-75 mb-4">{formatAmount(fatFIRE)}</div>
          <div className="text-xs opacity-90">Luxury lifestyle</div>
          <div className="text-sm mt-2 opacity-90">{calculateYearsToFIRE(fatFIRE)} years away</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Barista FIRE</div>
          <div className="text-3xl font-bold mb-2">{formatCompact(baristaFIRE)}</div>
          <div className="text-xs opacity-75 mb-4">{formatAmount(baristaFIRE)}</div>
          <div className="text-xs opacity-90">Part-time work</div>
          <div className="text-sm mt-2 opacity-90">{calculateYearsToFIRE(baristaFIRE)} years away</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200">
        <h3 className="text-xl font-bold text-secondary mb-4">How It Works</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-bold text-secondary mb-2">📊 The 4% Rule</h4>
            <p className="text-slate-700 leading-relaxed">
              Multiply your annual expenses by 25 to get your FIRE number. This allows you to
              withdraw 4% per year indefinitely.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-secondary mb-2">🎯 Different Types</h4>
            <p className="text-slate-700 leading-relaxed">
              <strong>Lean:</strong> 20x expenses • <strong>Regular:</strong> 25x expenses • 
              <strong>Fat:</strong> 30x expenses • <strong>Barista:</strong> Half FIRE + part-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPOUND INTEREST CALCULATOR
// ============================================================================
function CompoundInterestCalculator({ formatAmount, formatCompact, currency }: any) {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(30);

  const calculateCompound = () => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    
    let balance = principal;
    for (let i = 0; i < totalMonths; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    
    return balance;
  };

  const futureValue = calculateCompound();
  const totalContributed = principal + (monthlyContribution * 12 * years);
  const totalInterest = futureValue - totalContributed;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-6">Investment Details</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Initial Amount ({currency})
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Monthly Contribution ({currency})
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Return (%)
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Future Value</div>
          <div className="text-4xl font-bold mb-2">{formatCompact(futureValue)}</div>
          <div className="text-sm opacity-75">{formatAmount(futureValue)}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 bg-blue-50">
          <div className="text-sm text-blue-900 mb-2">Total Contributed</div>
          <div className="text-4xl font-bold text-blue-700 mb-2">{formatCompact(totalContributed)}</div>
          <div className="text-sm text-blue-600">{formatAmount(totalContributed)}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-green-200 bg-green-50">
          <div className="text-sm text-green-900 mb-2">Interest Earned</div>
          <div className="text-4xl font-bold text-green-700 mb-2">{formatCompact(totalInterest)}</div>
          <div className="text-sm text-green-600">{formatAmount(totalInterest)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h3 className="text-xl font-bold text-secondary mb-4">Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Initial Investment</span>
            <span className="font-bold text-secondary">{formatAmount(principal)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-slate-700">Monthly Contributions ({years} years)</span>
            <span className="font-bold text-secondary">{formatAmount(monthlyContribution * 12 * years)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <span className="text-green-900 font-semibold">Investment Growth</span>
            <span className="font-bold text-green-700">{formatAmount(totalInterest)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <span className="text-primary font-bold">Total Future Value</span>
            <span className="font-bold text-primary text-xl">{formatAmount(futureValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GERMAN TAX CALCULATOR
// ============================================================================
function GermanTaxCalculator({ formatAmount }: any) {
  const [grossSalary, setGrossSalary] = useState(60000);
  const [taxClass, setTaxClass] = useState(1);
  const [bundesland, setBundesland] = useState('Bayern');
  const [hasChurchTax, setHasChurchTax] = useState(true);
  const [children, setChildren] = useState(0);

  const taxResult = calculateGermanTax(grossSalary, taxClass, bundesland, hasChurchTax, children);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-6">Tax Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gross Annual Salary (€)
            </label>
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Class</label>
            <select
              value={taxClass}
              onChange={(e) => setTaxClass(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold"
            >
              <option value={1}>Class I (Single)</option>
              <option value={2}>Class II (Single parent)</option>
              <option value={3}>Class III (Married, higher earner)</option>
              <option value={4}>Class IV (Married, both work)</option>
              <option value={5}>Class V (Married, lower earner)</option>
              <option value={6}>Class VI (Multiple jobs)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bundesland</label>
            <select
              value={bundesland}
              onChange={(e) => setBundesland(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold"
            >
              <option>Bayern</option>
              <option>Baden-Württemberg</option>
              <option>Berlin</option>
              <option>Brandenburg</option>
              <option>Bremen</option>
              <option>Hamburg</option>
              <option>Hessen</option>
              <option>Niedersachsen</option>
              <option>Nordrhein-Westfalen</option>
              <option>Rheinland-Pfalz</option>
              <option>Saarland</option>
              <option>Sachsen</option>
              <option>Sachsen-Anhalt</option>
              <option>Schleswig-Holstein</option>
              <option>Thüringen</option>
              <option>Mecklenburg-Vorpommern</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Children</label>
            <input
              type="number"
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
              min="0"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasChurchTax}
                onChange={(e) => setHasChurchTax(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/20"
              />
              <span className="ml-3 text-sm font-semibold text-slate-700">
                Pay Church Tax ({bundesland === 'Bayern' || bundesland === 'Baden-Württemberg' ? '8%' : '9%'})
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Gross Salary</div>
          <div className="text-4xl font-bold mb-2">{formatAmount(grossSalary)}</div>
          <div className="text-sm opacity-75">Before all deductions</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Net Salary</div>
          <div className="text-4xl font-bold mb-2">{formatAmount(taxResult.netSalary)}</div>
          <div className="text-sm opacity-75">After all deductions</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h3 className="text-xl font-bold text-secondary mb-6">Tax Breakdown (2026 Rates)</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-900">Income Tax (Einkommensteuer)</span>
            <span className="font-bold text-red-700">-{formatAmount(taxResult.incomeTax)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-orange-900">Solidarity Surcharge (Solidaritätszuschlag)</span>
            <span className="font-bold text-orange-700">-{formatAmount(taxResult.solidarity)}</span>
          </div>
          {hasChurchTax && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-amber-900">Church Tax (Kirchensteuer)</span>
              <span className="font-bold text-amber-700">-{formatAmount(taxResult.churchTax)}</span>
            </div>
          )}
          {children > 0 && (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-900">Kindergeld ({children} {children === 1 ? 'child' : 'children'})</span>
              <span className="font-bold text-green-700">+{formatAmount(taxResult.kindergeld)}</span>
            </div>
          )}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary mt-4">
            <span className="text-primary font-bold">Monthly Net Income</span>
            <span className="font-bold text-primary text-xl">{formatAmount(taxResult.netSalary / 12)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RETIREMENT CALCULATOR
// ============================================================================
function RetirementCalculator({ formatAmount, formatCompact, currency }: any) {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [expectedInflation, setExpectedInflation] = useState(2);

  const yearsToRetirement = retirementAge - currentAge;
  
  const calculateRetirement = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    
    let balance = currentSavings;
    for (let i = 0; i < totalMonths; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    
    return balance;
  };

  const retirementSavings = calculateRetirement();
  const inflationAdjusted = retirementSavings / Math.pow(1 + expectedInflation / 100, yearsToRetirement);
  const monthlyIncome = (retirementSavings * 0.04) / 12;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-6">Retirement Planning</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Age</label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Retirement Age</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Years to Retirement</label>
            <div className="w-full px-4 py-3 bg-slate-100 rounded-xl font-bold text-primary text-lg text-center">
              {yearsToRetirement} years
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Savings ({currency})</label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Contribution ({currency})</label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Return (%)</label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Retirement Savings (Nominal)</div>
          <div className="text-4xl font-bold mb-2">{formatCompact(retirementSavings)}</div>
          <div className="text-sm opacity-75">{formatAmount(retirementSavings)}</div>
          <div className="mt-3 text-xs opacity-75">At age {retirementAge}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 bg-amber-50">
          <div className="text-sm text-amber-900 mb-2">Inflation-Adjusted Value</div>
          <div className="text-4xl font-bold text-amber-700 mb-2">{formatCompact(inflationAdjusted)}</div>
          <div className="text-sm text-amber-600">{formatAmount(inflationAdjusted)}</div>
          <div className="mt-3 text-xs text-amber-700">Today's purchasing power</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-green-200 bg-green-50">
          <div className="text-sm text-green-900 mb-2">Monthly Retirement Income</div>
          <div className="text-4xl font-bold text-green-700 mb-2">{formatCompact(monthlyIncome)}</div>
          <div className="text-sm text-green-600">{formatAmount(monthlyIncome)}</div>
          <div className="mt-3 text-xs text-green-700">Based on 4% withdrawal rule</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200">
        <h3 className="text-xl font-bold text-secondary mb-6">Your Retirement Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentAge}
            </div>
            <div className="flex-1">
              <div className="font-bold text-secondary">Today</div>
              <div className="text-sm text-slate-600">Current Savings: {formatAmount(currentSavings)}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-6">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-green-500"></div>
            <div className="text-sm text-slate-600">
              Contributing {formatAmount(monthlyContribution)}/month for {yearsToRetirement} years
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {retirementAge}
            </div>
            <div className="flex-1">
              <div className="font-bold text-secondary">Retirement</div>
              <div className="text-sm text-slate-600">Total Savings: {formatAmount(retirementSavings)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEBT PAYOFF CALCULATOR
// ============================================================================
function DebtPayoffCalculator({ formatAmount, currency }: any) {
  const [debtAmount, setDebtAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(18);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  const calculatePayoff = () => {
    if (monthlyPayment <= 0 || interestRate < 0) {
      return { months: 0, totalPaid: 0, totalInterest: 0 };
    }

    const monthlyRate = interestRate / 100 / 12;
    let balance = debtAmount;
    let months = 0;
    let totalPaid = 0;

    const monthlyInterest = balance * monthlyRate;
    if (monthlyPayment <= monthlyInterest) {
      return { months: Infinity, totalPaid: 0, totalInterest: 0 };
    }

    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      
      if (balance <= monthlyPayment) {
        totalPaid += balance + interest;
        balance = 0;
        months++;
        break;
      }
      
      balance -= principal;
      totalPaid += monthlyPayment;
      months++;
    }

    return {
      months,
      totalPaid,
      totalInterest: totalPaid - debtAmount
    };
  };

  const payoff = calculatePayoff();
  const years = Math.floor(payoff.months / 12);
  const remainingMonths = payoff.months % 12;
  const isPayoffImpossible = payoff.months === Infinity || payoff.months === 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold text-secondary mb-6">Debt Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Debt ({currency})</label>
            <input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Payment ({currency})</label>
            <input
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
        </div>
      </div>

      {isPayoffImpossible ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-900 mb-2">Payment Too Low!</h3>
          <p className="text-red-700 mb-4">
            Your monthly payment doesn't cover the interest charges. Increase your payment to at least{' '}
            <strong>{formatAmount((debtAmount * interestRate / 100 / 12) + 1)}</strong> per month.
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">Time to Payoff</div>
              <div className="text-4xl font-bold mb-2">{years}y {remainingMonths}m</div>
              <div className="text-sm opacity-75">{payoff.months} months total</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-red-200 bg-red-50">
              <div className="text-sm text-red-900 mb-2">Total Amount Paid</div>
              <div className="text-4xl font-bold text-red-700 mb-2">{formatAmount(payoff.totalPaid)}</div>
              <div className="text-sm text-red-600">Principal + Interest</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 bg-orange-50">
              <div className="text-sm text-orange-900 mb-2">Total Interest</div>
              <div className="text-4xl font-bold text-orange-700 mb-2">{formatAmount(payoff.totalInterest)}</div>
              <div className="text-sm text-orange-600">Extra cost of debt</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <h3 className="text-xl font-bold text-secondary mb-6">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Original Debt</span>
                <span className="font-bold text-secondary">{formatAmount(debtAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-900">Total Interest</span>
                <span className="font-bold text-orange-700">+{formatAmount(payoff.totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-300">
                <span className="text-red-900 font-bold">Total You'll Pay</span>
                <span className="font-bold text-red-700 text-xl">{formatAmount(payoff.totalPaid)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-secondary mb-3">💡 Pay More, Save More</h4>
              <div className="text-sm text-slate-700 space-y-2">
                <div>
                  If you increase payment to {formatAmount(monthlyPayment + 100)}:
                  <ul className="list-disc list-inside ml-4 mt-1 text-slate-600">
                    <li>Save approximately {formatAmount((payoff.totalInterest * 0.15))} in interest</li>
                    <li>Pay off {Math.floor(payoff.months * 0.15)} months faster</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
