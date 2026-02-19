import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { firestore } from '../firebase/config';

type Currency = 'EUR' | 'USD' | 'GBP' | 'INR' | 'CAD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
  convert: (amount: number, from: Currency, to: Currency) => Promise<number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  INR: '₹',
  CAD: '$'
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>('EUR');
  const [loading, setLoading] = useState(true);

  // Load currency from Firestore on mount
  useEffect(() => {
    if (user) {
      loadCurrency();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCurrency = async () => {
    try {
      const doc = await firestore
        .collection('users')
        .doc(user.uid)
        .get();

      if (doc.exists) {
        const savedCurrency = doc.data()?.currency;
        if (savedCurrency) {
          setCurrencyState(savedCurrency);
        }
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);

    // Save to Firestore if user is logged in
    if (user) {
      try {
        await firestore
          .collection('users')
          .doc(user.uid)
          .set({ currency: newCurrency }, { merge: true });
      } catch (error) {
        console.error('Error saving currency:', error);
      }
    }
  };

  const formatAmount = (amount: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `${symbol}${formatted}`;
  };

  const formatCompact = (amount: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}K`;
    }
    
    return `${symbol}${amount.toLocaleString('en-US')}`;
  };

  const convert = async (amount: number, from: Currency, to: Currency): Promise<number> => {
    if (from === to) return amount;
    
    // Simplified conversion - in production, use real exchange rates API
    const rates: Record<Currency, number> = {
      EUR: 1.0,
      USD: 1.1,
      GBP: 0.85,
      INR: 91,
      CAD: 1.45
    };
    
    // Convert to EUR first, then to target currency
    const inEUR = amount / rates[from];
    const inTargetCurrency = inEUR * rates[to];
    
    return inTargetCurrency;
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount,
        formatCompact,
        convert
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
