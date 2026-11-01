// Create firebase.js and add the Firebase configuration/SDK code provided by Firebase.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-platform-87429.firebaseapp.com",
  projectId: "ai-interview-platform-87429",
  storageBucket: "ai-interview-platform-87429.firebasestorage.app",
  messagingSenderId: "245078651991",
  appId: "1:245078651991:web:58121e041590a78f995f12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create Firebase Authentication and Google provider : Use auth and provider with signInWithPopup()
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
