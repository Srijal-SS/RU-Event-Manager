import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "ru-event-manager.firebaseapp.com",
  projectId: "ru-event-manager",
  storageBucket: "ru-event-manager.firebasestorage.app",
  messagingSenderId: "843317522014",
  appId: "1:843317522014:web:35749d2c17d781ed7b8ecf",
  measurementId: "G-WC5M0GFSET"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);