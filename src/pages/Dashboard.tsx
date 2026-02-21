import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load investments
      const investmentsRef = collection(db, 'users', user.uid, 'investments');
      const investmentsSnapshot = await getDocs(investmentsRef);
      const investmentsTotal = investmentsSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.quantity || 0) * (data.currentPrice || data.purchasePrice || 0);
      }, 0);
      setTotalInvestments(investmentsTotal);

      // Load goals
      const goalsRef = collection(db, 'users', user.uid, 'goals');
      const goalsSnapshot = await getDocs(goalsRef);
      const goalsTotal = goalsSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.targetAmount || 0);
      }, 0);
      setTotalGoals(goalsTotal);

      // Load lifestyle basket
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

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-2xl text-slate-600">Loading...</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Dashboard
          </h1>
          <p className="text-slate-600">Welcome back, {user?.email}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Investments</div>
            <div className="text-4xl font-bold mb-1">{formatAmount(totalInvestments)}</div>
            <div className="text-xs opacity-75">Portfolio Value</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Financial Goals</div>
            <div className="text-4xl font-bold mb-1">{formatAmount(totalGoals)}</div>
            <div className="text-xs opacity-75">Target Amount</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Lifestyle Basket</div>
            <div className="text-4xl font-bold mb-1">{formatAmount(totalLifestyleItems)}</div>
            <div className="text-xs opacity-75">Planned Purchases</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/investments"
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-secondary">Add Investment</div>
            </a>
            
            <a 
              href="/goal-tracker"
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-secondary">Create Goal</div>
            </a>
            
            <a 
              href="/lifestyle-basket"
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <div className="text-3xl mb-2">🛒</div>
              <div className="font-semibold text-secondary">Plan Purchase</div>
            </a>
            
            <a 
              href="/calculators"
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <div className="text-3xl mb-2">🧮</div>
              <div className="font-semibold text-secondary">Use Calculator</div>
            </a>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-300">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="text-xl font-bold text-secondary mb-2">Your Financial Overview</h3>
          <p className="text-slate-600">
            Track your investments, set goals, and plan your financial future all in one place.
          </p>
        </div>

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}
