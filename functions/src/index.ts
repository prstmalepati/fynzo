import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// @ts-ignore
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();

// =============================================================
// 1. SCHEDULED: Refresh exchange rates every 6 hours
// =============================================================
export const refreshExchangeRates = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      await db.doc('system/exchange_rates').set({
        rates: data.rates,
        base: 'EUR',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        source: 'exchangerate-api.com',
      });

      console.log('Exchange rates updated:', Object.keys(data.rates).length, 'currencies');
    } catch (err) {
      console.error('Failed to refresh exchange rates:', err);
    }
  });

// =============================================================
// 2. CALLABLE: Fetch live price for a symbol (rate-limited)
// =============================================================
// Client calls this instead of writing to market_prices directly.
// This function fetches from Twelve Data, writes to Firestore cache,
// and returns the price to the client.
export const fetchPrice = functions.https.onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const symbol = (data.symbol || '').trim().toUpperCase();
  if (!symbol || symbol.length > 20) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid symbol.');
  }

  // Check cache first (15 min during market hours, 6h otherwise)
  const cacheRef = db.doc(`market_prices/${symbol}`);
  const cached = await cacheRef.get();
  if (cached.exists) {
    const d = cached.data()!;
    const updatedAt = d.updatedAt?.toDate?.() || new Date(0);
    const ageMinutes = (Date.now() - updatedAt.getTime()) / 60000;
    if (ageMinutes < 15) {
      return { ...d, fromCache: true };
    }
  }

  // Fetch from Twelve Data
  const apiKeyDoc = await db.doc('system/api_keys').get();
  const apiKey = apiKeyDoc.exists ? apiKeyDoc.data()?.twelveData : '';

  if (!apiKey) {
    throw new functions.https.HttpsError('failed-precondition', 'Twelve Data API key not configured.');
  }

  try {
    const res = await fetch(
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
    );
    if (!res.ok) throw new Error(`Twelve Data returned ${res.status}`);
    const quote = await res.json();

    if (quote.code || !quote.close) {
      throw new functions.https.HttpsError('not-found', `No data for symbol: ${symbol}`);
    }

    const priceData = {
      symbol: quote.symbol || symbol,
      price: parseFloat(quote.close),
      previousClose: parseFloat(quote.previous_close || quote.close),
      change: parseFloat(quote.change || '0'),
      changePercent: parseFloat(quote.percent_change || '0'),
      currency: quote.currency || 'USD',
      name: quote.name || symbol,
      exchange: quote.exchange || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'twelvedata',
    };

    // Write to cache (admin SDK bypasses rules)
    await cacheRef.set(priceData);

    return { ...priceData, updatedAt: new Date().toISOString(), fromCache: false };
  } catch (err: any) {
    console.error(`Price fetch failed for ${symbol}:`, err.message);
    // Return cached data if available, even if stale
    if (cached.exists) {
      return { ...cached.data(), fromCache: true, stale: true };
    }
    throw new functions.https.HttpsError('internal', 'Failed to fetch price.');
  }
});

// =============================================================
// 3. CALLABLE: Batch fetch prices (max 10 symbols per call)
// =============================================================
export const fetchPrices = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const symbols: string[] = (data.symbols || [])
    .map((s: string) => s.trim().toUpperCase())
    .filter((s: string) => s.length > 0 && s.length <= 20)
    .slice(0, 10); // Cap at 10

  if (symbols.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'No valid symbols.');
  }

  const results: Record<string, any> = {};

  // Check cache for all symbols first
  const uncached: string[] = [];
  for (const sym of symbols) {
    const cached = await db.doc(`market_prices/${sym}`).get();
    if (cached.exists) {
      const d = cached.data()!;
      const age = (Date.now() - (d.updatedAt?.toDate?.()?.getTime() || 0)) / 60000;
      if (age < 15) {
        results[sym] = { ...d, fromCache: true };
        continue;
      }
    }
    uncached.push(sym);
  }

  // Fetch uncached from Twelve Data (batch endpoint)
  if (uncached.length > 0) {
    const apiKeyDoc = await db.doc('system/api_keys').get();
    const apiKey = apiKeyDoc.exists ? apiKeyDoc.data()?.twelveData : '';

    if (apiKey) {
      try {
        const symbolStr = uncached.join(',');
        const res = await fetch(
          `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolStr)}&apikey=${apiKey}`
        );
        if (res.ok) {
          const body = await res.json();
          // Single symbol returns object, multiple returns array-keyed object
          const quotes = uncached.length === 1 ? { [uncached[0]]: body } : body;

          for (const sym of uncached) {
            const q = quotes[sym];
            if (q && q.close && !q.code) {
              const priceData = {
                symbol: q.symbol || sym,
                price: parseFloat(q.close),
                previousClose: parseFloat(q.previous_close || q.close),
                change: parseFloat(q.change || '0'),
                changePercent: parseFloat(q.percent_change || '0'),
                currency: q.currency || 'USD',
                name: q.name || sym,
                exchange: q.exchange || '',
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                source: 'twelvedata',
              };
              await db.doc(`market_prices/${sym}`).set(priceData);
              results[sym] = { ...priceData, updatedAt: new Date().toISOString(), fromCache: false };
            }
          }
        }
      } catch (err) {
        console.error('Batch price fetch failed:', err);
      }
    }
  }

  return results;
});

