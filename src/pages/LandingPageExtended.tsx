import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Country-specific financial profiles
const COUNTRY_PROFILES = [
  {
    flag: '🇩🇪', country: 'Germany', currency: '€', goal: '€1.2M',
    tagline: 'Ehegattensplitting, Riester, 42% Spitzensteuersatz — we calculate it all.',
    features: ['German tax optimizer (2025)', 'Kirchensteuer by Bundesland', 'Grundfreibetrag tracking', 'ETF Sparplan projections'],
  },
  {
    flag: '🇺🇸', country: 'United States', currency: '$', goal: '$1.5M',
    tagline: '401(k), Roth IRA, state taxes — plan your path to financial independence.',
    features: ['Federal + State tax calculator', '401(k) & HSA optimization', 'FIRE number projections', 'Social Security integration'],
  },
  {
    flag: '🇨🇦', country: 'Canada', currency: 'C$', goal: 'C$1.8M',
    tagline: 'RRSP, TFSA, CPP — maximize every registered account.',
    features: ['Federal + Provincial tax', 'RRSP contribution optimizer', 'CPP & EI breakdowns', 'TFSA growth projections'],
  },
  {
    flag: '🇮🇳', country: 'India', currency: '₹', goal: '₹8Cr',
    tagline: 'New vs Old regime, 80C, NPS — see your true take-home.',
    features: ['New & Old regime comparison', 'Section 80C/80D optimizer', 'NPS tax benefit calculator', 'EPF & gratuity projections'],
  },
  {
    flag: '🇪🇺', country: 'Europe', currency: '€', goal: '€1M',
    tagline: 'Multi-currency portfolio tracking for expats and Europeans.',
    features: ['Live exchange rates (XE)', 'Multi-currency portfolios', 'Cross-border tax awareness', 'EUR/GBP/CHF support'],
  },
];

