// =============================================================
// services/marketDataService.ts — Live stock/ETF/crypto prices
// =============================================================
// STRATEGY:
// 1. Try Cloud Function (fetchPrice) — secure, server-side API key
// 2. Fall back to direct client fetch if CF unavailable (dev mode)
// 3. CoinGecko for crypto (free, no key needed)
// Caches in Firestore under market_prices/{symbol}

import { db } from '../firebase/config';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { cloudFetchPrice, cloudFetchPrices } from './cloudFunctions';

export interface MarketPrice {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  name: string;
  exchange: string;
  updatedAt: Date;
  source: string;
}

// Cache duration: 15 minutes during market hours, 6 hours otherwise
const CACHE_DURATION_MS = 15 * 60 * 1000;
const CACHE_DURATION_CLOSED_MS = 6 * 60 * 60 * 1000;

function isMarketOpen(): boolean {
  const now = new Date();
  const hour = now.getUTCHours();
  const day = now.getUTCDay();
  // Rough: Mon-Fri, 8am-9pm UTC covers US + EU market hours
  return day >= 1 && day <= 5 && hour >= 8 && hour <= 21;
}

// ─── Read from Firestore cache ────────────────────────────────
async function getCachedPrice(symbol: string): Promise<MarketPrice | null> {
  try {
    const snap = await getDoc(doc(db, 'market_prices', symbol.toUpperCase()));
    if (!snap.exists()) return null;
    const data = snap.data();
    const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);
    const maxAge = isMarketOpen() ? CACHE_DURATION_MS : CACHE_DURATION_CLOSED_MS;
    if (Date.now() - updatedAt.getTime() > maxAge) return null; // stale
    return { ...data, updatedAt } as MarketPrice;
  } catch {
    return null;
  }
}

async function setCachedPrice(price: MarketPrice): Promise<void> {
  try {
    await setDoc(doc(db, 'market_prices', price.symbol.toUpperCase()), {
      ...price,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error('Cache write failed:', err);
  }
}

// ─── Twelve Data (primary) ────────────────────────────────────
// API key stored in Firestore system config or env
async function getApiKey(): Promise<string> {
  try {
    const snap = await getDoc(doc(db, 'system', 'api_keys'));
    if (snap.exists()) return snap.data().twelveData || '';
  } catch {}
  return import.meta.env.VITE_TWELVE_DATA_KEY || '';
}

async function fetchFromTwelveData(symbol: string): Promise<MarketPrice | null> {
  const apiKey = await getApiKey();
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code || !data.close) return null;
    return {
      symbol: data.symbol || symbol.toUpperCase(),
      price: parseFloat(data.close),
      previousClose: parseFloat(data.previous_close || data.close),
      change: parseFloat(data.change || '0'),
      changePercent: parseFloat(data.percent_change || '0'),
      currency: data.currency || 'USD',
      name: data.name || symbol,
      exchange: data.exchange || '',
      updatedAt: new Date(),
      source: 'twelvedata',
    };
  } catch {
    return null;
  }
}

// ─── CoinGecko for crypto (free, no key) ──────────────────────
const CRYPTO_MAP: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', ADA: 'cardano',
  DOT: 'polkadot', XRP: 'ripple', DOGE: 'dogecoin', MATIC: 'matic-network',
  AVAX: 'avalanche-2', LINK: 'chainlink', BNB: 'binancecoin',
};

