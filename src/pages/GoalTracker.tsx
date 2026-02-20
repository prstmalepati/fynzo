import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';

export interface Goal {
  id: string;
  name: string;
  type: 'fire' | 'property' | 'vehicle' | 'education' | 'business' | 'travel' | 'emergency' | 'custom';
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContribution: number;
  priority: number;
  linkedScenario?: string;
  notes?: string;
  
  // Calculated
  progressPercentage: number;
  projectedCompletionDate: Date;
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
  monthsRemaining: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export default function GoalTracker() {
  const { user } = useAuth();
  const { formatAmount, formatCompact } = useCurrency();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const goalsRef = collection(db, 'users', user.uid, 'goals');
      const q = query(goalsRef, orderBy('priority', 'asc'));
      const snapshot = await getDocs(q);

      const loadedGoals = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          targetDate: data.targetDate?.toDate() || new Date(),
          projectedCompletionDate: data.projectedCompletionDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }) as Goal[];

      setGoals(loadedGoals);
      setLoading(false);
    } catch (error) {
      console.error('Error loading goals:', error);
      setLoading(false);
    }
  };

  const goalTypes = [
    { value: 'all', label: 'All Goals', emoji: '🎯' },
    { value: 'fire', label: 'FIRE/Retirement', emoji: '🔥' },
    { value: 'property', label: 'Property', emoji: '🏠' },
    { value: 'vehicle', label: 'Vehicle', emoji: '🚗' },
    { value: 'education', label: 'Education', emoji: '🎓' },
    { value: 'business', label: 'Business', emoji: '💼' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'emergency', label: 'Emergency Fund', emoji: '🛡️' },
    { value: 'custom', label: 'Custom', emoji: '⭐' }
  ];

  const filteredGoals = filterType === 'all' 
    ? goals 
    : goals.filter(g => g.type === filterType);

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-teal-400/30 border-t-teal-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-700 font-semibold text-xl">Loading goals...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* PREMIUM HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 px-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6 animate-fadeInUp">
              <div className="text-7xl">🎯</div>
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-6xl font-bold text-white font-crimson" style={{ letterSpacing: '-0.02em' }}>
                    Goal Tracker
                  </h1>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl">
                    💎 Premium
                  </span>
                </div>
                <p className="text-slate-300 text-2xl font-medium">
                  Track progress toward your financial objectives
                </p>
              </div>
            </div>

            {goals.length > 0 && (
              <div className="mt-10 grid md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">Active Goals</div>
                  <div className="text-5xl font-bold text-white font-manrope">{goals.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">Total Progress</div>
                  <div className="text-5xl font-bold text-white font-manrope">{overallProgress.toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">Total Saved</div>
                  <div className="text-5xl font-bold text-white font-manrope">{formatCompact(totalCurrentAmount)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Empty State */}
          {goals.length === 0 && (
            <div className="relative">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
              </div>

              <div className="relative bg-white rounded-3xl p-20 border-2 border-slate-200 shadow-2xl text-center animate-fadeInUp">
                <div className="text-9xl mb-8">🎯</div>
                <h2 className="text-5xl font-bold text-secondary mb-6 font-crimson" style={{ letterSpacing: '-0.02em' }}>
                  Set Your Financial Targets
                </h2>
                <p className="text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Define clear objectives and track systematic progress toward your financial goals.
                </p>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
                  <p className="text-blue-900 text-lg font-semibold mb-2">
                    🚧 Goal Creation Coming Soon
                  </p>
                  <p className="text-blue-700">
                    The goal creation interface will be available in the next update. For now, this page displays your existing goals.
                  </p>
                </div>

                {/* Example Goals */}
                <div className="mt-16 grid md:grid-cols-3 gap-6">
                  {[
                    { emoji: '🔥', name: 'FIRE Fund', amount: '€1.8M' },
                    { emoji: '🏠', name: 'House Down Payment', amount: '€100K' },
                    { emoji: '🎓', name: 'Education Fund', amount: '€50K' }
                  ].map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200">
                      <div className="text-5xl mb-4">{item.emoji}</div>
                      <div className="font-bold text-xl text-secondary mb-1">{item.name}</div>
                      <div className="text-primary font-bold text-lg">{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Goals Display */}
          {goals.length > 0 && (
            <>
              {/* Filters */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {goalTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                        filterType === type.value
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-primary'
                      }`}
                    >
                      <span className="mr-2">{type.emoji}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {filteredGoals.map((goal, index) => (
                  <div 
                    key={goal.id} 
                    className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-5xl">{goal.emoji}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-secondary font-crimson">{goal.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {goalTypes.find(t => t.value === goal.type)?.label || 'Custom'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Progress</span>
                        <span className="text-sm font-bold text-secondary">{goal.progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-teal-600 transition-all duration-1000"
                          style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-600 mb-1">Current</div>
                        <div className="text-xl font-bold text-secondary font-manrope">
                          {formatAmount(goal.currentAmount)}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-600 mb-1">Target</div>
                        <div className="text-xl font-bold text-secondary font-manrope">
                          {formatAmount(goal.targetAmount)}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-semibold ${
                        goal.status === 'on-track' ? 'text-green-600' :
                        goal.status === 'ahead' ? 'text-blue-600' :
                        goal.status === 'completed' ? 'text-purple-600' :
                        'text-amber-600'
                      }`}>
                        {goal.status === 'on-track' ? 'On Track' :
                         goal.status === 'ahead' ? 'Ahead of Schedule' :
                         goal.status === 'completed' ? 'Completed' :
                         'Needs Attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800;900&display=swap');
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
            animation-fill-mode: both;
          }
          
          .font-crimson {
            font-family: 'Crimson Pro', serif;
          }
          
          .font-manrope {
            font-family: 'Manrope', sans-serif;
          }
        `}</style>
      </div>
    </SidebarLayout>
  );
}
