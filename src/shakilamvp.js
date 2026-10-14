
// 1. Logika Katalog
export function filterCatalog(products, { category = 'ALL', searchQuery = '' } = {}) {
  if (!Array.isArray(products)) return [];
  const query = searchQuery.trim().toLowerCase();

  return products.filter((item) => {
    if (!item.isActive) return false;
    const matchCategory = category === 'ALL' || item.category === category;
    const matchQuery = query === '' || item.name.toLowerCase().includes(query);
    return matchCategory && matchQuery;
  });
}

// 2. Logika Kalkulasi Kustomisasi & Harga
export const SIZE_MULTIPLIERS = {
  '16cm': 1.0,
  '20cm': 1.35,
  '24cm': 1.75
};

export const CANDLE_PRICE = 5000; // Harga lilin angka per biji
export const MAX_GREETING_LENGTH = 35;

export function calculateOrderPrice({ basePrice, size = '16cm', candleCount = 0, greetingText = '' }) {
  if (typeof basePrice !== 'number' || basePrice <= 0) {
    throw new Error('Harga dasar kue tidak valid');
  }
  if (!SIZE_MULTIPLIERS[size]) {
    throw new Error(`Ukuran kue '${size}' tidak valid`);
  }
  if (candleCount < 0 || !Number.isInteger(candleCount)) {
    throw new Error('Jumlah lilin harus bilangan bulat non-negatif');
  }
  if (greetingText && greetingText.length > MAX_GREETING_LENGTH) {
    throw new Error(`Tulisan ucapan maksimal ${MAX_GREETING_LENGTH} karakter`);
  }

  const cakePrice = Math.round(basePrice * SIZE_MULTIPLIERS[size]);
  const candleTotal = candleCount * CANDLE_PRICE;
  return {
    cakePrice,
    candleTotal,
    totalPrice: cakePrice + candleTotal
  };
}

// 3. Logika Validasi Pre-Order (H-2 & Jam Operasional)
export function validatePreOrderSchedule(pickupDateTimeStr, currentDateTime = new Date()) {
  const pickupDate = new Date(pickupDateTimeStr);
  if (isNaN(pickupDate.getTime())) {
    return { isValid: false, reason: 'Format tanggal dan jam pengambilan tidak valid' };
  }

  const diffHours = (pickupDate.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);
  if (diffHours < 48) {
    return {
      isValid: false,
      reason: 'Pemesanan harus dilakukan minimal H-2 (48 jam sebelum jadwal ambil)'
    };
  }

  const hours = pickupDate.getHours();
  if (hours < 8 || hours >= 18) {
    return {
      isValid: false,
      reason: 'Waktu pengambilan di luar jam operasional toko (08:00 - 18:00)'
    };
  }

  return { isValid: true, reason: 'Jadwal valid' };
}

// 4. Logika WhatsApp Checkout Engine
export function sanitizePhoneNumber(phone) {
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('62') || cleaned.length < 10 || cleaned.length > 15) {
    throw new Error('Nomor WhatsApp toko tidak valid');
  }
  return cleaned;
}

export function generateWhatsAppLink({ storePhone, customerName, cakeName, size, greetingText, pickupDate, totalPrice }) {
  if (!customerName || !customerName.trim()) {
    throw new Error('Nama pelanggan wajib diisi');
  }
  if (!cakeName || !pickupDate || !totalPrice) {
    throw new Error('Data pesanan belum lengkap');
  }

  const formattedPhone = sanitizePhoneNumber(storePhone);
  const greetingDisplay = greetingText && greetingText.trim() ? `"${greetingText.trim()}"` : '-(Tanpa ucapan)-';

  const message = [
    `*HALO SHAKILA CAKE, SAYA INGIN PRE-ORDER KUE*`,
    `----------------------------------------`,
    `• *Nama Pemesan:* ${customerName.trim()}`,
    `• *Kue:* ${cakeName} (${size})`,
    `• *Tulisan Ucapan:* ${greetingDisplay}`,
    `• *Jadwal Ambil:* ${pickupDate}`,
    `• *Total Estimasi:* Rp${Number(totalPrice).toLocaleString('id-ID')}`,
    `----------------------------------------`,
    `Mohon konfirmasi ketersediaan slotnya ya, Mama Shakila. Terima kasih!`
  ].join('\n');

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

// 5. Logika Validasi Produk Admin
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateProductData({ name, price, category }) {
  const errors = [];
  if (!name || name.trim().length < 3) {
    errors.push('Nama produk minimal 3 karakter');
  }
  if (typeof price !== 'number' || price <= 0) {
    errors.push('Harga produk harus angka positif lebih dari 0');
  }
  const validCategories = ['Kue Ulang Tahun', 'Pie Buah', 'Bolu'];
  if (!validCategories.includes(category)) {
    errors.push(`Kategori tidak valid. Pilihan: ${validCategories.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateImageUpload(file) {
  if (!file) return { isValid: false, message: 'Berkas foto tidak ditemukan' };
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, message: 'Format berkas harus JPEG, PNG, atau WEBP' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, message: 'Ukuran foto maksimal adalah 5 MB' };
  }
  return { isValid: true, message: 'Berkas valid' };
}
