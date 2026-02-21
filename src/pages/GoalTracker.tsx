import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
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
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const categories = [
    { id: 'savings', label: 'Emergency Fund', icon: '🛡️', bgColor: 'bg-blue-100', textColor: 'text-blue-700', progressFrom: 'from-blue-400', progressTo: 'to-blue-600' },
    { id: 'investment', label: 'Investment Goal', icon: '📈', bgColor: 'bg-green-100', textColor: 'text-green-700', progressFrom: 'from-green-400', progressTo: 'to-green-600' },
    { id: 'purchase', label: 'Major Purchase', icon: '🏠', bgColor: 'bg-purple-100', textColor: 'text-purple-700', progressFrom: 'from-purple-400', progressTo: 'to-purple-600' },
    { id: 'travel', label: 'Travel', icon: '✈️', bgColor: 'bg-orange-100', textColor: 'text-orange-700', progressFrom: 'from-orange-400', progressTo: 'to-orange-600' },
    { id: 'education', label: 'Education', icon: '🎓', bgColor: 'bg-teal-100', textColor: 'text-teal-700', progressFrom: 'from-teal-400', progressTo: 'to-teal-600' },
    { id: 'retirement', label: 'Retirement', icon: '🏖️', bgColor: 'bg-red-100', textColor: 'text-red-700', progressFrom: 'from-red-400', progressTo: 'to-red-600' },
    { id: 'debt', label: 'Debt Payoff', icon: '💳', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', progressFrom: 'from-yellow-400', progressTo: 'to-yellow-600' },
    { id: 'other', label: 'Other', icon: '🎯', bgColor: 'bg-slate-100', textColor: 'text-slate-700', progressFrom: 'from-slate-400', progressTo: 'to-slate-600' }
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
        currentAmount: Number(currentAmount) || 0,
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
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate);
    setNotes(goal.notes);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditingGoal(null);
    setGoalName('');
    setCategory('savings');
    setTargetAmount('');
    setCurrentAmount('');
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
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
            <div className="text-xs opacity-75">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">Your Financial Goals</h2>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          >
            + Add New Goal
          </button>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-300">
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
          <div className="grid lg:grid-cols-2 gap-6">
            {goals.map(goal => {
              const categoryInfo = getCategoryInfo(goal.category);
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysRemaining = calculateDaysRemaining(goal.targetDate);
              const isOverdue = daysRemaining < 0;
              const isNearDeadline = daysRemaining < 30 && daysRemaining >= 0;

              return (
                <div key={goal.id} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary transition-all shadow-sm hover:shadow-xl">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 ${categoryInfo.bgColor} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                        {categoryInfo.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary mb-1">{goal.name}</h3>
                        <div className={`text-sm font-semibold ${categoryInfo.textColor}`}>
                          {categoryInfo.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-xl"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-xl"
                        title="Delete"
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
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${categoryInfo.progressFrom} ${categoryInfo.progressTo} transition-all duration-500 rounded-full`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-bold text-slate-700">{progress.toFixed(1)}% Complete</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1">Remaining</div>
                      <div className="text-lg font-bold text-secondary">
                        {formatCompact(goal.targetAmount - goal.currentAmount)}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      isOverdue ? 'bg-red-50 border border-red-200' : 
                      isNearDeadline ? 'bg-orange-50 border border-orange-200' : 
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className={`text-xs mb-1 ${
                        isOverdue ? 'text-red-600' : 
                        isNearDeadline ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        Time Left
                      </div>
                      <div className={`text-lg font-bold ${
                        isOverdue ? 'text-red-700' : 
                        isNearDeadline ? 'text-orange-700' : 
                        'text-green-700'
                      }`}>
                        {isOverdue ? `${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days`}
                      </div>
                    </div>
                  </div>

                  {/* Target Date */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Target Date:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(goal.targetDate).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {goal.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="text-xs text-slate-500 mb-1">Notes:</div>
                      <div className="text-sm text-slate-700">{goal.notes}</div>
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
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          category === cat.id
                            ? 'border-primary bg-primary/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-semibold text-sm">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Target Amount (€) *
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="25000"
                    min="0"
                    step="100"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                {/* Current Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Amount (€)
                  </label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="5000"
                    min="0"
                    step="100"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
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
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </div>

                {/* Preview */}
                {targetAmount && currentAmount && (
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-900">Progress Preview:</span>
                      <span className="text-2xl font-bold text-blue-700">
                        {calculateProgress(Number(currentAmount) || 0, Number(targetAmount)).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${calculateProgress(Number(currentAmount) || 0, Number(targetAmount))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddGoal}
                    disabled={!goalName || !targetAmount || !targetDate}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      !goalName || !targetAmount || !targetDate
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
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
    </SidebarLayout>
  );
}
