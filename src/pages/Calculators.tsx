import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';

// Import new calculator components
import FIRECalculator from '../components/FIRECalculator';
import ProjectionCalculator from '../components/ProjectionCalculator';
import WealthProjection from '../components/WealthProjection';
import GermanTaxCalculator from '../components/GermanTaxCalculator';

export default function Calculators() {
  const { formatAmount, formatCompact, currency } = useCurrency();
  const [activeCalculator, setActiveCalculator] = useState('fire');

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title" >
            Financial Calculators
          </h1>
          <p className="text-surface-900-500">
            Professional tools to plan your financial future
          </p>
        </div>

        {/* Calculator Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { id: 'fire', label: '🔥 FIRE Calculator', color: 'orange' },
            { id: 'projection', label: '📈 Investment Projection', color: 'blue' },
            { id: 'wealth', label: '💰 Wealth Scenarios', color: 'purple' },
            { id: 'tax', label: '🇩🇪 German Tax', color: 'red' },
            { id: 'retirement', label: '👴 Retirement', color: 'green' },
            { id: 'debt', label: '💳 Debt Payoff', color: 'orange' }
          ].map(calc => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeCalculator === calc.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white border border-secondary-200 text-surface-900-700 hover:border-primary'
              }`}
            >
              {calc.label}
            </button>
          ))}
        </div>

        {/* Calculator Content */}
        <div className="animate-fadeIn">
          {activeCalculator === 'fire' && <FIRECalculator />}
          {activeCalculator === 'projection' && <ProjectionCalculator />}
          {activeCalculator === 'wealth' && <WealthProjection />}
          {activeCalculator === 'tax' && <GermanTaxCalculator />}
          {activeCalculator === 'retirement' && <RetirementCalculator formatAmount={formatAmount} formatCompact={formatCompact} currency={currency} />}
          {activeCalculator === 'debt' && <DebtPayoffCalculator formatAmount={formatAmount} currency={currency} />}
        </div>
      </div>
    </SidebarLayout>
  );
}

// ============================================================================
// RETIREMENT CALCULATOR (KEPT FROM YOUR ORIGINAL)
// ============================================================================
function RetirementCalculator({ formatAmount, formatCompact, currency }: any) {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1500);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);

  const yearsToRetirement = retirementAge - currentAge;
  const monthlyReturn = expectedReturn / 100 / 12;
  const months = yearsToRetirement * 12;

  // Future value of current savings
  const futureValueCurrent = currentSavings * Math.pow(1 + monthlyReturn, months);

  // Future value of monthly contributions
  const futureValueContributions = monthlyContribution * 
    ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);

  const retirementSavings = futureValueCurrent + futureValueContributions;
  const totalContributed = currentSavings + (monthlyContribution * months);
  const investmentGains = retirementSavings - totalContributed;

  // Inflation-adjusted value
  const realValue = retirementSavings / Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Safe withdrawal amount (4% rule)
  const annualWithdrawal = retirementSavings * 0.04;
  const monthlyIncome = annualWithdrawal / 12;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-secondary-200">
        <h2 className="text-2xl font-bold text-surface-900 mb-6">Your Retirement Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Current Age
            </label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Retirement Age
            </label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Current Savings ({currency})
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Monthly Contribution ({currency})
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Expected Return (%)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              step="0.1"
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Total at Retirement</div>
          <div className="text-5xl font-bold mb-3">{formatCompact(retirementSavings)}</div>
          <div className="text-xs opacity-75 mb-4">{formatAmount(retirementSavings)}</div>
          <div className="border-t border-white/20 pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-75">Today's Value:</span>
              <span className="font-semibold">{formatCompact(realValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Years to Go:</span>
              <span className="font-semibold">{yearsToRetirement} years</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-secondary-200 space-y-6">
          <div>
            <div className="text-sm text-surface-900-500 mb-2">Monthly Retirement Income (4% rule)</div>
            <div className="text-3xl lg:text-4xl font-bold text-surface-900">{formatAmount(monthlyIncome)}</div>
            <div className="text-sm text-surface-900-400 mt-1">{formatAmount(annualWithdrawal)}/year</div>
          </div>
          
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-surface-900-500">Total Contributed</span>
              <span className="font-bold text-primary">{formatCompact(totalContributed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-surface-900-500">Investment Gains</span>
              <span className="font-bold text-green-600">+{formatCompact(investmentGains)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="font-bold text-surface-900">Total Savings</span>
              <span className="font-bold text-surface-900 text-xl">{formatCompact(retirementSavings)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-secondary-200">
        <h3 className="text-xl font-bold text-surface-900 mb-6">Your Journey to Retirement</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentAge}
            </div>
            <div className="flex-1">
              <div className="font-bold text-surface-900">Today</div>
              <div className="text-sm text-surface-900-500">Starting Savings: {formatAmount(currentSavings)}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-6">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-green-500"></div>
            <div className="text-sm text-surface-900-500">
              Contributing {formatAmount(monthlyContribution)}/month for {yearsToRetirement} years
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {retirementAge}
            </div>
            <div className="flex-1">
              <div className="font-bold text-surface-900">Retirement</div>
              <div className="text-sm text-surface-900-500">Total Savings: {formatAmount(retirementSavings)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEBT PAYOFF CALCULATOR (KEPT FROM YOUR ORIGINAL)
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
      <div className="bg-white rounded-2xl p-8 border border-secondary-200">
        <h2 className="text-2xl font-bold text-surface-900 mb-6">Debt Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">Total Debt ({currency})</label>
            <input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900-700 mb-2">Monthly Payment ({currency})</label>
            <input
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-lg"
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
              <div className="text-3xl lg:text-4xl font-bold mb-2">{years}y {remainingMonths}m</div>
              <div className="text-sm opacity-75">{payoff.months} months total</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-red-200 bg-red-50">
              <div className="text-sm text-red-900 mb-2">Total Amount Paid</div>
              <div className="text-3xl lg:text-4xl font-bold text-red-700 mb-2">{formatAmount(payoff.totalPaid)}</div>
              <div className="text-sm text-red-600">Principal + Interest</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 bg-orange-50">
              <div className="text-sm text-orange-900 mb-2">Total Interest</div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-700 mb-2">{formatAmount(payoff.totalInterest)}</div>
              <div className="text-sm text-orange-600">Extra cost of debt</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-secondary-200">
            <h3 className="text-xl font-bold text-surface-900 mb-6">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <span className="text-surface-900-700">Original Debt</span>
                <span className="font-bold text-surface-900">{formatAmount(debtAmount)}</span>
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
              <h4 className="font-bold text-surface-900 mb-3">💡 Pay More, Save More</h4>
              <div className="text-sm text-surface-900-700 space-y-2">
                <div>
                  If you increase payment to {formatAmount(monthlyPayment + 100)}:
                  <ul className="list-disc list-inside ml-4 mt-1 text-surface-900-500">
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
