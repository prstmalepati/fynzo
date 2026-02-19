import { useCurrency } from '../context/CurrencyContext';
import { UserLifestyleItem } from '../pages/LifestyleBasket';

interface TruthScoreCardProps {
  items: UserLifestyleItem[];
  totalCurrentCost: number;
  totalFutureCost: number;
  weightedInflation: number;
}

export default function TruthScoreCard({ 
  items, 
  totalCurrentCost, 
  totalFutureCost, 
  weightedInflation 
}: TruthScoreCardProps) {
  const { formatAmount, formatCompact } = useCurrency();

  // Calculate what they'd expect with generic 2% inflation
  const currentYear = new Date().getFullYear();
  const avgYearsToTarget = items.reduce((sum, item) => 
    sum + (item.targetYear - currentYear), 0) / items.length;
  
  const genericInflation = 0.02;
  const expectedCost = totalCurrentCost * Math.pow(1 + genericInflation, avgYearsToTarget);
  
  // The "truth gap"
  const gap = totalFutureCost - expectedCost;
  const gapPercentage = (gap / totalCurrentCost) * 100;
  
  // Determine severity
  let severity: 'good' | 'warning' | 'critical';
  let message: string;
  let bgColor: string;
  let borderColor: string;
  let textColor: string;

  if (gapPercentage < 10) {
    severity = 'good';
    message = "Your lifestyle inflation is close to CPI. Your goals are realistic!";
    bgColor = 'bg-green-50';
    borderColor = 'border-green-300';
    textColor = 'text-green-900';
  } else if (gapPercentage < 25) {
    severity = 'warning';
    message = "Your lifestyle inflates faster than you think. Adjust your goals upward.";
    bgColor = 'bg-amber-50';
    borderColor = 'border-amber-300';
    textColor = 'text-amber-900';
  } else {
    severity = 'critical';
    message = "Major gap detected! Your lifestyle costs are rising much faster than savings.";
    bgColor = 'bg-red-50';
    borderColor = 'border-red-300';
    textColor = 'text-red-900';
  }

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-8 mb-8 shadow-lg`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-secondary mb-2">
            🎯 Truth Score
          </h2>
          <p className="text-slate-700">
            The real cost of your lifestyle vs what generic inflation suggests
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600 mb-1">Your Inflation</div>
          <div className="text-4xl font-bold text-primary">
            {(weightedInflation * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-600">vs CPI: 2.0%</div>
        </div>
      </div>

      {/* Main Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* What You Think */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤔</span>
            <h3 className="text-lg font-bold text-secondary">What You Think You Need</h3>
          </div>
          <div className="text-sm text-slate-600 mb-2">
            (Based on 2% CPI inflation)
          </div>
          <div className="text-4xl font-bold text-slate-700 mb-2">
            {formatCompact(expectedCost)}
          </div>
          <div className="text-xs text-slate-600">
            In ~{Math.round(avgYearsToTarget)} years
          </div>
        </div>

        {/* What You Actually Need */}
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-xl p-6 border-2 border-primary text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold">What You Actually Need</h3>
          </div>
          <div className="text-sm opacity-90 mb-2">
            (Based on YOUR lifestyle inflation)
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatCompact(totalFutureCost)}
          </div>
          <div className="text-xs opacity-80">
            In ~{Math.round(avgYearsToTarget)} years
          </div>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-secondary">The Reality Gap</h3>
          <span className={`text-2xl font-bold ${textColor}`}>
            +{gapPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="mb-4">
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, gapPercentage)}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-600 mb-1">You're Underestimating By:</div>
            <div className="text-2xl font-bold text-secondary">
              {formatAmount(gap)}
            </div>
          </div>
          <div>
            <div className="text-slate-600 mb-1">Extra Savings Needed Per Month:</div>
            <div className="text-2xl font-bold text-primary">
              {formatAmount(gap / (avgYearsToTarget * 12))}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className={`p-4 ${bgColor} border-2 ${borderColor} rounded-lg`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {severity === 'good' ? '✅' : severity === 'warning' ? '⚠️' : '🚨'}
          </span>
          <div className="flex-1">
            <div className={`font-bold ${textColor} mb-1`}>
              {severity === 'good' ? 'Looking Good!' : 
               severity === 'warning' ? 'Reality Check' : 
               'Critical Gap'}
            </div>
            <div className={`text-sm ${textColor}`}>
              {message}
            </div>
          </div>
        </div>
      </div>

      {/* Examples of Impact */}
      {gapPercentage > 15 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
          <div className="font-semibold text-secondary mb-2">💭 What This Means:</div>
          <div className="text-sm text-slate-700 space-y-1">
            <div>• If you thought you needed €2M to retire, you actually need €{((2000000 * (1 + gapPercentage/100)) / 1000000).toFixed(2)}M</div>
            <div>• Your "done number" is {gapPercentage.toFixed(0)}% higher than you calculated</div>
            <div>• You'll need to work {(avgYearsToTarget * (gapPercentage / 100)).toFixed(1)} more years at current savings rate</div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {severity !== 'good' && (
        <div className="mt-6 flex gap-4">
          <button className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-lg">
            Adjust My Projections
          </button>
          <button className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700">
            Optimize My Basket
          </button>
        </div>
      )}
    </div>
  );
}
