import {
  ALLOWED_MIME_TYPES,
  CANDLE_PRICE,
  MAX_FILE_SIZE,
  SIZE_MULTIPLIERS,
  calculateOrderPrice,
  filterCatalog,
  sanitizePhoneNumber,
  validateImageUpload,
  validatePreOrderSchedule,
  validateProductData
} from '../src/shakilamvp.js';

const sizeCases = Object.entries(SIZE_MULTIPLIERS);
const candleCases = Array.from({ length: 21 }, (_, candleCount) => [
  candleCount,
  candleCount * CANDLE_PRICE
]);

const validCategories = [
  'Kue Ulang Tahun',
  'Bolu Gulung',
  'Brownies',
  'Pie Buah',
  'Pie buah',
  'Bolu'
];

const validProduct = {
  name: 'Kue Cokelat',
  price: 100000,
  category: 'Brownies'
};

const productCases = [
  ...validCategories.map((category) => ({
    label: `kategori ${category}`,
    product: { ...validProduct, category },
    isValid: true
  })),
  ...[
    '',
    '  ',
    'ab',
    null,
    123,
    undefined
  ].map((name) => ({
    label: `nama ${String(name)}`,
    product: { ...validProduct, name },
    isValid: false
  })),
  ...[
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '100000',
    null
  ].map((price) => ({
    label: `harga ${String(price)}`,
    product: { ...validProduct, price },
    isValid: false
  })),
  ...[
    undefined,
    '',
    'kue ulang tahun',
    null,
    [],
    'Makanan'
  ].map((category) => ({
    label: `kategori tidak valid ${String(category)}`,
    product: { ...validProduct, category },
    isValid: false
  }))
];

const validImageSizes = [0, 1, MAX_FILE_SIZE - 1, MAX_FILE_SIZE];
const imageCases = [
  ...ALLOWED_MIME_TYPES.flatMap((type) =>
    validImageSizes.map((size) => ({
      label: `${type} dengan ukuran ${size} byte`,
      file: { type, size },
      isValid: true
    }))
  ),
  ...[
    'application/pdf',
    'image/gif',
    'image/svg+xml',
    'text/plain',
    '',
    null
  ].map((type) => ({
    label: `tipe berkas ${String(type)}`,
    file: { type, size: 100 },
    isValid: false
  })),
  ...[
    null,
    { type: undefined, size: 100 },
    { type: 123, size: 100 },
    { type: 'image/png', size: Number.NaN },
    { type: 'image/png', size: -1 },
    { type: 'image/png', size: '100' }
  ].map((file, index) => ({
    label: `metadata berkas tidak valid ${index + 1}`,
    file,
    isValid: false
  }))
];

const validPhoneCases = [
  ['081234567890', '6281234567890'],
  ['08-1234-567-890', '6281234567890'],
  ['08 1234 567 890', '6281234567890'],
  ['(08)1234567890', '6281234567890'],
  ['+62 812 3456 7890', '6281234567890'],
  ['+6281234567890', '6281234567890'],
  ['62 812-3456-7890', '6281234567890'],
  ['62812.3456.7890', '6281234567890'],
  ['628123456789', '628123456789'],
  ['62812345678901', '62812345678901'],
  ['628123456789012', '628123456789012'],
  ['6281234567', '6281234567'],
  ['+62.812.3456.7890', '6281234567890'],
  ['+62 (812) 3456-7890', '6281234567890'],
  ['62-812-3456-7890', '6281234567890']
];

const invalidPhoneCases = [
  '',
  ' ',
  '12345',
  '081',
  '08',
  '628',
  '62812345',
  '+1 555 123 4567',
  '441234567890',
  'abcdefghij',
  '62812345678901234',
  '006212345678901234',
  '0000000',
  '++---',
  null
];

const scheduleNow = new Date(2026, 0, 5, 0, 0, 0);
const scheduleCases = [
  ...Array.from({ length: 10 }, (_, index) => index + 8).map((hour) => {
    const pickup = new Date(scheduleNow.getTime() + 72 * 60 * 60 * 1000);
    pickup.setHours(hour, 0, 0, 0);
    return [`pukul ${hour}:00`, pickup.toISOString(), true];
  }),
  ...[
    ...Array.from({ length: 8 }, (_, hour) => hour),
    ...Array.from({ length: 6 }, (_, index) => index + 18)
  ].map((hour) => {
    const pickup = new Date(scheduleNow.getTime() + 72 * 60 * 60 * 1000);
    pickup.setHours(hour, 0, 0, 0);
    return [`di luar jam operasional ${hour}:00`, pickup.toISOString(), false];
  }),
  [
    'tepat 48 jam sebelumnya pada awal jam buka',
    new Date(2026, 0, 7, 8, 0, 0).toISOString(),
    true,
    new Date(2026, 0, 5, 8, 0, 0)
  ],
  [
    'kurang 1 milidetik dari 48 jam',
    new Date(new Date(2026, 0, 5, 8, 0, 0).getTime() + 48 * 60 * 60 * 1000 - 1).toISOString(),
    false,
    new Date(2026, 0, 5, 8, 0, 0)
  ]
];

