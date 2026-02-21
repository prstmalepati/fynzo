import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-teal-600">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">myfynzo</h1>
          <div className="flex gap-4">
            <Link 
              to="/login" 
              className="px-6 py-2 text-white font-semibold hover:bg-white/10 rounded-xl transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-white text-primary font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-white mb-6">
            Your Financial Control Center
          </h2>
          <p className="text-2xl text-white/90 mb-12">
            Track investments, plan goals, and master your financial future
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-white text-primary text-lg font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-3">Track Investments</h3>
            <p className="text-white/80">
              Monitor your portfolio across stocks, crypto, and more in real-time
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Set Goals</h3>
            <p className="text-white/80">
              Create financial goals and track your progress toward achieving them
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🧮</div>
            <h3 className="text-2xl font-bold text-white mb-3">Smart Calculators</h3>
            <p className="text-white/80">
              Plan your FIRE journey, retirement, taxes, and budget with powerful tools
            </p>
          </div>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
