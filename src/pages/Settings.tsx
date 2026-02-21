import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';

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
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    occupation: '',
    preferredCurrency: currency,
    notifications: {
      email: true,
      push: false,
      weekly: true
    }
  });

  const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'INR'];
  const countries = [
    'Germany', 'United States', 'United Kingdom', 'Switzerland', 'France', 
    'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Japan', 'Australia', 
    'Canada', 'India', 'Singapore', 'United Arab Emirates', 'Other'
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          fullName: data.fullName || '',
          email: user.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          postalCode: data.postalCode || '',
          dateOfBirth: data.dateOfBirth || '',
          occupation: data.occupation || '',
          preferredCurrency: data.preferredCurrency || currency,
          notifications: data.notifications || {
            email: true,
            push: false,
            weekly: true
          }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date()
      }, { merge: true });

      // Update currency if changed
      if (profile.preferredCurrency !== currency) {
        setCurrency(profile.preferredCurrency);
      }

      showToast('Settings saved successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save settings. Please try again.');
      setSaving(false);
    }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateNotification = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-surface-900-500 font-medium">Loading settings...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="page-title">Settings</h1>
            <p className="text-surface-900-500">Manage your account preferences and personal information</p>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">👤</span>
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => updateProfile('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl bg-secondary-50 text-surface-900-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                  placeholder="+49 123 456 7890"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => updateProfile('occupation', e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              Address
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => updateProfile('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => updateProfile('city', e.target.value)}
                  placeholder="Munich"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => updateProfile('postalCode', e.target.value)}
                  placeholder="80331"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Country</label>
                <select
                  value={profile.country}
                  onChange={(e) => updateProfile('country', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-surface-900-700 mb-2">Preferred Currency</label>
                <select
                  value={profile.preferredCurrency}
                  onChange={(e) => updateProfile('preferredCurrency', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔔</span>
              Notifications
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors">
                <div>
                  <div className="font-semibold text-surface-900-900">Email Notifications</div>
                  <div className="text-sm text-surface-900-500">Receive updates via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.notifications.email}
                  onChange={(e) => updateNotification('email', e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors">
                <div>
                  <div className="font-semibold text-surface-900-900">Push Notifications</div>
                  <div className="text-sm text-surface-900-500">Receive push notifications on your device</div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.notifications.push}
                  onChange={(e) => updateNotification('push', e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors">
                <div>
                  <div className="font-semibold text-surface-900-900">Weekly Summary</div>
                  <div className="text-sm text-surface-900-500">Get a weekly summary of your portfolio</div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.notifications.weekly}
                  onChange={(e) => updateNotification('weekly', e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={loadProfile}
              className="px-8 py-3 bg-slate-200 text-surface-900-700 rounded-xl font-semibold hover:bg-secondary-300 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
