import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface YearlyProjection {
  year: number;
  age: number;
  contributions: number;
  returns: number;
  balance: number;
  totalContributed: number;
  totalGains: number;
}

export default function ProjectionCalculator() {
  const { formatAmount, formatCompact } = useCurrency();
  
  // Inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [startingAmount, setStartingAmount] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [annualContribution, setAnnualContribution] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [inflationAdjusted, setInflationAdjusted] = useState(true);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [contributionGrowth, setContributionGrowth] = useState(3);

  const calculateProjection = (): YearlyProjection[] => {
    const projections: YearlyProjection[] = [];
    
    let balance = startingAmount;
    let totalContributed = startingAmount;
    let currentMonthly = monthlyContribution;
    let currentAnnual = annualContribution;
    
    const realReturn = inflationAdjusted ? expectedReturn - inflationRate : expectedReturn;
    const monthlyReturn = Math.pow(1 + realReturn / 100, 1 / 12) - 1;
    
    for (let year = 0; year <= years; year++) {
      const yearlyContributions = (currentMonthly * 12) + currentAnnual;
      
      if (year === 0) {
        projections.push({
          year: 0,
          age: currentAge,
          contributions: 0,
          returns: 0,
          balance: startingAmount,
          totalContributed: startingAmount,
          totalGains: 0
        });
      } else {
        let yearStartBalance = balance;
        
        // Add monthly contributions throughout the year
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + currentMonthly;
        }
        
        // Add annual contribution at year end
        balance += currentAnnual;
        
        totalContributed += yearlyContributions;
        const yearReturns = balance - yearStartBalance - yearlyContributions;
        const totalGains = balance - totalContributed;
        
        projections.push({
          year,
          age: currentAge + year,
          contributions: yearlyContributions,
          returns: yearReturns,
          balance,
          totalContributed,
          totalGains
        });
        
        // Increase contributions for next year
        currentMonthly *= (1 + contributionGrowth / 100);
        currentAnnual *= (1 + contributionGrowth / 100);
      }
    }
    
    return projections;
  };

  const projections = calculateProjection();
  const finalProjection = projections[projections.length - 1];
  const totalReturn = ((finalProjection.balance - finalProjection.totalContributed) / finalProjection.totalContributed) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
        <span className="text-4xl">📈</span>
        Investment Projection Calculator
      </h2>
      <p className="text-slate-600 mb-8">Project your portfolio growth over time</p>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Basic Inputs */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Current Age</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Starting Amount</label>
          <input
            type="number"
            value={startingAmount}
            onChange={(e) => setStartingAmount(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Contribution</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Contribution (bonus, etc.)</label>
          <input
            type="number"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Annual Return (%)</label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            step="0.1"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Time Horizon (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            max="50"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Contribution Growth (%/year)</label>
          <input
            type="number"
            value={contributionGrowth}
            onChange={(e) => setContributionGrowth(Number(e.target.value))}
            step="0.1"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Inflation Rate (%)</label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            step="0.1"
            disabled={!inflationAdjusted}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-slate-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inflationAdjusted}
              onChange={(e) => setInflationAdjusted(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-semibold text-slate-700">
              Adjust for inflation (show real purchasing power)
            </span>
          </label>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="text-sm font-semibold text-blue-700 mb-1">Final Balance</div>
            <div className="text-3xl font-bold text-blue-900">{formatCompact(finalProjection.balance)}</div>
            <div className="text-xs text-blue-600 mt-2">At age {finalProjection.age}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="text-sm font-semibold text-green-700 mb-1">Total Gains</div>
            <div className="text-3xl font-bold text-green-900">{formatCompact(finalProjection.totalGains)}</div>
            <div className="text-xs text-green-600 mt-2">{totalReturn.toFixed(1)}% return</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="text-sm font-semibold text-purple-700 mb-1">Total Contributed</div>
            <div className="text-3xl font-bold text-purple-900">{formatCompact(finalProjection.totalContributed)}</div>
            <div className="text-xs text-purple-600 mt-2">Your money</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Growth Timeline</h3>
          
          <div className="space-y-3">
            {projections.filter((_, i) => i % Math.ceil(projections.length / 10) === 0 || i === projections.length - 1).map((proj) => (
              <div key={proj.year} className="flex items-center gap-4">
                <div className="w-16 text-sm font-semibold text-slate-600">Year {proj.year}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-semibold">Age {proj.age}</div>
                    <div className="text-sm text-slate-600">•</div>
                    <div className="text-sm font-bold text-primary">{formatCompact(proj.balance)}</div>
                  </div>
                  <div className="h-8 bg-white rounded-lg overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(proj.totalContributed / finalProjection.balance) * 100}%` }}
                      title={`Contributions: ${formatAmount(proj.totalContributed)}`}
                    >
                      {proj.totalContributed > finalProjection.balance * 0.1 && formatCompact(proj.totalContributed)}
                    </div>
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(proj.totalGains / finalProjection.balance) * 100}%` }}
                      title={`Gains: ${formatAmount(proj.totalGains)}`}
                    >
                      {proj.totalGains > finalProjection.balance * 0.1 && formatCompact(proj.totalGains)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded"></div>
              <span>Contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
              <span>Investment Gains</span>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-slate-50 rounded-xl p-6 overflow-x-auto">
          <h3 className="text-xl font-bold text-secondary mb-4">Year-by-Year Breakdown</h3>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-2 font-semibold">Year</th>
                <th className="text-left py-3 px-2 font-semibold">Age</th>
                <th className="text-right py-3 px-2 font-semibold">Contributions</th>
                <th className="text-right py-3 px-2 font-semibold">Returns</th>
                <th className="text-right py-3 px-2 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {projections.slice(0, 11).map((proj) => (
                <tr key={proj.year} className="border-b border-slate-200 hover:bg-white transition-colors">
                  <td className="py-3 px-2 font-semibold">{proj.year}</td>
                  <td className="py-3 px-2 text-slate-600">{proj.age}</td>
                  <td className="py-3 px-2 text-right text-purple-600 font-semibold">
                    {proj.contributions > 0 ? formatAmount(proj.contributions) : '-'}
                  </td>
                  <td className="py-3 px-2 text-right text-green-600 font-semibold">
                    {proj.returns > 0 ? formatAmount(proj.returns) : '-'}
                  </td>
                  <td className="py-3 px-2 text-right text-primary font-bold">
                    {formatAmount(proj.balance)}
                  </td>
                </tr>
              ))}
              {projections.length > 11 && (
                <tr>
                  <td colSpan={5} className="py-3 px-2 text-center text-slate-500">
                    ... {projections.length - 11} more years ...
                  </td>
                </tr>
              )}
              {projections.length > 11 && (
                <tr className="border-t-2 border-slate-300 bg-white">
                  <td className="py-3 px-2 font-bold">{finalProjection.year}</td>
                  <td className="py-3 px-2 font-semibold text-slate-600">{finalProjection.age}</td>
                  <td className="py-3 px-2 text-right text-purple-700 font-bold">
                    {formatAmount(finalProjection.contributions)}
                  </td>
                  <td className="py-3 px-2 text-right text-green-700 font-bold">
                    {formatAmount(finalProjection.returns)}
                  </td>
                  <td className="py-3 px-2 text-right text-primary font-bold text-lg">
                    {formatAmount(finalProjection.balance)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">Contribution Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Contributed:</span>
                <span className="font-bold text-slate-900">{formatAmount(finalProjection.totalContributed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Starting Amount:</span>
                <span className="font-semibold">{formatAmount(startingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly × {years} years:</span>
                <span className="font-semibold">{formatAmount(monthlyContribution * 12 * years)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <h4 className="font-bold text-green-900 mb-4">Growth Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Total Investment Gains:</span>
                <span className="font-bold text-green-900">{formatAmount(finalProjection.totalGains)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Return:</span>
                <span className="font-semibold">{totalReturn.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Gain Multiplier:</span>
                <span className="font-semibold">{(finalProjection.balance / finalProjection.totalContributed).toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Notes */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• {inflationAdjusted ? 'Returns are adjusted for inflation - values shown in today\'s purchasing power' : 'Returns are nominal - actual purchasing power will be lower due to inflation'}</li>
            <li>• Contribution growth of {contributionGrowth}% per year accounts for salary increases</li>
            <li>• Assumes consistent returns - actual returns will vary year to year</li>
            <li>• Does not account for taxes on gains (use tax-advantaged accounts when possible)</li>
            <li>• Past performance doesn't guarantee future results</li>
          </ul>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        .font-crimson {
          font-family: 'Crimson Pro', serif;
        }
        
        .font-manrope {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>
    </div>
  );
}
