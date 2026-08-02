import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3VgOVHUAnCTFYPftmouRShEGJ6PWHjY0",
  authDomain: "dineverse-db3ea.firebaseapp.com",
  projectId: "dineverse-db3ea",
  storageBucket: "dineverse-db3ea.firebasestorage.app",
  messagingSenderId: "535536768055",
  appId: "1:535536768055:web:6358834ce50b531f04dbb2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
