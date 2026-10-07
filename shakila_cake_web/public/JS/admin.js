import { db, auth } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const dashboardSection = document.getElementById('dashboard-section');
const btnLogout = document.getElementById('btn-logout');
const productForm = document.getElementById('add-product-form');
const imageInput = document.getElementById('prod-image');
const imagePreview = document.getElementById('prod-image-preview');
const uploadStatus = document.getElementById('upload-status');

// Fungsi Kompresi Foto agar ukurannya di bawah 1 MB (Aman untuk Firestore)
function compressImage(file, maxWidth = 600, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Pratinjau Gambar saat Dipilih
imageInput.addEventListener('change', async () => {
    const imageFile = imageInput.files[0];
    if (!imageFile) {
        if (imagePreview) imagePreview.hidden = true;
        if (uploadStatus) uploadStatus.textContent = "";
        return;
    }

    try {
        const compressedBase64 = await compressImage(imageFile);
        if (imagePreview) {
            imagePreview.src = compressedBase64;
            imagePreview.hidden = false;
        }
        if (uploadStatus) uploadStatus.textContent = "Foto berhasil diproses & siap disimpan.";
    } catch (err) {
        if (uploadStatus) uploadStatus.textContent = "Gagal memproses gambar.";
    }
});

// AUTH GUARD
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
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
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const category = document.getElementById('prod-category').value;
    const price = Number(document.getElementById('prod-price').value);
    const imageFile = imageInput.files[0];
    const desc = document.getElementById('prod-desc').value;
    const submitButton = productForm.querySelector('button[type="submit"]');

    try {
        if (!imageFile) {
            throw new Error("Pilih foto produk terlebih dahulu.");
        }

        submitButton.disabled = true;
        if (uploadStatus) uploadStatus.textContent = "Mengompresi dan memproses foto...";

        // Kompresi foto ke Base64
        const imageUrl = await compressImage(imageFile);

        if (uploadStatus) uploadStatus.textContent = "Menyimpan ke database...";

        await addDoc(collection(db, "products"), { name, category, price, imageUrl, desc });
        
        alert("Produk berhasil ditambahkan!");
        productForm.reset();
        if (imagePreview) imagePreview.hidden = true;
        if (uploadStatus) uploadStatus.textContent = "Produk berhasil disimpan.";
        
        loadAdminProducts();
    } catch (error) {
        console.error("Gagal menyimpan produk:", error);
        alert("Gagal menambah produk: " + error.message);
    } finally {
        submitButton.disabled = false;
    }
});

// MUAT PRODUK
async function loadAdminProducts() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    list.innerHTML = "<p>Memuat data produk...</p>";
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        list.innerHTML = '';
        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const image = document.createElement('img');
            image.src = data.imageUrl;
            image.alt = data.name;
            image.style.width = '100%';
            image.style.maxHeight = '180px';
            image.style.objectFit = 'cover';
            image.style.borderRadius = '8px';

            card.innerHTML = `
                <h3>${data.name}</h3>
                <p>Kategori: ${data.category}</p>
                <p>Harga: Rp ${data.price.toLocaleString('id-ID')}</p>
                <button class="btn-wa" style="background:#e74c3c; margin-top:10px; width:100%" onclick="deleteProduct('${documentSnapshot.id}')">Hapus</button>
            `;
            card.prepend(image);
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