import { useCurrency } from '../context/CurrencyContext';
import { UserLifestyleItem } from '../pages/LifestyleBasket';

interface TruthScoreCardPremiumProps {
  items: UserLifestyleItem[];
  totalCurrentCost: number;
  totalFutureCost: number;
  weightedInflation: number;
}

export default function TruthScoreCardPremium({ 
  items, 
  totalCurrentCost, 
  totalFutureCost, 
  weightedInflation 
}: TruthScoreCardPremiumProps) {
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
  let gradientFrom: string;
  let gradientTo: string;

  if (gapPercentage < 10) {
    severity = 'good';
    message = "Your lifestyle inflation is close to CPI. Your goals are realistic!";
    bgColor = 'bg-gradient-to-br from-green-50 to-emerald-50';
    borderColor = 'border-green-300';
    textColor = 'text-green-900';
    gradientFrom = 'from-green-500';
    gradientTo = 'to-emerald-600';
  } else if (gapPercentage < 25) {
    severity = 'warning';
    message = "Your lifestyle inflates faster than you think. Adjust your goals upward.";
    bgColor = 'bg-gradient-to-br from-amber-50 to-orange-50';
    borderColor = 'border-amber-400';
    textColor = 'text-amber-900';
    gradientFrom = 'from-amber-500';
    gradientTo = 'to-orange-600';
  } else {
    severity = 'critical';
    message = "Major gap detected! Your lifestyle costs are rising much faster than savings.";
    bgColor = 'bg-gradient-to-br from-red-50 to-rose-50';
    borderColor = 'border-red-400';
    textColor = 'text-red-900';
    gradientFrom = 'from-red-500';
    gradientTo = 'to-rose-600';
  }

  return (
    <div className={`${bgColor} border-3 ${borderColor} rounded-3xl p-10 shadow-2xl animate-fadeInUp`}>
      {/* PREMIUM HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-float">🎯</div>
          <div>
            <h2 className="text-4xl font-bold text-secondary mb-2 font-crimson" style={{ letterSpacing: '-0.01em' }}>
              Your Truth Score
            </h2>
            <p className="text-secondary-700 text-lg">
              The real cost of your lifestyle vs generic inflation
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-2">Your Inflation</div>
          <div className="text-6xl font-bold text-primary font-manrope mb-1">
            {(weightedInflation * 100).toFixed(1)}%
          </div>
          <div className="text-lg text-secondary-500">
            vs CPI: <span className="line-through text-secondary-300">2.0%</span>
          </div>
        </div>
      </div>

      {/* PREMIUM COMPARISON CARDS */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* What You Think (Subtle) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-secondary-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🤔</span>
            <h3 className="text-2xl font-bold text-secondary font-crimson">What You Think</h3>
          </div>
          <div className="text-sm text-secondary-500 mb-3 font-semibold uppercase tracking-wide">
            (Based on 2% CPI inflation)
          </div>
          <div className="text-5xl font-bold text-secondary-700 mb-3 font-manrope">
            {formatCompact(expectedCost)}
          </div>
          <div className="text-sm text-secondary-500">
            In ~{Math.round(avgYearsToTarget)} years
          </div>
        </div>

        {/* What You Actually Need (PREMIUM GRADIENT) */}
        <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-8 border-2 border-primary/50 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-102`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💡</span>
            <h3 className="text-2xl font-bold font-crimson">What You Actually Need</h3>
          </div>
          <div className="text-sm opacity-90 mb-3 font-semibold uppercase tracking-wide">
            (Based on YOUR lifestyle inflation)
          </div>
          <div className="text-5xl font-bold mb-3 font-manrope">
            {formatCompact(totalFutureCost)}
          </div>
          <div className="text-sm opacity-90">
            In ~{Math.round(avgYearsToTarget)} years
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </div>
      </div>

      {/* PREMIUM GAP ANALYSIS */}
      <div className="bg-white rounded-2xl p-8 border border-secondary-200 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-secondary font-crimson">The Reality Gap</h3>
          <div className="flex items-center gap-3">
            <span className={`text-5xl font-bold ${textColor} font-manrope`}>
              +{gapPercentage.toFixed(1)}%
            </span>
            <span className="text-3xl">
              {severity === 'good' ? '✅' : severity === 'warning' ? '⚠️' : '🚨'}
            </span>
          </div>
        </div>
        
        {/* Premium Progress Bar */}
        <div className="mb-6">
          <div className="h-6 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-1000 shadow-lg`}
              style={{ width: `${Math.min(100, gapPercentage)}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-secondary-200">
            <div className="text-sm text-secondary-500 mb-2 font-semibold uppercase tracking-wide">Underestimating By:</div>
            <div className="text-4xl font-bold text-secondary font-manrope">
              {formatAmount(gap)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-teal-50 rounded-xl p-6 border border-primary/30">
            <div className="text-sm text-primary mb-2 font-semibold uppercase tracking-wide">Extra Monthly Savings:</div>
            <div className="text-4xl font-bold text-primary font-manrope">
              {formatAmount(gap / (avgYearsToTarget * 12))}
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM MESSAGE CARD */}
      <div className={`${bgColor} border-3 ${borderColor} rounded-2xl p-8 shadow-lg`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">
            {severity === 'good' ? '✅' : severity === 'warning' ? '⚠️' : '🚨'}
          </span>
          <div className="flex-1">
            <div className={`font-bold text-2xl ${textColor} mb-3 font-crimson`}>
              {severity === 'good' ? 'Looking Good!' : 
               severity === 'warning' ? 'Reality Check' : 
               'Critical Gap'}
            </div>
            <div className={`text-lg ${textColor} leading-relaxed`}>
              {message}
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM IMPACT EXAMPLES */}
      {gapPercentage > 15 && (
        <div className="mt-8 bg-white rounded-2xl p-8 border border-secondary-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💭</span>
            <div className="font-bold text-2xl text-secondary font-crimson">What This Really Means:</div>
          </div>
          <div className="space-y-3 text-lg text-secondary-700">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-2xl">→</span>
              <span>If you thought you needed €2M to retire, you actually need <strong className="text-primary">€{((2000000 * (1 + gapPercentage/100)) / 1000000).toFixed(2)}M</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-2xl">→</span>
              <span>Your "done number" is <strong className="text-primary">{gapPercentage.toFixed(0)}% higher</strong> than you calculated</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-2xl">→</span>
              <span>You'll need to work <strong className="text-primary">{(avgYearsToTarget * (gapPercentage / 100)).toFixed(1)} more years</strong> at current savings rate</span>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM ACTION BUTTONS */}
      {severity !== 'good' && (
        <div className="mt-8 flex gap-4">
          <button className="flex-1 px-8 py-5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-primary/50 transition-all font-bold text-lg hover:scale-102">
            Adjust My Projections
          </button>
          <button className="flex-1 px-8 py-5 bg-white border-3 border-secondary-200 rounded-2xl hover:bg-secondary-50 hover:shadow-xl transition-all font-bold text-lg text-secondary-700 hover:scale-102">
            Optimize My Basket
          </button>
        </div>
      )}

      {/* Premium Styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
