import { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';

interface Investment {
  id: string;
  type: 'Stocks' | 'ETF' | 'Crypto' | 'Real Estate' | 'Gold' | 'Other';
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  notes?: string;
}

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      type: 'Stocks',
      name: 'Apple Inc. (AAPL)',
      quantity: 50,
      purchasePrice: 150,
      currentPrice: 185,
      purchaseDate: '2023-06-15',
      notes: 'Long-term hold'
    },
    {
      id: '2',
      type: 'ETF',
      name: 'Vanguard S&P 500 ETF (VOO)',
      quantity: 100,
      purchasePrice: 380,
      currentPrice: 425,
      purchaseDate: '2023-01-10'
    },
    {
      id: '3',
      type: 'Crypto',
      name: 'Bitcoin (BTC)',
      quantity: 0.5,
      purchasePrice: 45000,
      currentPrice: 52000,
      purchaseDate: '2023-09-20'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [newInvestment, setNewInvestment] = useState<Partial<Investment>>({
    type: 'Stocks',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const investmentTypes = ['Stocks', 'ETF', 'Crypto', 'Real Estate', 'Gold', 'Other'];

  const typeIcons = {
    'Stocks': '📈',
    'ETF': '📊',
    'Crypto': '₿',
    'Real Estate': '🏠',
    'Gold': '🥇',
    'Other': '💼'
  };

  const typeColors = {
    'Stocks': 'from-blue-500 to-blue-700',
    'ETF': 'from-emerald-500 to-emerald-700',
    'Crypto': 'from-amber-500 to-amber-700',
    'Real Estate': 'from-purple-500 to-purple-700',
    'Gold': 'from-yellow-500 to-yellow-700',
    'Other': 'from-slate-500 to-slate-700'
  };

  const handleAddInvestment = () => {
    if (!newInvestment.name || !newInvestment.quantity || !newInvestment.purchasePrice || !newInvestment.currentPrice) {
      alert('Please fill in all required fields');
      return;
    }

    const investment: Investment = {
      id: Date.now().toString(),
      type: newInvestment.type as Investment['type'],
      name: newInvestment.name,
      quantity: newInvestment.quantity,
      purchasePrice: newInvestment.purchasePrice,
      currentPrice: newInvestment.currentPrice,
      purchaseDate: newInvestment.purchaseDate || new Date().toISOString().split('T')[0],
      notes: newInvestment.notes
    };

    setInvestments([...investments, investment]);
    setShowAddModal(false);
    setNewInvestment({
      type: 'Stocks',
      quantity: 1,
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteInvestment = (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      setInvestments(investments.filter(inv => inv.id !== id));
    }
  };

  const filteredInvestments = filterType === 'All' 
    ? investments 
    : investments.filter(inv => inv.type === filterType);

  const calculateValue = (inv: Investment) => inv.quantity * inv.currentPrice;
  const calculateGainLoss = (inv: Investment) => {
    const currentValue = calculateValue(inv);
    const purchaseValue = inv.quantity * inv.purchasePrice;
    return currentValue - purchaseValue;
  };
  const calculateGainLossPercent = (inv: Investment) => {
    const gainLoss = calculateGainLoss(inv);
    const purchaseValue = inv.quantity * inv.purchasePrice;
    return (gainLoss / purchaseValue) * 100;
  };

  const totalValue = investments.reduce((sum, inv) => sum + calculateValue(inv), 0);
  const totalGainLoss = investments.reduce((sum, inv) => sum + calculateGainLoss(inv), 0);
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);

  const assetBreakdown = investmentTypes.map(type => ({
    type,
    value: investments
      .filter(inv => inv.type === type)
      .reduce((sum, inv) => sum + calculateValue(inv), 0)
  })).filter(item => item.value > 0);

  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Investments
            </h1>
            <p className="text-slate-600">
              Track and manage your investment portfolio
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Investment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-teal-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 font-semibold mb-2">Total Portfolio Value</div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{(totalValue / 1000).toFixed(1)}K
            </div>
            <div className="text-sm opacity-90">
              {investments.length} investments
            </div>
          </div>

          <div className={`bg-gradient-to-br ${totalGainLoss >= 0 ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700'} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="text-sm opacity-90 font-semibold mb-2">Total Gain/Loss</div>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {totalGainLoss >= 0 ? '+' : ''}€{(totalGainLoss / 1000).toFixed(1)}K
            </div>
            <div className="text-sm opacity-90">
              {((totalGainLoss / totalInvested) * 100).toFixed(2)}% return
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
            <div className="text-sm text-slate-600 font-semibold mb-2">Total Invested</div>
            <div className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{(totalInvested / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-slate-600">
              Initial capital
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-lg mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterType === 'All' 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Assets
          </button>
          {investmentTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filterType === type 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{typeIcons[type as keyof typeof typeIcons]}</span>
              {type}
            </button>
          ))}
        </div>

        {/* Asset Breakdown */}
        {filterType === 'All' && assetBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Asset Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {assetBreakdown.map(item => (
                <div key={item.type} className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl mb-2">{typeIcons[item.type as keyof typeof typeIcons]}</div>
                  <div className="text-sm text-slate-600 mb-1">{item.type}</div>
                  <div className="text-lg font-bold text-secondary">€{(item.value / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-slate-500">{((item.value / totalValue) * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investments List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Asset</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Quantity</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Purchase Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Current Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Current Value</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Gain/Loss</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="text-6xl mb-4">📊</div>
                      <div className="text-lg font-semibold mb-2">No investments yet</div>
                      <div className="text-sm">Click "Add Investment" to get started</div>
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map(inv => {
                    const gainLoss = calculateGainLoss(inv);
                    const gainLossPercent = calculateGainLossPercent(inv);
                    const isPositive = gainLoss >= 0;

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-secondary">{inv.name}</div>
                          {inv.notes && <div className="text-xs text-slate-500">{inv.notes}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${typeColors[inv.type]} text-white`}>
                            {typeIcons[inv.type]} {inv.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">{inv.quantity}</td>
                        <td className="px-6 py-4 text-right font-medium">€{inv.purchasePrice.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-medium">€{inv.currentPrice.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-bold text-secondary">€{calculateValue(inv).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}€{gainLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                          <div className={`text-xs ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteInvestment(inv.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Add New Investment
            </h2>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Investment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {investmentTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setNewInvestment({ ...newInvestment, type: type as Investment['type'] })}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        newInvestment.type === type
                          ? `bg-gradient-to-r ${typeColors[type as keyof typeof typeColors]} text-white shadow-lg`
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{typeIcons[type as keyof typeof typeIcons]}</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={newInvestment.name || ''}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  placeholder="e.g., Apple Inc. (AAPL)"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              {/* Quantity and Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Quantity *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvestment.quantity || ''}
                    onChange={(e) => setNewInvestment({ ...newInvestment, quantity: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Purchase Date</label>
                  <input
                    type="date"
                    value={newInvestment.purchaseDate || ''}
                    onChange={(e) => setNewInvestment({ ...newInvestment, purchaseDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Purchase Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvestment.purchasePrice || ''}
                    onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: Number(e.target.value) })}
                    placeholder="150.00"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Current Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvestment.currentPrice || ''}
                    onChange={(e) => setNewInvestment({ ...newInvestment, currentPrice: Number(e.target.value) })}
                    placeholder="185.00"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Notes (Optional)</label>
                <textarea
                  value={newInvestment.notes || ''}
                  onChange={(e) => setNewInvestment({ ...newInvestment, notes: e.target.value })}
                  placeholder="Add any notes about this investment..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInvestment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
