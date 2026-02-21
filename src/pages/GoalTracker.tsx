import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  notes: string;
  createdAt: Date;
}

export default function GoalTracker() {
  const { formatAmount, formatCompact } = useCurrency();
  const { user } = useAuth();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  // Form fields
  const [goalName, setGoalName] = useState('');
  const [category, setCategory] = useState('savings');
  const [targetAmount, setTargetAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const categories = [
    { id: 'savings', label: 'Emergency Fund', icon: '🛡️', color: 'blue' },
    { id: 'investment', label: 'Investment Goal', icon: '📈', color: 'green' },
    { id: 'purchase', label: 'Major Purchase', icon: '🏠', color: 'purple' },
    { id: 'travel', label: 'Travel', icon: '✈️', color: 'orange' },
    { id: 'education', label: 'Education', icon: '🎓', color: 'teal' },
    { id: 'retirement', label: 'Retirement', icon: '🏖️', color: 'red' },
    { id: 'debt', label: 'Debt Payoff', icon: '💳', color: 'yellow' },
    { id: 'other', label: 'Other', icon: '🎯', color: 'slate' }
  ];

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    
    try {
      const goalsRef = collection(db, 'users', user.uid, 'goals');
      const snapshot = await getDocs(goalsRef);
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Goal[];
      
      setGoals(goalsData.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()));
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleAddGoal = async () => {
    if (!user || !goalName || !targetAmount || !targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const goalData = {
        name: goalName,
        category,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        targetDate,
        notes,
        createdAt: new Date()
      };

      if (editingGoal) {
        await updateDoc(doc(db, 'users', user.uid, 'goals', editingGoal.id), goalData);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'goals'), goalData);
      }

      resetForm();
      loadGoals();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user || !confirm('Are you sure you want to delete this goal?')) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId));
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal.');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setCategory(goal.category);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
    setTargetDate(goal.targetDate);
    setNotes(goal.notes);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditingGoal(null);
    setGoalName('');
    setCategory('savings');
    setTargetAmount(0);
    setCurrentAmount(0);
    setTargetDate('');
    setNotes('');
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const calculateDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Total Goal Amount</div>
          <div className="text-4xl font-bold mb-1">{formatCompact(totalTargetAmount)}</div>
          <div className="text-xs opacity-75">{formatAmount(totalTargetAmount)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Amount Saved</div>
          <div className="text-4xl font-bold mb-1">{formatCompact(totalCurrentAmount)}</div>
          <div className="text-xs opacity-75">{formatAmount(totalCurrentAmount)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-sm opacity-90 mb-2">Overall Progress</div>
          <div className="text-4xl font-bold mb-1">{overallProgress.toFixed(0)}%</div>
          <div className="text-xs opacity-75">{goals.length} active goals</div>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary">Your Financial Goals</h2>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
        >
          + Add New Goal
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-secondary mb-2">No Goals Yet</h3>
          <p className="text-slate-600 mb-6">Start by creating your first financial goal!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const categoryInfo = getCategoryInfo(goal.category);
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysRemaining = calculateDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            const isNearDeadline = daysRemaining < 30 && daysRemaining >= 0;

            return (
              <div key={goal.id} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary transition-all shadow-sm hover:shadow-lg">
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${categoryInfo.color}-100 rounded-xl flex items-center justify-center text-2xl`}>
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary">{goal.name}</h3>
                      <div className={`text-xs font-semibold text-${categoryInfo.color}-600`}>
                        {categoryInfo.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">{formatAmount(goal.currentAmount)}</span>
                    <span className="font-bold text-primary">{formatAmount(goal.targetAmount)}</span>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${categoryInfo.color}-400 to-${categoryInfo.color}-600 transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-600 mt-1">
                    {progress.toFixed(1)}% Complete
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Remaining</div>
                    <div className="font-bold text-secondary">{formatCompact(goal.targetAmount - goal.currentAmount)}</div>
                  </div>
                  <div className={`rounded-lg p-3 ${isOverdue ? 'bg-red-50' : isNearDeadline ? 'bg-orange-50' : 'bg-green-50'}`}>
                    <div className="text-xs text-slate-600 mb-1">
                      {isOverdue ? 'Overdue' : 'Time Left'}
                    </div>
                    <div className={`font-bold ${isOverdue ? 'text-red-600' : isNearDeadline ? 'text-orange-600' : 'text-green-600'}`}>
                      {isOverdue ? `${Math.abs(daysRemaining)} days` : `${daysRemaining} days`}
                    </div>
                  </div>
                </div>

                {/* Target Date */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Target Date:</span>
                  <span className="font-semibold text-secondary">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>

                {goal.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">Notes:</div>
                    <div className="text-xs text-blue-800">{goal.notes}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Goal Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Goal Name *
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Emergency Fund, Down Payment, Vacation"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        category === cat.id
                          ? `border-${cat.color}-500 bg-${cat.color}-50`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-semibold">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amounts */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Target Amount *
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about this goal..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
