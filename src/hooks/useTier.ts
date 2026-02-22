import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { TIER_LIMITS, TierType, TierLimits } from '../constants/tiers';

// Premium users — add emails here to grant premium access
// In production, this would come from a Stripe webhook writing to Firestore
const PREMIUM_EMAILS: string[] = [
  // Add premium user emails here
  // 'premium@example.com',
];

interface TierInfo {
  tier: TierType;
  isPremium: boolean;
  isFree: boolean;
  limits: TierLimits;
  loading: boolean;
  canUseFeature: (feature: keyof TierLimits) => boolean;
  checkLimit: (feature: 'maxAssets' | 'projectionYears' | 'bankConnections' | 'maxScenarios' | 'familyMembers', currentCount: number) => boolean;
}

export function useTier(): TierInfo {
  const { user } = useAuth();
  const [tier, setTier] = useState<TierType>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTier('free');
      setLoading(false);
      return;
    }

    // Check hardcoded premium list first
    if (user.email && PREMIUM_EMAILS.includes(user.email)) {
      setTier('premium');
      setLoading(false);
      return;
    }

    // Listen for real-time tier from Firestore profile
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        const data = snap.data();
        const userTier = (data?.tier as TierType) || 'free';
        setTier(userTier);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading tier:', error);
        setTier('free');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const limits = TIER_LIMITS[tier];
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';

  const canUseFeature = (feature: keyof TierLimits): boolean => {
    const value = limits[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    return value !== 'weekly';
  };

  const checkLimit = (
    feature: 'maxAssets' | 'projectionYears' | 'bankConnections' | 'maxScenarios' | 'familyMembers',
    currentCount: number
  ): boolean => {
    return currentCount < limits[feature];
  };

  return { tier, isPremium, isFree, limits, loading, canUseFeature, checkLimit };
}

export function usePremiumFeature(feature: keyof TierLimits) {
  const { canUseFeature } = useTier();
  return { hasAccess: canUseFeature(feature), locked: !canUseFeature(feature) };
}