const catalog = [
  { id: 'p1', name: 'Black Forest Special', category: 'Kue Ulang Tahun', isActive: true },
  { id: 'p2', name: 'Red Velvet Cake', category: 'Kue Ulang Tahun', isActive: true },
  { id: 'p3', name: 'Strawberry Birthday Cake', category: 'Kue Ulang Tahun', isActive: false },
  { id: 'p4', name: 'Brownies Cokelat', category: 'Brownies', isActive: true },
  { id: 'p5', name: 'Brownies Keju', category: 'Brownies', isActive: true },
  { id: 'p6', name: 'Bolu Pandan', category: 'Bolu', isActive: true },
  { id: 'p7', name: 'Bolu Gulung Keju', category: 'Bolu Gulung', isActive: true },
  { id: 'p8', name: 'Pie Apel', category: 'Pie Buah', isActive: true },
  { id: 'p9', name: 'Pie Strawberry', category: 'Pie Buah', isActive: true },
  { id: 'p10', name: 'Kue Ulang Tahun Cokelat', category: 'Kue Ulang Tahun', isActive: true }
];

const activeCatalogIds = ['p1', 'p2', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
const categoryCases = [
  ['ALL', activeCatalogIds],
  ['all', []],
  ['Kue Ulang Tahun', ['p1', 'p2', 'p10']],
  ['kue ulang tahun', ['p1', 'p2', 'p10']],
  ['KUE ULANG TAHUN', ['p1', 'p2', 'p10']],
  ['Bolu Gulung', ['p7']],
  ['bolu gulung', ['p7']],
  ['BOLU GULUNG', ['p7']],
  ['Brownies', ['p4', 'p5']],
  ['brownies', ['p4', 'p5']],
  ['BROWNIES', ['p4', 'p5']],
  ['Pie Buah', ['p8', 'p9']],
  ['pie buah', ['p8', 'p9']],
  ['PIE BUAH', ['p8', 'p9']],
  ['Bolu', ['p6']],
  ['bolu', ['p6']],
  ['BOlu', ['p6']],
  ['Kue', []],
  ['', []],
  ['ALL ', []]
];

const searchCases = [
  ['black', ['p1']],
  ['BLACK', ['p1']],
  [' Forest ', ['p1']],
  ['black forest', ['p1']],
  ['special', ['p1']],
  ['red', ['p2']],
  ['cake', ['p2']],
  ['strawberry', ['p9']],
  ['brownies', ['p4', 'p5']],
  ['cokelat', ['p4', 'p10']],
  ['keju', ['p5', 'p7']],
  ['pandan', ['p6']],
  ['  pandan  ', ['p6']],
  ['bolu', ['p6', 'p7']],
  ['gulung', ['p7']],
  ['pie', ['p8', 'p9']],
  ['apel', ['p8']],
  ['kue', ['p10']],
  ['tidak ditemukan', []],
  ['ulang tahun', ['p10']]
];

describe('Skenario tambahan validasi logika Shakila Cake', () => {
  test.each(sizeCases)(
    'menghitung harga dasar untuk ukuran %s',
    (size, multiplier) => {
      const result = calculateOrderPrice({ basePrice: 100000, size });
      expect(result.cakePrice).toBe(Math.round(100000 * multiplier));
      expect(result.totalPrice).toBe(result.cakePrice);
    }
  );

  test.each(candleCases)(
    'menghitung biaya untuk %i lilin',
    (candleCount, candleTotal) => {
      const result = calculateOrderPrice({ basePrice: 100000, candleCount });
      expect(result.candleTotal).toBe(candleTotal);
      expect(result.totalPrice).toBe(100000 + candleTotal);
    }
  );

  test.each(productCases)(
    'validasi produk: $label',
    ({ product, isValid }) => {
      expect(validateProductData(product).isValid).toBe(isValid);
    }
  );

  test.each(imageCases)(
    'validasi gambar: $label',
    ({ file, isValid }) => {
      expect(validateImageUpload(file).isValid).toBe(isValid);
    }
  );

  test.each(validPhoneCases)(
    'normalisasi nomor WhatsApp %s',
    (phone, normalized) => {
      expect(sanitizePhoneNumber(phone)).toBe(normalized);
    }
  );

  test.each(invalidPhoneCases)(
    'menolak nomor WhatsApp tidak valid: %s',
    (phone) => {
      expect(() => sanitizePhoneNumber(phone)).toThrow('Nomor WhatsApp toko tidak valid');
    }
  );

  test.each(scheduleCases)(
    'validasi jadwal: %s',
    (_label, pickupDateTime, isValid, currentDateTime = scheduleNow) => {
      expect(validatePreOrderSchedule(pickupDateTime, currentDateTime).isValid).toBe(isValid);
    }
  );

  test.each(categoryCases)(
    'filter katalog berdasarkan kategori "%s"',
    (category, expectedIds) => {
      expect(filterCatalog(catalog, { category }).map(({ id }) => id)).toEqual(expectedIds);
    }
  );

  test.each(searchCases)(
    'pencarian katalog dengan kata "%s"',
    (searchQuery, expectedIds) => {
      expect(filterCatalog(catalog, { searchQuery }).map(({ id }) => id)).toEqual(expectedIds);
    }
  );
});
