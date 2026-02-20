import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
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
  
  currentAge: number;
  retirementAge: number;
  currentNetWorth: number;
  monthlyIncome: number;
  monthlySavings: number;
  savingsRate: number;
  expectedReturn: number;
  inflationRate: number;
  
  lifeEvents: ScenarioLifeEvent[];
  
  projectedNetWorth: number;
  fireDate: Date | null;
  yearsToFire: number;
  confidenceScore: number;
  
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

  const baseline = scenarios.find(s => s.isBaseline);
  const alternatives = scenarios.filter(s => !s.isBaseline);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
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
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 py-20 px-8">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-7xl">🌳</div>
              <div>
                <h1 className="text-6xl font-bold text-white mb-2">Scenario Branching</h1>
                <p className="text-purple-200 text-2xl">Model different life paths before you commit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {scenarios.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center">
              <div className="text-9xl mb-8">🌳</div>
              <h2 className="text-5xl font-bold text-secondary mb-6">Your Life, Multiple Paths</h2>
              <p className="text-2xl text-slate-600 mb-10">
                What if you took that job? Bought that house? Model it before you commit.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-2xl"
              >
                Create Your First Scenario
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-8">
                <h2 className="text-3xl font-bold">Your Scenarios</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold"
                >
                  + New Scenario
                </button>
              </div>

              {baseline && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">📍 Baseline</h3>
                  <ScenarioCard
                    scenario={baseline}
                    isSelected={false}
                    comparisonMode={false}
                    onToggleSelect={() => {}}
                    onDelete={handleDeleteScenario}
                  />
                </div>
              )}

              {alternatives.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">🌿 Alternatives</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {alternatives.map(scenario => (
                      <ScenarioCard
                        key={scenario.id}
                        scenario={scenario}
                        isSelected={false}
                        comparisonMode={false}
                        onToggleSelect={() => {}}
                        onDelete={handleDeleteScenario}
                        baseline={baseline}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {showCreateModal && (
            <CreateScenarioModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateScenario}
              baseline={baseline}
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
