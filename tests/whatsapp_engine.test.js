import { sanitizePhoneNumber, generateWhatsAppLink } from '../src/shakilamvp.js';

describe('MVP 4: Generator Link Direct WhatsApp Checkout', () => {
  test('Harus menormalisasi format nomor HP Indonesia dari 08xx menjadi 628xx', () => {
    expect(sanitizePhoneNumber('081234567890')).toBe('6281234567890');
    expect(sanitizePhoneNumber('62812-3456-7890')).toBe('6281234567890');
  });

  test('Harus melempar error bila nomor telepon tidak valid', () => {
    expect(() => sanitizePhoneNumber('12345')).toThrow('Nomor WhatsApp toko tidak valid');
  });

  test('Harus menghasilkan link wa.me dengan encoding pesan yang valid dan lengkap', () => {
    const link = generateWhatsAppLink({
      storePhone: '081234567890',
      customerName: 'Budi Santoso',
      cakeName: 'Black Forest Klasik',
      size: '20cm',
      flavor: 'Cokelat',
      candleCount: 3,
      greetingText: 'HBD Adik',
      pickupDate: '2026-10-20 10:00',
      totalPrice: 217500
    });

    expect(link).toContain('https://wa.me/6281234567890?text=');
    expect(link).toContain(encodeURIComponent('Budi Santoso'));
    expect(link).toContain(encodeURIComponent('Black Forest Klasik (20cm)'));
    expect(link).toContain(encodeURIComponent('Varian Rasa:* Cokelat'));
    expect(link).toContain(encodeURIComponent('Lilin:* 3'));
    expect(link).toContain(encodeURIComponent('Rp217.500'));
  });

  test('Harus melempar error jika nama pelanggan kosong saat checkout', () => {
    expect(() => {
      generateWhatsAppLink({
        storePhone: '081234567890',
        customerName: '',
        cakeName: 'Bolu Pandan',
        pickupDate: '2026-10-20',
        totalPrice: 85000
      });
    }).toThrow('Nama pelanggan wajib diisi');
  });
});
