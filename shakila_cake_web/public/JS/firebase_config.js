import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBedEOI8tGsEF_8lP_JuNCA57u_qn2x2q4",
  authDomain: "shakila-cake-web.firebaseapp.com",
  projectId: "shakila-cake-web",
  storageBucket: "shakila-cake-web.firebasestorage.app",
  messagingSenderId: "983773485281",
  appId: "1:983773485281:web:554d585df333efae64bfa0",
  measurementId: "G-08N0PYNSV9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);