async function fetchFromCoinGecko(symbol: string): Promise<MarketPrice | null> {
  const id = CRYPTO_MAP[symbol.toUpperCase()];
  if (!id) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd,eur&include_24hr_change=true`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coin = data[id];
    if (!coin) return null;
    return {
      symbol: symbol.toUpperCase(),
      price: coin.usd,
      previousClose: coin.usd / (1 + (coin.usd_24h_change || 0) / 100),
      change: coin.usd - (coin.usd / (1 + (coin.usd_24h_change || 0) / 100)),
      changePercent: coin.usd_24h_change || 0,
      currency: 'USD',
      name: id.charAt(0).toUpperCase() + id.slice(1),
      exchange: 'Crypto',
      updatedAt: new Date(),
      source: 'coingecko',
    };
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────

export async function fetchLivePrice(symbol: string): Promise<MarketPrice | null> {
  if (!symbol?.trim()) return null;
  const sym = symbol.trim().toUpperCase();

  // 1. Check Firestore cache
  const cached = await getCachedPrice(sym);
  if (cached) return cached;

  // 2. Try crypto first if it's a known crypto symbol (free, no key)
  if (CRYPTO_MAP[sym]) {
    const crypto = await fetchFromCoinGecko(sym);
    if (crypto) { await setCachedPrice(crypto); return crypto; }
  }

  // 3. Try Cloud Function (secure, server-side API key)
  try {
    const cloudResult = await cloudFetchPrice(sym);
    if (cloudResult && cloudResult.price) {
      const mp: MarketPrice = {
        symbol: cloudResult.symbol, price: cloudResult.price,
        previousClose: cloudResult.previousClose, change: cloudResult.change,
        changePercent: cloudResult.changePercent, currency: cloudResult.currency,
        name: cloudResult.name, exchange: cloudResult.exchange,
        updatedAt: new Date(cloudResult.updatedAt), source: cloudResult.source,
      };
      return mp;
    }
  } catch {
    // Cloud Function not deployed — fall back to direct client fetch
  }

  // 4. Fallback: Direct Twelve Data fetch from client (dev mode)
  const stock = await fetchFromTwelveData(sym);
  if (stock) { await setCachedPrice(stock); return stock; }

  // 5. Try crypto as last resort
  const cryptoFallback = await fetchFromCoinGecko(sym);
  if (cryptoFallback) { await setCachedPrice(cryptoFallback); return cryptoFallback; }

  return null;
}

// Batch fetch for multiple symbols (used by dashboard)
export async function fetchMultiplePrices(symbols: string[]): Promise<Map<string, MarketPrice>> {
  const results = new Map<string, MarketPrice>();
  const unique = [...new Set(symbols.map(s => s.trim().toUpperCase()).filter(Boolean))];

  // Try Cloud Function batch first
  try {
    const cloudResults = await cloudFetchPrices(unique.slice(0, 10));
    for (const [sym, data] of Object.entries(cloudResults)) {
      if (data && data.price) {
        results.set(sym, {
          symbol: data.symbol, price: data.price,
          previousClose: data.previousClose, change: data.change,
          changePercent: data.changePercent, currency: data.currency,
          name: data.name, exchange: data.exchange,
          updatedAt: new Date(data.updatedAt), source: data.source,
        });
      }
    }
    // If cloud handled everything, return
    if (unique.every(s => results.has(s))) return results;
  } catch {
    // Cloud Functions not available, fall back to individual fetches
  }

  // Fallback: fetch remaining individually
  const remaining = unique.filter(s => !results.has(s));
  const batchSize = 4;
  for (let i = 0; i < remaining.length; i += batchSize) {
    const batch = remaining.slice(i, i + batchSize);
    const promises = batch.map(async sym => {
      const price = await fetchLivePrice(sym);
      if (price) results.set(sym, price);
    });
    await Promise.all(promises);
    if (i + batchSize < remaining.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return results;
}

// Get all cached prices (for offline/quick display)
export async function getAllCachedPrices(): Promise<Map<string, MarketPrice>> {
  const results = new Map<string, MarketPrice>();
  try {
    const snap = await getDocs(collection(db, 'market_prices'));
    snap.docs.forEach(d => {
      const data = d.data();
      results.set(d.id, { ...data, updatedAt: data.updatedAt?.toDate?.() || new Date() } as MarketPrice);
    });
  } catch {}
  return results;
}
