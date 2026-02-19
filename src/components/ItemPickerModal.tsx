import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { 
  LIFESTYLE_TEMPLATES, 
  INFLATION_CATEGORIES,
  LifestyleItemTemplate 
} from '../data/lifestyleInflation';

interface ItemPickerModalProps {
  onSelect: (templateId: string, customCost?: number, targetYear?: number) => void;
  onClose: () => void;
  userCurrency: string;
}

export default function ItemPickerModal({ onSelect, onClose, userCurrency }: ItemPickerModalProps) {
  const { formatAmount, convert } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LifestyleItemTemplate | null>(null);
  const [customCost, setCustomCost] = useState<number>(0);
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 5);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.entries(INFLATION_CATEGORIES);
  
  // Filter templates by category and search
  const filteredTemplates = LIFESTYLE_TEMPLATES.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: LifestyleItemTemplate) => {
    setSelectedTemplate(template);
    setCustomCost(template.typicalCost);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.id, customCost, targetYear);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-secondary">Add Lifestyle Item</h2>
            <p className="text-slate-600">Choose from templates or create custom</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-3 h-full">
            {/* Left Sidebar - Categories */}
            <div className="lg:border-r border-slate-200 p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <h3 className="font-bold text-secondary mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === null
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold">All Items</div>
                  <div className="text-xs opacity-80">{LIFESTYLE_TEMPLATES.length} templates</div>
                </button>

                {categories.map(([key, category]) => {
                  const itemCount = LIFESTYLE_TEMPLATES.filter(t => t.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === key
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{category.name}</div>
                          <div className="text-xs opacity-80">{itemCount} items • {(category.avgInflationRate * 100).toFixed(1)}%/yr</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle - Template List */}
            <div className="p-6">
              <h3 className="font-bold text-secondary mb-3">
                {selectedCategory 
                  ? INFLATION_CATEGORIES[selectedCategory].name 
                  : 'All Templates'}
              </h3>
              
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No items found
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-primary bg-teal-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{template.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-secondary">{template.name}</div>
                          <div className="text-sm text-slate-600">{template.description}</div>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="text-slate-600">
                              Typical: {template.currency === userCurrency 
                                ? formatAmount(template.typicalCost)
                                : `~${formatAmount(template.typicalCost)}`}
                            </span>
                            <span className="text-amber-600 font-semibold">
                              {(template.inflationRate * 100).toFixed(1)}%/yr
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Customization */}
            <div className="lg:border-l border-slate-200 p-6 bg-slate-50">
              {selectedTemplate ? (
                <div>
                  <h3 className="font-bold text-secondary mb-3">Customize</h3>
                  
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-primary">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{selectedTemplate.emoji}</span>
                      <div>
                        <div className="font-bold text-secondary">{selectedTemplate.name}</div>
                        <div className="text-xs text-slate-600">{selectedTemplate.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Current Cost ({userCurrency})
                      </label>
                      <input
                        type="number"
                        value={customCost}
                        onChange={(e) => setCustomCost(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold text-lg"
                      />
                      <div className="text-xs text-slate-600 mt-1">
                        Typical: {formatAmount(selectedTemplate.typicalCost)} {selectedTemplate.currency}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Target Year
                      </label>
                      <input
                        type="number"
                        value={targetYear}
                        onChange={(e) => setTargetYear(Number(e.target.value))}
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 50}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold text-lg"
                      />
                      <div className="text-xs text-slate-600 mt-1">
                        {targetYear - new Date().getFullYear()} years from now
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="text-sm text-amber-900 mb-2">
                        <strong>Inflation Impact:</strong>
                      </div>
                      <div className="text-xs text-amber-800 space-y-1">
                        <div>Rate: {(selectedTemplate.inflationRate * 100).toFixed(1)}%/year</div>
                        <div>vs CPI: +{((selectedTemplate.inflationRate - 0.02) * 100).toFixed(1)}% faster</div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full px-6 py-4 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-lg shadow-lg"
                    >
                      Add to Basket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-4xl mb-3">👈</div>
                  <div className="text-sm">Select an item to customize</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
