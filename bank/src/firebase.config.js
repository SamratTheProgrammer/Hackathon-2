// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBALNl0BCu9pIiLW4JC7J138zSDz992T_o",
    authDomain: "digitaldhan-68c0d.firebaseapp.com",
    projectId: "digitaldhan-68c0d",
    storageBucket: "digitaldhan-68c0d.firebasestorage.app",
    messagingSenderId: "1024647884714",
    appId: "1:1024647884714:web:c48c8cd75ab75eb27385d3",
    measurementId: "G-8F67HKMCT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
