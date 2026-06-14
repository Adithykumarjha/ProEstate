// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREVASE_API_KEY,
  authDomain: "proestate-c3244.firebaseapp.com",
  projectId: "proestate-c3244",
  storageBucket: "proestate-c3244.firebasestorage.app",
  messagingSenderId: "93580921491",
  appId: "1:93580921491:web:0ea5d1d06b1429b584db66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);