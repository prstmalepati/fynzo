import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, orderBy, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import ScenarioCard from '../components/ScenarioCard';
import CreateScenarioModal from '../components/CreateScenarioModal';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  isBaseline: boolean;
  
  // Financial inputs
  currentAge: number;
  retirementAge: number;
  currentNetWorth: number;
  monthlyIncome: number;
  monthlySavings: number;
  savingsRate: number;
  expectedReturn: number;
  inflationRate: number;
  
  // Major life events
  lifeEvents: ScenarioLifeEvent[];
  
  // Calculated results
  projectedNetWorth: number;
  fireDate: Date | null;
  yearsToFire: number;
  confidenceScore: number; // 0-100
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ScenarioLifeEvent {
  id: string;
  name: string;
  type: 'income-change' | 'expense-change' | 'one-time-expense' | 'one-time-income' | 'lifestyle-change';
  year: number;
  amount: number;
  recurring: boolean;
}

export default function ScenarioBranching() {
  const { user } = useAuth();
  const { formatAmount, formatCompact } = useCurrency();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadScenarios();
    }
  }, [user]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const scenariosRef = collection(db, 'users', user.uid, 'scenarios');
      const q = query(scenariosRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const loadedScenarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fireDate: doc.data().fireDate?.toDate() || null,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Scenario[];

      setScenarios(loadedScenarios);
      setLoading(false);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      setLoading(false);
    }
  };

  const handleCreateScenario = async (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const scenariosRef = collection(db, 'users', user.uid, 'scenarios');
      await addDoc(scenariosRef, {
        ...scenario,
        fireDate: scenario.fireDate ? Timestamp.fromDate(scenario.fireDate) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      setShowCreateModal(false);
      await loadScenarios();
    } catch (error) {
      console.error('Error creating scenario:', error);
      alert('Failed to create scenario');
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    if (confirm('Delete this scenario? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'scenarios', scenarioId));
        await loadScenarios();
      } catch (error) {
        console.error('Error deleting scenario:', error);
      }
    }
  };

  const toggleScenarioSelection = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else {
      if (selectedScenarios.length < 3) {
        setSelectedScenarios([...selectedScenarios, scenarioId]);
      }
    }
  };

  const baseline = scenarios.find(s => s.isBaseline);
  const alternatives = scenarios.filter(s => !s.isBaseline);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-pink-400/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-700 font-semibold text-xl">Loading scenarios...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
        {/* PREMIUM HERO SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 py-20 px-8">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6 animate-fadeInUp">
              <div className="text-7xl animate-float">🌳</div>
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-6xl font-bold text-white font-crimson" style={{ letterSpacing: '-0.02em' }}>
                    Scenario Branching
                  </h1>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl">
                    💎 Premium
                  </span>
                </div>
                <p className="text-purple-200 text-2xl font-medium">
                  Model different life paths before you commit
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {scenarios.length > 0 && (
              <div className="mt-10 grid md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">Total Scenarios</div>
                  <div className="text-5xl font-bold text-white font-manrope">{scenarios.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">Best Path</div>
                  <div className="text-5xl font-bold text-white font-manrope">
                    {Math.min(...scenarios.map(s => s.yearsToFire))}y
                  </div>
                  <div className="text-purple-200 text-sm mt-1">to FIRE</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">Best Outcome</div>
                  <div className="text-5xl font-bold text-white font-manrope">
                    {formatCompact(Math.max(...scenarios.map(s => s.projectedNetWorth)))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Empty State */}
          {scenarios.length === 0 && (
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>

              <div className="relative bg-white rounded-3xl p-20 border-2 border-slate-200 shadow-2xl text-center animate-fadeInUp">
                <div className="text-9xl mb-8 animate-float">🌳</div>
                <h2 className="text-5xl font-bold text-secondary mb-6 font-crimson" style={{ letterSpacing: '-0.02em' }}>
                  Your Life, Multiple Paths
                </h2>
                <p className="text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  What if you took that job offer? Bought that house? Started that business?
                  <br />
                  <strong className="text-purple-600">Model it before you commit.</strong>
                </p>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span>Create Your First Scenario</span>
                    <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  {/* Animated Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </button>

                {/* Examples */}
                <div className="mt-16 text-left max-w-4xl mx-auto">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Common Scenarios:</div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { emoji: '💼', title: 'Job Change', desc: '+30% salary, new city' },
                      { emoji: '🏠', title: 'Buy Property', desc: '€500K mortgage impact' },
                      { emoji: '👶', title: 'Start Family', desc: 'Kids, education, career break' }
                    ].map((item, i) => (
                      <div key={i} className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</div>
                        <div className="font-bold text-xl text-secondary mb-2">{item.title}</div>
                        <div className="text-slate-600">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scenarios Display */}
          {scenarios.length > 0 && (
            <>
              {/* Comparison Mode Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary font-crimson">Your Scenarios</h2>
                  <p className="text-slate-600 mt-1">Compare different life paths side-by-side</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setComparisonMode(!comparisonMode);
                      if (comparisonMode) setSelectedScenarios([]);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      comparisonMode
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-purple-500'
                    }`}
                  >
                    {comparisonMode ? '✓ Comparing' : '⚖️ Compare Mode'}
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    + New Scenario
                  </button>
                </div>
              </div>

              {/* Baseline Scenario */}
              {baseline && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📍</span>
                    <h3 className="text-2xl font-bold text-secondary font-crimson">Baseline (Current Path)</h3>
                  </div>
                  <ScenarioCard
                    scenario={baseline}
                    isSelected={selectedScenarios.includes(baseline.id)}
                    comparisonMode={comparisonMode}
                    onToggleSelect={toggleScenarioSelection}
                    onDelete={handleDeleteScenario}
                  />
                </div>
              )}

              {/* Alternative Scenarios */}
              {alternatives.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌿</span>
                    <h3 className="text-2xl font-bold text-secondary font-crimson">Alternative Paths</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {alternatives.map(scenario => (
                      <ScenarioCard
                        key={scenario.id}
                        scenario={scenario}
                        isSelected={selectedScenarios.includes(scenario.id)}
                        comparisonMode={comparisonMode}
                        onToggleSelect={toggleScenarioSelection}
                        onDelete={handleDeleteScenario}
                        baseline={baseline}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison View */}
              {comparisonMode && selectedScenarios.length >= 2 && (
                <div className="mt-12 bg-white rounded-3xl p-8 border-2 border-purple-300 shadow-2xl">
                  <h3 className="text-3xl font-bold text-secondary mb-6 font-crimson">Side-by-Side Comparison</h3>
                  {/* Comparison table would go here */}
                  <div className="text-slate-600">
                    Comparing {selectedScenarios.length} scenarios...
                    {/* Would show detailed comparison table */}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Floating Add Button */}
          {scenarios.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white rounded-3xl shadow-2xl hover:shadow-purple-500/60 hover:scale-110 transition-all duration-300 flex items-center justify-center text-4xl font-bold z-50 group animate-float"
              style={{ animationDuration: '3s' }}
            >
              <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
            </button>
          )}

          {/* Create Modal */}
          {showCreateModal && (
            <CreateScenarioModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateScenario}
              baseline={baseline}
            />
          )}
        </div>

        {/* Premium Styles */}
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
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
            animation-fill-mode: both;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
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
