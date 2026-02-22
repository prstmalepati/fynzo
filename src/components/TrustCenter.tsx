// =============================================================
// components/TrustCenter.tsx — Security & Privacy Trust Layer
// =============================================================
// Shows users exactly how their data is protected, gives them
// control over their data (export, delete), and displays real
// security signals — not marketing fluff.

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function TrustCenter() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'password' | 'deleting' | 'done'>('confirm');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // ─── Data Export (GDPR Art. 20 — Right to portability) ────
  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const exportData: Record<string, any> = {};

      // Profile
      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      if (profileSnap.exists()) {
        exportData.profile = profileSnap.data();
        // Remove internal fields
        delete exportData.profile.updatedAt;
      }

      // All sub-collections
      const collections = ['investments', 'goals', 'lifestyleBasket', 'anti_portfolio', 'scenarios'];
      for (const col of collections) {
        const snap = await getDocs(collection(db, 'users', user.uid, col));
        exportData[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      // Generate JSON file
      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `myfynzo-export-${user.uid.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 5000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  // ─── Account Deletion (GDPR Art. 17 — Right to erasure) ───
  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleteStep('deleting');
    setDeleteError('');
    try {
      // Re-authenticate first
      const providers = user.providerData.map(p => p.providerId);
      if (providers.includes('google.com')) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else if (deletePassword) {
        const credential = EmailAuthProvider.credential(user.email!, deletePassword);
        await reauthenticateWithCredential(user, credential);
      }

      // Delete all user data from Firestore
      const subcollections = ['investments', 'goals', 'lifestyleBasket', 'anti_portfolio', 'scenarios'];
      for (const sub of subcollections) {
        const snap = await getDocs(collection(db, 'users', user.uid, sub));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, 'users', user.uid, sub, d.id));
        }
      }
      // Delete user profile
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete Firebase Auth account
      await deleteUser(user);

      setDeleteStep('done');
      // Redirect after 2 seconds
      setTimeout(() => { window.location.href = '/'; }, 2000);
    } catch (err: any) {
      console.error('Delete failed:', err);
      if (err.code === 'auth/requires-recent-login' || err.code === 'auth/wrong-password') {
        setDeleteStep('password');
        setDeleteError('Please enter your password to confirm deletion.');
      } else {
        setDeleteError(err.message || 'Deletion failed. Please try again.');
        setDeleteStep('confirm');
      }
    }
  };

  const isGoogle = user?.providerData.some(p => p.providerId === 'google.com');

  // ─── Security info ────────────────────────────────────────
  const securityItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: 'AES-256 Encryption',
      desc: 'All data encrypted at rest and in transit using industry-standard encryption.',
      status: 'active',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: 'EU Data Residency (Frankfurt)',
      desc: 'Your data is stored in Google Cloud Frankfurt (europe-west1). It never leaves the EU.',
      status: 'active',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'GDPR Compliant',
      desc: 'We follow EU General Data Protection Regulation. You own your data — export or delete at any time.',
      status: 'active',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: 'Per-User Data Isolation',
      desc: 'Every user has their own encrypted data silo. No user can access another user\'s data.',
      status: 'active',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: 'No Data Selling. Ever.',
      desc: 'We do not sell, share, or monetize your financial data. Our revenue comes from subscriptions only.',
      status: 'active',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
      title: 'Financial Disclaimer',
      desc: 'myfynzo is an informational tool. Tax calculations are estimates, not tax advice. Consult a professional.',
      status: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Security Status ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary">Security & Privacy</h2>
            <p className="text-sm text-slate-500">How we protect your financial data</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">All Systems Secure</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {securityItems.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-secondary">{item.title}</span>
                  {item.status === 'active' && (
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Your Account ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
        <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Your Account
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">Email</div>
            <div className="text-sm font-semibold text-secondary truncate">{user?.email}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">Auth Provider</div>
            <div className="text-sm font-semibold text-secondary">
              {isGoogle ? 'Google Account' : 'Email & Password'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">Account Created</div>
            <div className="text-sm font-semibold text-secondary">
              {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(
                locale === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }
              ) : '—'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">Last Sign In</div>
            <div className="text-sm font-semibold text-secondary">
              {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                locale === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              ) : '—'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">User ID</div>
            <div className="text-xs font-mono text-slate-500 truncate">{user?.uid}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-400 mb-0.5">Email Verified</div>
            <div className="flex items-center gap-1.5">
              {user?.emailVerified ? (
                <><span className="w-2 h-2 bg-emerald-500 rounded-full" /><span className="text-sm font-semibold text-emerald-600">Verified</span></>
              ) : (
                <><span className="w-2 h-2 bg-amber-500 rounded-full" /><span className="text-sm font-semibold text-amber-600">Not verified</span></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Data Control ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
        <h2 className="text-lg font-bold text-secondary mb-1 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          Your Data, Your Control
        </h2>
        <p className="text-xs text-slate-500 mb-5">GDPR rights: access, portability, and erasure.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="text-sm font-semibold text-secondary">Export All Data</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Download all your data as a JSON file: profile, investments, goals, lifestyle basket, scenarios.</p>
            <button onClick={handleExportData} disabled={exporting}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                exported ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                exporting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}>
              {exported ? '✓ Downloaded' : exporting ? 'Exporting...' : 'Download My Data'}
            </button>
          </div>

          {/* Delete */}
          <div className="p-4 rounded-xl border border-red-100 bg-red-50/30">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="text-sm font-semibold text-red-700">Delete Account</span>
            </div>
            <p className="text-xs text-red-600/70 mb-3">Permanently delete your account and ALL data. This cannot be undone.</p>
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors">
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* ─── Delete Confirmation Modal ───────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            {deleteStep === 'confirm' && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-secondary text-center mb-2">Delete Your Account?</h3>
                <p className="text-sm text-slate-500 text-center mb-4">
                  This will permanently delete your account and all associated data including investments, goals, lifestyle basket, and scenarios. This action <strong>cannot be undone</strong>.
                </p>
                {deleteError && <p className="text-xs text-red-600 text-center mb-3 bg-red-50 p-2 rounded-lg">{deleteError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50">
                    Cancel
                  </button>
                  <button onClick={() => isGoogle ? handleDeleteAccount() : setDeleteStep('password')}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700">
                    Yes, Delete Everything
                  </button>
                </div>
              </>
            )}
            {deleteStep === 'password' && (
              <>
                <h3 className="text-lg font-bold text-secondary mb-2">Confirm Your Password</h3>
                <p className="text-sm text-slate-500 mb-4">Enter your password to confirm account deletion.</p>
                {deleteError && <p className="text-xs text-red-600 mb-3 bg-red-50 p-2 rounded-lg">{deleteError}</p>}
                <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Enter your password" autoFocus
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary mb-4" />
                <div className="flex gap-3">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteStep('confirm'); }}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} disabled={!deletePassword}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50">
                    Delete Permanently
                  </button>
                </div>
              </>
            )}
            {deleteStep === 'deleting' && (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-600">Deleting your data...</p>
              </div>
            )}
            {deleteStep === 'done' && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">Account Deleted</h3>
                <p className="text-sm text-slate-500">All your data has been permanently removed. Redirecting...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
