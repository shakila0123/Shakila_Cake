import { calculateOrderPrice, CANDLE_PRICE } from '../src/shakilamvp.js';

describe('MVP 2: Kalkulasi Harga Kustomisasi Kue', () => {
  const basePrice = 150000;

  test('Harus menghitung harga ukuran standar (16cm) tanpa lilin dengan benar', () => {
    const calculation = calculateOrderPrice({ basePrice, size: '16cm', candleCount: 0 });
    expect(calculation.cakePrice).toBe(150000);
    expect(calculation.candleTotal).toBe(0);
    expect(calculation.totalPrice).toBe(150000);
  });

  test('Harus mengalikan harga dengan faktor ukuran 20cm dan menambah biaya lilin', () => {
    const calculation = calculateOrderPrice({
      basePrice,
      size: '20cm',
      candleCount: 3,
      greetingText: 'Selamat Ultah Ayah'
    });
    // 150000 * 1.35 = 202500, lilin 3 * 5000 = 15000 -> Total: 217500
    expect(calculation.cakePrice).toBe(202500);
    expect(calculation.candleTotal).toBe(15000);
    expect(calculation.totalPrice).toBe(217500);
  });

  test('Harus melempar error jika teks ucapan melebihi batas 35 karakter', () => {
    const longGreeting = 'Selamat ulang tahun yang ke-25 untuk sahabat terbaikku sepanjang masa!';
    expect(() => {
      calculateOrderPrice({ basePrice, size: '16cm', greetingText: longGreeting });
    }).toThrow('Tulisan ucapan maksimal 35 karakter');
  });

  test('Harus melempar error jika harga dasar kue negatif atau bukan angka', () => {
    expect(() => calculateOrderPrice({ basePrice: -10000 })).toThrow('Harga dasar kue tidak valid');
    expect(() => calculateOrderPrice({ basePrice: 'gratis' })).toThrow('Harga dasar kue tidak valid');
  });
});
