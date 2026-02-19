import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { UserLifestyleItem } from '../pages/LifestyleBasket';
import { calculateFutureCost, calculateMonthlySavings, getCategoryInfo } from '../data/lifestyleInflation';

interface LifestyleItemCardProps {
  item: UserLifestyleItem;
  onRemove: () => void;
  onUpdate: (updates: Partial<UserLifestyleItem>) => void;
}

export default function LifestyleItemCard({ item, onRemove, onUpdate }: LifestyleItemCardProps) {
  const { formatAmount } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCost, setEditedCost] = useState(item.currentCost);
  const [editedYear, setEditedYear] = useState(item.targetYear);

  const currentYear = new Date().getFullYear();
  const yearsUntilTarget = item.targetYear - currentYear;
  const futureCost = calculateFutureCost(item.currentCost, item.inflationRate, yearsUntilTarget);
  const costIncrease = futureCost - item.currentCost;
  const monthlySavings = calculateMonthlySavings(item.currentCost, futureCost, yearsUntilTarget);
  const categoryInfo = getCategoryInfo(item.category);

  const handleSave = () => {
    onUpdate({
      currentCost: editedCost,
      targetYear: editedYear
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCost(item.currentCost);
    setEditedYear(item.targetYear);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{item.emoji}</span>
            <h3 className="text-xl font-bold text-secondary">{item.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {categoryInfo.name}
            </span>
            {item.isRecurring && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                📅 Recurring
              </span>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Current Cost
            </label>
            <input
              type="number"
              value={editedCost}
              onChange={(e) => setEditedCost(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Target Year
            </label>
            <input
              type="number"
              value={editedYear}
              onChange={(e) => setEditedYear(Number(e.target.value))}
              min={currentYear}
              max={currentYear + 50}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-all font-semibold"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <>
          {/* Cost Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-slate-600 mb-1">Cost Today</div>
              <div className="text-2xl font-bold text-secondary">
                {formatAmount(item.currentCost)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">
                Cost in {item.targetYear}
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatAmount(futureCost)}
              </div>
            </div>
          </div>

          {/* Inflation Stats */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-900">
                Inflation Rate
              </span>
              <span className="text-lg font-bold text-amber-700">
                {(item.inflationRate * 100).toFixed(1)}%/yr
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-800">
              <span>vs. CPI (2.0%)</span>
              <span className="font-semibold">
                +{((item.inflationRate - 0.02) * 100).toFixed(1)}% faster
              </span>
            </div>
          </div>

          {/* Savings Required */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
            <div className="text-sm text-blue-900 mb-2">
              <strong>To afford this in {yearsUntilTarget} years:</strong>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-blue-700 mb-1">Total increase</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatAmount(costIncrease)}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">Save per month</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatAmount(monthlySavings)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {yearsUntilTarget > 0 && (
            <div className="mt-4 text-xs text-slate-600 text-center">
              {yearsUntilTarget} {yearsUntilTarget === 1 ? 'year' : 'years'} until target • 
              Appreciation: {((futureCost / item.currentCost - 1) * 100).toFixed(0)}%
            </div>
          )}
        </>
      )}
    </div>
  );
}
