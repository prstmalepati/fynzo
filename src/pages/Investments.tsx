import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';

interface Asset {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'real-estate' | 'crypto' | 'cash' | 'commodities';
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  currentPrice: number;
  currency: string;
  notes?: string;
  createdAt: Date;
}

export default function Investments() {
  const { user } = useAuth();
  const { formatAmount, formatCompact, currency } = useCurrency();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'stocks' as Asset['type'],
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    quantity: 1,
    currentPrice: 0,
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user]);

  const loadAssets = async () => {
    try {
      const assetsRef = collection(db, 'users', user.uid, 'assets');
      const q = query(assetsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const loadedAssets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data().purchaseDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Asset[];

      setAssets(loadedAssets);
      setLoading(false);
    } catch (error) {
      console.error('Error loading assets:', error);
      setLoading(false);
    }
  };

  const handleAddAsset = async () => {
    if (!newAsset.name || newAsset.purchasePrice <= 0 || newAsset.quantity <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    try {
      const assetsRef = collection(db, 'users', user.uid, 'assets');
      await addDoc(assetsRef, {
        name: newAsset.name,
        type: newAsset.type,
        purchaseDate: Timestamp.fromDate(new Date(newAsset.purchaseDate)),
        purchasePrice: newAsset.purchasePrice,
        quantity: newAsset.quantity,
        currentPrice: newAsset.currentPrice || newAsset.purchasePrice,
        currency: currency,
        notes: newAsset.notes,
        createdAt: Timestamp.now()
      });

      setNewAsset({
        name: '',
        type: 'stocks',
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasePrice: 0,
        quantity: 1,
        currentPrice: 0,
        notes: ''
      });
      setShowAddModal(false);
      loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Failed to add asset. Please try again.');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (confirm('Delete this asset? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'assets', assetId));
        loadAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Failed to delete asset');
      }
    }
  };

  const calculateAssetValue = (asset: Asset) => {
    return asset.currentPrice * asset.quantity;
  };

  const calculateGainLoss = (asset: Asset) => {
    const currentValue = calculateAssetValue(asset);
    const purchaseValue = asset.purchasePrice * asset.quantity;
    return currentValue - purchaseValue;
  };

  const calculateGainLossPercent = (asset: Asset) => {
    const purchaseValue = asset.purchasePrice * asset.quantity;
    if (purchaseValue === 0) return 0;
    return ((calculateGainLoss(asset) / purchaseValue) * 100);
  };

  const totalValue = assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
  const totalCost = assets.reduce((sum, asset) => sum + (asset.purchasePrice * asset.quantity), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<Asset['type'], Asset[]>);

  const getAssetIcon = (type: Asset['type']) => {
    const icons = {
      stocks: '📈',
      bonds: '📊',
      'real-estate': '🏡',
      crypto: '₿',
      cash: '💵',
      commodities: '🥇'
    };
    return icons[type] || '💼';
  };

  const getAssetColor = (type: Asset['type']) => {
    const colors = {
      stocks: 'from-blue-500 to-cyan-500',
      bonds: 'from-green-500 to-emerald-500',
      'real-estate': 'from-orange-500 to-amber-500',
      crypto: 'from-purple-500 to-pink-500',
      cash: 'from-emerald-500 to-green-600',
      commodities: 'from-yellow-500 to-orange-500'
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading investments...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Investments
            </h1>
            <p className="text-slate-600">Track and manage your portfolio</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Asset
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Value</div>
            <div className="text-4xl font-bold mb-2">{formatCompact(totalValue)}</div>
            <div className="text-sm opacity-75">{formatAmount(totalValue)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Total Cost</div>
            <div className="text-3xl font-bold text-secondary mb-2">{formatCompact(totalCost)}</div>
            <div className="text-xs text-slate-500">{formatAmount(totalCost)}</div>
          </div>

          <div className={`bg-white rounded-2xl p-6 border-2 ${totalGainLoss >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className={`text-sm mb-2 ${totalGainLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>Total Gain/Loss</div>
            <div className={`text-3xl font-bold mb-2 ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCompact(totalGainLoss)}
            </div>
            <div className={`text-xs ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Total Assets</div>
            <div className="text-3xl font-bold text-secondary mb-2">{assets.length}</div>
            <div className="text-xs text-slate-500">{Object.keys(assetsByType).length} types</div>
          </div>
        </div>

        {/* Assets List */}
        {assets.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-secondary mb-2">No Assets Yet</h3>
            <p className="text-slate-600 mb-6">Start tracking your investments</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              Add Your First Asset
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(assetsByType).map(([type, typeAssets]) => (
              <div key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getAssetIcon(type as Asset['type'])}</span>
                  <h2 className="text-2xl font-bold text-secondary capitalize">
                    {type.replace('-', ' ')} ({typeAssets.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {typeAssets.map(asset => {
                    const gainLoss = calculateGainLoss(asset);
                    const gainLossPercent = calculateGainLossPercent(asset);
                    const isPositive = gainLoss >= 0;

                    return (
                      <div
                        key={asset.id}
                        className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 bg-gradient-to-br ${getAssetColor(asset.type)} rounded-xl flex items-center justify-center text-2xl`}>
                                {getAssetIcon(asset.type)}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-secondary">{asset.name}</h3>
                                <p className="text-sm text-slate-600">
                                  {asset.quantity} {asset.quantity === 1 ? 'unit' : 'units'}
                                </p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-5 gap-4 mt-4">
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Purchase Date</div>
                                <div className="text-sm font-semibold text-secondary">
                                  {asset.purchaseDate.toLocaleDateString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-slate-500 mb-1">Purchase Price</div>
                                <div className="text-sm font-semibold text-secondary">
                                  {formatAmount(asset.purchasePrice)}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-slate-500 mb-1">Current Price</div>
                                <div className="text-sm font-semibold text-secondary">
                                  {formatAmount(asset.currentPrice)}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-slate-500 mb-1">Total Cost</div>
                                <div className="text-sm font-semibold text-secondary">
                                  {formatAmount(asset.purchasePrice * asset.quantity)}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-slate-500 mb-1">Current Value</div>
                                <div className="text-sm font-semibold text-primary">
                                  {formatAmount(calculateAssetValue(asset))}
                                </div>
                              </div>
                            </div>

                            {asset.notes && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">Notes</div>
                                <div className="text-sm text-slate-700">{asset.notes}</div>
                              </div>
                            )}
                          </div>

                          <div className="ml-6 text-right">
                            <div className={`text-2xl font-bold mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{formatCompact(gainLoss)}
                            </div>
                            <div className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                            </div>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="mt-3 text-xs text-red-600 hover:text-red-700 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary">Add Asset</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      placeholder="e.g., Apple Stock, Bitcoin, Apartment"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Asset Type *
                    </label>
                    <select
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as Asset['type'] })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="stocks">Stocks / ETFs</option>
                      <option value="bonds">Bonds</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="crypto">Cryptocurrency</option>
                      <option value="cash">Cash / Savings</option>
                      <option value="commodities">Commodities (Gold, etc.)</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Date *
                    </label>
                    <input
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newAsset.quantity || ''}
                      onChange={(e) => setNewAsset({ ...newAsset, quantity: Number(e.target.value) })}
                      placeholder="1"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={currency}
                      disabled
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Price ({currency}) *
                    </label>
                    <input
                      type="number"
                      value={newAsset.purchasePrice || ''}
                      onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Price ({currency})
                    </label>
                    <input
                      type="number"
                      value={newAsset.currentPrice || ''}
                      onChange={(e) => setNewAsset({ ...newAsset, currentPrice: Number(e.target.value) })}
                      placeholder="Same as purchase price"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave blank to use purchase price</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newAsset.notes}
                    onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                    placeholder="Add any additional information..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-900">
                    <strong>Total Cost:</strong> {formatAmount((newAsset.purchasePrice || 0) * (newAsset.quantity || 1))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddAsset}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                  >
                    Add Asset
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}
