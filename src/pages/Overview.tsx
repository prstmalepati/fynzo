import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Overview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-secondary-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="myfynzo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-secondary">myfynzo</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-teal-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 text-primary border-2 border-primary rounded-lg hover:bg-teal-50 transition-all duration-300 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-teal-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 fade-in">
            <div className="inline-block px-4 py-2 bg-teal-100 text-primary rounded-full text-sm font-medium border border-teal-200">
              European-First Wealth Planning
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-secondary leading-tight">
              Wealth.<br />
              Projection.<br />
              <span className="text-primary">Clarity.</span>
            </h1>
            <p className="text-xl text-secondary-500 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif" }}>
              The intelligent wealth projection platform built for ambitious Europeans pursuing financial independence. 
              Tax-aware. Couples-friendly. FIRE-focused.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/projection')}
                className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Calculate Your FIRE Number
              </button>
              <button
                onClick={() => user ? navigate('/calculators') : navigate('/login')}
                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl hover:bg-teal-50 transition-all duration-300 font-semibold"
              >
                {user ? 'Calculators' : 'Calculators (Login Required)'}
              </button>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-secondary">€2.4M+</div>
                <div className="text-sm text-secondary-500">Wealth Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">5</div>
                <div className="text-sm text-secondary-500">Tax Systems</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">40Y</div>
                <div className="text-sm text-secondary-500">Projections</div>
              </div>
            </div>
          </div>

          {/* Right: Projection Visualization Preview */}
          <div className="relative fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-secondary-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-secondary-800">Your Wealth Trajectory</h3>
                <span className="text-sm text-teal-600 font-medium">40-year projection</span>
              </div>
              
              {/* Simple Chart Illustration */}
              <div className="relative h-64">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Wealth projection curve */}
                  <path
                    d="M 20 180 Q 100 160, 150 120 T 380 20"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    className="projection-line"
                  />
                  
                  {/* Area under curve */}
                  <path
                    d="M 20 180 Q 100 160, 150 120 T 380 20 L 380 200 L 20 200 Z"
                    fill="url(#areaGradient)"
                    opacity="0.3"
                  />
                  
                  {/* FIRE milestone marker */}
                  <circle cx="280" cy="60" r="6" fill="#0f766e" className="pulse" />
                  <text x="290" y="55" fill="#0f766e" fontSize="12" fontWeight="600">FIRE</text>
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-secondary-200">
                <div>
                  <div className="text-2xl font-bold text-secondary">€1.2M</div>
                  <div className="text-xs text-secondary-400">Current</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">€4.8M</div>
                  <div className="text-xs text-secondary-400">FIRE Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">12Y</div>
                  <div className="text-xs text-secondary-400">To FIRE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-5xl font-bold text-secondary mb-4">
              Built Different
            </h2>
            <p className="text-xl text-secondary-500 max-w-2xl mx-auto">
              The only wealth planner designed for European FIRE seekers from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 hover:shadow-xl transition-all duration-300 fade-in">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">
                Tax-Smart Projections
              </h3>
              <p className="text-secondary-500 leading-relaxed">
                German capital gains, UK CGT, French PFU - we speak your tax language. Get accurate after-tax projections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-secondary-200 hover:shadow-xl transition-all duration-300 fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">
                Couples Mode
              </h3>
              <p className="text-secondary-500 leading-relaxed">
                Plan together. Track dual incomes, joint expenses, and shared FIRE goals. Built for modern partnerships.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 hover:shadow-xl transition-all duration-300 fade-in" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">
                FIRE-First Design
              </h3>
              <p className="text-secondary-500 leading-relaxed">
                Calculate your Financial Independence number, retirement age, and safe withdrawal rate. Built by the FIRE community, for the FIRE community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-teal-800 text-white">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h2 className="text-5xl font-bold mb-6">
            Start Your Journey to Financial Independence
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join ambitious Europeans building wealth with clarity. Your financial future deserves better than spreadsheets.
          </p>
          <button
            onClick={() => navigate('/projection')}
            className="px-10 py-5 bg-white text-primary rounded-xl hover:bg-teal-50 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-xl hover:scale-105 transform"
          >
            Calculate Your FIRE Number →
          </button>
          <p className="text-sm text-teal-200 mt-6">No credit card required. Advanced calculators available with login.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary text-secondary-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo-transparent.png" alt="myfynzo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold text-white">fynzo</span>
          </div>
          <p className="text-sm">
            Built with precision for the European FIRE community.
          </p>
          <p className="text-xs mt-4 text-secondary-400">
            © 2026 Fynzo. Wealth planning for the intentional.
          </p>
        </div>
      </footer>

      {/* Animations */}
    </div>
  );
}

