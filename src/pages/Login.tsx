import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithMicrosoft, signInWithApple, sendPhoneVerification, verifyPhoneCode } from '../firebase/auth';
import { ConfirmationResult } from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setLoading(true);
    setError('');

    let result;
    if (provider === 'google') {
      result = await signInWithGoogle();
    } else if (provider === 'microsoft') {
      result = await signInWithMicrosoft();
    } else {
      result = await signInWithApple();
    }

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError('');

    const result = await sendPhoneVerification(phoneNumber, 'recaptcha-container');
    
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.confirmation) {
      setConfirmation(result.confirmation);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmation) return;

    setLoading(true);
    setError('');

    const result = await verifyPhoneCode(confirmation, verificationCode);
    
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-3xl">f</span>
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Welcome to Fynzo
          </h1>
          <p className="text-slate-600" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Sign in to start planning your financial future
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Microsoft */}
            <button
              onClick={() => handleSocialLogin('microsoft')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z"/>
                <path fill="#81bc06" d="M12 0h11v11H12z"/>
                <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                <path fill="#ffba08" d="M12 12h11v11H12z"/>
              </svg>
              Continue with Microsoft
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-slate-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Phone Number */}
            <button
              onClick={() => setShowPhoneInput(!showPhoneInput)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Continue with Phone
            </button>
          </div>

          {/* Phone Input Section */}
          {showPhoneInput && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              {!confirmation ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+49 123 456 7890"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Include country code (e.g., +49 for Germany)
                    </p>
                  </div>
                  <button
                    onClick={handleSendCode}
                    disabled={loading || !phoneNumber}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                  <div id="recaptcha-container"></div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Enter the 6-digit code sent to {phoneNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationCode}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center mt-6">
            By continuing, you agree to Fynzo's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
