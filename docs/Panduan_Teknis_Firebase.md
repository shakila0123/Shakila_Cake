# Panduan Teknis & Integrasi Firebase — Shakila Cake App

Dokumen ini berisi spesifikasi arsitektur teknis, konfigurasi Firebase Web SDK (v9/v10 Modular), aturan keamanan database (*Security Rules*), skema data Firestore, dan contoh implementasi logika program untuk aplikasi **Shakila Cake App**.

---

## 1. Arsitektur Teknis & Tech Stack

Aplikasi ini dibangun menggunakan arsitektur *Jamstack* tanpa *server/backend* kustom (Serverless architecture). Seluruh logika bisnis dan manajemen data ditangani di sisi klien (*client-side*) menggunakan JavaScript dan layanan Firebase.

* **Frontend Framework:** Native HTML5 & CSS3 (Flexbox/Grid, Responsive Mobile-First).
* **Programming Language:** JavaScript Vanilla (ES6 Module / ES2022+).
* **Database (BaaS):** Firebase Cloud Firestore (Document-oriented NoSQL Database).
* **Authentication:** Firebase Authentication (Email & Password provider).
* **Hosting:** Firebase Hosting atau GitHub Pages.

---

## 2. Setup & Konfigurasi Firebase (`public/js/firebase-config.js`)

Inisialisasi SDK Firebase dilakukan menggunakan ES Modules agar performa *loading* halaman cepat dan terstruktur.

```javascript
// Import fungsi yang dibutuhkan dari SDK Firebase Web (Modular v9+)
import { initializeApp } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js)";
import { getFirestore } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js)";
import { getAuth } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js)";

// Konfigurasi kredensial proyek Firebase (Dapatkan dari Console Firebase)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "shakila-cake-app.firebaseapp.com",
  projectId: "shakila-cake-app",
  storageBucket: "shakila-cake-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Export instance Firestore dan Auth untuk digunakan di berkas JS lain
export const db = getFirestore(app);
export const auth = getAuth(app);
