import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { firestore } from '../firebase/config';
import SidebarLayout from '../components/SidebarLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProjectionPage() {
  const { user } = useAuth();
  const { formatAmount, formatCompact, currency } = useCurrency();
  
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlySavings, setMonthlySavings] = useState(2000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(2);

  // Calculate projections
  const calculateProjection = () => {
    const data = [];
    let balance = currentSavings;
    const monthlyReturn = expectedReturn / 100 / 12;
    const monthlyInflation = inflationRate / 100 / 12;

    for (let year = 0; year <= years; year++) {
      // Calculate balance at end of year
      if (year > 0) {
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + monthlySavings;
        }
      }

      // Calculate inflation-adjusted value
      const inflationAdjusted = balance / Math.pow(1 + inflationRate / 100, year);

      data.push({
        year,
        nominal: Math.round(balance),
        real: Math.round(inflationAdjusted),
        name: `Year ${year}`
      });
    }

    return data;
  };

  const projectionData = calculateProjection();
  const finalValue = projectionData[projectionData.length - 1].nominal;
  const realValue = projectionData[projectionData.length - 1].real;
  const totalContributions = currentSavings + (monthlySavings * 12 * years);
  const totalGrowth = finalValue - totalContributions;

  // FIRE calculation
  const annualExpenses = monthlySavings * 6; // Assume expenses are half of savings
  const fireNumber = annualExpenses * 25; // 4% rule
  const yearsToFIRE = fireNumber > finalValue 
    ? Math.ceil((fireNumber - currentSavings) / (monthlySavings * 12))
    : years;

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Wealth Projection
          </h1>
          <p className="text-slate-600">
            Model your financial future with compound growth
          </p>
        </div>

        {/* Input Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Savings */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Current Savings ({currency})
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Monthly Savings */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Monthly Savings ({currency})
            </label>
            <input
              type="number"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Expected Return */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Annual Return (%)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step="0.5"
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Time Horizon */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Years to Project
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Math.min(50, Number(e.target.value)))}
              min="1"
              max="50"
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Final Value */}
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Final Value (Nominal)</div>
            <div className="text-4xl font-bold mb-2">
              {formatCompact(finalValue)}
            </div>
            <div className="text-sm opacity-75">
              {formatAmount(finalValue)}
            </div>
            <div className="mt-3 text-xs opacity-75">
              In {years} years
            </div>
          </div>

          {/* Real Value */}
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 bg-amber-50">
            <div className="text-sm text-amber-900 font-semibold mb-2">
              Real Value (Inflation-Adjusted)
            </div>
            <div className="text-4xl font-bold text-amber-700 mb-2">
              {formatCompact(realValue)}
            </div>
            <div className="text-sm text-amber-600">
              {formatAmount(realValue)}
            </div>
            <div className="mt-3 text-xs text-amber-700">
              Adjusted for {inflationRate}% inflation
            </div>
          </div>

          {/* Total Growth */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 bg-green-50">
            <div className="text-sm text-green-900 font-semibold mb-2">
              Investment Growth
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">
              {formatCompact(totalGrowth)}
            </div>
            <div className="text-sm text-green-600">
              {formatAmount(totalGrowth)}
            </div>
            <div className="mt-3 text-xs text-green-700">
              From {formatCompact(totalContributions)} contributed
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Projection Chart</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => formatCompact(value)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => formatAmount(value)}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="nominal" 
                  stroke="#14B8A6" 
                  strokeWidth={3}
                  name="Nominal Value"
                  dot={{ fill: '#14B8A6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="real" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Real Value (Inflation-Adjusted)"
                  dot={{ fill: '#F59E0B', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FIRE Target */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🔥</div>
            <div>
              <h2 className="text-2xl font-bold text-secondary">FIRE Target</h2>
              <p className="text-slate-600">Financial Independence, Retire Early</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-2">Your FIRE Number</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {formatCompact(fireNumber)}
              </div>
              <div className="text-xs text-slate-600">
                Based on 4% withdrawal rule
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-2">Projected Value</div>
              <div className="text-3xl font-bold text-primary mb-1">
                {formatCompact(finalValue)}
              </div>
              <div className="text-xs text-slate-600">
                In {years} years
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-2">
                {finalValue >= fireNumber ? 'You\'ll reach FIRE!' : 'Years to FIRE'}
              </div>
              <div className={`text-3xl font-bold mb-1 ${
                finalValue >= fireNumber ? 'text-green-600' : 'text-amber-600'
              }`}>
                {finalValue >= fireNumber ? `✓ ${years} years` : `≈ ${yearsToFIRE} years`}
              </div>
              <div className="text-xs text-slate-600">
                {finalValue >= fireNumber 
                  ? 'Based on current projection' 
                  : 'Keep saving to reach your goal'}
              </div>
            </div>
          </div>

          {finalValue < fireNumber && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-sm text-orange-900">
                <strong>💡 Tip:</strong> To reach FIRE in {years} years, increase monthly savings by{' '}
                <strong>{formatAmount((fireNumber - finalValue) / (years * 12))}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Inflation Adjustment */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-1">
                Inflation Adjustment
              </h3>
              <p className="text-sm text-slate-600">
                Account for purchasing power loss over time
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-900 mb-1">Current Rate</div>
              <div className="text-3xl font-bold text-blue-700">{inflationRate}%</div>
            </div>
          </div>
          
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between text-xs text-blue-700 mt-2">
            <span>0%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}
