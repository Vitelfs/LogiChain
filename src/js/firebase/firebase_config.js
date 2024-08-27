import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3U7YjxCDJCmjv_WeCmRr-MWk3m8PRi2Q",
  authDomain: "logichain-8a4e5.firebaseapp.com",
  projectId: "logichain-8a4e5",
  storageBucket: "logichain-8a4e5.appspot.com",
  messagingSenderId: "940006643520",
  appId: "1:940006643520:web:e932b7d8b591c40be18ca5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut };
