import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import BrokerImportModal from '../components/BrokerImportModal';

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
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  // Form
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Stocks / ETFs');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => { if (user) loadInvestments(); }, [user]);

  const loadInvestments = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'investments'));
      setInvestments(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Investment[]);
    } catch (err) {
      console.error('Error loading investments:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const resetForm = () => {
    setAssetName(''); setAssetType('Stocks / ETFs'); setQuantity('');
    setPurchasePrice(''); setCurrentPrice(''); setNotes('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const openEdit = (inv: Investment) => {
    setAssetName(inv.name); setAssetType(inv.type); setQuantity(String(inv.quantity));
    setPurchasePrice(String(inv.purchasePrice)); setCurrentPrice(String(inv.currentPrice));
    setPurchaseDate(inv.purchaseDate); setNotes(inv.notes || '');
    setEditingId(inv.id); setShowModal(true);
  };

  const handleSave = async () => {
    if (!user || !assetName.trim() || !quantity || !purchasePrice) return;
    setLoading(true);
    try {
      const data = {
        name: assetName.trim(), type: assetType, quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        currentPrice: currentPrice && Number(currentPrice) > 0 ? Number(currentPrice) : Number(purchasePrice),
        purchaseDate, currency, notes: notes.trim(), updatedAt: new Date()
      };
      if (editingId) {
        await updateDoc(doc(db, 'users', user.uid, 'investments', editingId), data);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'investments'), { ...data, createdAt: new Date() });
      }
      resetForm(); setShowModal(false); await loadInvestments();
    } catch (err) {
      console.error('Error saving:', err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'investments', id));
      setDeleteConfirmId(null); await loadInvestments();
    } catch (err) { console.error('Error deleting:', err); }
  };

  const calcValue = (inv: Investment) => inv.quantity * inv.currentPrice;
  const calcGain = (inv: Investment) => calcValue(inv) - (inv.quantity * inv.purchasePrice);
  const calcGainPct = (inv: Investment) => {
    const cost = inv.quantity * inv.purchasePrice;
    return cost > 0 ? (calcGain(inv) / cost) * 100 : 0;
  };

  const totalValue = investments.reduce((s, i) => s + calcValue(i), 0);
  const totalCost = investments.reduce((s, i) => s + i.quantity * i.purchasePrice, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const assetTypes = ['Stocks / ETFs', 'Cryptocurrency', 'Bonds', 'Real Estate', 'Commodities', 'Mutual Funds', 'Other'];

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary font-display">Investments</h1>
            <p className="text-slate-500 mt-1">Track your investment portfolio</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowImport(true)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Import
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Investment
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger">
          <div className="rounded-2xl p-5 bg-gradient-to-br from-secondary to-surface-700 text-white shadow-elevated animate-slideUp">
            <div className="text-sm text-white/50 mb-1">Total Value</div>
            <div className="text-3xl font-bold tracking-tight">{formatAmount(totalValue)}</div>
          </div>
          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-card animate-slideUp">
            <div className="text-sm text-slate-500 mb-1">Total Cost</div>
            <div className="text-3xl font-bold text-secondary tracking-tight">{formatAmount(totalCost)}</div>
          </div>
          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-card animate-slideUp">
            <div className="text-sm text-slate-500 mb-1">Total Gain/Loss</div>
            <div className={`text-3xl font-bold tracking-tight ${totalGain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {totalGain >= 0 ? '+' : ''}{formatAmount(totalGain)}
              <span className="text-sm font-medium ml-1.5">({totalGainPct >= 0 ? '+' : ''}{totalGainPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        {pageLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">No investments yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Add your first investment to start tracking your portfolio performance.</p>
            <button onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
              Add Your First Investment
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Buy Price</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gain/Loss</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => {
                    const gain = calcGain(inv);
                    const gainPct = calcGainPct(inv);
                    return (
                      <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-secondary">{inv.name}</div>
                          <div className="text-xs text-slate-400">{inv.type}</div>
                        </td>
                        <td className="text-right py-4 px-5 text-sm text-secondary">{inv.quantity}</td>
                        <td className="text-right py-4 px-5 text-sm text-slate-600">{formatAmount(inv.purchasePrice)}</td>
                        <td className="text-right py-4 px-5 text-sm text-secondary font-medium">{formatAmount(inv.currentPrice)}</td>
                        <td className="text-right py-4 px-5 text-sm font-semibold text-secondary">{formatAmount(calcValue(inv))}</td>
                        <td className={`text-right py-4 px-5 text-sm font-semibold ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {gain >= 0 ? '+' : ''}{formatAmount(gain)}
                          <div className="text-xs font-medium opacity-70">{gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%</div>
                        </td>
                        <td className="text-right py-4 px-5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteConfirmId(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {investments.map((inv) => {
                const gain = calcGain(inv);
                const gainPct = calcGainPct(inv);
                return (
                  <div key={inv.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-secondary">{inv.name}</div>
                        <div className="text-xs text-slate-400">{inv.type} · {inv.quantity} units</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirmId(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Value</div>
                        <div className="text-lg font-bold text-secondary">{formatAmount(calcValue(inv))}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Gain/Loss</div>
                        <div className={`text-sm font-semibold ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {gain >= 0 ? '+' : ''}{formatAmount(gain)} ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirmId(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-elevated" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-secondary mb-2">Delete Investment</h3>
              <p className="text-slate-500 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary font-display">{editingId ? 'Edit' : 'Add'} Investment</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asset Name</label>
                  <input type="text" value={assetName} onChange={e => setAssetName(e.target.value)}
                    placeholder="e.g., Apple Stock, Bitcoin" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asset Type</label>
                  <select value={assetType} onChange={e => setAssetType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary bg-white">
                    {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                    <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                      placeholder="0" min="0" step="0.01" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
                    <input type="text" value={currency} disabled className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Purchase Price ({currency})</label>
                    <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)}
                      placeholder="0" min="0" step="0.01" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Price ({currency})</label>
                    <input type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)}
                      placeholder="Same as purchase" min="0" step="0.01" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                    placeholder="Optional notes..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary resize-none" />
                </div>

                {quantity && purchasePrice && Number(quantity) > 0 && Number(purchasePrice) > 0 && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary">Total Cost</span>
                      <span className="text-xl font-bold text-primary">{formatAmount(Number(quantity) * Number(purchasePrice))}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={loading}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all text-white ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'}`}>
                    {loading ? 'Saving...' : editingId ? 'Update Investment' : 'Add Investment'}
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} disabled={loading}
                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Broker Import Modal */}
        <BrokerImportModal open={showImport} onClose={() => setShowImport(false)} onImported={loadInvestments} />
      </div>
    </SidebarLayout>
  );
}
