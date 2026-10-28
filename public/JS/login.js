import { auth } from './firebase_config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from './firebase_config.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        getDoc(doc(db, 'admins', user.uid))
            .then((snapshot) => {
                if (snapshot.exists() && snapshot.data().active === true) {
                    window.location.replace('admin.html');
                }
            })
            .catch((error) => console.error('Gagal memeriksa akses admin:', error));
    }
});

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginButton = loginForm.querySelector('button[type="submit"]');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Memeriksa...';
    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            document.getElementById('admin-email').value.trim(),
            document.getElementById('admin-password').value
        );
        const adminSnapshot = await getDoc(doc(db, 'admins', credential.user.uid));
        if (!adminSnapshot.exists() || adminSnapshot.data().active !== true) {
            await signOut(auth);
            throw new Error('Akun ini belum diberi akses admin.');
        }
        window.location.replace('admin.html');
    } catch (error) {
        console.error('Login admin gagal:', error);
        loginError.textContent = error.message === 'Akun ini belum diberi akses admin.'
            ? error.message
            : 'Login gagal. Periksa email, password, koneksi, dan konfigurasi Firebase.';
        loginButton.disabled = false;
        loginButton.textContent = 'Masuk';
    }
});