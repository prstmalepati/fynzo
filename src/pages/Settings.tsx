import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLocale } from '../context/LocaleContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '../constants/countries';

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
  preferredCurrency: string;
  locale: string;
  projectionYears: number;
  notifications: { email: boolean; push: boolean; weekly: boolean };
}

export default function Settings() {
  const { user } = useAuth();
  const { currency, setCurrency, exchangeRates, ratesLoading, ratesLastUpdated } = useCurrency();
  const { t, locale, setLocale, isGerman } = useLocale();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '', email: user?.email || '', phone: '', address: '', city: '',
    country: '', postalCode: '', dateOfBirth: '', occupation: '',
    preferredCurrency: currency, locale: locale, projectionYears: 10,
    notifications: { email: true, push: false, weekly: true }
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
          occupation: d.occupation || '', preferredCurrency: d.preferredCurrency || currency,
          locale: d.locale || locale, projectionYears: d.projectionYears || 10,
          notifications: d.notifications || { email: true, push: false, weekly: true }
        });
      }
    } catch (err) { console.error('Error loading profile:', err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'users', user!.uid), {
        ...profile, locale: locale, updatedAt: new Date()
      }, { merge: true });
      if (profile.preferredCurrency !== currency) {
        setCurrency(profile.preferredCurrency as SupportedCurrency);
      }
      showToast(t('settings.saved'), 'success');
    } catch (err) {
      showToast(t('settings.saveFailed'), 'error');
    } finally { setSaving(false); }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  const updateNotification = (field: string, value: boolean) => {
    setProfile(prev => ({ ...prev, notifications: { ...prev.notifications, [field]: value } }));
  };

  // XE-style exchange rate display
  const baseRates: { code: string; symbol: string }[] = [
    { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
    { code: 'CHF', symbol: 'CHF' }, { code: 'CAD', symbol: 'C$' }, { code: 'INR', symbol: '₹' },
  ];

  const getRate = (from: string, to: string) => {
    const fromRate = exchangeRates[from] || 1;
    const toRate = exchangeRates[to] || 1;
    return toRate / fromRate;
  };

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
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary font-display">{t('settings.title')}</h1>
          <p className="text-slate-500 mt-1">{t('settings.subtitle')}</p>
        </div>

        {/* Account link card */}
        <Link to="/account" className="block bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 mb-6 hover:border-primary/20 hover:shadow-card-hover transition-all group animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {(profile.fullName || user?.email || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold text-secondary">{profile.fullName || 'Set your name'}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:block">Profile, address & subscription</span>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Preferences: Currency + Language */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8 mb-6">
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/8 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              </svg>
            </div>
            {t('settings.preferences')}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.currency')}</label>
              <select value={profile.preferredCurrency}
                onChange={e => { updateProfile('preferredCurrency', e.target.value); setCurrency(e.target.value as SupportedCurrency); }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary bg-white">
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code} — {isGerman ? c.nameDE : c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.language')}</label>
              <div className="flex gap-2">
                <button onClick={() => setLocale('en')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    locale === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-slate-200 text-slate-600 hover:border-primary/30'
                  }`}>
                  <span>🇬🇧</span> English
                </button>
                <button onClick={() => setLocale('de')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    locale === 'de' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-slate-200 text-slate-600 hover:border-primary/30'
                  }`}>
                  <span>🇩🇪</span> Deutsch
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Dashboard Projection Period</label>
                <span className="text-sm font-bold text-primary">{profile.projectionYears} years</span>
              </div>
              <input type="range" min="5" max="50" step="5" value={profile.projectionYears}
                onChange={e => updateProfile('projectionYears', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5yr</span><span>10yr</span><span>20yr</span><span>30yr</span><span>50yr</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Controls the projected value shown on your Dashboard card</p>
            </div>
          </div>
        </div>

        {/* XE Exchange Rate Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {t('settings.exchangeRates')}
            </h2>
            <div className="flex items-center gap-2">
              {ratesLastUpdated && (
                <span className="text-xs text-slate-400">
                  {new Date(ratesLastUpdated).toLocaleTimeString(locale === 'de' ? 'de-DE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
            </div>
          </div>

          {ratesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {baseRates.filter(r => r.code !== currency).map(target => {
                const rate = getRate(currency, target.code);
                return (
                  <div key={target.code} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500">{currency} → {target.code}</span>
                    </div>
                    <div className="text-lg font-bold text-secondary">{target.symbol}{rate.toFixed(rate > 10 ? 2 : 4)}</div>
                    <div className="text-xs text-slate-400">1 {currency} = {rate.toFixed(4)} {target.code}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('settings.poweredByXE')}</span>
            <a href="https://www.xe.com" target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium">xe.com →</a>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8 mb-6">
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/8 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            {t('settings.notifications')}
          </h2>
          <div className="space-y-3">
            {[
              { key: 'email', title: t('settings.emailNotif'), desc: t('settings.emailNotifDesc') },
              { key: 'push', title: t('settings.pushNotif'), desc: t('settings.pushNotifDesc') },
              { key: 'weekly', title: t('settings.weeklyNotif'), desc: t('settings.weeklyNotifDesc') },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                <div>
                  <div className="font-semibold text-secondary text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only"
                    checked={(profile.notifications as any)[item.key]}
                    onChange={e => updateNotification(item.key, e.target.checked)} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${(profile.notifications as any)[item.key] ? 'bg-primary' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(profile.notifications as any)[item.key] ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Security & Privacy link */}
        <Link to="/security" className="block bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 mb-6 hover:border-primary/20 hover:shadow-card-hover transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary">Security & Privacy</h2>
                <p className="text-xs text-slate-500">Data protection, GDPR rights, export & delete your data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-700">Secure</span>
              </div>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Save */}
        <div className="flex justify-end gap-3 animate-fadeIn">
          <button onClick={loadProfile}
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            {t('settings.reset')}
          </button>
          <button onClick={handleSave} disabled={saving}
            className={`px-8 py-3 rounded-xl font-semibold transition-all text-white flex items-center gap-2 ${
              saving ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
            }`}>
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('settings.saving')}</>
            ) : (
              <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>{t('settings.save')}</>
            )}
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
