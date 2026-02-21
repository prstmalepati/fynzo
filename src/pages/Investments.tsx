import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import SidebarLayout from '../components/SidebarLayout';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Investment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currency: string;
  notes: string;
}

export default function Investments() {
  const { user } = useAuth();
  const { formatAmount, currency } = useCurrency();
  const { showToast } = useToast();
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Stocks / ETFs');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  const loadInvestments = async () => {
    if (!user) return;
    
    try {
      const investmentsRef = collection(db, 'users', user.uid, 'investments');
      const snapshot = await getDocs(investmentsRef);
      const investmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Investment[];
      
      setInvestments(investmentsData);
    } catch (error) {
      console.error('Error loading investments:', error);
      showToast('Failed to load investments', 'error');
    }
  };

  const handleAddAsset = async () => {
    // Validate user is logged in
    if (!user) {
      showToast('You must be logged in to add investments', 'error');
      return;
    }

    // Validate required fields
    if (!assetName || !assetName.trim()) {
      showToast('Asset name is required', 'error');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      showToast('Quantity must be greater than 0', 'error');
      return;
    }

    if (!purchasePrice || Number(purchasePrice) <= 0) {
      showToast('Purchase price must be greater than 0', 'error');
      return;
    }

    if (!purchaseDate) {
      showToast('Purchase date is required', 'error');
      return;
    }

    setLoading(true);

    try {
      // Prepare data
      const assetData = {
        name: assetName.trim(),
        type: assetType,
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        currentPrice: currentPrice && Number(currentPrice) > 0 ? Number(currentPrice) : Number(purchasePrice),
        purchaseDate: purchaseDate,
        currency: currency,
        notes: notes.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Attempting to save investment:', assetData);
      console.log('User ID:', user.uid);

      // Save to Firestore
      const investmentsRef = collection(db, 'users', user.uid, 'investments');
      const docRef = await addDoc(investmentsRef, assetData);
      
      console.log('Investment saved successfully with ID:', docRef.id);

      // Success!
      showToast(`${assetName} added successfully!`, 'success');
      
      // Reset form
      resetForm();
      setShowAddModal(false);
      
      // Reload investments
      await loadInvestments();
      
    } catch (error: any) {
      console.error('Error adding investment:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Show specific error message
      let errorMessage = 'Failed to add investment';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your account permissions.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Database unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = async (id: string, name: string) => {
    if (!user) return;
    
    // Use custom confirmation instead of browser confirm
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'investments', id));
      showToast(`${name} deleted`, 'success');
      await loadInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
      showToast('Failed to delete investment', 'error');
    }
  };

  const resetForm = () => {
    setAssetName('');
    setAssetType('Stocks / ETFs');
    setQuantity('');
    setPurchasePrice('');
    setCurrentPrice('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  const calculateTotalValue = (inv: Investment) => {
    return inv.quantity * inv.currentPrice;
  };

  const calculateGainLoss = (inv: Investment) => {
    const currentValue = calculateTotalValue(inv);
    const purchaseValue = inv.quantity * inv.purchasePrice;
    return currentValue - purchaseValue;
  };

  const calculateGainLossPercent = (inv: Investment) => {
    const purchaseValue = inv.quantity * inv.purchasePrice;
    const gainLoss = calculateGainLoss(inv);
    return (gainLoss / purchaseValue) * 100;
  };

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + calculateTotalValue(inv), 0);
  const totalGainLoss = investments.reduce((sum, inv) => sum + calculateGainLoss(inv), 0);
  const totalGainLossPercent = investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0) > 0
    ? (totalGainLoss / investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0)) * 100
    : 0;

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2">Investments</h1>
            <p className="text-slate-600">Track your investment portfolio</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          >
            + Add Investment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Portfolio Value</div>
            <div className="text-4xl font-bold">{formatAmount(totalPortfolioValue)}</div>
          </div>

          <div className={`bg-gradient-to-br rounded-2xl p-6 text-white shadow-xl ${
            totalGainLoss >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'
          }`}>
            <div className="text-sm opacity-90 mb-2">Total Gain/Loss</div>
            <div className="text-4xl font-bold">{formatAmount(totalGainLoss)}</div>
            <div className="text-sm opacity-75 mt-1">{totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Investments</div>
            <div className="text-4xl font-bold">{investments.length}</div>
          </div>
        </div>

        {/* Investments List */}
        {investments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-secondary mb-2">No Investments Yet</h3>
            <p className="text-slate-600 mb-6">Start tracking your portfolio by adding your first investment!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Add Your First Investment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Asset</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Quantity</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Purchase Price</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Current Price</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Total Value</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Gain/Loss</th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map(inv => {
                  const gainLoss = calculateGainLoss(inv);
                  const gainLossPercent = calculateGainLossPercent(inv);
                  
                  return (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-secondary">{inv.name}</div>
                        <div className="text-sm text-slate-600">{inv.type}</div>
                      </td>
                      <td className="text-right py-4 px-4">{inv.quantity}</td>
                      <td className="text-right py-4 px-4">{formatAmount(inv.purchasePrice)}</td>
                      <td className="text-right py-4 px-4">{formatAmount(inv.currentPrice)}</td>
                      <td className="text-right py-4 px-4 font-semibold">{formatAmount(calculateTotalValue(inv))}</td>
                      <td className={`text-right py-4 px-4 font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainLoss >= 0 ? '+' : ''}{formatAmount(gainLoss)}
                        <div className="text-sm">{gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%</div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <button
                          onClick={() => handleDeleteInvestment(inv.id, inv.name)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Investment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Add Asset</h2>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Asset Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="e.g., Apple Stock, Bitcoin, S&P 500 ETF"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                {/* Asset Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Asset Type *
                  </label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="Stocks / ETFs">Stocks / ETFs</option>
                    <option value="Cryptocurrency">Cryptocurrency</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Commodities">Commodities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Purchase Date, Quantity, Currency */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Date *
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-slate-100 text-slate-600"
                    />
                  </div>
                </div>

                {/* Purchase Price & Current Price */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Price ({currency}) *
                    </label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Price ({currency})
                    </label>
                    <input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      placeholder="Leave blank to use purchase price"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave blank to use purchase price</p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </div>

                {/* Total Cost Display */}
                {quantity && purchasePrice && Number(quantity) > 0 && Number(purchasePrice) > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-900">Total Cost:</span>
                      <span className="text-2xl font-bold text-blue-900">
                        {formatAmount(Number(quantity) * Number(purchasePrice))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddAsset}
                    disabled={loading}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      loading
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {loading ? 'Adding...' : 'Add Asset'}
                  </button>
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
