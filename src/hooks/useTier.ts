import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../firebase/config';
import { TIER_LIMITS, TierType, TierLimits } from '../constants/tiers';

interface TierInfo {
  tier: TierType;
  isPremium: boolean;
  isFree: boolean;
  limits: TierLimits;
  loading: boolean;
  canUseFeature: (feature: keyof TierLimits) => boolean;
  checkLimit: (feature: 'maxAssets' | 'projectionYears' | 'bankConnections' | 'maxScenarios' | 'familyMembers', currentCount: number) => boolean;
}

/**
 * Hook for managing user tier and feature access
 * 
 * Usage:
 * const { isPremium, limits, canUseFeature } = useTier();
 * 
 * if (!canUseFeature('advancedProjections')) {
 *   return <PaywallModal />;
 * }
 */
export function useTier(): TierInfo {
  const { user } = useAuth();
  const [tier, setTier] = useState<TierType>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Listen for real-time tier updates
      const unsubscribe = firestore
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
          const data = doc.data();
          const userTier = data?.tier || 'free';
          setTier(userTier);
          setLoading(false);
        }, error => {
          console.error('Error loading tier:', error);
          setTier('free');
          setLoading(false);
        });
      
      return unsubscribe;
    } else {
      // Not logged in - default to free
      setTier('free');
      setLoading(false);
    }
  }, [user]);

  const limits = TIER_LIMITS[tier];
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';

  /**
   * Check if user can use a specific feature
   */
  const canUseFeature = (feature: keyof TierLimits): boolean => {
    const value = limits[feature];
    
    // For boolean features, return the value directly
    if (typeof value === 'boolean') {
      return value;
    }
    
    // For numeric features, return true if limit > 0
    if (typeof value === 'number') {
      return value > 0;
    }
    
    // For string features (like exportFrequency), check if not restricted
    return value !== 'weekly';
  };

  /**
   * Check if user has reached a limit
   * Returns true if within limit, false if exceeded
   */
  const checkLimit = (
    feature: 'maxAssets' | 'projectionYears' | 'bankConnections' | 'maxScenarios' | 'familyMembers',
    currentCount: number
  ): boolean => {
    const limit = limits[feature];
    return currentCount < limit;
  };

  return {
    tier,
    isPremium,
    isFree,
    limits,
    loading,
    canUseFeature,
    checkLimit
  };
}

/**
 * Hook to check if a specific premium feature is available
 * Shows paywall modal if not available
 * 
 * Usage:
 * const { hasAccess, showPaywall } = usePremiumFeature('advancedProjections');
 * 
 * if (!hasAccess) {
 *   return showPaywall;
 * }
 */
export function usePremiumFeature(feature: keyof TierLimits) {
  const { canUseFeature } = useTier();
  const hasAccess = canUseFeature(feature);
  
  return {
    hasAccess,
    locked: !hasAccess
  };
}
