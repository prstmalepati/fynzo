import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, orderBy, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import TruthScoreCard from '../components/TruthScoreCard';
import LifestyleItemCard from '../components/LifestyleItemCard';
import ItemPickerModal from '../components/ItemPickerModal';

export interface UserLifestyleItem {
  id: string;
  templateId: string;
  name: string;
  category: string;
  currentCost: number;
  inflationRate: number;
  targetYear: number;
  emoji: string;
  isRecurring: boolean;
}

export default function LifestyleBasket() {
  const { user } = useAuth();
  const { formatAmount, formatCompact, currency } = useCurrency();
  const [items, setItems] = useState<UserLifestyleItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    try {
      const itemsRef = collection(db, 'users', user.uid, 'lifestyle_basket');
      const q = query(itemsRef, orderBy('addedAt', 'desc'));
      const snapshot = await getDocs(q);

      const loadedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserLifestyleItem[];

      setItems(loadedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error loading items:', error);
      setLoading(false);
    }
  };

  const handleAddItem = async (item: Omit<UserLifestyleItem, 'id'>) => {
    try {
      const itemsRef = collection(db, 'users', user.uid, 'lifestyle_basket');
      await addDoc(itemsRef, {
        ...item,
        addedAt: Timestamp.now()
      });
      setShowPicker(false);
      loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this item from your basket?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'lifestyle_basket', itemId));
        loadItems();
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<UserLifestyleItem>) => {
    try {
      await updateDoc(doc(db, 'users', user.uid, 'lifestyle_basket', itemId), updates);
      loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Calculate statistics
  const totalCurrentCost = items.reduce((sum, item) => sum + item.currentCost, 0);
  const totalFutureCost = items.reduce((sum, item) => {
    const years = item.targetYear - new Date().getFullYear();
    return sum + (item.currentCost * Math.pow(1 + item.inflationRate, years));
  }, 0);

  const weightedInflation = items.length > 0
    ? items.reduce((sum, item) => sum + (item.inflationRate * item.currentCost), 0) / totalCurrentCost
    : 0;

  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, UserLifestyleItem[]>);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your lifestyle...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">🛒</div>
            <div>
              <h1 className="text-4xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Lifestyle Basket
              </h1>
              <p className="text-slate-600 text-lg">Track the real inflation of YOUR lifestyle</p>
            </div>
          </div>
        </div>

        {/* Truth Score (if items exist) */}
        {items.length > 0 && (
          <div className="mb-8">
            <TruthScoreCard
              items={items}
              totalCurrentCost={totalCurrentCost}
              totalFutureCost={totalFutureCost}
              weightedInflation={weightedInflation}
            />
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-secondary mb-2">Start Your Lifestyle Basket</h3>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Track what YOU actually want to buy—Porsches, private schools, prime real estate—and see the real cost.
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
            >
              Add Your First Item
            </button>

            {/* Examples */}
            <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { emoji: '🏎️', name: 'Porsche 911', inflation: '8%/yr' },
                { emoji: '🎓', name: 'Private School', inflation: '15%/yr' },
                { emoji: '🏠', name: 'Prime Property', inflation: '7%/yr' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-secondary">{item.name}</div>
                  <div className="text-sm text-primary font-bold">{item.inflation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items by Category */}
        {items.length > 0 && (
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{categoryItems[0].emoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary capitalize" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      {category.replace('-', ' ')}
                    </h2>
                    <p className="text-slate-600">
                      {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Category Items */}
                <div className="grid md:grid-cols-2 gap-4">
                  {categoryItems.map(item => (
                    <LifestyleItemCard
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdate={handleUpdateItem}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        {items.length > 0 && (
          <button
            onClick={() => setShowPicker(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary to-teal-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-3xl font-bold z-50"
          >
            +
          </button>
        )}

        {/* Item Picker Modal */}
        {showPicker && (
          <ItemPickerModal
            onAdd={handleAddItem}
            onClose={() => setShowPicker(false)}
          />
        )}

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </SidebarLayout>
  );
}
