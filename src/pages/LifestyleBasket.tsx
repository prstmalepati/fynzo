import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTier } from '../hooks/useTier';
import SidebarLayout from '../components/SidebarLayout';
import Paywall from '../components/Paywall';
import { firestore } from '../firebase/config';
import { 
  LIFESTYLE_TEMPLATES, 
  calculateFutureCost, 
  calculateMonthlySavings,
  getCategoryInfo 
} from '../data/lifestyleInflation';
import LifestyleItemCard from '../components/LifestyleItemCard';
import ItemPickerModal from '../components/ItemPickerModal';
import TruthScoreCard from '../components/TruthScoreCard';

export interface UserLifestyleItem {
  id: string;
  templateId: string;
  name: string;
  category: string;
  currentCost: number;
  currency: string;
  inflationRate: number;
  targetYear: number;
  emoji: string;
  isRecurring: boolean;
  addedAt: Date;
}

export default function LifestyleBasket() {
  const { user } = useAuth();
  const { currency, convert, formatAmount } = useCurrency();
  const { isPremium, isFree, limits } = useTier();
  const [items, setItems] = useState<UserLifestyleItem[]>([]);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user's lifestyle basket from Firestore
  useEffect(() => {
    if (user) {
      const unsubscribe = firestore
        .collection('users')
        .doc(user.uid)
        .collection('lifestyle_basket')
        .onSnapshot(snapshot => {
          const loadedItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as UserLifestyleItem[];
          setItems(loadedItems);
          setLoading(false);
        });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user]);

  // Check if user can add more items (free tier limit)
  const canAddItem = isPremium || items.length < (limits?.maxAssets || 3);

  const handleAddItem = async (templateId: string, customCost?: number, targetYear?: number) => {
    if (!user) return;

    const template = LIFESTYLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    // Convert cost to user's currency
    const costInUserCurrency = customCost || await convert(
      template.typicalCost,
      template.currency,
      currency
    );

    const newItem: Omit<UserLifestyleItem, 'id'> = {
      templateId: template.id,
      name: template.name,
      category: template.category,
      currentCost: costInUserCurrency,
      currency: currency,
      inflationRate: template.inflationRate,
      targetYear: targetYear || new Date().getFullYear() + 5,
      emoji: template.emoji,
      isRecurring: template.tags.includes('recurring'),
      addedAt: new Date()
    };

    await firestore
      .collection('users')
      .doc(user.uid)
      .collection('lifestyle_basket')
      .add(newItem);

    setShowItemPicker(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user) return;
    
    if (confirm('Remove this item from your lifestyle basket?')) {
      await firestore
        .collection('users')
        .doc(user.uid)
        .collection('lifestyle_basket')
        .doc(itemId)
        .delete();
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<UserLifestyleItem>) => {
    if (!user) return;
    
    await firestore
      .collection('users')
      .doc(user.uid)
      .collection('lifestyle_basket')
      .doc(itemId)
      .update(updates);
  };

  // Calculate aggregate statistics
  const currentYear = new Date().getFullYear();
  const totalCurrentCost = items.reduce((sum, item) => sum + item.currentCost, 0);
  
  const totalFutureCost = items.reduce((sum, item) => {
    const years = item.targetYear - currentYear;
    const futureCost = calculateFutureCost(item.currentCost, item.inflationRate, years);
    return sum + futureCost;
  }, 0);

  const weightedInflation = items.length > 0
    ? items.reduce((sum, item) => sum + (item.inflationRate * item.currentCost), 0) / totalCurrentCost
    : 0;

  // Show paywall for free users
  if (isFree && !loading) {
    return (
      <SidebarLayout>
        <Paywall 
          feature="Lifestyle Basket"
          description="Track the real inflation of YOUR lifestyle items. See what you'll actually need to maintain your desired standard of living."
          showClose={false}
        />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Lifestyle Basket
          </h1>
          <p className="text-slate-600 text-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Track the real cost of YOUR lifestyle. Generic 2% inflation is a lie.
          </p>
        </div>

        {/* Truth Score - Show if items exist */}
        {items.length > 0 && (
          <TruthScoreCard
            items={items}
            totalCurrentCost={totalCurrentCost}
            totalFutureCost={totalFutureCost}
            weightedInflation={weightedInflation}
          />
        )}

        {/* Summary Stats */}
        {items.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total Today</div>
              <div className="text-3xl font-bold text-secondary">
                {formatAmount(totalCurrentCost)}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-2 border-amber-200 bg-amber-50">
              <div className="text-sm text-amber-800 mb-1">Average Inflation</div>
              <div className="text-3xl font-bold text-amber-700">
                {(weightedInflation * 100).toFixed(1)}%/yr
              </div>
              <div className="text-xs text-amber-600 mt-1">vs CPI: 2.0%</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-2 border-primary bg-teal-50">
              <div className="text-sm text-teal-800 mb-1">Future Total</div>
              <div className="text-3xl font-bold text-primary">
                {formatAmount(totalFutureCost)}
              </div>
            </div>
          </div>
        )}

        {/* Lifestyle Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary">Your Lifestyle Items</h2>
            <span className="text-sm text-slate-600">
              {items.length} {items.length === 1 ? 'item' : 'items'}
              {!isPremium && ` / ${limits.maxAssets} max`}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-secondary mb-2">
                Your basket is empty
              </h3>
              <p className="text-slate-600 mb-6">
                What do you actually want to buy with your wealth?
              </p>
              <button
                onClick={() => setShowItemPicker(true)}
                className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-lg"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {items.map(item => (
                <LifestyleItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveItem(item.id)}
                  onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                />
              ))}
            </div>
          )}

          {/* Add Item Button */}
          {items.length > 0 && (
            <button
              onClick={() => {
                if (!canAddItem) {
                  alert(`Free tier limited to ${limits.maxAssets} items. Upgrade to Premium for unlimited!`);
                  return;
                }
                setShowItemPicker(true);
              }}
              className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary hover:bg-teal-50 transition-all text-slate-600 hover:text-primary font-semibold"
            >
              + Add Lifestyle Item
            </button>
          )}
        </div>

        {/* Educational Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-secondary mb-4">
            💡 Why Lifestyle Inflation Matters
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
            <div>
              <h4 className="font-bold mb-2">Generic Inflation (CPI): 2-3%</h4>
              <p className="text-slate-600">
                Based on average consumer basket: bread, milk, gas, rent.
                Useful for most people, but not for YOU.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Your Lifestyle: 4-8%</h4>
              <p className="text-slate-600">
                Luxury cars, private schools, prime real estate inflate much faster.
                Your €2M goal might actually be €3.2M in real terms.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="font-semibold text-secondary mb-2">Example:</div>
            <div className="text-sm text-slate-700 space-y-1">
              <div>• Porsche 911: +6%/year (doubles in 12 years)</div>
              <div>• Private school: +4.5%/year (€25K → €44K in 15 years)</div>
              <div>• London apartment: +5.5%/year (£1M → £2.3M in 15 years)</div>
            </div>
          </div>
        </div>

        {/* Item Picker Modal */}
        {showItemPicker && (
          <ItemPickerModal
            onSelect={handleAddItem}
            onClose={() => setShowItemPicker(false)}
            userCurrency={currency}
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
