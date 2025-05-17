// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZgprWnr9tEEhIwvS0ruEbO9UdM0Tvqg",
  authDomain: "doan-46a6f.firebaseapp.com",
  projectId: "doan-46a6f",
  storageBucket: "doan-46a6f.firebasestorage.app",
  messagingSenderId: "857995958698",
  appId: "1:857995958698:web:cb501585b49baf8c05a813",
  measurementId: "G-93FMWGV2PV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }; 