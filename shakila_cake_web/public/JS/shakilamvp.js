
// 1. Logika Katalog
export function filterCatalog(products, { category = 'ALL', searchQuery = '' } = {}) {
  if (!Array.isArray(products)) return [];
  const query = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';

  return products.filter((item) => {
    if (!item || item.isActive === false) return false;
    const matchCategory = category === 'ALL'
      || (typeof category === 'string' && typeof item.category === 'string'
        && item.category.toLocaleLowerCase('id-ID') === category.toLocaleLowerCase('id-ID'));
    const matchQuery = query === '' || (typeof item.name === 'string' && item.name.toLowerCase().includes(query));
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
  if (typeof basePrice !== 'number' || !Number.isFinite(basePrice) || basePrice <= 0) {
    throw new Error('Harga dasar kue tidak valid');
  }
  if (!SIZE_MULTIPLIERS[size]) {
    throw new Error(`Ukuran kue '${size}' tidak valid`);
  }
  if (!Number.isInteger(candleCount) || candleCount < 0 || candleCount > 20) {
    throw new Error('Jumlah lilin harus bilangan bulat non-negatif');
  }
  if (typeof greetingText !== 'string') {
    throw new Error('Tulisan ucapan tidak valid');
  }
  if (greetingText.length > MAX_GREETING_LENGTH) {
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
  if (typeof pickupDateTimeStr !== 'string' || !pickupDateTimeStr.trim()) {
    return { isValid: false, reason: 'Tanggal dan jam pengambilan wajib diisi' };
  }
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

export function generateWhatsAppLink({
  storePhone,
  customerName,
  cakeName,
  size,
  flavor = '',
  candleCount = 0,
  greetingText,
  pickupDate,
  totalPrice
}) {
  if (!customerName || !customerName.trim()) {
    throw new Error('Nama pelanggan wajib diisi');
  }
  if (!cakeName || !pickupDate || typeof totalPrice !== 'number' || !Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new Error('Data pesanan belum lengkap');
  }

  const formattedPhone = sanitizePhoneNumber(storePhone);
  const greetingDisplay = greetingText && greetingText.trim() ? `"${greetingText.trim()}"` : '-(Tanpa ucapan)-';

  const message = [
    `*HALO SHAKILA CAKE, SAYA INGIN PRE-ORDER KUE*`,
    `----------------------------------------`,
    `• *Nama Pemesan:* ${customerName.trim()}`,
    `• *Kue:* ${cakeName} (${size})`,
    `• *Varian Rasa:* ${flavor || '-'}`,
    `• *Lilin:* ${candleCount}`,
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
  if (typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Nama produk minimal 3 karakter');
  }
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    errors.push('Harga produk harus angka positif lebih dari 0');
  }
  const validCategories = ['Kue Ulang Tahun', 'Bolu Gulung', 'Brownies', 'Pie Buah', 'Pie buah', 'Bolu'];
  if (!validCategories.includes(category)) {
    errors.push(`Kategori tidak valid. Pilihan: ${validCategories.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCustomerOrder({
  customerName,
  productName,
  flavor,
  pickupDateTime,
  greetingText = '',
  candleCount = 0
}, currentDateTime = new Date()) {
  const errors = [];
  if (typeof customerName !== 'string' || customerName.trim().length < 2) {
    errors.push('Nama pemesan minimal 2 karakter');
  }
  if (typeof productName !== 'string' || !productName.trim()) {
    errors.push('Produk wajib dipilih');
  }
  if (typeof flavor !== 'string' || !flavor.trim()) {
    errors.push('Varian rasa wajib diisi');
  }
  const schedule = validatePreOrderSchedule(pickupDateTime, currentDateTime);
  if (!schedule.isValid) errors.push(schedule.reason);
  if (typeof greetingText !== 'string' || greetingText.length > MAX_GREETING_LENGTH) {
    errors.push(`Tulisan ucapan maksimal ${MAX_GREETING_LENGTH} karakter`);
  }
  if (!Number.isInteger(candleCount) || candleCount < 0 || candleCount > 20) {
    errors.push('Jumlah lilin harus bilangan bulat antara 0 dan 20');
  }
  return { isValid: errors.length === 0, errors };
}

export function validateImageUpload(file) {
  if (!file) return { isValid: false, message: 'Berkas foto tidak ditemukan' };
  if (typeof file.type !== 'string' || !Number.isFinite(file.size) || file.size < 0) {
    return { isValid: false, message: 'Informasi berkas foto tidak valid' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, message: 'Format berkas harus JPEG, PNG, atau WEBP' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, message: 'Ukuran foto maksimal adalah 5 MB' };
  }
  return { isValid: true, message: 'Berkas valid' };
}
