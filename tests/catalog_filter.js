import { filterCatalog } from '../src/shakilaCore.js';

describe('MVP 1: Filter & Pencarian Katalog Produk Shakila Cake', () => {
  const mockCatalog = [
    { id: 1, name: 'Black Forest Special', category: 'Kue Ulang Tahun', isActive: true },
    { id: 2, name: 'Bolu Gulung Pandan', category: 'Bolu', isActive: true },
    { id: 3, name: 'Mini Fruit Pie', category: 'Pie Buah', isActive: true },
    { id: 4, name: 'Bolu Jadul Keju (Habis)', category: 'Bolu', isActive: false },
    { id: 5, name: 'Kue Tart Cokelat Mini', category: 'Kue Ulang Tahun', isActive: true }
  ];

  test('Harus memfilter produk hanya berdasarkan kategori yang dipilih', () => {
    const result = filterCatalog(mockCatalog, { category: 'Pie Buah' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Mini Fruit Pie');
  });

  test('Harus mencari nama produk secara case-insensitive', () => {
    const result = filterCatalog(mockCatalog, { searchQuery: 'cokelat' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Kue Tart Cokelat Mini');
  });

  test('Tidak boleh menampilkan produk yang status isActive-nya false', () => {
    const result = filterCatalog(mockCatalog, { category: 'Bolu' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bolu Gulung Pandan');
  });

  test('Harus mengembalikan array kosong jika input catalog bukan array', () => {
    expect(filterCatalog(null)).toEqual([]);
    expect(filterCatalog(undefined)).toEqual([]);
  });
});
