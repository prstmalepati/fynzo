import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLocale } from '../context/LocaleContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';
import { SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES, getDefaultCurrency, SupportedCurrency } from '../constants/countries';

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
    preferredCurrency: currency, locale: locale,
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
          locale: d.locale || locale,
          notifications: d.notifications || { email: true, push: false, weekly: true }
        });
      }
    } catch (err) { console.error('Error loading profile:', err); }
    finally { setLoading(false); }
  };

  const handleCountryChange = (countryName: string) => {
    updateProfile('country', countryName);
    // Auto-set currency based on country
    const defaultCurr = getDefaultCurrency(countryName);
    updateProfile('preferredCurrency', defaultCurr);
    setCurrency(defaultCurr);

    // If Germany, suggest German locale
    if (countryName === 'Germany' || countryName === 'Austria') {
      // Don't force, just set default
    }
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

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8 mb-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            {t('settings.personalInfo')}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.fullName')}</label>
              <input type="text" value={profile.fullName} onChange={e => updateProfile('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.email')}</label>
              <input type="email" value={profile.email} disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.phone')}</label>
              <input type="tel" value={profile.phone} onChange={e => updateProfile('phone', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.dob')}</label>
              <input type="date" value={profile.dateOfBirth} onChange={e => updateProfile('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.occupation')}</label>
              <input type="text" value={profile.occupation} onChange={e => updateProfile('occupation', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8 mb-6">
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/8 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            {t('settings.address')}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.country')}</label>
              <select value={profile.country} onChange={e => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary bg-white">
                <option value="">{t('settings.selectCountry')}</option>
                {SUPPORTED_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {isGerman ? c.nameDE : c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.streetAddress')}</label>
              <input type="text" value={profile.address} onChange={e => updateProfile('address', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.city')}</label>
              <input type="text" value={profile.city} onChange={e => updateProfile('city', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.postalCode')}</label>
              <input type="text" value={profile.postalCode} onChange={e => updateProfile('postalCode', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
            </div>
          </div>
        </div>

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
