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
const flavorOptionsByCategory = {
    'Kue Ulang Tahun': ['Blackforest', 'Choco Vanilla', 'Red Velvet'],
    Brownies: ['Cokelat Chip', 'Almond', 'Keju'],
    'Bolu Gulung': ['cokelat', 'keju', 'Cokelat Keju'],
    'Pie Buah': ['Buah'],
    Default: ['Original']
};
const sizeOptionsByCategory = {
    'Kue Ulang Tahun': [
        { value: '16cm', label: '16 cm (standar)' },
        { value: '20cm', label: '20 cm (+35%)' },
        { value: '24cm', label: '24 cm (+75%)' }
    ],
    Brownies: [
        { value: 'brownies-20x10', label: '20x10 cm (standar)' },
        { value: 'brownies-20x20', label: '20x20 cm (+100%)' }
    ],
    'Bolu Gulung': [
        { value: 'bolu-gulung-24cm', label: 'Panjang 24 cm (standar)' }
    ],
    'Pie Buah': [
        { value: 'pie-buah-box-10', label: 'Box isi 10 (standar)' },
        { value: 'pie-buah-box-20', label: 'Box isi 20 (+100%)' }
    ],
    Bolu: [
        { value: 'bolu-20cm', label: 'Diameter 20 cm (standar)' }
    ],
    Default: [
        { value: 'standard', label: 'Ukuran standar' }
    ]
};

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
    populateFlavorOptions(product.category);
    populateSizeOptions(product.category);
    configureBirthdayOptions(product.category);
    document.getElementById('order-error').textContent = '';
    updatePriceEstimate();
    document.getElementById('order-modal').classList.remove('hidden');
    document.getElementById('customer-name').focus();
}

function populateFlavorOptions(category) {
    const flavorSelect = document.getElementById('order-flavor');
    if (!flavorSelect) return;

    const flavors = getCategoryOptions(flavorOptionsByCategory, category);

    flavorSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Pilih varian rasa';
    flavorSelect.appendChild(placeholder);

    flavors.forEach((flavor) => {
        const option = document.createElement('option');
        option.value = flavor;
        option.textContent = flavor;
        flavorSelect.appendChild(option);
    });
}

function populateSizeOptions(category) {
    const sizeSelect = document.getElementById('order-size');
    if (!sizeSelect) return;

    const sizes = getCategoryOptions(sizeOptionsByCategory, category);

    sizeSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Pilih ukuran';
    sizeSelect.appendChild(placeholder);

    sizes.forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        sizeSelect.appendChild(option);
    });
}

function configureBirthdayOptions(category) {
    const birthdayOptions = document.getElementById('birthday-options');
    const sizeSelect = document.getElementById('order-size');
    const candleInput = document.getElementById('order-candles');
    const greetingInput = document.getElementById('order-text');
    const isBirthdayCake = typeof category === 'string'
        && category.trim().toLocaleLowerCase('id-ID') === 'kue ulang tahun';

    birthdayOptions.classList.toggle('hidden', !isBirthdayCake);
    birthdayOptions.querySelectorAll('select, input, textarea').forEach((field) => {
        field.disabled = !isBirthdayCake;
    });
    sizeSelect.required = isBirthdayCake;

    if (!isBirthdayCake) {
        sizeSelect.value = sizeSelect.options[1]?.value || '';
        candleInput.value = '0';
        greetingInput.value = '';
    }
}

function getCategoryOptions(optionsByCategory, category) {
    if (typeof category !== 'string') return optionsByCategory.Default;

    const normalizedCategory = category.trim().toLocaleLowerCase('id-ID');
    const matchingCategory = Object.keys(optionsByCategory).find((key) =>
        key !== 'Default' && key.toLocaleLowerCase('id-ID') === normalizedCategory
    );
    return matchingCategory ? optionsByCategory[matchingCategory] : optionsByCategory.Default;
}

async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorMessage = document.getElementById('order-error');
    const submitButton = form.querySelector('button[type="submit"]');
    const product = productsById.get(document.getElementById('product-id').value);
    const customerName = document.getElementById('customer-name').value.trim();
    const flavor = document.getElementById('order-flavor').value.trim();
    const sizeSelect = document.getElementById('order-size');
    const size = sizeSelect.value;
    const sizeLabel = sizeSelect.selectedOptions[0]?.textContent || size;
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
        size: sizeLabel,
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
            size: sizeLabel,
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
