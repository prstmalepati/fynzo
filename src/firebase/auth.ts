import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from './config';

// Google Sign In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return { user: null, error: error.message };
  }
};

// Microsoft Sign In
export const signInWithMicrosoft = async () => {
  const provider = new OAuthProvider('microsoft.com');
  provider.addScope('profile');
  provider.addScope('email');
  
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Microsoft sign in error:', error);
    return { user: null, error: error.message };
  }
};

// Apple Sign In
export const signInWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Apple sign in error:', error);
    return { user: null, error: error.message };
  }
};

// Phone Sign In - Step 1: Send verification code
export const sendPhoneVerification = async (
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<{ confirmation: ConfirmationResult | null; error: string | null }> => {
  try {
    // Initialize reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      }
    });

    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmation, error: null };
  } catch (error: any) {
    console.error('Phone verification error:', error);
    return { confirmation: null, error: error.message };
  }
};

// Phone Sign In - Step 2: Verify code
export const verifyPhoneCode = async (
  confirmation: ConfirmationResult,
  code: string
) => {
  try {
    const result = await confirmation.confirm(code);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Code verification error:', error);
    return { user: null, error: error.message };
  }
};

// Sign Out
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
};

// Auth State Observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get Current User
export const getCurrentUser = () => {
  return auth.currentUser;
};
