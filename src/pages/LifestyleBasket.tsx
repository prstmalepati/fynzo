import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, query, orderBy, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';
import TruthScoreCardPremium from '../components/TruthScoreCardPremium';
import LifestyleItemCardPremium from '../components/LifestyleItemCardPremium';
import ItemPickerModalPremium from '../components/ItemPickerModalPremium';

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

export default function LifestyleBasketPremium() {
  const { user } = useAuth();
  const { formatAmount, formatCompact, currency } = useCurrency();
  const [items, setItems] = useState<UserLifestyleItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    try {
      setLoading(true);
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
      setIsAdding(true);
      const itemsRef = collection(db, 'users', user.uid, 'lifestyle_basket');
      await addDoc(itemsRef, {
        ...item,
        addedAt: Timestamp.now()
      });
      
      // IMPORTANT: Reload items after adding
      await loadItems();
      
      setShowPicker(false);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
      setIsAdding(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this item from your basket?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'lifestyle_basket', itemId));
        await loadItems(); // Reload after delete
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<UserLifestyleItem>) => {
    try {
      await updateDoc(doc(db, 'users', user.uid, 'lifestyle_basket', itemId), updates);
      await loadItems(); // Reload after update
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-teal-400/30 border-t-teal-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-700 font-semibold text-xl">Loading your lifestyle...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
        {/* PREMIUM HERO SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary via-slate-800 to-secondary py-20 px-8">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }}></div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6 animate-fadeInUp">
              <div className="text-7xl animate-float">🛒</div>
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-6xl font-bold text-white" style={{ fontFamily: "'Crimson Pro', serif", letterSpacing: '-0.02em' }}>
                    Lifestyle Basket
                  </h1>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl">
                    💎 Premium
                  </span>
                </div>
                <p className="text-teal-200 text-2xl font-medium">
                  Track the <strong className="text-white">real</strong> inflation of YOUR lifestyle
                </p>
              </div>
            </div>

            {/* Premium Stats Bar */}
            {items.length > 0 && (
              <div className="mt-10 grid md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-teal-300 text-sm font-semibold uppercase tracking-wider mb-2">Items Tracked</div>
                  <div className="text-5xl font-bold text-white font-manrope">{items.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-teal-300 text-sm font-semibold uppercase tracking-wider mb-2">Your Inflation</div>
                  <div className="text-5xl font-bold text-white font-manrope">{(weightedInflation * 100).toFixed(1)}%</div>
                  <div className="text-teal-200 text-sm mt-1">vs CPI: 2.0%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-teal-300 text-sm font-semibold uppercase tracking-wider mb-2">Future Cost</div>
                  <div className="text-5xl font-bold text-white font-manrope">{formatCompact(totalFutureCost)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Truth Score (Premium) */}
          {items.length > 0 && (
            <div className="mb-16 animate-fadeInUp">
              <TruthScoreCardPremium
                items={items}
                totalCurrentCost={totalCurrentCost}
                totalFutureCost={totalFutureCost}
                weightedInflation={weightedInflation}
              />
            </div>
          )}

          {/* PREMIUM EMPTY STATE */}
          {items.length === 0 && (
            <div className="relative">
              {/* Decorative Background Blobs */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>

              <div className="relative bg-white rounded-3xl p-20 border-2 border-slate-200 shadow-2xl text-center animate-fadeInUp">
                <div className="text-9xl mb-8 animate-float">🛒</div>
                <h2 className="text-5xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif", letterSpacing: '-0.02em' }}>
                  Your Lifestyle Journey Starts Here
                </h2>
                <p className="text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Stop using generic <span className="text-slate-400 line-through">2%</span> inflation. 
                  Track what <strong className="text-primary">YOU</strong> actually want to buy—
                  <span className="font-semibold">Porsches, private schools, prime real estate</span>—
                  and see the <strong className="text-primary">real</strong> cost of your lifestyle.
                </p>

                <button
                  onClick={() => setShowPicker(true)}
                  className="group relative px-12 py-6 bg-gradient-to-r from-primary via-teal-600 to-primary text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span>Add Your First Item</span>
                    <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  {/* Animated Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  {/* Animated Background Pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Premium Example Items */}
                <div className="mt-16 text-left max-w-4xl mx-auto">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Popular Luxury Items:</div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { emoji: '🏎️', name: 'Porsche 911 Turbo', inflation: '8%/yr', cost: '€180K' },
                      { emoji: '🎓', name: 'Private School (UK)', inflation: '15%/yr', cost: '€30K/yr' },
                      { emoji: '🏠', name: 'Prime London Flat', inflation: '7%/yr', cost: '€2M' }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</div>
                        <div className="font-bold text-xl text-secondary mb-1">{item.name}</div>
                        <div className="text-primary font-bold text-lg mb-1">{item.inflation}</div>
                        <div className="text-slate-600 text-sm">{item.cost}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PREMIUM ITEMS DISPLAY */}
          {items.length > 0 && (
            <div className="space-y-12">
              {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => (
                <div 
                  key={category} 
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${categoryIndex * 0.15}s` }}
                >
                  {/* Premium Category Header */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl animate-float" style={{ animationDelay: `${categoryIndex * 0.3}s` }}>
                      {categoryItems[0].emoji}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-secondary capitalize mb-2" style={{ fontFamily: "'Crimson Pro', serif", letterSpacing: '-0.01em' }}>
                        {category.replace('-', ' ')}
                      </h2>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span className="font-semibold">{categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-primary">{formatCompact(categoryItems.reduce((sum, item) => sum + item.currentCost, 0))} total</span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Item Cards */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {categoryItems.map((item, itemIndex) => (
                      <div 
                        key={item.id}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${(categoryIndex * 0.15) + (itemIndex * 0.1)}s` }}
                      >
                        <LifestyleItemCardPremium
                          item={item}
                          onRemove={handleRemoveItem}
                          onUpdate={handleUpdateItem}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PREMIUM FLOATING ADD BUTTON */}
          {items.length > 0 && (
            <button
              onClick={() => setShowPicker(true)}
              className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-primary via-teal-600 to-primary text-white rounded-3xl shadow-2xl hover:shadow-primary/60 hover:scale-110 transition-all duration-300 flex items-center justify-center text-4xl font-bold z-50 group animate-float"
              style={{ animationDuration: '3s' }}
            >
              <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
            </button>
          )}

          {/* Item Picker Modal */}
          {showPicker && (
            <ItemPickerModalPremium
              onAdd={handleAddItem}
              onClose={() => setShowPicker(false)}
              isAdding={isAdding}
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
