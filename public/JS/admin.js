import { auth, db } from './firebase_config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    setDoc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
    validateImageUpload,
    validateProductData
} from './shakilamvp.js';

// Catatan: Import Firebase Storage sudah dihapus total agar tidak memicu error CORS

const dashboardSection = document.getElementById('dashboard-section');
const btnLogout = document.getElementById('btn-logout');
const productForm = document.getElementById('add-product-form');
const imageInput = document.getElementById('prod-image');
const imagePreview = document.getElementById('prod-image-preview');
const uploadStatus = document.getElementById('upload-status');
const productError = document.getElementById('product-error');
const productList = document.getElementById('admin-product-list');
const orderList = document.getElementById('admin-order-list');
const cancelEditButton = document.getElementById('cancel-product-edit');
const accessError = document.getElementById('admin-access-error');
const submitButton = productForm.querySelector('button[type="submit"]');
const fallbackProductImageUrl = 'https://placehold.co/600x400?text=Shakila+Cake';
let stopOrdersListener;
let stopProductsListener;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace('login.html');
        return;
    }
    btnLogout.classList.remove('hidden');
    try {
        const adminSnapshot = await getDoc(doc(db, 'admins', user.uid));
        if (!adminSnapshot.exists() || adminSnapshot.data().active !== true) {
            accessError.textContent = 'Akun ini belum diberi akses admin.';
            return;
        }
    } catch (error) {
        console.error('Gagal memeriksa akses admin:', error);
        accessError.textContent = 'Akses admin tidak dapat diverifikasi. Periksa koneksi dan konfigurasi Firebase.';
        return;
    }
    dashboardSection.classList.remove('hidden');
    loadAdminData();
});

btnLogout.addEventListener('click', async () => {
    btnLogout.disabled = true;
    try {
        await signOut(auth);
        window.location.replace('login.html');
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Logout gagal. Silakan coba kembali.');
        btnLogout.disabled = false;
    }
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) {
        imagePreview.hidden = true;
        uploadStatus.textContent = '';
        return;
    }
    const result = validateImageUpload(file);
    if (!result.isValid) {
        imageInput.value = '';
        imagePreview.hidden = true;
        uploadStatus.textContent = result.message;
        return;
    }
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.hidden = false;
    uploadStatus.textContent = 'Foto siap dikompres dan disimpan.';
});

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    productError.textContent = '';
    const productId = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = Number(document.getElementById('prod-price').value);
    const description = document.getElementById('prod-desc').value.trim();
    const imageFile = imageInput.files[0];
    const validation = validateProductData({ name, price, category });

    if (!validation.isValid) {
        productError.textContent = validation.errors.join('. ');
        return;
    }
    if (description.length > 500) {
        productError.textContent = 'Deskripsi produk maksimal 500 karakter.';
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Menyimpan...';
    
    try {
        let finalImageUrl = fallbackProductImageUrl;

        if (imageFile) {
            uploadStatus.textContent = 'Memproses foto...';
            // Ubah gambar menjadi format Base64 (Teks) agar bisa disimpan di Firestore
            finalImageUrl = await convertImageToBase64(imageFile);
        } else if (productId) {
            // Jika sedang edit tapi tidak ganti foto, pertahankan foto lama
            const oldProduct = await importProduct(productId);
            if (oldProduct.imageUrl) {
                finalImageUrl = oldProduct.imageUrl;
            }
        }

        const productData = { 
            name, 
            category, 
            price, 
            description, 
            isActive: true, 
            imageUrl: finalImageUrl 
        };

        if (productId) {
            await setDoc(doc(db, 'products', productId), productData);
        } else {
            await addDoc(collection(db, 'products'), productData);
        }
        
        resetProductForm();
        uploadStatus.textContent = 'Produk berhasil disimpan!';
    } catch (error) {
        console.error('Gagal menyimpan produk:', error);
        productError.textContent = error.message || 'Gagal menyimpan produk. Periksa koneksi Firestore.';
        uploadStatus.textContent = '';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = document.getElementById('prod-id').value ? 'Simpan Perubahan' : 'Simpan Produk';
    }
});

// FUNGSI BARU: Mengubah gambar menjadi format teks (Base64) dengan kompresi Canvas
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxDimension = 800; // Maksimal lebar/tinggi 800px agar aman di Firestore
                const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
                canvas.width = Math.max(1, Math.round(img.width * scale));
                canvas.height = Math.max(1, Math.round(img.height * scale));

                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Kualitas 60% (0.6) untuk format JPEG agar ukuran Base64 sangat kecil
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => reject(new Error('Gagal membaca gambar.'));
        };
        reader.onerror = () => reject(new Error('Gagal memproses file foto.'));
    });
}

cancelEditButton.addEventListener('click', resetProductForm);

async function importProduct(productId) {
    const snapshot = await getDoc(doc(db, 'products', productId));
    if (!snapshot.exists()) throw new Error('Produk yang akan diedit tidak ditemukan.');
    return snapshot.data();
}

async function loadAdminData() {
    loadAdminProducts();
    loadOrders();
}

