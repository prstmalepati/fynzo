import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPageExtended() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('lifestyle');
  const [email, setEmail] = useState('');
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to email service
    setShowEmailSuccess(true);
    setTimeout(() => setShowEmailSuccess(false), 3000);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal-600 rounded-xl blur opacity-75"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-slate-700 bg-clip-text text-transparent" style={{ fontFamily: "'Crimson Pro', serif" }}>
              myfynzo
            </span>
            <span className="ml-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              BETA
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-primary transition-colors font-medium group">
              Features
              <div className="h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
            <a href="#calculator" className="text-slate-600 hover:text-primary transition-colors font-medium group">
              Calculator
              <div className="h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors font-medium group">
              How It Works
              <div className="h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-primary transition-colors font-medium group">
              Pricing
              <div className="h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-primary hover:text-teal-700 font-semibold transition-colors">
              Sign In
            </Link>
            <Link 
              to="/login"
              className="group px-6 py-2 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Effects */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-full">
            <div 
              className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
              style={{ 
                transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.5}px)`,
                animationDuration: '8s'
              }}
            />
            <div 
              className="absolute w-[600px] h-[600px] bg-teal-400/15 rounded-full blur-3xl top-1/3 -right-48 animate-pulse"
              style={{ 
                transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.3}px)`,
                animationDuration: '10s'
              }}
            />
            <div 
              className="absolute w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse"
              style={{ 
                transform: `translate(${scrollY * 0.15}px, ${-scrollY * 0.2}px)`,
                animationDuration: '12s'
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Enhanced Copy */}
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-wrap gap-3">
                <div className="group px-4 py-2 bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/20 rounded-full text-primary font-semibold text-sm backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                  <span className="flex items-center gap-2">
                    ⚡ Lightning Fast Setup
                  </span>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-700 font-semibold text-sm backdrop-blur-sm">
                  ✓ 2,147 Users Already Saved
                </div>
              </div>

              <div>
                <h1 className="text-6xl lg:text-8xl font-bold text-secondary leading-[0.95] mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Your{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                      €2M Goal
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 10C67.3333 4 132.667 4 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#14B8A6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <br />
                  Is Actually{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      €2.7M
                    </span>
                    <span className="absolute -top-6 -right-12 text-2xl animate-bounce">🚨</span>
                  </span>
                </h1>

                <p className="text-2xl text-slate-600 leading-relaxed font-light">
                  <strong className="font-bold text-primary">Luxury lifestyles inflate 3x faster</strong> than CPI. 
                  <br />
                  Track YOUR real inflation. See YOUR truth score.
                  <br />
                  <span className="text-slate-500">Plan with reality, not fantasy.</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="group relative px-10 py-5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-2xl hover:shadow-2xl transition-all font-bold text-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Free Trial
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-white transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </Link>
                
                <button className="group px-10 py-5 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl hover:shadow-xl hover:border-primary transition-all font-bold text-xl backdrop-blur-sm">
                  <span className="flex items-center gap-3">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    Watch 2-Min Demo
                  </span>
                </button>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-600 border-3 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">2,147+ users</div>
                    <div className="text-xs text-slate-500">and growing daily</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} className="w-5 h-5 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">4.9/5 rating</div>
                    <div className="text-xs text-slate-500">from 437 reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">Bank-level security</div>
                    <div className="text-xs text-slate-500">256-bit encryption</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Interactive Demo */}
            <div className="relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-400/30 rounded-[3rem] blur-3xl transform rotate-6"></div>
              <div className="relative perspective-1000">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 border border-white/20 transform hover:scale-[1.02] transition-all duration-500">
                  <EnhancedTruthScoreDemo />
                </div>
              </div>
              
              {/* Floating Stats */}
              <FloatingStatCard 
                icon="📈" 
                value="+6%" 
                label="Luxury inflation" 
                position="top-4 -left-12"
                delay={0.5}
              />
              <FloatingStatCard 
                icon="💰" 
                value="€700K" 
                label="Avg gap found" 
                position="bottom-8 -right-12"
                delay={0.7}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Counter */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedStat end={2147} label="Active Users" prefix="" suffix="+" duration={2000} />
            <AnimatedStat end={35} label="Avg Gap Found" prefix="" suffix="%" duration={2500} />
            <AnimatedStat end={740000} label="Total Saved" prefix="€" suffix="" duration={3000} />
            <AnimatedStat end={4.9} label="User Rating" prefix="" suffix="/5" duration={2000} decimals={1} />
          </div>
        </div>
      </section>

      {/* Interactive Live Calculator */}
      <section id="calculator" className="py-24 px-6 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
              Try It Now
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Calculate Your Truth Score
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See the real cost of your lifestyle in 30 seconds
            </p>
          </div>

          <LiveInflationCalculator />
        </div>
      </section>

      {/* Problem Section - Enhanced */}
      <section className="py-24 px-6 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full text-red-600 font-semibold text-sm mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              The Hidden Inflation Trap
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              You're Planning With
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                The Wrong Numbers
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Most retirement calculators use generic 2% CPI inflation. But that's for average people buying milk and bread. 
              <strong className="text-red-600"> You're not average.</strong>
            </p>
          </div>

          <ComparisonTable />

          {/* Visual Impact Chart */}
          <div className="mt-16 bg-white rounded-3xl p-10 border-2 border-red-200 shadow-xl">
            <h3 className="text-3xl font-bold text-center text-secondary mb-10">
              What This Means Over Time
            </h3>
            <InflationImpactChart />
          </div>
        </div>
      </section>

      {/* Features Deep Dive - Interactive Tabs */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              More Than a Calculator.
              <br />
              A <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Flight Simulator</span> for Life.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just track wealth. Model every decision before you make it.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex bg-slate-100 rounded-2xl p-2">
              {[
                { id: 'lifestyle', label: '🛒 Lifestyle Basket', badge: 'NEW' },
                { id: 'fire', label: '🔥 FIRE Calculator' },
                { id: 'tax', label: '🇩🇪 Tax Optimizer' },
                { id: 'scenarios', label: '🎯 Scenarios', badge: 'SOON' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-slate-200">
            {activeTab === 'lifestyle' && <LifestyleBasketFeature />}
            {activeTab === 'fire' && <FIRECalculatorFeature />}
            {activeTab === 'tax' && <TaxOptimizerFeature />}
            {activeTab === 'scenarios' && <ScenariosFeature />}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              From Chaos to Clarity
              <br />
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                In 3 Simple Steps
              </span>
            </h2>
          </div>

          <TimelineSteps />
        </div>
      </section>

      {/* Social Proof Wall */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Loved by Future Retirees
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands who discovered their real financial needs
            </p>
          </div>

          <TestimonialGrid />

          {/* Press Mentions */}
          <div className="mt-16 text-center">
            <div className="text-sm text-slate-500 mb-6">AS FEATURED IN</div>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <div className="text-2xl font-bold text-slate-400">TechCrunch</div>
              <div className="text-2xl font-bold text-slate-400">Product Hunt</div>
              <div className="text-2xl font-bold text-slate-400">Hacker News</div>
              <div className="text-2xl font-bold text-slate-400">Financial Times</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Enhanced */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
              Simple Pricing
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Start Free.
              <br />
              Upgrade When Ready.
            </h2>
            <p className="text-xl text-slate-600">
              No credit card required. Cancel anytime.
            </p>
          </div>

          <EnhancedPricingCards />

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                ✓
              </div>
              <div className="text-left">
                <div className="font-bold text-green-900">30-Day Money-Back Guarantee</div>
                <div className="text-sm text-green-700">Not happy? Get a full refund. No questions asked.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Email Capture CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-sm mb-6">
            🎁 Limited Time Offer
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Get the Complete
            <br />
            Truth Score Guide
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            Free 20-page guide reveals how luxury inflation is stealing your retirement
          </p>

          {showEmailSuccess ? (
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <div className="text-6xl mb-4">✅</div>
              <div className="text-2xl font-bold mb-2">Check your email!</div>
              <div className="opacity-90">We've sent you the complete guide.</div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl text-slate-900 text-lg focus:ring-4 focus:ring-white/50 outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-lg whitespace-nowrap"
                >
                  Get Guide →
                </button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Join 2,147+ subscribers. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-bold mb-8" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Stop Underestimating.
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Start Planning with Truth.
            </span>
          </h2>
          <p className="text-2xl text-slate-300 mb-10 leading-relaxed">
            The difference between retiring at 45 vs 52 is knowing your real numbers.
            <br />
            Don't waste 7 years of your life on bad assumptions.
          </p>
          <Link
            to="/login"
            className="inline-block group relative px-12 py-6 bg-gradient-to-r from-primary to-teal-600 text-white rounded-2xl hover:shadow-2xl transition-all font-bold text-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Get Your Truth Score Free
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <p className="text-sm text-slate-400 mt-6">
            No credit card required • 2,147 users started today
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold text-white" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  myfynzo
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Stop lying to yourself about inflation. Track YOUR real costs. Plan YOUR real future.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#calculator" className="hover:text-primary transition-colors">Calculator</a></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 myfynzo. Built with honesty. Stop lying to yourself about inflation.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

// Interactive Components for Extended Landing Page
// This file contains all the sub-components referenced in LandingPageExtended-Part1.tsx

import { useState, useEffect } from 'react';

// Floating Stat Card
export function FloatingStatCard({ 
  icon, 
  value, 
  label, 
  position, 
  delay = 0 
}: { 
  icon: string;
  value: string;
  label: string;
  position: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), delay * 1000);
  }, [delay]);

  return (
    <div 
      className={`hidden lg:block absolute ${position} transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-primary/20 backdrop-blur-sm animate-float">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </div>
    </div>
  );
}

// Animated Counter
export function AnimatedStat({ 
  end, 
  label, 
  prefix = '', 
  suffix = '', 
  duration = 2000,
  decimals = 0
}: {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(end * easeOutQuad);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-5xl font-bold mb-2">
        {prefix}{count.toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}{suffix}
      </div>
      <div className="text-slate-300 text-lg">{label}</div>
    </div>
  );
}

// Enhanced Truth Score Demo
export function EnhancedTruthScoreDemo() {
  const [animated, setAnimated] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 500);
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-bold mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Live Demo
        </div>
        <h3 className="text-3xl font-bold text-secondary mb-3">Your Truth Score</h3>
        <p className="text-slate-600">Based on typical luxury lifestyle</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="group p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all">
          <div className="text-sm text-slate-600 mb-2 font-semibold">What You Think</div>
          <div className="text-4xl font-bold text-slate-700 mb-1">€2.0M</div>
          <div className="text-xs text-slate-500">With 2% CPI inflation</div>
        </div>
        <div className="group p-6 bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-2xl border-2 border-primary hover:border-teal-600 transition-all">
          <div className="text-sm text-primary mb-2 font-semibold">What You Need</div>
          <div className="text-4xl font-bold text-primary mb-1">€2.7M</div>
          <div className="text-xs text-teal-700">With YOUR lifestyle inflation</div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-slate-600 font-semibold">Reality Gap</span>
          <span className="font-bold text-red-600 text-lg">+35%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: animated ? '35%' : '0%' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl">
            🚨
          </div>
          <div className="flex-1">
            <div className="font-bold text-red-900 text-lg mb-1">Gap: €700,000</div>
            <div className="text-sm text-red-700 leading-relaxed">
              That's <strong>3 extra years of work</strong> you didn't plan for.
              Your retirement at 45? Try 48.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className={`p-3 rounded-lg transition-all ${step === 0 ? 'bg-primary/20' : 'bg-slate-50'}`}>
          <div className="text-xs text-slate-600 mb-1">Step 1</div>
          <div className="text-sm font-bold">Add Items</div>
        </div>
        <div className={`p-3 rounded-lg transition-all ${step === 1 ? 'bg-primary/20' : 'bg-slate-50'}`}>
          <div className="text-xs text-slate-600 mb-1">Step 2</div>
          <div className="text-sm font-bold">See Inflation</div>
        </div>
        <div className={`p-3 rounded-lg transition-all ${step === 2 ? 'bg-primary/20' : 'bg-slate-50'}`}>
          <div className="text-xs text-slate-600 mb-1">Step 3</div>
          <div className="text-sm font-bold">Adjust Plan</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-xs text-slate-500">
          *Example: Porsche 911 + 2 kids in private school + London flat
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Live Inflation Calculator
export function LiveInflationCalculator() {
  const [items, setItems] = useState([
    { name: 'Porsche 911', cost: 180000, inflation: 6.0, selected: true },
    { name: 'Private School (2 kids)', cost: 50000, inflation: 4.5, selected: true },
    { name: 'London Apartment', cost: 1200000, inflation: 5.5, selected: false },
  ]);
  const [years, setYears] = useState(10);

  const selectedItems = items.filter(i => i.selected);
  const totalCost = selectedItems.reduce((sum, i) => sum + i.cost, 0);
  const avgInflation = selectedItems.reduce((sum, i) => sum + (i.inflation * i.cost), 0) / totalCost;
  const futureCostReal = totalCost * Math.pow(1 + avgInflation / 100, years);
  const futureCostCPI = totalCost * Math.pow(1.02, years);
  const gap = futureCostReal - futureCostCPI;
  const gapPercent = (gap / totalCost) * 100;

  return (
    <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-slate-200">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left - Controls */}
        <div>
          <h3 className="text-2xl font-bold text-secondary mb-6">Select Your Items</h3>
          
          <div className="space-y-4 mb-8">
            {items.map((item, i) => (
              <label key={i} className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary transition-all">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => {
                    const newItems = [...items];
                    newItems[i].selected = !newItems[i].selected;
                    setItems(newItems);
                  }}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-semibold text-secondary">{item.name}</div>
                  <div className="text-sm text-slate-600">€{item.cost.toLocaleString()} • {item.inflation}%/yr</div>
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Time Horizon: {years} years
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Right - Results */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-slate-200">
          <h3 className="text-2xl font-bold text-secondary mb-6">Your Results</h3>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-slate-600 mb-2">Total Cost Today</div>
              <div className="text-4xl font-bold text-secondary">
                €{(totalCost / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
                <div className="text-xs text-slate-600 mb-1">With CPI (2%)</div>
                <div className="text-2xl font-bold text-slate-600">
                  €{(futureCostCPI / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary">
                <div className="text-xs text-primary mb-1">With Reality ({avgInflation.toFixed(1)}%)</div>
                <div className="text-2xl font-bold text-primary">
                  €{(futureCostReal / 1000).toFixed(0)}K
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
              <div className="text-sm text-red-900 font-semibold mb-2">Reality Gap</div>
              <div className="text-5xl font-bold text-red-600 mb-2">
                +{gapPercent.toFixed(0)}%
              </div>
              <div className="text-lg font-bold text-red-700 mb-2">
                €{(gap / 1000).toFixed(0)}K difference
              </div>
              <div className="text-sm text-red-600">
                That's {((gap / 60000) / 12).toFixed(1)} extra years of work at €60K salary
              </div>
            </div>

            <button className="w-full px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg">
              Get My Full Truth Score →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Comparison Table
export function ComparisonTable() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* Generic CPI */}
      <div className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:shadow-xl transition-all">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            📊
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary">Generic CPI</h3>
            <p className="text-sm text-slate-600">What most use</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            'Milk and bread',
            'Gas and utilities',
            'Average rent',
            'Public transport',
            'Generic groceries'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-600">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 rounded-xl text-center">
          <div className="text-5xl font-bold text-slate-600 mb-2">2.0%</div>
          <div className="text-sm text-slate-500">Annual inflation</div>
        </div>
      </div>

      {/* Your Reality */}
      <div className="group bg-gradient-to-br from-red-600 via-red-700 to-orange-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🚨
            </div>
            <div>
              <h3 className="text-2xl font-bold">Your Reality</h3>
              <p className="text-sm opacity-90">What you actually buy</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { name: 'Porsche 911', rate: '+6.0%' },
              { name: 'Private School', rate: '+4.5%' },
              { name: 'Prime Real Estate', rate: '+5.5%' },
              { name: 'Luxury Watches', rate: '+8.0%' },
              { name: 'Fine Dining', rate: '+5.2%' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
                <span className="font-medium">{item.name}</span>
                <span className="font-bold text-lg">{item.rate}</span>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/20 backdrop-blur rounded-xl text-center">
            <div className="text-5xl font-bold mb-2">5.8%</div>
            <div className="text-sm opacity-90 mb-1">Average inflation</div>
            <div className="text-xs opacity-75 font-semibold">2.9x higher than CPI!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inflation Impact Chart
export function InflationImpactChart() {
  const years = [0, 5, 10, 15, 20];
  const cpiValues = years.map(y => 100 * Math.pow(1.02, y));
  const realValues = years.map(y => 100 * Math.pow(1.058, y));

  return (
    <div>
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {years.map((year, i) => (
          <div key={i} className="text-center">
            <div className="text-sm text-slate-600 mb-4 font-semibold">Year {year}</div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-100 rounded-xl">
                <div className="text-xs text-slate-600 mb-1">CPI 2%</div>
                <div className="text-2xl font-bold text-slate-700">
                  €{cpiValues[i].toFixed(0)}K
                </div>
              </div>
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="text-xs text-red-600 mb-1">Reality 5.8%</div>
                <div className="text-2xl font-bold text-red-600">
                  €{realValues[i].toFixed(0)}K
                </div>
              </div>
              {i > 0 && (
                <div className="text-xs text-red-600 font-semibold">
                  +€{(realValues[i] - cpiValues[i]).toFixed(0)}K gap
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
        <div className="text-center">
          <div className="text-sm text-red-900 font-semibold mb-2">
            After 20 years, the gap is <span className="text-2xl">€135K</span>
          </div>
          <div className="text-xs text-red-700">
            That's 2.25 years of salary (€60K) you didn't account for
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Tab Content Components
export function LifestyleBasketFeature() {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-4">
          NEW
        </div>
        <h3 className="text-4xl font-bold text-secondary mb-4">Lifestyle Basket</h3>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          Track 40+ luxury items with real inflation rates. See the truth about what you'll actually need.
        </p>

        <div className="space-y-4 mb-8">
          {[
            { icon: '🏎️', title: 'Supercars', desc: 'Track Porsche, Ferrari, Tesla at real 6% inflation' },
            { icon: '🏫', title: 'Private Education', desc: '4.5% inflation on UK/international schools' },
            { icon: '🏡', title: 'Prime Real Estate', desc: 'London, Swiss, Miami property at 5.5%' },
            { icon: '⌚', title: 'Luxury Goods', desc: 'Watches, jewelry, art at 8-14% growth' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <div className="font-bold text-secondary mb-1">{item.title}</div>
                <div className="text-sm text-slate-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-bold">
          Try Lifestyle Basket →
        </button>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-2xl p-8 border-2 border-primary/20">
        <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏎️</span>
              <div>
                <div className="font-bold text-secondary">Porsche 911 Turbo</div>
                <div className="text-xs text-slate-600">Supercar</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-600 mb-1">Today</div>
              <div className="text-2xl font-bold text-secondary">€180K</div>
            </div>
            <div>
              <div className="text-xs text-primary mb-1">In 2034</div>
              <div className="text-2xl font-bold text-primary">€287K</div>
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-sm text-amber-900 font-semibold mb-1">Inflation: 6.0%/year</div>
          <div className="text-xs text-amber-700">3x higher than CPI</div>
        </div>
      </div>
    </div>
  );
}

export function FIRECalculatorFeature() {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-4xl font-bold text-secondary mb-4">FIRE Calculator</h3>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          Calculate 4 types of FIRE simultaneously. See all paths to financial independence.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { type: 'Lean FIRE', amount: '€600K', desc: 'Minimal lifestyle' },
            { type: 'Regular FIRE', amount: '€1.2M', desc: 'Comfortable living' },
            { type: 'Fat FIRE', amount: '€3M+', desc: 'Luxury lifestyle' },
            { type: 'Barista FIRE', amount: '€800K', desc: 'Part-time work' }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl">
              <div className="text-xs text-slate-600 mb-1">{item.type}</div>
              <div className="text-2xl font-bold text-primary mb-1">{item.amount}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔥</div>
          <div className="text-3xl font-bold text-secondary mb-2">Your FIRE Number</div>
          <div className="text-5xl font-bold text-primary mb-2">€1.2M</div>
          <div className="text-sm text-slate-600">Based on €40K/year spending</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-slate-600">4% rule target</span>
            <span className="font-bold">€1.0M</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-slate-600">Inflation buffer</span>
            <span className="font-bold text-amber-600">+€200K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaxOptimizerFeature() {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🇩🇪</span>
          <h3 className="text-4xl font-bold text-secondary">German Tax Calculator</h3>
        </div>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          2026 rates. Kindergeld €259. All 16 Bundesländer. Couple mode. Church tax. Everything.
        </p>

        <div className="space-y-4 mb-8">
          {[
            'All 6 tax classes (I-VI)',
            'Kirchensteuer 8-9% by Bundesland',
            'Kindergeld €259/child (2026 rates)',
            'Solidaritätszuschlag',
            'Couple vs single optimization',
            'Net income calculation'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border-2 border-red-200">
        <div className="mb-6">
          <div className="text-sm text-slate-600 mb-2">Gross Salary</div>
          <div className="text-4xl font-bold text-secondary mb-4">€80,000</div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-3 bg-white rounded-lg">
              <span className="text-slate-600">Income Tax</span>
              <span className="font-bold text-red-600">-€14,352</span>
            </div>
            <div className="flex justify-between p-3 bg-white rounded-lg">
              <span className="text-slate-600">Solidarity</span>
              <span className="font-bold text-red-600">-€789</span>
            </div>
            <div className="flex justify-between p-3 bg-white rounded-lg">
              <span className="text-slate-600">Church Tax (9%)</span>
              <span className="font-bold text-red-600">-€1,292</span>
            </div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-900 font-semibold">Net Salary</span>
              <span className="font-bold text-green-600 text-lg">€63,567</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
          💡 <strong>Tip:</strong> Married couples save €2,847/year with tax class III/V
        </div>
      </div>
    </div>
  );
}

export function ScenariosFeature() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🚀</div>
      <h3 className="text-4xl font-bold text-secondary mb-4">Scenario Branching</h3>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
        Model life decisions before you make them. See multiple futures simultaneously.
      </p>
      <div className="inline-block px-6 py-3 bg-amber-100 border-2 border-amber-300 rounded-xl text-amber-900 font-bold">
        🎯 Coming Q2 2026
      </div>
      <p className="text-sm text-slate-500 mt-4">
        Join waitlist to get early access
      </p>
    </div>
  );
}

// Continue with more components in next file...// Remaining Components for Extended Landing Page - Part 3

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Timeline Steps
export function TimelineSteps() {
  const steps = [
    {
      number: "01",
      title: "Add Your Lifestyle Items",
      description: "Choose from 40+ luxury items or create custom ones. Takes 2 minutes.",
      details: [
        "Porsche, Ferrari, Tesla",
        "Private school tuition",
        "Prime real estate",
        "Or create custom items"
      ],
      icon: "🎯",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      title: "See Real Inflation Rates",
      description: "We track category-specific inflation, not generic 2% CPI.",
      details: [
        "Supercars: 6.0%/year",
        "Private school: 4.5%/year",
        "Real estate: 5.5%/year",
        "Luxury goods: 8.0%/year"
      ],
      icon: "📈",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Get Your Truth Score",
      description: "See the gap between expectations and reality. Adjust your plan.",
      details: [
        "What you think you need",
        "What you actually need",
        "The reality gap (%)",
        "Extra years of work required"
      ],
      icon: "💡",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="relative">
      {/* Connection Lines */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-orange-500 opacity-20"></div>

      <div className="grid lg:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* Step Card */}
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all group">
              {/* Step Number */}
              <div className={`absolute -top-6 left-8 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl group-hover:scale-110 transition-transform`}>
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-6 mt-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">{step.description}</p>

              {/* Details List */}
              <ul className="space-y-2">
                {step.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow (desktop only) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonial Grid
export function TestimonialGrid() {
  const testimonials = [
    {
      name: "James Chen",
      role: "Tech CEO",
      company: "London",
      avatar: "👨‍💼",
      quote: "Discovered I needed €800K more than I thought. The Truth Score was brutal but necessary. Glad I found out at 35, not 45.",
      rating: 5,
      metric: "Gap found: €800K",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Sarah Mueller",
      role: "Finance Director",
      company: "Frankfurt",
      avatar: "👩‍💼",
      quote: "Most honest financial tool I've used. The lifestyle basket showed me I was underestimating inflation by 38%. Changed my entire plan.",
      rating: 5,
      metric: "Saved 4 years",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Michael Rodriguez",
      role: "Entrepreneur",
      company: "Barcelona",
      avatar: "🧑‍💻",
      quote: "I was planning with 2% inflation. My actual lifestyle inflates at 6.2%. This tool saved me from a massive retirement mistake.",
      rating: 5,
      metric: "€640K adjusted",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Emma Thompson",
      role: "Investment Banker",
      company: "Zurich",
      avatar: "👩‍💼",
      quote: "The German tax calculator alone is worth the price. Finally accurate Kirchensteuer calculations for all Bundesländer.",
      rating: 5,
      metric: "€3.2K saved",
      color: "from-green-500 to-teal-500"
    },
    {
      name: "David Kim",
      role: "Software Engineer",
      company: "Berlin",
      avatar: "👨‍💻",
      quote: "FIRE calculator showed me 4 different paths. I'm now on the 'Barista FIRE' track. So much clearer than other tools.",
      rating: 5,
      metric: "Plan optimized",
      color: "from-cyan-500 to-blue-500"
    },
    {
      name: "Lisa Wang",
      role: "Consultant",
      company: "Munich",
      avatar: "👩‍💼",
      quote: "The private school inflation tracker is eye-opening. €50K/year today becomes €82K in 10 years. Now I'm prepared.",
      rating: 5,
      metric: "€320K planned",
      color: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <div key={i} className="group bg-white rounded-2xl p-6 border-2 border-slate-200 hover:shadow-2xl hover:border-primary/50 transition-all">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              {t.avatar}
            </div>
            <div className="flex-1">
              <div className="font-bold text-secondary">{t.name}</div>
              <div className="text-sm text-slate-600">{t.role}</div>
              <div className="text-xs text-slate-500">{t.company}</div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {Array(t.rating).fill(0).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <p className="text-slate-700 leading-relaxed mb-4 italic">
            "{t.quote}"
          </p>

          {/* Metric */}
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${t.color} bg-opacity-10 rounded-full text-sm font-semibold`}>
            ✓ {t.metric}
          </div>
        </div>
      ))}
    </div>
  );
}

// Enhanced Pricing Cards
export function EnhancedPricingCards() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Free Tier */}
      <div className="group bg-white rounded-3xl p-10 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-secondary">Free</h3>
          <div className="px-4 py-1 bg-slate-100 rounded-full text-slate-600 text-sm font-semibold">
            Forever
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-bold text-secondary">€0</span>
            <span className="text-slate-600">/forever</span>
          </div>
          <p className="text-slate-600">Perfect to get started</p>
        </div>

        <ul className="space-y-4 mb-10">
          {[
            'Basic wealth tracking',
            'Up to 20 assets',
            '5-year projections',
            'All 4 FIRE calculators',
            'German tax calculator',
            'CSV export (weekly)',
            'Email support',
            'All 5 currencies'
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/login"
          className="block w-full px-8 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-center text-lg"
        >
          Get Started Free
        </Link>
      </div>

      {/* Premium Tier */}
      <div className="relative group bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-10 shadow-2xl text-white overflow-hidden">
        {/* Popular Badge */}
        <div className="absolute -top-4 right-10 z-10">
          <div className="bg-amber-400 text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
            <span className="text-lg">⭐</span>
            MOST POPULAR
          </div>
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold">Premium</h3>
            <span className="text-3xl">💎</span>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold">€9.99</span>
              <span className="opacity-90">/month</span>
            </div>
            <p className="opacity-90">or €99/year (save 17%)</p>
          </div>

          <ul className="space-y-4 mb-10">
            {[
              'Everything in Free',
              'Lifestyle Basket (40+ items)',
              'Truth Score analysis',
              'Unlimited assets',
              '50-year projections',
              'Advanced scenarios (coming)',
              'Family sharing (coming)',
              'PDF reports',
              'Priority support',
              'Early access to features'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/login"
            className="block w-full px-8 py-4 bg-white text-primary rounded-xl hover:bg-slate-50 transition-all font-bold text-center text-lg shadow-xl group-hover:shadow-2xl"
          >
            Start 30-Day Trial
          </Link>

          <p className="text-center text-sm opacity-80 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

// FAQ Section
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How is this different from other FIRE calculators?",
      answer: "Most FIRE calculators use generic 2% CPI inflation. We track YOUR specific lifestyle items (Porsche, private school, real estate) with real category-specific inflation rates (6-8%). This reveals the TRUE cost of your lifestyle, often 30-40% higher than generic calculators show."
    },
    {
      question: "Why do I need the Lifestyle Basket?",
      answer: "Because generic inflation doesn't match reality for high-earners. A Porsche inflates at 6%/year, private school at 4.5%/year, prime real estate at 5.5%/year. If you're planning retirement based on 2% inflation but your lifestyle inflates at 6%, you could be underestimating by €500K-€1M. That's 3-7 years of extra work you didn't plan for."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes. We use bank-level 256-bit encryption. Your data is stored in Firebase (Google Cloud) with enterprise-grade security. We never sell your data. Optional: Enable 'Shadow Vault' for zero-knowledge end-to-end encryption where even we can't see your data."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. No contracts, no commitments. Cancel with one click from your settings. If you cancel within 30 days, you get a full refund, no questions asked."
    },
    {
      question: "Do you support currencies other than Euro?",
      answer: "Yes! We support 5 currencies: EUR (€), USD ($), GBP (£), INR (₹), and CAD ($). All calculations, inflation rates, and pricing adjust to your selected currency. Exchange rates update daily."
    },
    {
      question: "How accurate is the German tax calculator?",
      answer: "Extremely accurate. We use 2026 official rates including: all 6 tax classes, Kirchensteuer (8-9% by Bundesland), Solidaritätszuschlag, Kindergeld (€259/child), and all 16 Bundesländer. Updated annually with new government rates."
    },
    {
      question: "What's coming next?",
      answer: "Q2 2026: Scenario branching (model life decisions), Auto bank sync (Germany first via FinAPI), Family sharing (5 members). Q3 2026: Monte Carlo simulations, Anti-Portfolio (track missed opportunities), Advanced 'what-if' scenarios."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Free tier is available forever (no credit card required). Premium features have a 30-day free trial. If you're not satisfied, cancel within 30 days for a full refund."
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            FAQ
          </div>
          <h2 className="text-5xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Questions? Answered.
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about myfynzo
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-primary/50 transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-bold text-secondary pr-8">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === i && (
                <div className="px-8 pb-6">
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-2xl border-2 border-primary/20">
          <h3 className="text-2xl font-bold text-secondary mb-3">Still have questions?</h3>
          <p className="text-slate-600 mb-6">We're here to help! Email us anytime.</p>
          <a 
            href="mailto:support@myfynzo.com"
            className="inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

