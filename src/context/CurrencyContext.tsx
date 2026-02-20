import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
  formatPercentage: (value: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<string>('EUR');

  // Load saved currency preference
  useEffect(() => {
    const saved = localStorage.getItem('preferredCurrency');
    if (saved) {
      setCurrency(saved);
    }
  }, []);

  // Save currency preference
  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  // Get currency symbol
  const getCurrencySymbol = (curr: string): string => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'CHF': 'CHF ',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'INR': '₹'
    };
    return symbols[curr] || curr + ' ';
  };

  const symbol = getCurrencySymbol(currency);

  /**
   * PREMIUM FORMATTING - Full numbers with proper grouping
   * Examples:
   *   €1,234,567.89
   *   €1,234,567
   *   $25,000.00
   */
  const formatAmount = (amount: number): string => {
    if (amount === 0) return `${symbol}0`;
    
    const decimals = amount % 1 === 0 ? 0 : 2;
    
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);

    return `${symbol}${formatted}`;
  };

  /**
   * PREMIUM COMPACT - For cards/widgets, but still elegant
   * Examples:
   *   €1.23 million  (not €1.23M)
   *   €450,000       (not €450K)
   *   €15.50 billion (not €15.5B)
   */
  const formatCompact = (amount: number): string => {
    if (amount === 0) return `${symbol}0`;
    
    // For amounts under 100K, show full number
    if (amount < 100_000) {
      return formatAmount(amount);
    }
    
    // For amounts 100K to 1M, show with K but full
    if (amount < 1_000_000) {
      return formatAmount(amount); // Still show full: €850,000
    }
    
    // For millions
    if (amount < 1_000_000_000) {
      const millions = amount / 1_000_000;
      return `${symbol}${millions.toFixed(2)} million`;
    }
    
    // For billions
    const billions = amount / 1_000_000_000;
    return `${symbol}${billions.toFixed(2)} billion`;
  };

  /**
   * Format percentage
   */
  const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  };

  const value = {
    currency,
    setCurrency: handleSetCurrency,
    formatAmount,
    formatCompact,
    formatPercentage
  };

  return (
    <CurrencyContext.Provider value={value}>
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