export default function LandingPageExtended() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCountry, setActiveCountry] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-rotate country profiles
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCountry(prev => (prev + 1) % COUNTRY_PROFILES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const profile = COUNTRY_PROFILES[activeCountry];

  return (
    <div className="min-h-screen bg-white antialiased">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-transparent.png" alt="myfynzo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold text-secondary tracking-tight font-display">myfynzo</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-slate-500 hover:text-secondary transition-colors font-medium">Features</a>
            <a href="#countries" className="text-slate-500 hover:text-secondary transition-colors font-medium">Countries</a>
            <a href="#pricing" className="text-slate-500 hover:text-secondary transition-colors font-medium">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-600 hover:text-secondary font-medium transition-colors">Sign In</Link>
            <Link to="/signup" className="px-5 py-2 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 px-6 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            {/* Country pill — dynamic */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 mb-6 shadow-sm">
              <span className="text-base">{profile.flag}</span>
              <span className="font-medium">Built for {profile.country}</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-secondary leading-[1.1] tracking-tight mb-6 font-display">
              Know your real numbers.
              <br />
              <span className="text-primary">Plan with clarity.</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed mb-8 max-w-2xl">
              myfynzo is a wealth management platform for people who take their money seriously.
              Track investments, calculate taxes, model scenarios, and build your path to financial independence — tailored to your country.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/signup"
                className="px-7 py-3.5 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10">
                Start Free — No Card Required
              </Link>
              <a href="#features"
                className="px-7 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all">
                See Features
              </a>
            </div>

            {/* Trust — honest, minimal */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              {['Free forever tier', 'Bank-level encryption', 'GDPR compliant', 'EU-hosted data'].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Modules Grid ──────────────────────────────────── */}
      <section id="features" className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">What you get</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight font-display">
              Eight modules. One platform.
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl">Every tool a serious wealth builder needs — from daily tracking to decade-long projections.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>, title: 'Dashboard', desc: 'Portfolio overview with live market data and performance tracking.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>, title: 'Investments', desc: 'Track stocks, ETFs, crypto with live prices via Twelve Data.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>, title: 'FIRE Calculator', desc: 'Financial independence projections with real inflation rates.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>, title: 'Tax Calculators', desc: 'Country-specific: DE, US, CA, IN — updated for 2025.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>, title: 'Lifestyle Basket', desc: 'Track luxury inflation — Porsche, private school, real estate.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: 'Scenario Branching', desc: 'Model life decisions — job change, relocation, kids, sabbatical.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></svg>, title: 'Goal Tracker', desc: 'Set financial goals with progress tracking and target dates.' },
              { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>, title: 'Anti-Portfolio', desc: 'Track missed opportunities and learn from investment regrets.' },
            ].map((mod, i) => (
              <div key={i} className="group p-5 rounded-2xl border border-slate-100 hover:border-primary/20 bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/[0.08] flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  {mod.icon}
                </div>
                <h3 className="font-bold text-secondary text-sm mb-1">{mod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Country-Specific Section ──────────────────────── */}
      <section id="countries" className="py-20 lg:py-28 px-6 bg-slate-50/80">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Country-aware</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight font-display">
              Your country. Your rules. Your numbers.
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl">Tax brackets, social security, inflation rates — all calibrated to where you live.</p>
          </div>

          {/* Country selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {COUNTRY_PROFILES.map((c, i) => (
              <button key={i} onClick={() => setActiveCountry(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCountry === i
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <span className="text-base">{c.flag}</span>
                {c.country}
              </button>
            ))}
          </div>

          {/* Country detail card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{profile.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary font-display">{profile.country}</h3>
                    <p className="text-sm text-slate-500">Target: {profile.goal} financial independence</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{profile.tagline}</p>
                <div className="space-y-3">
                  {profile.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/signup" className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10">
                  Start with {profile.country} Profile →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-secondary p-8 lg:p-10 text-white flex flex-col justify-center">
                <div className="text-sm text-white/50 uppercase tracking-wider mb-2 font-semibold">Financial Independence Target</div>
                <div className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight font-display">{profile.goal}</div>
                <div className="text-white/60 text-sm leading-relaxed mb-6">
                  Calculated using {profile.country}-specific tax rules, social security contributions, inflation rates, and cost of living data.
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tax Calculator', status: 'Live' },
                    { label: 'Live Prices', status: 'Live' },
                    { label: 'Exchange Rates', status: 'Live' },
                    { label: 'Language', status: profile.country === 'Germany' ? 'DE/EN' : 'EN' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-xs">
                      <div className="text-white/40">{item.label}</div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">3 steps</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight font-display">
              From signup to clarity in under 5 minutes.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set your country', desc: 'Select your country and currency. Tax rules, language, and defaults adapt automatically.', accent: 'bg-primary' },
              { step: '02', title: 'Add your portfolio', desc: 'Enter investments, goals, and lifestyle items. Live prices update automatically via market data.', accent: 'bg-blue-600' },
              { step: '03', title: 'See your real numbers', desc: 'Tax-aware projections, FIRE calculations, and scenario modeling — all calibrated to your reality.', accent: 'bg-emerald-600' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className={`w-8 h-8 ${s.accent} rounded-lg flex items-center justify-center text-white text-xs font-bold mb-4`}>{s.step}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28 px-6 bg-slate-50/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight font-display">
              Start free. Upgrade when it makes sense.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all">
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Free</div>
              <div className="text-4xl font-bold text-secondary mb-1 font-display">€0</div>
              <div className="text-sm text-slate-500 mb-6">Forever. No card required.</div>
              <ul className="space-y-3 mb-8">
                {['Up to 10 investments', 'Dashboard + Goal Tracker', 'FIRE & Retirement calculators', '1 tax calculator (your country)', 'Live exchange rates'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-secondary rounded-2xl p-8 text-white relative overflow-hidden hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-8 translate-x-8" />
              <div className="relative">
                <div className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Premium</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold font-display">€2.99</span>
                  <span className="text-white/60">/month</span>
                </div>
                <div className="text-sm text-white/50 mb-6">or €29/year — save 19%</div>
                <ul className="space-y-3 mb-8">
                  {['Everything in Free', 'Unlimited investments', 'All 4 tax calculators', 'Lifestyle Basket + Truth Score', 'Scenario Branching', 'Anti-Portfolio tracking', '50-year wealth projections', 'Live market prices', 'Priority support'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="block w-full py-3 text-center bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                  Start 30-Day Free Trial
                </Link>
                <p className="text-xs text-white/40 text-center mt-3">Cancel anytime. 30-day money-back guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight mb-4 font-display">
            Your financial clarity starts here.
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join people in Germany, the US, Canada, India, and across Europe who are building wealth with real numbers.
          </p>
          <Link to="/signup"
            className="inline-block px-8 py-4 bg-secondary text-white rounded-xl font-semibold text-lg hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10">
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo-transparent.png" alt="myfynzo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-secondary font-display">myfynzo</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wealth management for people who take their money seriously. Built in Germany, available worldwide.
              </p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Countries', href: '#countries' }] },
              { title: 'Legal', links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }, { label: 'GDPR', href: '#' }] },
              { title: 'Connect', links: [{ label: 'support@myfynzo.com', href: 'mailto:support@myfynzo.com' }, { label: 'Twitter', href: '#' }, { label: 'LinkedIn', href: '#' }] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-secondary mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href={link.href} className="text-xs text-slate-400 hover:text-primary transition-colors">{link.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-400">© 2026 myfynzo. Built in Frankfurt, Germany.</p>
            <div className="flex gap-3 text-xs text-slate-400">
              {COUNTRY_PROFILES.map((c, i) => <span key={i}>{c.flag}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
