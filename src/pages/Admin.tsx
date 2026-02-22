import { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ALL_TAX_RULES } from '../data/taxRules';
import { useToast } from '../context/ToastContext';

type Tab = 'overview' | 'users' | 'tax-rules' | 'market-prices' | 'system';

export default function Admin() {
  const { isAdmin, adminLoading } = useAdmin();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({ users: 0, investments: 0, goals: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [cachedPrices, setCachedPrices] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) loadDashboard();
  }, [isAdmin]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Count users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
      setUsers(usersData);

      // Count investments across all users (sample first 20)
      let totalInv = 0;
      let totalGoals = 0;
      for (const u of usersData.slice(0, 20)) {
        try {
          const invSnap = await getDocs(collection(db, 'users', u.uid, 'investments'));
          totalInv += invSnap.size;
          const goalSnap = await getDocs(collection(db, 'users', u.uid, 'goals'));
          totalGoals += goalSnap.size;
        } catch {}
      }

      setStats({ users: usersData.length, investments: totalInv, goals: totalGoals });

      // Load market price cache
      try {
        const priceSnap = await getDocs(collection(db, 'market_prices'));
        setCachedPrices(priceSnap.docs.map(d => ({ symbol: d.id, ...d.data() })));
      } catch {}

      // Load system config
      try {
        const sysSnap = await getDoc(doc(db, 'system', 'api_keys'));
        if (sysSnap.exists()) setSystemConfig(sysSnap.data());
      } catch {}
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const seedTaxRules = async () => {
    try {
      for (const rule of ALL_TAX_RULES) {
        await setDoc(doc(db, 'tax_rules', rule.countryCode, String(rule.year), 'data'), rule);
      }
      showToast('Tax rules seeded to Firestore!', 'success');
    } catch (err) {
      showToast('Failed to seed tax rules.', 'error');
    }
  };

  const saveApiKeys = async (keys: Record<string, string>) => {
    try {
      await setDoc(doc(db, 'system', 'api_keys'), keys, { merge: true });
      showToast('API keys saved.', 'success');
    } catch (err) {
      showToast('Failed to save.', 'error');
    }
  };

  if (adminLoading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-secondary mb-2">Access Denied</h2>
            <p className="text-sm text-slate-500">You do not have admin privileges.</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary font-display">Admin Panel</h1>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">RESTRICTED</span>
          </div>
          <p className="text-sm text-slate-500">System administration — visible only to whitelisted users.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'tax-rules', label: 'Tax Rules' },
            { id: 'market-prices', label: 'Market Prices' },
            { id: 'system', label: 'System Config' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Overview ──────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-secondary">{stats.users}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Total Investments</div>
              <div className="text-3xl font-bold text-secondary">{stats.investments}</div>
              <div className="text-xs text-slate-400 mt-1">Sampled from first 20 users</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Total Goals</div>
              <div className="text-3xl font-bold text-secondary">{stats.goals}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Cached Prices</div>
              <div className="text-3xl font-bold text-secondary">{cachedPrices.length}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Tax Rule Sets</div>
              <div className="text-3xl font-bold text-secondary">{ALL_TAX_RULES.length}</div>
              <button onClick={seedTaxRules} className="mt-2 text-xs text-primary font-semibold hover:underline">Seed to Firestore →</button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-sm text-slate-500 mb-1">Your Role</div>
              <div className="text-lg font-bold text-red-600">Admin</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
        )}

        {/* ─── Users ─────────────────────────────────────── */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Currency</th>
                    <th className="px-4 py-3">Locale</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-secondary truncate max-w-[200px]">{u.fullName || u.uid?.slice(0, 12)}</div>
                        <div className="text-xs text-slate-400 truncate">{u.email || u.uid}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.country || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{u.preferredCurrency || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{u.locale || 'en'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {u.updatedAt ? new Date(u.updatedAt.seconds ? u.updatedAt.seconds * 1000 : u.updatedAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">No users found.</div>
            )}
          </div>
        )}

        {/* ─── Tax Rules ─────────────────────────────────── */}
        {tab === 'tax-rules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Tax rules stored in <code className="bg-slate-100 px-1 rounded">data/taxRules.ts</code>. Seed them to Firestore for runtime updates.</p>
              <button onClick={seedTaxRules}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90">
                Seed All to Firestore
              </button>
            </div>
            {ALL_TAX_RULES.map((rule, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-secondary">{rule.country} — {rule.year}</h3>
                    <p className="text-xs text-slate-400">{rule.source}</p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">{rule.currency}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">Brackets</div>
                    <div className="text-sm font-semibold text-secondary">{rule.brackets.single.length}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">Std. Deduction</div>
                    <div className="text-sm font-semibold text-secondary">{rule.currency} {rule.standardDeduction.single.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">SS Rate</div>
                    <div className="text-sm font-semibold text-secondary">{(rule.socialSecurity.employeeRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">Health Rate</div>
                    <div className="text-sm font-semibold text-secondary">{(rule.medicareOrHealth.rate * 100).toFixed(2)}%</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">{rule.notes}</p>
              </div>
            ))}
          </div>
        )}

        {/* ─── Market Prices ─────────────────────────────── */}
        {tab === 'market-prices' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {cachedPrices.map((p, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 font-semibold text-secondary">{p.symbol}</td>
                      <td className="px-4 py-2.5">{p.currency} {p.price?.toFixed(2)}</td>
                      <td className={`px-4 py-2.5 font-semibold ${(p.changePercent || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(p.changePercent || 0) >= 0 ? '+' : ''}{(p.changePercent || 0).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{p.source}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400">
                        {p.updatedAt ? new Date(p.updatedAt.seconds ? p.updatedAt.seconds * 1000 : p.updatedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cachedPrices.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">No cached prices. Prices get cached when users fetch live data.</div>
            )}
          </div>
        )}

        {/* ─── System Config ──────────────────────────────── */}
        {tab === 'system' && (
          <div className="space-y-4">
            <ApiKeyEditor label="Twelve Data API Key" field="twelveData" current={systemConfig.twelveData} onSave={val => saveApiKeys({ twelveData: val })} />
            <ApiKeyEditor label="Admin Whitelist (UIDs)" field="admin_note" current="Managed in Firestore: system/admin_whitelist → uids[]" onSave={() => {}} readonly />
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-secondary mb-3">Firestore Rules</h3>
              <p className="text-xs text-slate-500 mb-3">Deploy these rules via Firebase Console or <code className="bg-slate-100 px-1 rounded">firebase deploy --only firestore:rules</code></p>
              <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs overflow-x-auto">{`// system/admin_whitelist — readable only by admins
match /system/admin_whitelist {
  allow read: if request.auth != null 
    && request.auth.uid in resource.data.uids;
  allow write: if false; // Manual only
}`}</pre>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

function ApiKeyEditor({ label, field, current, onSave, readonly }: { label: string; field: string; current?: string; onSave: (val: string) => void; readonly?: boolean }) {
  const [value, setValue] = useState(current || '');
  const [editing, setEditing] = useState(false);
  useEffect(() => { setValue(current || ''); }, [current]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-secondary text-sm">{label}</h3>
        {!readonly && (
          <button onClick={() => {
            if (editing) { onSave(value); setEditing(false); }
            else setEditing(true);
          }} className="text-xs text-primary font-semibold hover:underline">
            {editing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>
      {editing ? (
        <input type="text" value={value} onChange={e => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-secondary font-mono" />
      ) : (
        <div className="text-sm text-slate-500 font-mono truncate">{current ? `${current.slice(0, 8)}${'•'.repeat(20)}` : 'Not set'}</div>
      )}
    </div>
  );
}
