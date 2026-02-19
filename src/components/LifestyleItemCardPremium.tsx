import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { UserLifestyleItem } from '../pages/LifestyleBasket';

interface LifestyleItemCardPremiumProps {
  item: UserLifestyleItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<UserLifestyleItem>) => void;
}

export default function LifestyleItemCardPremium({ item, onRemove, onUpdate }: LifestyleItemCardPremiumProps) {
  const { formatAmount, formatCompact } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [editedYear, setEditedYear] = useState(item.targetYear);
  const [editedCost, setEditedCost] = useState(item.currentCost);

  const currentYear = new Date().getFullYear();
  const yearsUntilTarget = item.targetYear - currentYear;
  const futureCost = item.currentCost * Math.pow(1 + item.inflationRate, yearsUntilTarget);
  const totalIncrease = futureCost - item.currentCost;
  const percentageIncrease = ((totalIncrease / item.currentCost) * 100);

  const handleSaveEdit = () => {
    onUpdate(item.id, {
      targetYear: editedYear,
      currentCost: editedCost
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedYear(item.targetYear);
    setEditedCost(item.currentCost);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl hover:border-primary transition-all duration-300 hover:-translate-y-2 animate-fadeInUp">
      {/* Premium Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-teal-500 to-primary rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          {/* Premium Emoji Badge */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform">
              {item.emoji}
            </div>
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-2xl border-3 border-primary/30 animate-ping opacity-0 group-hover:opacity-100"></div>
          </div>

          {/* Title & Category */}
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-secondary mb-2 font-crimson group-hover:text-primary transition-colors" style={{ letterSpacing: '-0.01em' }}>
              {item.name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold capitalize">
                {item.category.replace('-', ' ')}
              </span>
              {item.isRecurring && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                  ♻️ Recurring
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Premium Stats Section */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Current vs Future Cost */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Cost */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
              <div className="text-sm text-slate-600 font-semibold uppercase tracking-wider mb-2">Today</div>
              <div className="text-4xl font-bold text-secondary font-manrope mb-1">
                {formatCompact(item.currentCost)}
              </div>
              <div className="text-sm text-slate-500">{formatAmount(item.currentCost)}</div>
            </div>

            {/* Future Cost - PREMIUM GRADIENT */}
            <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 font-semibold uppercase tracking-wider mb-2">
                In {item.targetYear}
              </div>
              <div className="text-4xl font-bold font-manrope mb-1">
                {formatCompact(futureCost)}
              </div>
              <div className="text-sm opacity-90">{formatAmount(futureCost)}</div>
            </div>
          </div>

          {/* Inflation Impact */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-amber-900 font-semibold uppercase tracking-wider">Inflation Impact</div>
              <div className="text-3xl font-bold text-amber-600 font-manrope">
                {(item.inflationRate * 100).toFixed(1)}%/yr
              </div>
            </div>
            
            {/* Premium Progress Bar */}
            <div className="mb-4">
              <div className="h-4 bg-amber-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (item.inflationRate * 100) * 7)}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-amber-700 mb-1">Total Increase</div>
                <div className="text-xl font-bold text-amber-900">
                  +{formatCompact(totalIncrease)}
                </div>
              </div>
              <div>
                <div className="text-amber-700 mb-1">Percentage</div>
                <div className="text-xl font-bold text-amber-900">
                  +{percentageIncrease.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📅</span>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Timeline</div>
                  <div className="text-2xl font-bold text-secondary font-manrope">
                    {yearsUntilTarget} years
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">Target Year</div>
                <div className="text-2xl font-bold text-primary font-manrope">
                  {item.targetYear}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-primary transition-all"
          >
            ✏️ Edit Details
          </button>
        </div>
      ) : (
        /* PREMIUM EDIT MODE */
        <div className="space-y-6">
          {/* Edit Cost */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Current Cost
            </label>
            <input
              type="number"
              value={editedCost}
              onChange={(e) => setEditedCost(Number(e.target.value))}
              className="w-full px-6 py-4 border-3 border-primary rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none text-2xl font-bold font-manrope"
            />
          </div>

          {/* Edit Target Year */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Target Year
            </label>
            <input
              type="number"
              value={editedYear}
              onChange={(e) => setEditedYear(Number(e.target.value))}
              min={currentYear}
              max={currentYear + 50}
              className="w-full px-6 py-4 border-3 border-primary rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none text-2xl font-bold font-manrope"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-102"
            >
              ✓ Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-6 py-4 bg-white border-3 border-slate-300 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
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
