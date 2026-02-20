import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface HealthScoreData {
  totalScore: number;
  breakdown: {
    savingsRate: { score: number; value: number };
    emergencyFund: { score: number; months: number };
    diversification: { score: number; assetClasses: number };
    debtRatio: { score: number; percentage: number };
    goalProgress: { score: number; percentage: number };
    lifestyleInflation: { score: number; rate: number };
  };
  percentile: number;
  industryMedian: number;
  lastCalculated: Date;
}

export default function FinancialHealthScore() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      calculateHealthScore();
    }
  }, [user]);

  const calculateHealthScore = async () => {
    try {
      // Fetch user's financial data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Calculate each component
      const savingsRateScore = calculateSavingsRateScore(userData?.savingsRate || 0);
      const emergencyFundScore = calculateEmergencyFundScore(userData?.emergencyFundMonths || 0);
      const diversificationScore = calculateDiversificationScore(userData?.assetClasses || 0);
      const debtRatioScore = calculateDebtRatioScore(userData?.debtRatio || 0);
      const goalProgressScore = calculateGoalProgressScore(userData?.goalProgress || 0);
      const lifestyleInflationScore = calculateLifestyleInflationScore(userData?.lifestyleInflation || 0.02);

      const totalScore = Math.round(
        savingsRateScore.score +
        emergencyFundScore.score +
        diversificationScore.score +
        debtRatioScore.score +
        goalProgressScore.score +
        lifestyleInflationScore.score
      );

      // Calculate percentile (mock - would be based on actual user base)
      const percentile = Math.min(99, Math.max(1, Math.round((totalScore / 100) * 95)));

      setHealthScore({
        totalScore,
        breakdown: {
          savingsRate: savingsRateScore,
          emergencyFund: emergencyFundScore,
          diversification: diversificationScore,
          debtRatio: debtRatioScore,
          goalProgress: goalProgressScore,
          lifestyleInflation: lifestyleInflationScore
        },
        percentile,
        industryMedian: 65,
        lastCalculated: new Date()
      });

      setLoading(false);
    } catch (error) {
      console.error('Error calculating health score:', error);
      setLoading(false);
    }
  };

  const calculateSavingsRateScore = (rate: number): { score: number; value: number } => {
    let score = 0;
    if (rate >= 0.30) score = 25;
    else if (rate >= 0.20) score = 20;
    else if (rate >= 0.10) score = 10;
    else score = Math.round(rate * 100);
    
    return { score, value: rate };
  };

  const calculateEmergencyFundScore = (months: number): { score: number; months: number } => {
    let score = 0;
    if (months >= 12) score = 20;
    else if (months >= 6) score = 15;
    else if (months >= 3) score = 10;
    else score = Math.round((months / 12) * 20);
    
    return { score, months };
  };

  const calculateDiversificationScore = (assetClasses: number): { score: number; assetClasses: number } => {
    let score = 0;
    if (assetClasses >= 5) score = 15;
    else if (assetClasses >= 3) score = 10;
    else if (assetClasses >= 1) score = 5;
    
    return { score, assetClasses };
  };

  const calculateDebtRatioScore = (ratio: number): { score: number; percentage: number } => {
    let score = 0;
    if (ratio <= 0.10) score = 15;
    else if (ratio <= 0.30) score = 10;
    else if (ratio <= 0.50) score = 5;
    
    return { score, percentage: ratio };
  };

  const calculateGoalProgressScore = (progress: number): { score: number; percentage: number } => {
    let score = 0;
    if (progress >= 0.75) score = 15;
    else if (progress >= 0.50) score = 10;
    else if (progress >= 0.25) score = 5;
    
    return { score, percentage: progress };
  };

  const calculateLifestyleInflationScore = (rate: number): { score: number; rate: number } => {
    let score = 0;
    if (rate <= 0.05) score = 10;
    else if (rate <= 0.10) score = 5;
    
    return { score, rate };
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-300' };
    if (score >= 40) return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-300' };
    return { bg: 'from-red-500 to-rose-600', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-300' };
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 50) return 'Adequate';
    if (score >= 40) return 'Needs Attention';
    return 'Critical';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
        <div className="animate-pulse flex items-center justify-center h-64">
          <div className="text-slate-400">Calculating your financial health...</div>
        </div>
      </div>
    );
  }

  if (!healthScore) return null;

  const colors = getScoreColor(healthScore.totalScore);

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2 font-crimson">Financial Health Assessment</h2>
        <p className="text-slate-600">Comprehensive analysis of your financial position</p>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center gap-8 mb-8">
        {/* Circular Gauge */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="16"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="16"
              strokeDasharray={`${(healthScore.totalScore / 100) * 552.92} 552.92`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={healthScore.totalScore >= 70 ? 'text-green-500' : healthScore.totalScore >= 40 ? 'text-amber-500' : 'text-red-500'} stopColor="currentColor" />
                <stop offset="100%" className={healthScore.totalScore >= 70 ? 'text-emerald-600' : healthScore.totalScore >= 40 ? 'text-orange-600' : 'text-rose-600'} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-secondary font-manrope">{healthScore.totalScore}</div>
            <div className="text-slate-500 text-sm">/100</div>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex-1">
          <div className={`inline-block px-4 py-2 rounded-lg ${colors.light} ${colors.border} border-2 mb-4`}>
            <span className={`font-bold ${colors.text}`}>{getStatusText(healthScore.totalScore)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Your Position:</span>
              <span className="font-bold text-secondary">{healthScore.percentile}th percentile</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Industry Median:</span>
              <span className="font-semibold text-slate-700">{healthScore.industryMedian}/100</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Status:</span>
              <span className={`font-semibold ${healthScore.totalScore >= healthScore.industryMedian ? 'text-green-600' : 'text-amber-600'}`}>
                {healthScore.totalScore >= healthScore.industryMedian ? 'Above median' : 'Below median'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-xl font-bold text-secondary mb-4 font-crimson">Component Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(healthScore.breakdown).map(([key, data]) => {
            const maxScore = key === 'savingsRate' ? 25 : key === 'emergencyFund' ? 20 : 15;
            const percentage = (data.score / maxScore) * 100;
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-bold text-secondary">{data.score}/{maxScore}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 border-t border-slate-200 pt-6">
        <h3 className="text-xl font-bold text-secondary mb-3 font-crimson">Priority Actions</h3>
        <div className="space-y-2">
          {healthScore.breakdown.emergencyFund.score < 15 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-600 mt-0.5">→</span>
              <span className="text-slate-700">Build emergency fund to 6 months of expenses</span>
            </div>
          )}
          {healthScore.breakdown.savingsRate.score < 20 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-600 mt-0.5">→</span>
              <span className="text-slate-700">Increase savings rate to 20% or higher</span>
            </div>
          )}
          {healthScore.breakdown.diversification.score < 10 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-600 mt-0.5">→</span>
              <span className="text-slate-700">Diversify across additional asset classes</span>
            </div>
          )}
          {healthScore.breakdown.debtRatio.score < 10 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-600 mt-0.5">→</span>
              <span className="text-slate-700">Reduce debt-to-income ratio below 30%</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600;700&family=Manrope:wght@700;800&display=swap');
        .font-crimson { font-family: 'Crimson Pro', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
    </div>
  );
}
