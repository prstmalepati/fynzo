import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type Currency = 'EUR' | 'USD' | 'GBP' | 'INR' | 'CAD';

interface ExchangeRates {
  EUR: number;
  USD: number;
  GBP: number;
  INR: number;
  CAD: number;
  lastUpdated: Date;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => Promise<void>;
  formatAmount: (amount: number, showSymbol?: boolean) => string;
  formatCompact: (amount: number) => string;
  convertAmount: (amount: number, from: Currency, to: Currency) => number;
  exchangeRates: ExchangeRates;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static exchange rates (updated Feb 2026)
// In production, these would come from an API
const STATIC_RATES: ExchangeRates = {
  EUR: 1.00,      // Base currency
  USD: 1.08,      // 1 EUR = 1.08 USD
  GBP: 0.85,      // 1 EUR = 0.85 GBP
  INR: 90.50,     // 1 EUR = 90.50 INR
  CAD: 1.47,      // 1 EUR = 1.47 CAD
  lastUpdated: new Date()
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  INR: '₹',
  CAD: '$'
};

const CURRENCY_NAMES: Record<Currency, string> = {
  EUR: 'Euro',
  USD: 'US Dollar',
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  CAD: 'Canadian Dollar'
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(STATIC_RATES);
  const [loading, setLoading] = useState(true);

  // Load user's currency preference
  useEffect(() => {
    if (user) {
      loadCurrencyPreference();
      // Optionally fetch live rates here
      fetchExchangeRates();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCurrencyPreference = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.currency) {
          setCurrencyState(userData.currency as Currency);
        }
      }
    } catch (error) {
      console.error('Error loading currency preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      // Try to fetch from free API
      // Using exchangerate-api.io (free tier: 1500 requests/month)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      
      if (response.ok) {
        const data = await response.json();
        setExchangeRates({
          EUR: 1.00,
          USD: data.rates.USD || 1.08,
          GBP: data.rates.GBP || 0.85,
          INR: data.rates.INR || 90.50,
          CAD: data.rates.CAD || 1.47,
          lastUpdated: new Date(data.time_last_updated || Date.now())
        });
      } else {
        // Fallback to static rates
        console.log('Using static exchange rates');
        setExchangeRates(STATIC_RATES);
      }
    } catch (error) {
      // Fallback to static rates if API fails
      console.log('Exchange rate API unavailable, using static rates');
      setExchangeRates(STATIC_RATES);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    try {
      setCurrencyState(newCurrency);
      
      // Save to Firestore
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          currency: newCurrency,
          updatedAt: new Date()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const convertAmount = (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    
    // Convert to EUR first (base currency)
    const amountInEUR = amount / exchangeRates[from];
    
    // Then convert to target currency
    return amountInEUR * exchangeRates[to];
  };

  const formatAmount = (amount: number, showSymbol: boolean = true): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    
    // Format with proper number formatting
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    
    return showSymbol ? `${symbol}${formatted}` : formatted;
  };

  const formatCompact = (amount: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}K`;
    } else {
      return `${symbol}${Math.round(amount)}`;
    }
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
        convertAmount,
        exchangeRates
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

export { Currency, CURRENCY_SYMBOLS, CURRENCY_NAMES };
