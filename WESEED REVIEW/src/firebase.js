import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDedpj1Gq3kFwByie0REzG-QqrMelP4gSc",
  authDomain: "weseed-4bc42.firebaseapp.com",
  projectId: "weseed-4bc42",
  storageBucket: "weseed-4bc42.firebasestorage.app",
  messagingSenderId: "880647036656",
  appId: "1:880647036656:web:64df513bc9aed16af8ec35"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
