import { validatePreOrderSchedule } from '../src/shakilamvp.js';

describe('MVP 3: Aturan Waktu Pre-Order (H-2 & Jam Ambil)', () => {
  const now = new Date('2026-10-15T10:00:00Z');

  test('Harus menolak pemesanan di hari yang sama (kurang dari 48 jam)', () => {
    const sameDay = '2026-10-15T15:00:00Z';
    const result = validatePreOrderSchedule(sameDay, now);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('minimal H-2');
  });

  test('Harus menolak pemesanan H-1 (24 jam kemudian)', () => {
    const nextDay = '2026-10-16T10:00:00Z';
    const result = validatePreOrderSchedule(nextDay, now);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('minimal H-2');
  });

  test('Harus menerima pemesanan valid H-3 pada jam operasional (14:00)', () => {
    // 3 hari setelahnya pukul 14:00 waktu lokal
    const validPickup = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    validPickup.setHours(14, 0, 0);

    const result = validatePreOrderSchedule(validPickup.toISOString(), now);
    expect(result.isValid).toBe(true);
  });

  test('Harus menolak pemesanan pada jam di luar operasional toko (misal: 21:00)', () => {
    const latePickup = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    latePickup.setHours(21, 0, 0);

    const result = validatePreOrderSchedule(latePickup.toString(), now);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('jam operasional toko');
  });
});