// =============================================================
// 4. CALLABLE: Seed tax rules (admin only)
// =============================================================
export const seedTaxRules = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  // Check admin whitelist
  const whitelist = await db.doc('system/admin_whitelist').get();
  if (!whitelist.exists || !(whitelist.data()?.uids || []).includes(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  const rules = data.rules;
  if (!Array.isArray(rules)) {
    throw new functions.https.HttpsError('invalid-argument', 'Expected rules array.');
  }

  let count = 0;
  for (const rule of rules) {
    if (rule.countryCode && rule.year) {
      await db.doc(`tax_rules/${rule.countryCode}/${rule.year}/data`).set(rule);
      count++;
    }
  }

  return { seeded: count };
});

// =============================================================
// 5. CALLABLE: Admin - list all users (admin only)
// =============================================================
export const listUsers = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const whitelist = await db.doc('system/admin_whitelist').get();
  if (!whitelist.exists || !(whitelist.data()?.uids || []).includes(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  const usersSnap = await db.collection('users').get();
  const users = usersSnap.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
    // Strip sensitive fields before sending to client
    passwordHash: undefined,
  }));

  return { users, count: users.length };
});

// =============================================================
// 6. TRIGGER: On user creation — initialize profile
// =============================================================
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const existing = await db.doc(`users/${user.uid}`).get();
    if (!existing.exists) {
      await db.doc(`users/${user.uid}`).set({
        email: user.email || '',
        fullName: user.displayName || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        preferredCurrency: 'EUR',
        locale: 'en',
        country: '',
        notifications: { email: true, push: false, weekly: true },
      });
      console.log(`User profile created for ${user.uid}`);
    }
  } catch (err) {
    console.error('Failed to create user profile:', err);
  }
});

// =============================================================
// 7. TRIGGER: On user deletion — cleanup data
// =============================================================
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user document and all sub-collections
    const subcollections = ['investments', 'goals', 'lifestyleBasket', 'anti_portfolio', 'scenarios'];

    for (const sub of subcollections) {
      const snap = await db.collection(`users/${user.uid}/${sub}`).get();
      const batch = db.batch();
      snap.docs.forEach(doc => batch.delete(doc.ref));
      if (snap.size > 0) await batch.commit();
    }

    // Delete user profile
    await db.doc(`users/${user.uid}`).delete();
    console.log(`User data cleaned up for ${user.uid}`);
  } catch (err) {
    console.error('Failed to cleanup user data:', err);
  }
});

// =============================================================
// 8. CALLABLE: Save API keys (admin only)
// =============================================================
export const saveApiKeys = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const whitelist = await db.doc('system/admin_whitelist').get();
  if (!whitelist.exists || !(whitelist.data()?.uids || []).includes(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required.');
  }

  const allowed = ['twelveData', 'tinkApiKey', 'plaidClientId', 'plaidSecret'];
  const filtered: Record<string, string> = {};
  for (const key of allowed) {
    if (data[key] && typeof data[key] === 'string') {
      filtered[key] = data[key];
    }
  }

  await db.doc('system/api_keys').set(filtered, { merge: true });
  return { saved: Object.keys(filtered) };
});
