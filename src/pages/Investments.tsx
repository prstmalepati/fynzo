import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { firestore } from '../firebase/config';
import SidebarLayout from '../components/SidebarLayout';

interface Asset {
  id: string;
  name: string;
  type: 'stocks' | 'real-estate' | 'crypto' | 'cash' | 'other';
  value: number;
  currency: string;
  addedAt: Date;
}

export default function Investments() {
  const { user } = useAuth();
  const { formatAmount, formatCompact, currency, convert } = useCurrency();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'stocks' as Asset['type'],
    value: 0
  });

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user]);

  const loadAssets = async () => {
    try {
      const snapshot = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('assets')
        .orderBy('addedAt', 'desc')
        .get();

      const loadedAssets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt?.toDate()
      })) as Asset[];

      setAssets(loadedAssets);
      setLoading(false);
    } catch (error) {
      console.error('Error loading assets:', error);
      setLoading(false);
    }
  };

  const handleAddAsset = async () => {
    if (!newAsset.name || newAsset.value <= 0) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await firestore
        .collection('users')
        .doc(user.uid)
        .collection('assets')
        .add({
          name: newAsset.name,
          type: newAsset.type,
          value: newAsset.value,
          currency: currency,
          addedAt: new Date()
        });

      setNewAsset({ name: '', type: 'stocks', value: 0 });
      setShowAddModal(false);
      loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Failed to add asset');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (confirm('Delete this asset?')) {
      try {
        await firestore
          .collection('users')
          .doc(user.uid)
          .collection('assets')
          .doc(assetId)
          .delete();
        
        loadAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = 0;
    }
    acc[asset.type] += asset.value;
    return acc;
  }, {} as Record<Asset['type'], number>);

  const getAssetIcon = (type: Asset['type']) => {
    const icons = {
      stocks: '📈',
      'real-estate': '🏡',
      crypto: '₿',
      cash: '💵',
      other: '💼'
    };
    return icons[type] || '💼';
  };

  const getAssetColor = (type: Asset['type']) => {
    const colors = {
      stocks: 'from-blue-500 to-cyan-500',
      'real-estate': 'from-green-500 to-teal-500',
      crypto: 'from-orange-500 to-red-500',
      cash: 'from-emerald-500 to-green-600',
      other: 'from-purple-500 to-pink-500'
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
            <p className="text-slate-600">Track and manage your assets</p>
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

        {/* Total Value Card */}
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="text-sm opacity-90 mb-2">Total Portfolio Value</div>
          <div className="text-5xl font-bold mb-2">
            {formatCompact(totalValue)}
          </div>
          <div className="text-lg opacity-75">
            {formatAmount(totalValue)}
          </div>
          <div className="mt-4 text-sm opacity-90">
            {assets.length} {assets.length === 1 ? 'asset' : 'assets'} tracked
          </div>
        </div>

        {/* Assets by Type */}
        {Object.keys(assetsByType).length > 0 && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {Object.entries(assetsByType).map(([type, value]) => (
              <div key={type} className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="text-3xl mb-2">{getAssetIcon(type as Asset['type'])}</div>
                <div className="text-xs text-slate-600 mb-1 capitalize">
                  {type.replace('-', ' ')}
                </div>
                <div className="text-xl font-bold text-secondary">
                  {formatCompact(value)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {((value / totalValue) * 100).toFixed(0)}% of total
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assets List */}
        {assets.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-secondary mb-2">
              No Assets Yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start by adding your first investment to track your wealth
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              Add Your First Asset
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary mb-4">All Assets</h2>
            {assets.map(asset => (
              <div
                key={asset.id}
                className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getAssetColor(asset.type)} rounded-xl flex items-center justify-center text-3xl`}>
                      {getAssetIcon(asset.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary">{asset.name}</h3>
                      <div className="text-sm text-slate-600 capitalize">
                        {asset.type.replace('-', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatCompact(asset.value)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {formatAmount(asset.value)}
                    </div>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., S&P 500 ETF"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as Asset['type'] })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="stocks">Stocks / ETFs</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="cash">Cash / Savings</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Value ({currency})
                  </label>
                  <input
                    type="number"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
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
