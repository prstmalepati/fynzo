import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalLifestyleItems, setTotalLifestyleItems] = useState(0);
  const [investmentCount, setInvestmentCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const investmentsRef = collection(db, 'users', user.uid, 'investments');
      const investmentsSnapshot = await getDocs(investmentsRef);
      const investmentsTotal = investmentsSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.quantity || 0) * (data.currentPrice || data.purchasePrice || 0);
      }, 0);
      setTotalInvestments(investmentsTotal);
      setInvestmentCount(investmentsSnapshot.docs.length);

      const goalsRef = collection(db, 'users', user.uid, 'goals');
      const goalsSnapshot = await getDocs(goalsRef);
      const goalsTotal = goalsSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.targetAmount || 0);
      }, 0);
      setTotalGoals(goalsTotal);
      setGoalCount(goalsSnapshot.docs.length);

      const lifestyleRef = collection(db, 'users', user.uid, 'lifestyleBasket');
      const lifestyleSnapshot = await getDocs(lifestyleRef);
      const lifestyleTotal = lifestyleSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.cost || 0);
      }, 0);
      setTotalLifestyleItems(lifestyleTotal);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';

  // Loading skeleton
  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-40 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-1 font-display">
            Welcome back, {displayName}
          </h1>
          <p className="text-slate-500">Here's your financial overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8 stagger">
          {/* Investments */}
          <Link to="/investments" className="group animate-slideUp">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-secondary to-surface-700 text-white shadow-elevated transition-transform duration-200 group-hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/60 font-medium">Portfolio Value</span>
                </div>
                <div className="text-3xl font-bold tracking-tight mb-1">{formatAmount(totalInvestments)}</div>
                <div className="text-xs text-white/40">{investmentCount} asset{investmentCount !== 1 ? 's' : ''} tracked</div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </Link>

          {/* Goals */}
          <Link to="/goal-tracker" className="group animate-slideUp">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200/80 shadow-card transition-all duration-200 group-hover:shadow-card-hover group-hover:border-primary/20">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Financial Goals</span>
                </div>
                <div className="text-3xl font-bold text-secondary tracking-tight mb-1">{formatAmount(totalGoals)}</div>
                <div className="text-xs text-slate-400">{goalCount} goal{goalCount !== 1 ? 's' : ''} set</div>
              </div>
            </div>
          </Link>

          {/* Lifestyle */}
          <Link to="/lifestyle-basket" className="group animate-slideUp">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200/80 shadow-card transition-all duration-200 group-hover:shadow-card-hover group-hover:border-primary/20">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/8 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Lifestyle Basket</span>
                </div>
                <div className="text-3xl font-bold text-secondary tracking-tight mb-1">{formatAmount(totalLifestyleItems)}</div>
                <div className="text-xs text-slate-400">Planned purchases</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
            {[
              { to: '/investments', label: 'Add Investment', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ), color: 'text-primary bg-primary/8' },
              { to: '/goal-tracker', label: 'Create Goal', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
              ), color: 'text-blue-600 bg-blue-500/8' },
              { to: '/lifestyle-basket', label: 'Plan Purchase', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              ), color: 'text-purple-600 bg-purple-500/8' },
              { to: '/calculators', label: 'Calculators', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
              ), color: 'text-orange-600 bg-orange-500/8' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-200/80 bg-white
                  hover:border-primary/20 hover:shadow-card transition-all duration-200 animate-slideUp"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-sm font-semibold text-secondary text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Overview CTA */}
        <div className="animate-fadeIn rounded-2xl gradient-card border border-primary/10 p-8 text-center" style={{ animationDelay: '400ms' }}>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-2 font-display">Your Financial Command Center</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Track investments, set goals, and plan your financial future — all in one place.
          </p>
        </div>

        {/* Trust strip */}
        <div className="mt-6 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <Link to="/security" className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all group">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[11px] text-slate-400 font-medium">AES-256 encrypted</span>
            </div>
            <span className="text-slate-200">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">🇪🇺</span>
              <span className="text-[11px] text-slate-400 font-medium">EU data residency</span>
            </div>
            <span className="text-slate-200">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[11px] text-slate-400 font-medium">GDPR compliant</span>
            </div>
            <svg className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </SidebarLayout>
  );
}
