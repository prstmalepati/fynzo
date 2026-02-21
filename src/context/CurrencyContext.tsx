import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF'
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const formatAmount = (amount: number): string => {
    const symbol = currencySymbols[currency];
    
    // Format with proper separators
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return `${symbol}${formatted}`;
  };

  const formatCompact = (amount: number): string => {
    const symbol = currencySymbols[currency];
    
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
    
    return `${symbol}${amount.toFixed(0)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, formatCompact }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
