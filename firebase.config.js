import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB4BMlRYqp_zhBOfcNqMxBrzTALvtP8Bf4",
  authDomain: "saibaba-community.firebaseapp.com",
  projectId: "saibaba-community",
  storageBucket: "saibaba-community.firebasestorage.app",
  messagingSenderId: "646552958318",
  appId: "1:646552958318:web:9e2ae4b9dbc2fa50a0bd7f",
  measurementId: "G-DCVL2NVK6G"
};

// Initialize Firebase app (avoid multiple initializations)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth
// Using getAuth directly - Firebase handles persistence automatically in React Native
// For Expo Go, this is the recommended approach
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;

