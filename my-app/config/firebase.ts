import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcPV6MAFMVzQKL5Tr537ycKutb8IXRqok",
  authDomain: "amdroid-app-e6e67.firebaseapp.com",
  projectId: "amdroid-app-e6e67",
  storageBucket: "amdroid-app-e6e67.firebasestorage.app",
  messagingSenderId: "758156712534",
  appId: "1:758156712534:web:e0c7fbe78ce750f7d5f9f7"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db }; 