import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import SidebarLayout from '../components/SidebarLayout';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

interface InvData { type: string; value: number; cost: number; }

export default function Dashboard() {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();

  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalLifestyleItems, setTotalLifestyleItems] = useState(0);
  const [investmentCount, setInvestmentCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [invByType, setInvByType] = useState<InvData[]>([]);
  const [projYears, setProjYears] = useState(10);
  const [cashSavings, setCashSavings] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadDashboardData(); }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Investments
      const invSnap = await getDocs(collection(db, 'users', user.uid, 'investments'));
      const typeMap: Record<string, { value: number; cost: number }> = {};
      let invTotal = 0, costTotal = 0;
      invSnap.docs.forEach(d => {
        const data = d.data();
        const val = (data.quantity || 0) * (data.currentPrice || data.purchasePrice || 0);
        const cost = (data.quantity || 0) * (data.purchasePrice || 0);
        invTotal += val;
        costTotal += cost;
        const t = data.type || 'Other';
        if (!typeMap[t]) typeMap[t] = { value: 0, cost: 0 };
        typeMap[t].value += val;
        typeMap[t].cost += cost;
      });
      setTotalInvestments(invTotal);
      setTotalCost(costTotal);
      setInvestmentCount(invSnap.docs.length);
      setInvByType(Object.entries(typeMap).map(([type, d]) => ({ type, ...d })).sort((a, b) => b.value - a.value));

      // Goals
      const goalSnap = await getDocs(collection(db, 'users', user.uid, 'goals'));
      let gTarget = 0, gCurrent = 0;
      goalSnap.docs.forEach(d => {
        const data = d.data();
        gTarget += data.targetAmount || 0;
        gCurrent += data.currentAmount || 0;
      });
      setTotalGoals(gTarget);
      setGoalCount(goalSnap.docs.length);
      setGoalProgress(gTarget > 0 ? (gCurrent / gTarget) * 100 : 0);

      // Lifestyle
      const lifeSnap = await getDocs(collection(db, 'users', user.uid, 'lifestyleBasket'));
      setTotalLifestyleItems(lifeSnap.docs.reduce((s, d) => s + (d.data().cost || 0), 0));

      // Projection years preference + wealth projection inputs
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const ud = userSnap.data();
        if (ud.projectionYears) setProjYears(ud.projectionYears);
      }
      // Load saved wealth projection data for net worth calc
      const projSnap = await getDoc(doc(db, 'users', user.uid, 'projections', 'wealth'));
      if (projSnap.exists()) {
        const pd = projSnap.data();
        setCashSavings(pd.currentNetWorth || 0);
        setMonthlyInvestment(pd.monthlyInvestment || 0);
      }

      // Fetch total debt from debts collection (source of truth)
      const debtSnap = await getDocs(collection(db, 'users', user.uid, 'debts'));
      let debtSum = 0;
      debtSnap.docs.forEach(d => { debtSum += d.data().remainingAmount || 0; });
      setTotalDebt(debtSum);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally { setLoading(false); }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';
  const totalGain = totalInvestments - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // Net Worth = Cash/Savings + Investments - Debt
  const todayNetWorth = cashSavings + totalInvestments - totalDebt;

  // Projected net worth: compound growth on investments + monthly contributions
  const projectedValue = useMemo(() => {
    const annualReturn = 0.07;
    const annualContribution = monthlyInvestment * 12;
    let projected = totalInvestments;
    for (let y = 0; y < projYears; y++) {
      projected = projected * (1 + annualReturn) + annualContribution;
    }
    // Add cash, subtract remaining debt (simplified: debt reduces linearly)
    return cashSavings + projected - Math.max(0, totalDebt - (projYears * annualContribution * 0.1));
  }, [totalInvestments, projYears, cashSavings, totalDebt, monthlyInvestment]);

  const colors = ['#0f766e', '#2563eb', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6b7280'];

  const allocationData = useMemo(() => {
    return invByType.map((item, i) => ({
      ...item,
      pct: totalInvestments > 0 ? (item.value / totalInvestments) * 100 : 0,
      color: colors[i % colors.length],
    }));
  }, [invByType, totalInvestments]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-6" />
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[1, 2, 3].map(i => <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            {[1, 2].map(i => <div key={i} className="h-44 bg-slate-50 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary mb-1 font-display">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-slate-500">Here's your financial overview</p>
        </div>

        {/* Row 1: Wealth Projection + Portfolio Value */}
        <div className="grid md:grid-cols-2 gap-4 mb-4 stagger">
          {/* Wealth Projection */}
          <Link to="/wealth-projection" className="group animate-slideUp">
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-secondary to-surface-700 text-white shadow-elevated transition-transform duration-200 group-hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/50 font-medium">Wealth Projection</span>
                </div>
                <span className="text-[10px] text-white/30 bg-white/10 px-2 py-0.5 rounded-full group-hover:bg-white/15">View full →</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-white/40 mb-0.5">Today Net Worth</div>
                  <div className="text-xl font-bold tracking-tight">{formatAmount(todayNetWorth)}</div>
                  <div className="text-[10px] text-white/40 mt-2">Net Worth in {projYears} years</div>
                  <div className="text-xl font-bold text-accent tracking-tight">{formatAmount(projectedValue)}</div>
                </div>
                <svg viewBox="0 0 100 50" className="w-28 h-14 opacity-60">
                  <defs>
                    <linearGradient id="dashSpk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(15,118,110)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(15,118,110)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,42 C12,40 20,36 30,33 C42,30 50,38 60,28 C72,18 80,22 90,15 C95,12 100,8 100,6" fill="none" stroke="rgb(15,118,110)" strokeWidth="2" />
                  <path d="M0,42 C12,40 20,36 30,33 C42,30 50,38 60,28 C72,18 80,22 90,15 C95,12 100,8 100,6 L100,50 L0,50 Z" fill="url(#dashSpk)" />
                </svg>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </Link>

          {/* Portfolio Value */}
          <Link to="/investments" className="group animate-slideUp">
            <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-200/80 shadow-card transition-all group-hover:shadow-card-hover group-hover:border-primary/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 font-medium">Portfolio Value</span>
              </div>
              <div className="text-2xl font-bold text-secondary tracking-tight mb-1">{formatAmount(totalInvestments)}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-400">{investmentCount} assets</span>
                {totalGain !== 0 && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${totalGain >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {totalGain >= 0 ? '+' : ''}{totalGainPct.toFixed(1)}%
                  </span>
                )}
              </div>
              {investmentCount > 0 && allocationData.length > 0 && (
                <div className="space-y-1">
                  {allocationData.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-slate-500 flex-1 truncate">{item.type}</span>
                      <span className="text-[10px] font-bold text-slate-600">{item.pct.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Row 2: Financial Goals + Lifestyle Basket */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Goals */}
          <Link to="/goal-tracker" className="group animate-slideUp">
            <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-card transition-all group-hover:shadow-card-hover group-hover:border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 font-medium">Financial Goals</span>
              </div>
              <div className="text-2xl font-bold text-secondary tracking-tight mb-1">{formatAmount(totalGoals)}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(goalProgress, 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{goalProgress.toFixed(0)}%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">{goalCount} goal{goalCount !== 1 ? 's' : ''} active</div>
            </div>
          </Link>

          {/* Lifestyle */}
          <Link to="/lifestyle-basket" className="group animate-slideUp">
            <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-card transition-all group-hover:shadow-card-hover group-hover:border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 font-medium">Lifestyle Basket</span>
              </div>
              <div className="text-2xl font-bold text-secondary tracking-tight mb-0.5">{formatAmount(totalLifestyleItems)}</div>
              <div className="text-xs text-slate-400">Planned purchases</div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { to: '/investments', label: 'Add Investment', color: 'text-primary bg-primary/8', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg> },
              { to: '/goal-tracker', label: 'Create Goal', color: 'text-blue-600 bg-blue-500/8', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></svg> },
              { to: '/lifestyle-basket', label: 'Plan Purchase', color: 'text-purple-600 bg-purple-500/8', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg> },
              { to: '/calculators', label: 'Calculators', color: 'text-orange-600 bg-orange-500/8', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg> },
            ].map(a => (
              <Link key={a.to} to={a.to} className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-primary/20 hover:shadow-card transition-all">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${a.color}`}>{a.icon}</div>
                <span className="text-sm font-semibold text-secondary">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <Link to="/security" className="flex items-center justify-center gap-4 py-2.5 px-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all group">
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
