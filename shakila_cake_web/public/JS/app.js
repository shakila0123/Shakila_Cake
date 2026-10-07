import { db } from './firebase_config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const WA_NUMBER = "6285656125421";

document.addEventListener('DOMContentLoaded', () => {
    loadProducts('all');
    
    // Filter Kategori
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadProducts(e.target.dataset.category);
        });
    });

    // Logika Modal WA
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productName = document.getElementById('product-name').value;
            const name = document.getElementById('customer-name').value;
            const date = document.getElementById('order-date').value;
            const variant = document.getElementById('order-variant').value;
            const text = document.getElementById('order-text').value;

            const waText = `Halo Shakila Cake, saya ingin memesan:\n\n*Produk:* ${productName}\n*Nama:* ${name}\n*Tanggal Ambil:* ${date}\n*Varian/Ukuran:* ${variant}\n*Tulisan di Kue:* ${text || '-'}\n\nMohon info total harga dan pembayarannya. Terima kasih!`;
            const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            modal.classList.add('hidden');
            e.target.reset();
        });
    }
});

async function loadProducts(category) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    productList.innerHTML = "<p>Memuat produk...</p>";
    
    try {
        let q = collection(db, "products");
        if (category !== 'all') {
            q = query(q, where("category", "==", category));
        }
        const querySnapshot = await getDocs(q);
        productList.innerHTML = '';
        
        if (querySnapshot.empty) {
            productList.innerHTML = "<p>Belum ada produk di kategori ini.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const imageUrl = data.imageUrl || data.image;
            const image = document.createElement('img');
            image.alt = data.name || 'Foto produk';
            
            // Jika link/gambar rusak, otomatis gunakan gambar placeholder tanpa tulisan error
            image.addEventListener('error', () => {
                image.src = 'https://placehold.co/300x200?text=Foto+Kue';
            }, { once: true });

            if (typeof imageUrl === 'string' && imageUrl.trim()) {
                image.src = imageUrl;
            } else {
                image.src = 'https://placehold.co/300x200?text=Foto+Kue';
            }

            card.innerHTML = `
                <h3>${data.name}</h3>
                <p class="price">Rp ${Number(data.price).toLocaleString('id-ID')}</p>
                <button class="btn-order" onclick="openOrderModal('${data.name}')">Pesan</button>
            `;
            card.prepend(image);
            productList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading products:", error);
        productList.innerHTML = "<p>Gagal memuat produk. Periksa koneksi atau konfigurasi Firebase.</p>";
    }
}

window.openOrderModal = (productName) => {
    const modal = document.getElementById('order-modal');
    if (modal) {
        document.getElementById('product-name').value = productName;
        modal.classList.remove('hidden');
    }
};

window.requestCustomWA = function() {
    const pesan = "Halo Shakila Cake, saya ingin tanya-tanya tentang pesan kue custom.";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
};

window.orderViaWA = function(namaKue, harga) {
    const pesan = `Halo Shakila Cake, saya ingin memesan ${namaKue} seharga Rp ${Number(harga).toLocaleString('id-ID')}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
};