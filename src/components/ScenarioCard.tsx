import { useCurrency } from '../context/CurrencyContext';
import { Scenario } from '../pages/ScenarioBranching';

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  comparisonMode: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  baseline?: Scenario;
}

export default function ScenarioCard({
  scenario,
  isSelected,
  comparisonMode,
  onToggleSelect,
  onDelete,
  baseline
}: ScenarioCardProps) {
  const { formatAmount, formatCompact } = useCurrency();

  const deltaFromBaseline = baseline && !scenario.isBaseline
    ? {
        netWorth: scenario.projectedNetWorth - baseline.projectedNetWorth,
        yearsToFire: scenario.yearsToFire - baseline.yearsToFire,
      }
    : null;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
        scenario.isBaseline
          ? 'border-secondary-200 shadow-lg'
          : isSelected
          ? 'border-purple-500 shadow-2xl'
          : 'border-secondary-200 shadow-lg hover:shadow-xl hover:border-purple-300'
      }`}
      onClick={() => comparisonMode && onToggleSelect(scenario.id)}
      style={{ cursor: comparisonMode ? 'pointer' : 'default' }}
    >
      {/* Selection Indicator */}
      {comparisonMode && (
        <div
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-purple-600 border-purple-600'
              : 'bg-white border-secondary-200 group-hover:border-purple-400'
          }`}
        >
          {isSelected && (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{ backgroundColor: scenario.color + '20', color: scenario.color }}
          >
            {scenario.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-surface-900 mb-1 font-crimson">
              {scenario.name}
            </h3>
            {scenario.description && (
              <p className="text-surface-900-500 text-sm">{scenario.description}</p>
            )}
            {scenario.isBaseline && (
              <span className="inline-block px-3 py-1 bg-secondary-100 text-surface-900-700 rounded-lg text-xs font-semibold mt-2">
                Current Path
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {!scenario.isBaseline && !comparisonMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(scenario.id);
            }}
            className="p-2 text-surface-900-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* FIRE Date */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-secondary-200">
          <div className="text-sm text-surface-900-500 mb-1 font-semibold">FIRE Date</div>
          <div className="text-2xl font-bold text-surface-900 font-manrope">
            {scenario.fireDate
              ? new Date(scenario.fireDate).getFullYear()
              : 'N/A'}
          </div>
          {deltaFromBaseline && (
            <div
              className={`text-sm font-semibold mt-1 ${
                deltaFromBaseline.yearsToFire < 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {deltaFromBaseline.yearsToFire < 0 ? '−' : '+'}
              {Math.abs(deltaFromBaseline.yearsToFire)} years
            </div>
          )}
        </div>

        {/* Projected Net Worth */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="text-sm text-purple-900 mb-1 font-semibold">Projected Net Worth</div>
          <div className="text-2xl font-bold text-purple-700 font-manrope">
            {formatCompact(scenario.projectedNetWorth)}
          </div>
          {deltaFromBaseline && (
            <div
              className={`text-sm font-semibold mt-1 ${
                deltaFromBaseline.netWorth > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {deltaFromBaseline.netWorth > 0 ? '+' : ''}
              {formatCompact(deltaFromBaseline.netWorth)}
            </div>
          )}
        </div>

        {/* Savings Rate */}
        <div className="bg-white rounded-xl p-4 border border-secondary-200">
          <div className="text-sm text-surface-900-500 mb-1 font-semibold">Savings Rate</div>
          <div className="text-2xl font-bold text-surface-900 font-manrope">
            {(scenario.savingsRate * 100).toFixed(0)}%
          </div>
        </div>

        {/* Expected Return */}
        <div className="bg-white rounded-xl p-4 border border-secondary-200">
          <div className="text-sm text-surface-900-500 mb-1 font-semibold">Expected Return</div>
          <div className="text-2xl font-bold text-surface-900 font-manrope">
            {(scenario.expectedReturn * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-surface-900-700">Confidence Level</span>
          <span className="text-sm font-bold text-surface-900-900">{scenario.confidenceScore}%</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              scenario.confidenceScore >= 75
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : scenario.confidenceScore >= 50
                ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}
            style={{ width: `${scenario.confidenceScore}%` }}
          />
        </div>
      </div>

      {/* Life Events */}
      {scenario.lifeEvents && scenario.lifeEvents.length > 0 && (
        <div className="border-t border-secondary-200 pt-4">
          <div className="text-sm font-semibold text-surface-900-700 mb-3">Key Events</div>
          <div className="space-y-2">
            {scenario.lifeEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start gap-2 text-sm">
                <span className="text-purple-600">•</span>
                <div className="flex-1">
                  <span className="font-semibold text-surface-900-700">{event.name}</span>
                  <span className="text-surface-900-400 ml-2">
                    Year {event.year} • {formatCompact(Math.abs(event.amount))}
                  </span>
                </div>
              </div>
            ))}
            {scenario.lifeEvents.length > 3 && (
              <div className="text-xs text-surface-900-400">
                +{scenario.lifeEvents.length - 3} more events
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
