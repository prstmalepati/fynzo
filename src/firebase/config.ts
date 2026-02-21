import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBIXXj5B2bvmwIwbFOQIAgkxJGpwqCDwrY",
  authDomain: "myfynzo.firebaseapp.com",
  projectId: "myfynzo",
  storageBucket: "myfynzo.firebasestorage.app",
  messagingSenderId: "722972966832",
  appId: "1:722972966832:web:f31a649d8d75fee2f32075",
  measurementId: "G-HXZKYF3EEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;