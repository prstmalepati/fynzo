import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Your real API key
  authDomain: "fynzo-xxxxx.firebaseapp.com",        // Your real domain
  projectId: "fynzo-xxxxx",                         // Your real project ID
  storageBucket: "fynzo-xxxxx.appspot.com",        // Your real bucket
  messagingSenderId: "123456789012",               // Your real sender ID
  appId: "1:123456789012:web:abcdefghijklmnop"    // Your real app ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
