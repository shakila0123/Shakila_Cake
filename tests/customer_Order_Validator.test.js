import { validateCustomerOrder } from '../src/shakilamvp.js';

describe('MVP: Validasi checkout pelanggan', () => {
  const now = new Date(2026, 9, 15, 10, 0, 0);
  const pickup = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  pickup.setHours(14, 0, 0, 0);

  test('Menerima data pemesanan lengkap dengan jadwal valid', () => {
    const result = validateCustomerOrder({
      customerName: 'Budi Santoso',
      productName: 'Black Forest',
      flavor: 'Cokelat',
      pickupDateTime: pickup.toISOString(),
      greetingText: 'Selamat Ulang Tahun',
      candleCount: 2
    }, now);

    expect(result).toEqual({ isValid: true, errors: [] });
  });

  test('Menolak nama, rasa, jadwal, ucapan, dan jumlah lilin yang tidak valid', () => {
    const result = validateCustomerOrder({
      customerName: ' ',
      productName: '',
      flavor: '',
      pickupDateTime: '',
      greetingText: 'Ucapan ini sengaja dibuat terlalu panjang untuk melewati batas tiga puluh lima karakter',
      candleCount: 21
    }, now);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(6);
  });
});
