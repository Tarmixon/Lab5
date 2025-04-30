import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBorW3ZEWG34MlYwhitm70SAphGJXEgiAk",
    authDomain: "lab4-476da.firebaseapp.com",
    projectId: "lab4-476da",
    storageBucket: "lab4-476da.firebasestorage.app",
    messagingSenderId: "1:592682868228:web:31eace2086f5c9b9015f51",
    appId: "G-P1SCH7FBWB"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація сервісів
export const auth = getAuth(app);
export const db = getFirestore(app);