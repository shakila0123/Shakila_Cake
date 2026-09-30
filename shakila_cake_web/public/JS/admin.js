import { db, auth } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const dashboardSection = document.getElementById('dashboard-section');
const btnLogout = document.getElementById('btn-logout');

// PENGECEKAN STATUS LOGIN (Auth Guard)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Jika BELUM login, tendang balik ke halaman login
        window.location.href = "login.html";
    } else {
        // Jika SUDAH login, tampilkan elemen dasbor
        dashboardSection.classList.remove('hidden');
        btnLogout.classList.remove('hidden');
        loadAdminProducts();
    }
});

// LOGOUT
btnLogout.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "login.html";
});

// TAMBAH PRODUK
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const category = document.getElementById('prod-category').value;
    const price = Number(document.getElementById('prod-price').value);
    const imageUrl = document.getElementById('prod-image').value;
    const desc = document.getElementById('prod-desc').value;

    try {
        await addDoc(collection(db, "products"), { name, category, price, imageUrl, desc });
        alert("Produk berhasil ditambahkan!");
        e.target.reset();
        loadAdminProducts();
    } catch (error) {
        alert("Gagal menambah produk: " + error.message);
    }
});

// MUAT PRODUK
async function loadAdminProducts() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = "<p>Memuat data produk...</p>";
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        list.innerHTML = '';
        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${data.name}</h3>
                <p>Kategori: ${data.category}</p>
                <p>Harga: Rp ${data.price.toLocaleString('id-ID')}</p>
                <button class="btn-wa" style="background:#e74c3c; margin-top:10px; width:100%" onclick="deleteProduct('${documentSnapshot.id}')">Hapus</button>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error("Gagal memuat produk:", error);
    }
}

// HAPUS PRODUK
window.deleteProduct = async (id) => {
    if(confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        await deleteDoc(doc(db, "products", id));
        loadAdminProducts();
    }
}