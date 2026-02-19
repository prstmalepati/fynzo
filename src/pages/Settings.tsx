import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { auth } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import SidebarLayout from '../components/SidebarLayout';
import { useNavigate } from 'react-router-dom';

type Currency = 'EUR' | 'USD' | 'GBP' | 'INR' | 'CAD';

export default function Settings() {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditingName, setIsEditingName] = useState(false);

  const currencies: { code: Currency; name: string; symbol: string; flag: string }[] = [
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦' }
  ];

  const handleCurrencyChange = async (newCurrency: Currency) => {
    setSaving(true);
    await setCurrency(newCurrency);
    setTimeout(() => setSaving(false), 500);
  };

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      alert('Display name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      await updateProfile(auth.currentUser!, {
        displayName: displayName.trim()
      });
      setIsEditingName(false);
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      console.error('Error updating display name:', error);
      alert('Failed to update display name');
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out');
    }
  };

  return (
    <SidebarLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Settings
          </h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 mb-6">
          <h2 className="text-2xl font-bold text-secondary mb-6">Account Information</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm text-slate-600 mb-1">Email Address</div>
                <div className="font-semibold text-secondary">{user?.email}</div>
              </div>
            </div>

            {/* Display Name - Editable */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-1">Display Name</div>
                {isEditingName ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleUpdateDisplayName}
                      disabled={saving}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-all font-semibold text-sm disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setDisplayName(user?.displayName || '');
                        setIsEditingName(false);
                      }}
                      className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-secondary">
                      {user?.displayName || 'Not set'}
                    </div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-sm text-primary hover:text-teal-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm text-slate-600 mb-1">Account Type</div>
                <div className="font-semibold text-secondary">Free Plan</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-primary to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* Currency Section */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary">Currency Preferences</h2>
              <p className="text-sm text-slate-600 mt-1">
                All amounts will display in your selected currency
              </p>
            </div>
            {saving && (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                ✓ Saved
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  currency === curr.code
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-slate-200 hover:border-primary hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{curr.flag}</span>
                    <div>
                      <div className="font-bold text-secondary">{curr.code}</div>
                      <div className="text-xs text-slate-600">{curr.name}</div>
                    </div>
                  </div>
                  {currency === curr.code && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-primary">{curr.symbol}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="text-sm text-blue-900">
                <strong>Tip:</strong> Your currency preference is saved and will apply to all pages including Dashboard, Investments, Projections, and Calculators.
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 bg-orange-50">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">Account Actions</h2>
          
          <div className="space-y-4">
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-4 bg-white border-2 border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50 transition-all font-bold text-left flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-orange-900">Sign Out</div>
                <div className="text-sm text-orange-600">You'll need to log in again</div>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* Delete Account */}
            <div className="p-4 bg-white rounded-xl border-2 border-red-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-900">Delete Account</div>
                  <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                </div>
                <button 
                  onClick={() => alert('Account deletion is currently disabled. Please contact support.')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}
