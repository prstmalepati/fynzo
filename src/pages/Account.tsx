import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';
import { SUPPORTED_COUNTRIES } from '../constants/countries';
import { useAdmin } from '../hooks/useAdmin';
import { useTier } from '../hooks/useTier';
import { TierType, TIER_INFO, getTierPrice, getAnnualSavings, getCurrencySymbol } from '../constants/tiers';

type Tab = 'profile' | 'subscription' | 'billing';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  dateOfBirth: string;
  occupation: string;
}

export default function Account() {
  const { user } = useAuth();
  const { t, locale, isGerman } = useLocale();
  const { currency } = useCurrency();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '', email: user?.email || '', phone: '', address: '', city: '',
    country: '', postalCode: '', dateOfBirth: '', occupation: '',
  });

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, 'users', user!.uid));
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          fullName: d.fullName || '', email: user!.email || '', phone: d.phone || '',
          address: d.address || '', city: d.city || '', country: d.country || '',
          postalCode: d.postalCode || '', dateOfBirth: d.dateOfBirth || '',
          occupation: d.occupation || '',
        });
      }
    } catch (err) { console.error('Error loading profile:', err); }
    finally { setLoading(false); }
  };

  const updateField = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'users', user!.uid), {
        ...profile, updatedAt: new Date()
      }, { merge: true });
      showToast(t('settings.saved') || 'Saved!', 'success');
    } catch (err) {
      showToast(t('settings.saveFailed') || 'Failed to save', 'error');
    } finally { setSaving(false); }
  };

  const isGoogle = user?.providerData.some(p => p.providerId === 'google.com');

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse mb-4" />)}
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary font-display">Account</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information, subscription, and billing.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6">
          {([
            { id: 'profile' as Tab, label: 'Profile & Address', icon: '👤' },
            { id: 'subscription' as Tab, label: 'Subscription', icon: '⭐' },
            { id: 'billing' as Tab, label: 'Billing & Payments', icon: '💳' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-secondary text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ═══ PROFILE TAB ═══════════════════════════════════ */}
        {tab === 'profile' && (
          <div className="space-y-6">
            {/* Account info bar */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {(profile.fullName || profile.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-secondary truncate">{profile.fullName || 'Set your name'}</div>
                <div className="text-sm text-slate-500 truncate">{profile.email}</div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                <span className="text-xs">{isGoogle ? '🔵' : '📧'}</span>
                <span className="text-xs text-slate-600 font-medium">{isGoogle ? 'Google' : 'Email'}</span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" value={profile.fullName} onChange={e => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" value={profile.email} disabled
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input type="tel" value={profile.phone} onChange={e => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" value={profile.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Occupation</label>
                  <input type="text" value={profile.occupation} onChange={e => updateField('occupation', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Address
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <select value={profile.country} onChange={e => updateField('country', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all">
                    <option value="">Select country</option>
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.flag} {isGerman ? c.nameDE : c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label>
                  <input type="text" value={profile.address} onChange={e => updateField('address', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input type="text" value={profile.city} onChange={e => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Postal Code</label>
                  <input type="text" value={profile.postalCode} onChange={e => updateField('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3">
              <button onClick={loadProfile} className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Reset
              </button>
              <button onClick={handleSave} disabled={saving}
                className={`px-8 py-3 rounded-xl font-semibold transition-all text-white flex items-center gap-2 ${
                  saving ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                }`}>
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Save Changes</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══ SUBSCRIPTION TAB ══════════════════════════════ */}
        {tab === 'subscription' && (
          <SubscriptionTab user={user!} currency={currency} showToast={showToast} />
        )}

        {/* ═══ BILLING TAB ═══════════════════════════════════ */}
        {tab === 'billing' && (
          <div className="space-y-6">
            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-secondary">Payment Methods</h2>
                <button className="px-4 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                  + Add Payment Method
                </button>
              </div>

              {/* Empty state */}
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-secondary mb-1">No payment method on file</p>
                <p className="text-xs text-slate-500">Add a payment method to upgrade to Premium.</p>
              </div>

              {/* Supported methods */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 mb-2 font-medium">Accepted payment methods</div>
                <div className="flex items-center gap-3">
                  {[
                    { name: 'Visa', bg: 'bg-blue-600', text: 'VISA' },
                    { name: 'Mastercard', bg: 'bg-red-500', text: 'MC' },
                    { name: 'SEPA', bg: 'bg-emerald-600', text: 'SEPA' },
                    { name: 'PayPal', bg: 'bg-blue-500', text: 'PP' },
                  ].map((m, i) => (
                    <div key={i} className={`${m.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-md`}>{m.text}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing history */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-secondary mb-5">Billing History</h2>
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">No billing history yet.</p>
                <p className="text-xs text-slate-400 mt-1">Invoices will appear here once you upgrade to Premium.</p>
              </div>
            </div>

            {/* Billing info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6">
              <h2 className="text-lg font-bold text-secondary mb-4">Billing Address</h2>
              {profile.address || profile.city ? (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-secondary font-semibold">{profile.fullName}</p>
                  {profile.address && <p className="text-sm text-slate-600">{profile.address}</p>}
                  <p className="text-sm text-slate-600">
                    {[profile.postalCode, profile.city].filter(Boolean).join(' ')}
                  </p>
                  {profile.country && <p className="text-sm text-slate-600">{profile.country}</p>}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-sm text-slate-500">No billing address set.</p>
                  <button onClick={() => setTab('profile')} className="text-xs text-primary font-semibold hover:underline mt-1">
                    Add address in Profile →
                  </button>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <div className="text-sm font-semibold text-emerald-800">Secure payments</div>
                <div className="text-xs text-emerald-600">Payments are processed by Stripe. myfynzo never stores your card details.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

// ─── Subscription Tab Component ──────────────────────────────
function SubscriptionTab({ user, currency, showToast }: { user: any; currency: string; showToast: (msg: string, type: 'success' | 'error') => void }) {
  const { isAdmin } = useAdmin();
  const { tier } = useTier();
  const [selectedTier, setSelectedTier] = useState<TierType>(tier);
  const [savingTier, setSavingTier] = useState(false);

  useEffect(() => { setSelectedTier(tier); }, [tier]);

  const sym = getCurrencySymbol(currency);

  const handleSaveTier = async () => {
    setSavingTier(true);
    try {
      await setDoc(doc(db, 'users', user.uid), { tier: selectedTier, updatedAt: new Date() }, { merge: true });
      showToast(`Plan updated to ${selectedTier}`, 'success');
    } catch (err) {
      showToast('Failed to update plan', 'error');
    } finally { setSavingTier(false); }
  };

  const plans: { id: TierType; border: string; bg: string; badge?: { text: string; color: string }; accent: string; btnClass: string }[] = [
    { id: 'free', border: 'border-slate-200', bg: 'bg-white', accent: 'text-primary', btnClass: 'border border-slate-200 text-slate-700 hover:bg-slate-50' },
    { id: 'premium', border: 'border-primary/40', bg: 'bg-primary/[0.02]', badge: { text: 'Popular', color: 'bg-primary text-white' }, accent: 'text-primary', btnClass: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' },
    { id: 'couples', border: 'border-rose-300/50', bg: 'bg-gradient-to-br from-rose-50/50 to-amber-50/50', badge: { text: 'Partner Card', color: 'bg-rose-500 text-white' }, accent: 'text-rose-500', btnClass: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90 shadow-lg shadow-rose-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin override banner */}
      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔧</span>
            <div>
              <div className="text-sm font-bold text-amber-800">Admin Mode</div>
              <div className="text-xs text-amber-600">You can select and save any plan for testing.</div>
            </div>
          </div>
          {selectedTier !== tier && (
            <button onClick={handleSaveTier} disabled={savingTier}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${savingTier ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
              {savingTier ? 'Saving...' : `Save as "${selectedTier}"`}
            </button>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(plan => {
          const info = TIER_INFO[plan.id];
          const isCurrent = tier === plan.id;
          const isSelected = selectedTier === plan.id;
          const price = plan.id === 'free' ? 0 : getTierPrice(currency, plan.id as 'premium' | 'couples', 'monthly');
          const annual = plan.id === 'free' ? 0 : getTierPrice(currency, plan.id as 'premium' | 'couples', 'annual');
          const savings = plan.id === 'free' ? 0 : getAnnualSavings(currency, plan.id as 'premium' | 'couples');

          return (
            <div key={plan.id}
              onClick={() => isAdmin ? setSelectedTier(plan.id) : undefined}
              className={`relative rounded-2xl p-5 border-2 transition-all ${
                isSelected && isAdmin ? 'ring-2 ring-offset-2 ring-primary' : ''
              } ${isCurrent ? `border-primary ${plan.bg}` : `${plan.border} ${plan.bg}`} ${isAdmin ? 'cursor-pointer hover:shadow-lg' : ''}`}>
              
              {/* Badges */}
              {isCurrent && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase">Current</div>
              )}
              {plan.badge && !isCurrent && (
                <div className={`absolute -top-2.5 right-4 px-2.5 py-0.5 ${plan.badge.color} text-[10px] font-bold rounded-full`}>{plan.badge.text}</div>
              )}

              <div className="mt-1">
                <div className="text-lg font-bold text-secondary mb-0.5">{info.name}</div>
                <div className="text-xs text-slate-500 mb-3">{info.tagline}</div>
                
                <div className="flex items-baseline gap-0.5 mb-0.5">
                  <span className="text-2xl font-bold text-secondary">{sym}{price === 0 ? '0' : price.toFixed(2)}</span>
                  <span className="text-sm text-slate-400">/month</span>
                </div>
                {plan.id !== 'free' && (
                  <div className="text-xs text-slate-500 mb-4">or {sym}{annual}/year — save {savings}%</div>
                )}
                {plan.id === 'free' && <div className="text-xs text-slate-500 mb-4">Free forever</div>}

                {/* Partner card visual for couples */}
                {plan.id === 'couples' && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-2.5 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-primary/40 flex items-center justify-center text-[7px] text-white font-bold">1</div>
                      <div className="w-4 h-4 rounded-full bg-rose-400/40 flex items-center justify-center text-[7px] text-white font-bold">2</div>
                      <span className="text-[8px] text-white/50">2 users, 1 subscription</span>
                    </div>
                    <div className="text-white text-[9px] font-semibold">Partner Card</div>
                  </div>
                )}

                <ul className="space-y-2 mb-5">
                  {info.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 ${plan.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {!isAdmin && !isCurrent && (
                  <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${plan.btnClass}`}>
                    {plan.id === 'free' ? 'Downgrade' : `Upgrade to ${info.name}`}
                  </button>
                )}
                {!isAdmin && isCurrent && (
                  <div className="w-full py-2.5 text-center bg-slate-100 text-slate-400 rounded-xl text-sm font-semibold">Current Plan</div>
                )}
                {isAdmin && (
                  <div className={`w-full py-2.5 text-center rounded-xl text-sm font-semibold ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {isSelected ? (isCurrent ? '✓ Current' : '● Selected') : 'Click to select'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6">
        <h2 className="text-lg font-bold text-secondary mb-4">Plan Usage</h2>
        <div className="space-y-3">
          {[
            { label: 'Investments', used: '—', limit: tier === 'free' ? '10' : '∞', pct: 0 },
            { label: 'Projection years', used: '—', limit: tier === 'free' ? '5' : '50', pct: 0 },
            { label: 'Tax calculators', used: tier === 'free' ? '1' : '4', limit: '4', pct: tier === 'free' ? 25 : 100 },
            { label: 'Users', used: '1', limit: tier === 'couples' ? '2' : '1', pct: tier === 'couples' ? 50 : 100 },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-secondary">{item.label}</span>
                <span className="text-xs text-slate-500">{item.used} / {item.limit}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
