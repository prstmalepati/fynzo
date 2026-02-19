import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { UserLifestyleItem } from '../pages/LifestyleBasket';
import { lifestyleItems } from '../data/lifestyleInflation';

interface ItemPickerModalPremiumProps {
  onAdd: (item: Omit<UserLifestyleItem, 'id'>) => void;
  onClose: () => void;
  isAdding?: boolean;
}

export default function ItemPickerModalPremium({ onAdd, onClose, isAdding = false }: ItemPickerModalPremiumProps) {
  const { currency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customCost, setCustomCost] = useState<number>(0);
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 5);

  const categories = [
    { id: 'all', name: 'All Items', emoji: '✨', count: lifestyleItems.length },
    { id: 'supercars', name: 'Supercars', emoji: '🏎️', count: lifestyleItems.filter(i => i.category === 'supercars').length },
    { id: 'luxury-cars', name: 'Luxury Cars', emoji: '🚙', count: lifestyleItems.filter(i => i.category === 'luxury-cars').length },
    { id: 'education', name: 'Education', emoji: '🎓', count: lifestyleItems.filter(i => i.category === 'education').length },
    { id: 'real-estate', name: 'Real Estate', emoji: '🏠', count: lifestyleItems.filter(i => i.category === 'real-estate').length },
    { id: 'watches', name: 'Watches', emoji: '⌚', count: lifestyleItems.filter(i => i.category === 'watches').length },
    { id: 'travel', name: 'Travel', emoji: '✈️', count: lifestyleItems.filter(i => i.category === 'travel').length },
    { id: 'healthcare', name: 'Healthcare', emoji: '🏥', count: lifestyleItems.filter(i => i.category === 'healthcare').length },
    { id: 'services', name: 'Services', emoji: '👔', count: lifestyleItems.filter(i => i.category === 'services').length },
    { id: 'lifestyle', name: 'Lifestyle', emoji: '🍷', count: lifestyleItems.filter(i => i.category === 'lifestyle').length },
    { id: 'culture', name: 'Culture', emoji: '🎨', count: lifestyleItems.filter(i => i.category === 'culture').length },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? lifestyleItems 
    : lifestyleItems.filter(item => item.category === selectedCategory);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setCustomCost(item.typicalCost);
  };

  const handleAdd = () => {
    if (!selectedItem) return;

    onAdd({
      templateId: selectedItem.id,
      name: selectedItem.name,
      category: selectedItem.category,
      currentCost: customCost,
      inflationRate: selectedItem.inflationRate,
      targetYear: targetYear,
      emoji: selectedItem.emoji,
      isRecurring: selectedItem.isRecurring
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* PREMIUM HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-primary via-teal-600 to-primary p-8 text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl animate-float">🛒</div>
              <div>
                <h2 className="text-4xl font-bold font-crimson mb-2" style={{ letterSpacing: '-0.01em' }}>
                  Choose Your Lifestyle Items
                </h2>
                <p className="text-teal-100 text-lg">
                  Track what YOU actually want to buy
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-160px)]">
          {/* PREMIUM CATEGORY SIDEBAR */}
          <div className="w-80 bg-gradient-to-br from-slate-50 to-white border-r-2 border-slate-200 p-6 overflow-y-auto">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Categories</div>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all text-left ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-xl scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.emoji}</span>
                    <span className="font-semibold text-lg">{cat.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    selectedCategory === cat.id ? 'text-white' : 'text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PREMIUM ITEMS GRID */}
          <div className="flex-1 overflow-y-auto p-8">
            {!selectedItem ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="group text-left bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors font-crimson">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-semibold">
                            {(item.inflationRate * 100).toFixed(1)}%/yr
                          </span>
                          {item.isRecurring && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                              ♻️ Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-slate-600">Typical:</span>
                      <span className="text-2xl font-bold text-primary font-manrope">
                        {currency}{item.typicalCost.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* PREMIUM CONFIGURATION PANEL */
              <div className="max-w-3xl mx-auto animate-fadeInUp">
                {/* Selected Item Preview */}
                <div className="bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-8 text-white mb-8 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-5xl">
                      {selectedItem.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold mb-3 font-crimson" style={{ letterSpacing: '-0.01em' }}>
                        {selectedItem.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                          {(selectedItem.inflationRate * 100).toFixed(1)}% annual inflation
                        </span>
                        {selectedItem.isRecurring && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                            ♻️ Recurring Cost
                          </span>
                        )}
                      </div>
                      <p className="text-teal-100 text-lg">{selectedItem.description}</p>
                    </div>
                  </div>
                </div>

                {/* Configuration Form */}
                <div className="space-y-8">
                  {/* Cost Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      Current Cost ({currency})
                    </label>
                    <input
                      type="number"
                      value={customCost}
                      onChange={(e) => setCustomCost(Number(e.target.value))}
                      className="w-full px-8 py-5 border-3 border-primary rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none text-3xl font-bold font-manrope shadow-lg"
                      placeholder="Enter amount"
                    />
                    <p className="mt-3 text-sm text-slate-600">
                      Typical: {currency}{selectedItem.typicalCost.toLocaleString()}
                    </p>
                  </div>

                  {/* Target Year Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      When do you want this?
                    </label>
                    <input
                      type="number"
                      value={targetYear}
                      onChange={(e) => setTargetYear(Number(e.target.value))}
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 50}
                      className="w-full px-8 py-5 border-3 border-primary rounded-2xl focus:ring-4 focus:ring-primary/20 outline-none text-3xl font-bold font-manrope shadow-lg"
                    />
                  </div>

                  {/* Preview Calculation */}
                  {customCost > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-3 border-amber-300">
                      <div className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4">Future Cost Preview</div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <div className="text-sm text-amber-700 mb-2">Today</div>
                          <div className="text-2xl font-bold text-amber-900 font-manrope">
                            {currency}{customCost.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-amber-700 mb-2">In {targetYear}</div>
                          <div className="text-2xl font-bold text-amber-900 font-manrope">
                            {currency}{Math.round(customCost * Math.pow(1 + selectedItem.inflationRate, targetYear - new Date().getFullYear())).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-amber-700 mb-2">Increase</div>
                          <div className="text-2xl font-bold text-amber-900 font-manrope">
                            +{Math.round(((Math.pow(1 + selectedItem.inflationRate, targetYear - new Date().getFullYear()) - 1) * 100))}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAdd}
                      disabled={customCost <= 0 || isAdding}
                      className="flex-1 px-8 py-6 bg-gradient-to-r from-primary to-teal-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-primary/50 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </span>
                      ) : (
                        '✓ Add to Basket'
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-8 py-6 bg-white border-3 border-slate-300 text-slate-700 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Styles */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out;
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
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
    </div>
  );
}
