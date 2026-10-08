import { db } from './firebase_config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initWAModal } from './fitur_wa.js'; 

document.addEventListener('DOMContentLoaded', () => {
    
    initWAModal();

    loadProducts('all');
    
    // Filter Kategori
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadProducts(e.target.dataset.category);
        });
    });
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