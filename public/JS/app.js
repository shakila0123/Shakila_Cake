import { db } from './firebase_config.js';
import { addDoc, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
    calculateOrderPrice,
    filterCatalog,
    generateWhatsAppLink,
    validateCustomerOrder
} from './shakilamvp.js';
import { initWAModal, WA_NUMBER } from './fitur_wa.js';

const productsById = new Map();
let products = [];
let activeCategory = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
    initWAModal();
    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach((filter) => filter.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.dataset.category || 'ALL';
            renderProducts();
        });
    });

    document.getElementById('catalog-search')?.addEventListener('input', renderProducts);
    document.getElementById('order-form')?.addEventListener('submit', submitOrder);
    ['order-size', 'order-candles', 'order-text'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', updatePriceEstimate);
        document.getElementById(id)?.addEventListener('change', updatePriceEstimate);
    });
    document.getElementById('order-date')?.setAttribute(
        'min',
        toLocalDateTimeValue(new Date(Date.now() + 48 * 60 * 60 * 1000 + 60 * 1000))
    );
    loadProducts();
});

function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.textContent = 'Memuat produk...';

    onSnapshot(collection(db, 'products'), (snapshot) => {
        products = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }));
        productsById.clear();
        products.forEach((product) => productsById.set(product.id, product));
        renderProducts();
    }, (error) => {
        console.error('Gagal memuat katalog:', error);
        productList.textContent = 'Katalog belum dapat dimuat. Periksa koneksi internet dan konfigurasi Firebase.';
    });
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    const visibleProducts = filterCatalog(products, {
        category: activeCategory,
        searchQuery: document.getElementById('catalog-search')?.value || ''
    });
    productList.replaceChildren();

    if (!visibleProducts.length) {
        productList.textContent = products.length
            ? 'Produk tidak ditemukan pada kategori atau pencarian ini.'
            : 'Belum ada produk yang tersedia.';
        return;
    }

    visibleProducts.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        const image = document.createElement('img');
        image.alt = product.name ? `Foto ${product.name}` : 'Foto produk';
        image.loading = 'lazy';
        image.src = typeof product.imageUrl === 'string' && product.imageUrl.trim()
            ? product.imageUrl
            : 'https://placehold.co/600x400?text=Shakila+Cake';
        image.addEventListener('error', () => {
            image.src = 'https://placehold.co/600x400?text=Foto+tidak+tersedia';
        }, { once: true });

        const name = document.createElement('h3');
        name.textContent = product.name || 'Produk tanpa nama';
        const description = document.createElement('p');
        description.textContent = product.description || product.desc || '';
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `Rp ${Number(product.price || 0).toLocaleString('id-ID')}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-order';
        button.textContent = 'Pesan';
        button.addEventListener('click', () => openOrderModal(product.id));

        card.append(image, name, description, price, button);
        productList.appendChild(card);
    });
}

function openOrderModal(productId) {
    const product = productsById.get(productId);
    if (!product) return;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('order-product-price').textContent = `Harga dasar: Rp ${Number(product.price || 0).toLocaleString('id-ID')}`;
    document.getElementById('order-error').textContent = '';
    updatePriceEstimate();
    document.getElementById('order-modal').classList.remove('hidden');
    document.getElementById('customer-name').focus();
}

async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorMessage = document.getElementById('order-error');
    const submitButton = form.querySelector('button[type="submit"]');
    const product = productsById.get(document.getElementById('product-id').value);
    const customerName = document.getElementById('customer-name').value.trim();
    const flavor = document.getElementById('order-flavor').value.trim();
    const size = document.getElementById('order-size').value;
    const greetingText = document.getElementById('order-text').value.trim();
    const candleCount = Number(document.getElementById('order-candles').value);
    const pickupDateTime = document.getElementById('order-date').value;
    const validation = validateCustomerOrder({
        customerName,
        productName: product?.name,
        flavor,
        pickupDateTime,
        greetingText,
        candleCount
    });

    if (!validation.isValid) {
        errorMessage.textContent = validation.errors.join('. ');
        return;
    }
    if (!product || typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0) {
        errorMessage.textContent = 'Harga produk belum tersedia. Silakan hubungi toko melalui WhatsApp.';
        return;
    }

    let calculation;
    try {
        calculation = calculateOrderPrice({ basePrice: product.price, size, candleCount, greetingText });
    } catch (error) {
        errorMessage.textContent = error.message;
        return;
    }

    const pickupDate = new Date(pickupDateTime);
    const formattedPickup = pickupDate.toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short'
    });
    const whatsAppLink = generateWhatsAppLink({
        storePhone: WA_NUMBER,
        customerName,
        cakeName: product.name,
        size,
        flavor,
        candleCount,
        greetingText,
        pickupDate: formattedPickup,
        totalPrice: calculation.totalPrice
    });
    const waWindow = window.open('about:blank', '_blank');
    if (waWindow) {
        waWindow.opener = null;
        waWindow.document.title = 'Menyimpan pesanan...';
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Menyimpan pesanan...';
    errorMessage.textContent = '';

    try {
        await addDoc(collection(db, 'orders'), {
            customerName,
            productId: product.id,
            productName: product.name,
            category: product.category || '',
            flavor,
            size,
            greetingText,
            candleCount,
            pickupAt: pickupDate.toISOString(),
            basePrice: product.price,
            cakePrice: calculation.cakePrice,
            candleTotal: calculation.candleTotal,
            totalPrice: calculation.totalPrice,
            status: 'menunggu_konfirmasi',
            createdAt: new Date().toISOString()
        });
        if (waWindow) {
            waWindow.location.href = whatsAppLink;
        } else {
            window.location.assign(whatsAppLink);
        }
        document.getElementById('order-modal').classList.add('hidden');
        form.reset();
    } catch (error) {
        console.error('Gagal menyimpan pesanan:', error);
        if (waWindow) waWindow.close();
        errorMessage.textContent = 'Pesanan belum tersimpan. Periksa koneksi, lalu coba lagi; WhatsApp belum dibuka.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Simpan & lanjut ke WhatsApp';
    }
}

function toLocalDateTimeValue(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
}

function updatePriceEstimate() {
    const product = productsById.get(document.getElementById('product-id').value);
    const estimate = document.getElementById('order-total');
    if (!product || typeof product.price !== 'number') {
        estimate.textContent = 'Estimasi total: belum tersedia';
        return;
    }
    try {
        const calculation = calculateOrderPrice({
            basePrice: product.price,
            size: document.getElementById('order-size').value,
            candleCount: Number(document.getElementById('order-candles').value),
            greetingText: document.getElementById('order-text').value
        });
        estimate.textContent = `Estimasi total: Rp ${calculation.totalPrice.toLocaleString('id-ID')}`;
    } catch (error) {
        estimate.textContent = error.message;
    }
}
