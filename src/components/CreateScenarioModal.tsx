import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Scenario, ScenarioLifeEvent } from '../pages/ScenarioBranching';

interface CreateScenarioModalProps {
  onClose: () => void;
  onCreate: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void;
  baseline?: Scenario;
}

export default function CreateScenarioModal({ onClose, onCreate, baseline }: CreateScenarioModalProps) {
  const { currency } = useCurrency();
  const currentYear = new Date().getFullYear();

  // Initialize with baseline or defaults
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🌿');
  const [color, setColor] = useState('#8B5CF6');

  const [currentAge, setCurrentAge] = useState(baseline?.currentAge || 30);
  const [retirementAge, setRetirementAge] = useState(baseline?.retirementAge || 65);
  const [currentNetWorth, setCurrentNetWorth] = useState(baseline?.currentNetWorth || 100000);
  const [monthlyIncome, setMonthlyIncome] = useState(baseline?.monthlyIncome || 5000);
  const [monthlySavings, setMonthlySavings] = useState(baseline?.monthlySavings || 1000);
  const [expectedReturn, setExpectedReturn] = useState(baseline?.expectedReturn || 0.07);
  const [inflationRate, setInflationRate] = useState(baseline?.inflationRate || 0.08);

  const [lifeEvents, setLifeEvents] = useState<Omit<ScenarioLifeEvent, 'id'>[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  // Event form state
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<ScenarioLifeEvent['type']>('income-change');
  const [eventYear, setEventYear] = useState(currentYear + 1);
  const [eventAmount, setEventAmount] = useState(0);
  const [eventRecurring, setEventRecurring] = useState(false);

  const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;

  const calculateProjections = () => {
    const yearsToRetirement = retirementAge - currentAge;
    let projectedNetWorth = currentNetWorth;
    
    // Simple projection with compound interest
    for (let year = 0; year < yearsToRetirement; year++) {
      projectedNetWorth = projectedNetWorth * (1 + expectedReturn) + (monthlySavings * 12);
    }

    // Apply life events
    lifeEvents.forEach(event => {
      const yearIndex = event.year - currentYear;
      if (yearIndex >= 0 && yearIndex < yearsToRetirement) {
        if (event.type === 'one-time-expense') {
          projectedNetWorth -= event.amount;
        } else if (event.type === 'one-time-income') {
          projectedNetWorth += event.amount;
        }
      }
    });

    const fireNumber = (monthlyIncome * 12) * 25; // 4% rule
    const yearsToFire = projectedNetWorth >= fireNumber ? 0 : Math.ceil((fireNumber - currentNetWorth) / (monthlySavings * 12));
    const fireDate = new Date();
    fireDate.setFullYear(currentYear + yearsToFire);

    // Confidence score based on multiple factors
    let confidenceScore = 70;
    if (savingsRate >= 0.30) confidenceScore += 15;
    else if (savingsRate >= 0.20) confidenceScore += 10;
    if (expectedReturn >= 0.07 && expectedReturn <= 0.09) confidenceScore += 10;
    if (lifeEvents.length <= 3) confidenceScore += 5;

    return {
      projectedNetWorth,
      fireDate: yearsToFire <= 50 ? fireDate : null,
      yearsToFire,
      confidenceScore: Math.min(95, Math.max(30, confidenceScore))
    };
  };

  const handleAddEvent = () => {
    if (!eventName) return;

    const newEvent = {
      name: eventName,
      type: eventType,
      year: eventYear,
      amount: eventAmount,
      recurring: eventRecurring
    };

    setLifeEvents([...lifeEvents, newEvent]);
    
    // Reset form
    setEventName('');
    setEventAmount(0);
    setEventYear(currentYear + 1);
    setEventRecurring(false);
    setShowEventForm(false);
  };

  const handleRemoveEvent = (index: number) => {
    setLifeEvents(lifeEvents.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!name) {
      console.log('Please enter a scenario name');
      return;
    }

    const projections = calculateProjections();

    const scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      description,
      emoji,
      color,
      isBaseline: false,
      currentAge,
      retirementAge,
      currentNetWorth,
      monthlyIncome,
      monthlySavings,
      savingsRate,
      expectedReturn,
      inflationRate,
      lifeEvents: lifeEvents.map((event, i) => ({ ...event, id: `event-${i}` })),
      ...projections
    };

    onCreate(scenario);
  };

  const emojiOptions = ['🌿', '💼', '🏠', '🚀', '🌍', '💡', '⚡', '🎯', '🌟', '🔮'];
  const colorOptions = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#14B8A6', '#F97316'];

  const eventTypes: { value: ScenarioLifeEvent['type']; label: string }[] = [
    { value: 'income-change', label: 'Income Change' },
    { value: 'expense-change', label: 'Expense Change' },
    { value: 'one-time-expense', label: 'One-Time Expense' },
    { value: 'one-time-income', label: 'One-Time Income' },
    { value: 'lifestyle-change', label: 'Lifestyle Change' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-8 text-white z-10 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-crimson mb-2">Create New Scenario</h2>
              <p className="text-purple-200">Model a different life path</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-2xl transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="text-2xl font-bold text-secondary mb-4 font-crimson">Basic Information</h3>
            
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary-700 mb-2">Scenario Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Job Change to Berlin"
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary-700 mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this scenario"
                rows={2}
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Emoji & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                        emoji === e ? 'border-purple-600 bg-purple-50' : 'border-secondary-200 hover:border-purple-400'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${
                        color === c ? 'border-slate-900 scale-110' : 'border-secondary-200'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Parameters */}
          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="text-2xl font-bold text-secondary mb-4 font-crimson">Financial Parameters</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Current Net Worth ({currency})
                </label>
                <input
                  type="number"
                  value={currentNetWorth}
                  onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Monthly Income ({currency})
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Monthly Savings ({currency})
                </label>
                <input
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
                <p className="text-sm text-secondary-500 mt-1">Savings Rate: {(savingsRate * 100).toFixed(0)}%</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Expected Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn * 100}
                  onChange={(e) => setExpectedReturn(Number(e.target.value) / 100)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">Inflation Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate * 100}
                  onChange={(e) => setInflationRate(Number(e.target.value) / 100)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Life Events */}
          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-secondary font-crimson">Life Events</h3>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
              >
                + Add Event
              </button>
            </div>

            {/* Event Form */}
            {showEventForm && (
              <div className="bg-white rounded-xl p-4 border-2 border-purple-300 mb-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Event Name</label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g., Relocation to Berlin"
                      className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as ScenarioLifeEvent['type'])}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={eventYear}
                      onChange={(e) => setEventYear(Number(e.target.value))}
                      min={currentYear}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Amount ({currency})</label>
                    <input
                      type="number"
                      value={eventAmount}
                      onChange={(e) => setEventAmount(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eventRecurring}
                        onChange={(e) => setEventRecurring(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm font-semibold text-secondary-700">Recurring annually</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddEvent}
                    className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="px-6 py-2 bg-slate-200 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Events List */}
            {lifeEvents.length > 0 ? (
              <div className="space-y-2">
                {lifeEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-xl p-4 border border-secondary-200">
                    <div className="flex-1">
                      <div className="font-semibold text-secondary">{event.name}</div>
                      <div className="text-sm text-secondary-500">
                        Year {event.year} • {currency}{event.amount.toLocaleString()} • {eventTypes.find(t => t.value === event.type)?.label}
                        {event.recurring && ' • Recurring'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(index)}
                      className="p-2 text-secondary-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-400 text-center py-6">No life events added yet</p>
            )}
          </div>

          {/* Projection Preview */}
          {name && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-secondary mb-4 font-crimson">Projection Preview</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-purple-900 mb-1">Projected Net Worth</div>
                  <div className="text-3xl font-bold text-purple-700 font-manrope">
                    {currency}{Math.round(calculateProjections().projectedNetWorth).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-900 mb-1">Years to FIRE</div>
                  <div className="text-3xl font-bold text-purple-700 font-manrope">
                    {calculateProjections().yearsToFire}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-900 mb-1">Confidence Level</div>
                  <div className="text-3xl font-bold text-purple-700 font-manrope">
                    {calculateProjections().confidenceScore}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleCreate}
              disabled={!name}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Scenario
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-white border border-secondary-200 text-secondary-700 rounded-2xl font-bold text-lg hover:bg-secondary-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