function loadAdminProducts() {
    if (stopProductsListener) stopProductsListener();
    productList.textContent = 'Memuat produk...';

    stopProductsListener = onSnapshot(collection(db, 'products'), (snapshot) => {
        const products = snapshot.docs.map((productSnapshot) => ({
            id: productSnapshot.id,
            ...productSnapshot.data()
        }));

        productList.replaceChildren();
        if (!products.length) {
            productList.textContent = 'Belum ada produk.';
            return;
        }

        products.forEach((product) => {
            const card = document.createElement('article');
            card.className = 'product-card';
            const image = document.createElement('img');
            image.src = product.imageUrl || fallbackProductImageUrl;
            image.alt = product.name ? `Foto ${product.name}` : 'Foto produk';
            image.loading = 'lazy';
            image.addEventListener('error', () => {
                image.src = fallbackProductImageUrl;
            }, { once: true });

            const name = document.createElement('h3');
            name.textContent = product.name || 'Produk tanpa nama';
            const category = document.createElement('p');
            category.textContent = `Kategori: ${product.category || '-'}`;
            const price = document.createElement('p');
            price.textContent = `Harga: Rp ${Number(product.price || 0).toLocaleString('id-ID')}`;
            
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn-secondary';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editProduct(product.id, product));
            
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn-danger';
            deleteButton.textContent = 'Hapus';
            deleteButton.addEventListener('click', () => deleteProduct(product.id, product));
            
            card.append(image, name, category, price, editButton, deleteButton);
            productList.appendChild(card);
        });
    }, (error) => {
        console.error('Gagal memuat produk admin:', error);
        productList.textContent = 'Produk gagal dimuat. Periksa koneksi dan aturan Firestore.';
    });
}

function loadOrders() {
    if (stopOrdersListener) stopOrdersListener();
    orderList.textContent = 'Memuat rekap pesanan...';
    stopOrdersListener = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const orders = snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((first, second) => new Date(first.pickupAt).getTime() - new Date(second.pickupAt).getTime());
        orderList.replaceChildren();
        if (!orders.length) {
            orderList.textContent = 'Belum ada pesanan yang tercatat.';
            return;
        }
        orders.forEach((order) => {
            const card = document.createElement('article');
            card.className = 'order-card';
            const heading = document.createElement('h3');
            heading.textContent = `${order.customerName || 'Pelanggan'} - ${order.productName || 'Produk'}`;
            const schedule = document.createElement('p');
            const date = new Date(order.pickupAt);
            schedule.textContent = `Pengambilan: ${Number.isNaN(date.getTime()) ? 'Jadwal tidak valid' : date.toLocaleString('id-ID')}`;
            const details = document.createElement('p');
            details.textContent = `Rasa: ${order.flavor || '-'} | Ukuran: ${order.size || '-'} | Lilin: ${order.candleCount ?? 0}`;
            const greeting = document.createElement('p');
            greeting.textContent = `Ucapan: ${order.greetingText || '-'}`;
            const total = document.createElement('p');
            total.textContent = `Total estimasi: Rp ${Number(order.totalPrice || 0).toLocaleString('id-ID')}`;
            const status = document.createElement('p');
            status.textContent = `Status: ${order.status || 'menunggu_konfirmasi'}`;
            card.append(heading, schedule, details, greeting, total, status);
            orderList.appendChild(card);
        });
    }, (error) => {
        console.error('Gagal memuat rekap pesanan:', error);
        orderList.textContent = 'Rekap gagal dimuat. Periksa koneksi dan aturan Firestore.';
    });
}

function editProduct(productId, product) {
    document.getElementById('prod-id').value = productId;
    document.getElementById('prod-name').value = product.name || '';
    document.getElementById('prod-category').value = product.category || 'Kue Ulang Tahun';
    document.getElementById('prod-price').value = product.price || '';
    document.getElementById('prod-desc').value = product.description || product.desc || '';
    imageInput.required = false;
    imagePreview.src = product.imageUrl || '';
    imagePreview.hidden = !product.imageUrl;
    document.getElementById('product-form-heading').textContent = 'Edit Produk';
    submitButton.textContent = 'Simpan Perubahan';
    cancelEditButton.classList.remove('hidden');
    productError.textContent = '';
    productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteProduct(productId, product) {
    if (!window.confirm(`Hapus produk "${product.name || 'ini'}"?`)) return;
    try {
        await deleteDoc(doc(db, 'products', productId));
        // Catatan: Logika penghapusan foto di Storage sudah dihapus, cukup hapus data Firestore saja.
        await loadAdminProducts();
    } catch (error) {
        console.error('Gagal menghapus produk:', error);
        productError.textContent = `Gagal menghapus produk: ${error.message || 'Periksa koneksi Firebase.'}`;
    }
}

function resetProductForm() {
    productForm.reset();
    document.getElementById('prod-id').value = '';
    imageInput.required = true;
    imagePreview.removeAttribute('src');
    imagePreview.hidden = true;
    document.getElementById('product-form-heading').textContent = 'Tambah Produk Baru';
    submitButton.textContent = 'Simpan Produk';
    cancelEditButton.classList.add('hidden');
    productError.textContent = '';
    uploadStatus.textContent = '';
}