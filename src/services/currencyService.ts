import { firestore } from '../firebase/config';

// Exchange Rate API - Free tier: 1,500 requests/month
// Sign up at: https://www.exchangerate-api.com
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || 'demo-key';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export interface ExchangeRates {
  base: string;
  rates: {
    EUR: number;
    USD: number;
    GBP: number;
    INR: number;
    CAD: number;
  };
  timestamp: number;
}

/**
 * Get current exchange rates (cached for 24 hours in Firestore)
 * Falls back to reasonable defaults if API fails
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    // Check Firestore cache first
    const cacheRef = firestore.collection('system').doc('exchange_rates');
    const cacheDoc = await cacheRef.get();
    
    if (cacheDoc.exists) {
      const data = cacheDoc.data() as ExchangeRates;
      const hoursSinceUpdate = (Date.now() - data.timestamp) / (1000 * 60 * 60);
      
      // Use cache if less than 24 hours old
      if (hoursSinceUpdate < 24) {
        console.log('Using cached exchange rates');
        return data;
      }
    }
    
    // Fetch fresh rates from API
    console.log('Fetching fresh exchange rates from API');
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/EUR`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    
    if (data.result !== 'success') {
      throw new Error('Exchange rate API returned error');
    }
    
    const rates: ExchangeRates = {
      base: 'EUR',
      rates: {
        EUR: 1,
        USD: data.conversion_rates.USD,
        GBP: data.conversion_rates.GBP,
        INR: data.conversion_rates.INR,
        CAD: data.conversion_rates.CAD
      },
      timestamp: Date.now()
    };
    
    // Update cache in Firestore
    await cacheRef.set(rates);
    
    console.log('Exchange rates updated:', rates);
    return rates;
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return reasonable fallback rates (approximate as of Feb 2026)
    return {
      base: 'EUR',
      rates: {
        EUR: 1,
        USD: 1.09,
        GBP: 0.86,
        INR: 91.24,
        CAD: 1.48
      },
      timestamp: Date.now()
    };
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return amount;
  
  try {
    const rates = await getExchangeRates();
    
    // Convert to EUR first (our base currency)
    const amountInEUR = amount / rates.rates[from as keyof typeof rates.rates];
    
    // Then convert to target currency
    const convertedAmount = amountInEUR * rates.rates[to as keyof typeof rates.rates];
    
    return convertedAmount;
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount; // Return original amount if conversion fails
  }
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string, decimals: number = 0): string {
  const symbols: { [key: string]: string } = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    INR: '₹',
    CAD: '$'
  };
  
  const symbol = symbols[currency] || currency;
  
  // For INR, use Indian number format (lakhs/crores)
  if (currency === 'INR') {
    return `${symbol}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  }
  
  // For other currencies, use standard format
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/**
 * Format currency amount with K/M abbreviations for large numbers
 */
export function formatCurrencyCompact(amount: number, currency: string): string {
  const symbols: { [key: string]: string } = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    INR: '₹',
    CAD: '$'
  };
  
  const symbol = symbols[currency] || currency;
  
  // For INR, use lakhs/crores
  if (currency === 'INR') {
    if (amount >= 10000000) { // 1 crore
      return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `${symbol}${(amount / 100000).toFixed(1)}L`;
    }
  }
  
  // For other currencies, use K/M/B
  if (amount >= 1000000000) {
    return `${symbol}${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  
  return formatCurrency(amount, currency, 0);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    INR: '₹',
    CAD: '$'
  };
  
  return symbols[currency] || currency;
}

/**
 * Parse currency string to number
 */
export function parseCurrencyString(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}
