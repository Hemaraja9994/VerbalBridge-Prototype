// Firebase Configuration for VerbalBridge
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Mock config for prototype
  apiKey: "AIISH-HACKATHON-MOCK-KEY",
  authDomain: "verbal-bridge.firebaseapp.com",
  projectId: "verbal-bridge",
  storageBucket: "verbal-bridge.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
