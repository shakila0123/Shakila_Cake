import { validateProductData, validateImageUpload, MAX_FILE_SIZE } from '../src/shakilamvp.js';

describe('MVP 5: Validasi Input Produk & Unggah Berkas Admin (Mama)', () => {
  test('Harus meloloskan data produk yang lengkap dan valid', () => {
    const result = validateProductData({
      name: 'Pie Buah Segar Strawberry',
      price: 65000,
      category: 'Pie Buah'
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Harus menolak data produk jika harga bernilai 0 atau negatif', () => {
    const result = validateProductData({
      name: 'Kue Bolu',
      price: -500,
      category: 'Bolu'
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Harga produk harus angka positif lebih dari 0');
  });

  test('Harus menolak unggahan berkas gambar dengan ukuran lebih dari 5 MB', () => {
    const heavyFile = {
      name: 'kue_hd.png',
      size: MAX_FILE_SIZE + 1024, // 5MB + 1KB
      type: 'image/png'
    };
    const uploadCheck = validateImageUpload(heavyFile);
    expect(uploadCheck.isValid).toBe(false);
    expect(uploadCheck.message).toContain('maksimal adalah 5 MB');
  });

  test('Harus menolak unggahan berkas dengan format di luar gambar (misal: PDF/EXE)', () => {
    const docFile = {
      name: 'kue_recipe.pdf',
      size: 1024 * 100,
      type: 'application/pdf'
    };
    const uploadCheck = validateImageUpload(docFile);
    expect(uploadCheck.isValid).toBe(false);
    expect(uploadCheck.message).toContain('Format berkas harus JPEG, PNG, atau WEBP');
  });
});
