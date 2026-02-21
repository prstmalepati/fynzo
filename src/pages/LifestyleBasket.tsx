import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { useToast } from '../context/ToastContext';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface LifestyleItem {
  id: string;
  name: string;
  category: string;
  cost: number;
  frequency: 'one-time' | 'recurring';
  targetYear: number;
  inflationRate: number;
  icon: string;
  notes: string;
  createdAt: Date;
}

export default function LifestyleBasket() {
  const { formatAmount, formatCompact } = useCurrency();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [items, setItems] = useState<LifestyleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LifestyleItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LifestyleItem | null>(null);
  
  // Form fields
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('travel');
  const [cost, setCost] = useState(0);
  const [frequency, setFrequency] = useState<'one-time' | 'recurring'>('one-time');
  const [targetYear, setTargetYear] = useState(2030);
  const [inflationRate, setInflationRate] = useState(3);
  const [notes, setNotes] = useState('');

  const categories = [
    { id: 'travel', label: 'Travel', icon: '✈️', color: 'blue' },
    { id: 'home', label: 'Home & Property', icon: '🏠', color: 'green' },
    { id: 'car', label: 'Vehicle', icon: '🚗', color: 'red' },
    { id: 'education', label: 'Education', icon: '🎓', color: 'purple' },
    { id: 'hobby', label: 'Hobby', icon: '🎨', color: 'orange' },
    { id: 'health', label: 'Health & Wellness', icon: '💪', color: 'teal' },
    { id: 'luxury', label: 'Luxury', icon: '💎', color: 'pink' },
    { id: 'other', label: 'Other', icon: '🎯', color: 'slate' }
  ];

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    if (!user) return;
    
    try {
      const itemsRef = collection(db, 'users', user.uid, 'lifestyleBasket');
      const snapshot = await getDocs(itemsRef);
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as LifestyleItem[];
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAddItem = async () => {
    if (!user || !itemName || !cost) {
      showToast('Please fill in all required fields');
      return;
    }

    try {
      const categoryInfo = categories.find(c => c.id === category);
      
      const itemData = {
        name: itemName,
        category,
        cost: Number(cost),
        frequency,
        targetYear: Number(targetYear),
        inflationRate: Number(inflationRate),
        icon: categoryInfo?.icon || '🎯',
        notes,
        createdAt: new Date()
      };

      if (editingItem) {
        await updateDoc(doc(db, 'users', user.uid, 'lifestyleBasket', editingItem.id), itemData);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'lifestyleBasket'), itemData);
      }

      resetForm();
      loadItems();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      showToast('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user || !confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'lifestyleBasket', itemId));
      loadItems();
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Failed to delete item.');
    }
  };

  const handleEditItem = (item: LifestyleItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setCategory(item.category);
    setCost(item.cost);
    setFrequency(item.frequency);
    setTargetYear(item.targetYear);
    setInflationRate(item.inflationRate);
    setNotes(item.notes);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setItemName('');
    setCategory('travel');
    setCost(0);
    setFrequency('one-time');
    setTargetYear(2030);
    setInflationRate(3);
    setNotes('');
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  };

  const calculateFutureValue = (currentCost: number, years: number, inflationRate: number) => {
    return currentCost * Math.pow(1 + inflationRate / 100, years);
  };

  const totalCurrentCost = items.reduce((sum, item) => sum + item.cost, 0);
  const totalFutureValue = items.reduce((sum, item) => {
    const years = item.targetYear - new Date().getFullYear();
    return sum + calculateFutureValue(item.cost, years, item.inflationRate);
  }, 0);

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title" >
            Lifestyle Basket
          </h1>
          <p className="text-surface-900-500">
            Plan and track your future lifestyle purchases with inflation projection
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Items</div>
            <div className="text-3xl lg:text-4xl font-bold mb-1">{items.length}</div>
            <div className="text-xs opacity-75">Lifestyle purchases planned</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Today's Cost</div>
            <div className="text-3xl lg:text-4xl font-bold mb-1">{formatCompact(totalCurrentCost)}</div>
            <div className="text-xs opacity-75">{formatAmount(totalCurrentCost)}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Future Value</div>
            <div className="text-3xl lg:text-4xl font-bold mb-1">{formatCompact(totalFutureValue)}</div>
            <div className="text-xs opacity-75">With inflation</div>
          </div>
        </div>

        {/* Add Item Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-surface-900">Your Basket</h2>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          >
            + Add Item
          </button>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-secondary-200">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">Your Basket is Empty</h3>
            <p className="text-surface-900-500 mb-6">Start adding your future lifestyle purchases!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const categoryInfo = getCategoryInfo(item.category);
              const currentYear = new Date().getFullYear();
              const yearsUntilTarget = item.targetYear - currentYear;
              const futureValue = calculateFutureValue(item.cost, yearsUntilTarget, item.inflationRate);
              const increase = futureValue - item.cost;
              const percentageIncrease = ((increase / item.cost) * 100).toFixed(0);

              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl p-6 border border-secondary-200 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${categoryInfo.color}-100 rounded-xl flex items-center justify-center text-2xl`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-surface-900">{item.name}</h3>
                        <div className={`text-xs font-semibold text-${categoryInfo.color}-600`}>
                          {categoryInfo.label}
                        </div>
                      </div>
                    </div>
                    {item.frequency === 'recurring' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        🔄 Recurring
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-900-500">Today:</span>
                      <span className="font-bold text-surface-900-900">{formatAmount(item.cost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-900-500">In {item.targetYear}:</span>
                      <span className="font-bold text-primary">{formatAmount(futureValue)}</span>
                    </div>
                    <div className="pt-3 border-t border-secondary-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-orange-600">+{percentageIncrease}%</span>
                        <span className="text-surface-900-500">{yearsUntilTarget} years</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-${getCategoryInfo(selectedItem.category).color}-100 rounded-xl flex items-center justify-center text-3xl`}>
                    {selectedItem.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-surface-900">{selectedItem.name}</h2>
                    <div className="text-surface-900-500">{getCategoryInfo(selectedItem.category).label}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-surface-900-300 hover:text-surface-900-500 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* COMPACT PROJECTION CARDS - THE FIX! */}
              <div className="space-y-4 mb-6">
                {/* Today & Future - Side by Side (COMPACT) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Today Card */}
                  <div className="bg-white rounded-xl p-4 border border-secondary-200">
                    <div className="text-xs font-semibold text-surface-900-500 mb-1">TODAY</div>
                    <div className="text-2xl font-bold text-surface-900-900 mb-1">
                      {formatCompact(selectedItem.cost)}
                    </div>
                    <div className="text-xs text-surface-900-400">
                      {formatAmount(selectedItem.cost)}
                    </div>
                  </div>

                  {/* Future Card */}
                  <div className="bg-gradient-to-br from-primary to-teal-600 rounded-xl p-4 shadow-md">
                    <div className="text-xs font-semibold text-white/80 mb-1">
                      IN {selectedItem.targetYear}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCompact(calculateFutureValue(
                        selectedItem.cost,
                        selectedItem.targetYear - new Date().getFullYear(),
                        selectedItem.inflationRate
                      ))}
                    </div>
                    <div className="text-xs text-white/70">
                      {formatAmount(calculateFutureValue(
                        selectedItem.cost,
                        selectedItem.targetYear - new Date().getFullYear(),
                        selectedItem.inflationRate
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inflation Impact - Compact */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-900">
                      INFLATION IMPACT
                    </span>
                    <span className="text-xl font-bold text-orange-700">
                      {selectedItem.inflationRate}%/yr
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-orange-200 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                      style={{
                        width: `${(
                          (calculateFutureValue(selectedItem.cost, selectedItem.targetYear - new Date().getFullYear(), selectedItem.inflationRate) - selectedItem.cost) / 
                          calculateFutureValue(selectedItem.cost, selectedItem.targetYear - new Date().getFullYear(), selectedItem.inflationRate)
                        ) * 100}%`
                      }}
                    />
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-orange-700">Total Increase</div>
                      <div className="font-bold text-orange-900">
                        +{formatCompact(
                          calculateFutureValue(selectedItem.cost, selectedItem.targetYear - new Date().getFullYear(), selectedItem.inflationRate) - selectedItem.cost
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-orange-700">Percentage</div>
                      <div className="font-bold text-orange-900">
                        +{(((calculateFutureValue(selectedItem.cost, selectedItem.targetYear - new Date().getFullYear(), selectedItem.inflationRate) - selectedItem.cost) / selectedItem.cost) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline - Compact */}
                <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📅</span>
                        <span className="text-xs text-surface-900-500">Timeline</span>
                      </div>
                      <div className="text-lg font-bold text-surface-900">
                        {selectedItem.targetYear - new Date().getFullYear()} years
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs text-surface-900-500">Target Year</span>
                        <span className="text-lg">🎯</span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {selectedItem.targetYear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-secondary-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-surface-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-surface-900-500">Category:</span>
                    <span className="font-semibold">{getCategoryInfo(selectedItem.category).label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-900-500">Frequency:</span>
                    <span className="font-semibold capitalize">{selectedItem.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-900-500">Inflation Rate:</span>
                    <span className="font-semibold">{selectedItem.inflationRate}% per year</span>
                  </div>
                  {selectedItem.notes && (
                    <div className="pt-3 border-t border-secondary-200">
                      <div className="text-sm text-surface-900-500 mb-1">Notes:</div>
                      <div className="text-surface-900-900">{selectedItem.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    handleEditItem(selectedItem);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 border border-secondary-200 text-surface-900-700 rounded-xl font-semibold hover:bg-secondary-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-surface-900">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="text-surface-900-300 hover:text-surface-900-500 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g., Yacht Charter (Week), Tesla Model S, Luxury Watch"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-surface-900-700 mb-2">
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
                            : 'border-secondary-200 hover:border-secondary-200'
                        }`}
                      >
                        <div className="text-2xl mb-1">{cat.icon}</div>
                        <div className="text-xs font-semibold">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cost and Frequency */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                      Cost *
                    </label>
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as 'one-time' | 'recurring')}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="one-time">One-time</option>
                      <option value="recurring">Recurring</option>
                    </select>
                  </div>
                </div>

                {/* Target Year and Inflation */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                      Target Year
                    </label>
                    <input
                      type="number"
                      value={targetYear}
                      onChange={(e) => setTargetYear(Number(e.target.value))}
                      min={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                      Inflation Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      step="0.1"
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-surface-900-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details..."
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddItem}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-6 py-3 border border-secondary-200 text-surface-900-700 rounded-xl font-semibold hover:bg-secondary-50 transition-colors"
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
