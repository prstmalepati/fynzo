import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, firestore } from './config';

/**
 * Initialize user preferences when they sign up
 * Called after successful authentication
 */
export async function createUserPreferences(userId: string) {
  try {
    const userRef = firestore.collection('users').doc(userId);
    
    // Check if user document already exists
    const userDoc = await userRef.get();
    
    // Only create if doesn't exist (new user)
    if (!userDoc.exists) {
      await userRef.set({
        preferences: {
          currency: 'EUR', // Default currency
          locale: navigator.language || 'en-US',
          dateFormat: 'DD/MM/YYYY',
          numberFormat: 'european',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        tier: 'free', // All new users start on free tier
        premiumSince: null,
        stripeCustomerId: null,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('User preferences initialized for:', userId);
    } else {
      // Update timestamp for existing users
      await userRef.update({
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error creating user preferences:', error);
    // Don't throw - auth should still succeed even if preferences fail
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Initialize user preferences
    await createUserPreferences(result.user.uid);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with Microsoft
 */
export async function signInWithMicrosoft() {
  try {
    const provider = new OAuthProvider('microsoft.com');
    const result = await signInWithPopup(auth, provider);
    
    // Initialize user preferences
    await createUserPreferences(result.user.uid);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Microsoft sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple() {
  try {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    
    // Initialize user preferences
    await createUserPreferences(result.user.uid);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Apple sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

/**
 * Get current user's tier
 */
export async function getUserTier(userId: string): Promise<'free' | 'premium'> {
  try {
    const userDoc = await firestore.collection('users').doc(userId).get();
    const data = userDoc.data();
    return data?.tier || 'free';
  } catch (error) {
    console.error('Error getting user tier:', error);
    return 'free';
  }
}

/**
 * Update user tier (for admin/backend use)
 */
export async function updateUserTier(userId: string, tier: 'free' | 'premium') {
  try {
    await firestore.collection('users').doc(userId).update({
      tier,
      premiumSince: tier === 'premium' ? new Date() : null,
      updatedAt: new Date()
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating user tier:', error);
    return { success: false, error: error.message };
  }
}
