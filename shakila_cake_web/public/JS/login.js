import { auth } from './firebase_config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Jika admin sudah terlanjur login, langsung arahkan ke halaman admin.html
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "admin.html";
    }
});

// Proses Login saat Form Ditekan
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Berhasil!");
        window.location.href = "admin.html"; // Pindah ke halaman dasbor produk
    } catch (error) {
        alert("Login Gagal: " + error.message);
    }
});