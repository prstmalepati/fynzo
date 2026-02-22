import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLocale } from '../context/LocaleContext';
import { db } from '../firebase/config';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';

const DEBT_CATEGORIES = [
  { id: 'mortgage', label: 'Mortgage / House', icon: '🏠', color: '#ef4444' },
  { id: 'auto', label: 'Auto Loan', icon: '🚗', color: '#f97316' },
  { id: 'student', label: 'Student Loan', icon: '🎓', color: '#8b5cf6' },
  { id: 'credit_card', label: 'Credit Card', icon: '💳', color: '#ec4899' },
  { id: 'personal', label: 'Personal Loan', icon: '🏦', color: '#2563eb' },
  { id: 'other', label: 'Other', icon: '📋', color: '#6b7280' },
];

interface Debt {
  id: string;
  name: string;
  category: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  lender: string;
  notes: string;
}

const emptyDebt: Omit<Debt, 'id'> = {
  name: '', category: 'mortgage', totalAmount: 0, remainingAmount: 0,
  interestRate: 0, monthlyPayment: 0, startDate: '', lender: '', notes: '',
};

export default function Debts() {
  const { user } = useAuth();
  const { formatAmount, currency } = useCurrency();
  const { t } = useLocale();
  const { showToast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Debt, 'id'>>(emptyDebt);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { if (user) loadDebts(); }, [user]);

  const loadDebts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'debts'));
      setDebts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Debt)));
    } catch (err) { console.error('Error loading debts:', err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await setDoc(doc(db, 'users', user.uid, 'debts', editingId), {
          ...form, updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'users', user.uid, 'debts'), {
          ...form, createdAt: new Date(), updatedAt: new Date(),
        });
      }
      showToast(editingId ? 'Debt updated' : 'Debt added', 'success');
      setShowForm(false);
      setEditingId(null);
      setForm(emptyDebt);
      loadDebts();
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally { setSaving(false); }
  };

  const handleEdit = (debt: Debt) => {
    setForm({
      name: debt.name, category: debt.category, totalAmount: debt.totalAmount,
      remainingAmount: debt.remainingAmount, interestRate: debt.interestRate,
      monthlyPayment: debt.monthlyPayment, startDate: debt.startDate,
      lender: debt.lender, notes: debt.notes,
    });
    setEditingId(debt.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'debts', id));
      showToast('Debt removed', 'success');
      setDeleteConfirm(null);
      loadDebts();
    } catch (err) { showToast('Failed to delete', 'error'); }
  };

  const totalDebt = useMemo(() => debts.reduce((s, d) => s + (d.remainingAmount || 0), 0), [debts]);
  const totalMonthly = useMemo(() => debts.reduce((s, d) => s + (d.monthlyPayment || 0), 0), [debts]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    debts.forEach(d => { map[d.category] = (map[d.category] || 0) + (d.remainingAmount || 0); });
    return DEBT_CATEGORIES.filter(c => map[c.id]).map(c => ({
      ...c, amount: map[c.id], pct: totalDebt > 0 ? (map[c.id] / totalDebt) * 100 : 0,
    }));
  }, [debts, totalDebt]);

  const getCat = (id: string) => DEBT_CATEGORIES.find(c => c.id === id) || DEBT_CATEGORIES[5];

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse mb-3" />)}
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-secondary font-display">Debt Tracker</h1>
            <p className="text-sm text-slate-500 mt-1">Track all your debts in one place. Total flows into Wealth Projection automatically.</p>
          </div>
          <button onClick={() => { setForm(emptyDebt); setEditingId(null); setShowForm(true); }}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Debt
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Total Debt</div>
            <div className="text-2xl font-bold">{formatAmount(totalDebt)}</div>
            <div className="text-xs text-white/60 mt-1">{debts.length} debt{debts.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Monthly Payments</div>
            <div className="text-2xl font-bold text-secondary">{formatAmount(totalMonthly)}</div>
            <div className="text-xs text-slate-400 mt-1">{formatAmount(totalMonthly * 12)}/year</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Debt-Free In</div>
            <div className="text-2xl font-bold text-secondary">
              {totalMonthly > 0 ? `${Math.ceil(totalDebt / (totalMonthly * 12))} years` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-1">At current payment rate</div>
          </div>
        </div>

        {/* Breakdown by Category */}
        {byCategory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 mb-6">
            <h2 className="text-sm font-bold text-secondary mb-4">Debt by Category</h2>
            <div className="flex gap-6 items-center">
              {/* Donut chart */}
              <svg viewBox="0 0 80 80" className="w-24 h-24 flex-shrink-0">
                {(() => {
                  const r = 30, c = 2 * Math.PI * r;
                  let offset = 0;
                  return byCategory.map((cat, i) => {
                    const dash = (cat.pct / 100) * c;
                    const el = (
                      <circle key={i} cx="40" cy="40" r={r} fill="none"
                        stroke={cat.color} strokeWidth="10"
                        strokeDasharray={`${dash} ${c - dash}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 40 40)" />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
                <circle cx="40" cy="40" r="22" fill="white" />
                <text x="40" y="42" textAnchor="middle" className="text-[8px] fill-slate-800 font-bold">
                  {debts.length}
                </text>
              </svg>
              {/* Legend */}
              <div className="flex-1 space-y-2">
                {byCategory.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-slate-500 flex-1">{cat.icon} {cat.label}</span>
                    <span className="text-xs font-bold text-slate-700">{formatAmount(cat.amount)}</span>
                    <span className="text-[10px] text-slate-400 w-10 text-right">{cat.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Debt List */}
        {debts.length === 0 && !showForm ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-secondary mb-1">No debts recorded</h3>
            <p className="text-sm text-slate-500 mb-4">Add your debts to track payoff progress and see the impact on your net worth.</p>
            <button onClick={() => { setForm(emptyDebt); setShowForm(true); }}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
              Add Your First Debt
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {debts.map(debt => {
              const cat = getCat(debt.category);
              const paidPct = debt.totalAmount > 0
                ? ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
                : 0;
              return (
                <div key={debt.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4 hover:shadow-card-hover transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: cat.color + '15' }}>
                        {cat.icon}
                      </div>
                      <div>
                        <div className="font-bold text-secondary text-sm">{debt.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span style={{ color: cat.color }}>{cat.label}</span>
                          {debt.lender && <><span>·</span><span>{debt.lender}</span></>}
                          {debt.interestRate > 0 && <><span>·</span><span>{debt.interestRate}% APR</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(debt)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                      </button>
                      {deleteConfirm === debt.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(debt.id)} className="text-[10px] text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100">Delete</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-[10px] text-slate-400 font-bold px-2 py-1 hover:bg-slate-50 rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(debt.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Progress bar + amounts */}
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-400">Remaining: <span className="font-bold text-red-500">{formatAmount(debt.remainingAmount)}</span></span>
                        <span className="text-slate-400">of {formatAmount(debt.totalAmount)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${paidPct}%`, backgroundColor: cat.color }} />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{paidPct.toFixed(0)}% paid off</div>
                    </div>
                    {debt.monthlyPayment > 0 && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-bold text-secondary">{formatAmount(debt.monthlyPayment)}</div>
                        <div className="text-[10px] text-slate-400">/month</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-bold text-secondary">{editingId ? 'Edit Debt' : 'Add New Debt'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Category selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-2 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DEBT_CATEGORIES.map(cat => (
                      <button key={cat.id} type="button"
                        onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          form.category === cat.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}>
                        <div className="text-lg mb-0.5">{cat.icon}</div>
                        <div className="text-[10px] font-semibold text-slate-600">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Debt Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. Home Mortgage, Chase Visa..." />
                </div>
                {/* Amounts row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Total Amount ({currency})</label>
                    <input type="number" value={form.totalAmount || ''} onChange={e => setForm(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      placeholder="Original loan amount" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Remaining ({currency})</label>
                    <input type="number" value={form.remainingAmount || ''} onChange={e => setForm(prev => ({ ...prev, remainingAmount: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      placeholder="Current balance" />
                  </div>
                </div>
                {/* Rate + monthly */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Interest Rate (%)</label>
                    <input type="number" step="0.1" value={form.interestRate || ''} onChange={e => setForm(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      placeholder="e.g. 3.5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Monthly Payment ({currency})</label>
                    <input type="number" value={form.monthlyPayment || ''} onChange={e => setForm(prev => ({ ...prev, monthlyPayment: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      placeholder="0" />
                  </div>
                </div>
                {/* Lender + start date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Lender</label>
                    <input type="text" value={form.lender} onChange={e => setForm(prev => ({ ...prev, lender: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                      placeholder="Bank / Institution" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
                  </div>
                </div>
                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Notes</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none"
                    placeholder="Optional notes..." />
                </div>
              </div>
              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name.trim()}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center gap-2 ${
                    saving || !form.name.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                  }`}>
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                  ) : (editingId ? 'Update Debt' : 'Add Debt')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
