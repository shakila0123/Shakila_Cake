# Checklist MVP Shakila Cake

Status tes di bawah mencatat validasi unit otomatis yang dijalankan dengan `npm test`. Uji yang membutuhkan kredensial dan layanan cloud ditandai **perlu uji manual**, bukan dianggap lulus berdasarkan tes unit.

| Fitur / alur MVP | Status implementasi | Status pengujian |
|---|---|---|
| Katalog publik menampilkan produk, foto, deskripsi, dan harga secara real-time | Selesai | Perlu uji manual dengan Firestore aktif |
| Filter kategori dan pencarian nama, termasuk katalog kosong | Selesai | **PASSED** — `catalog_filter.test.js` |
| Loading dan pesan kegagalan saat katalog tidak dapat dimuat | Selesai | Perlu uji manual untuk kondisi jaringan/Firebase gagal |
| Form checkout: nama, rasa, ukuran, lilin, tanggal/jam, dan ucapan opsional | Selesai | **PASSED** — `customer_Order_Validator.test.js` |
| Validasi H-2, jam operasional, nilai kosong, dan tanggal tidak valid | Selesai | **PASSED** — `order_Schedule_Validator.test.js` |
| Kalkulasi harga ukuran dan lilin serta penolakan input harga/ucapan/lilin tidak valid | Selesai | **PASSED** — `pricing_calculator.test.js` |
| Pesanan dicatat dahulu ke Firestore sebelum WhatsApp dibuka; kegagalan simpan menghentikan checkout | Selesai | Perlu uji manual dengan Firebase Auth/Firestore aktif |
| Format dan URL WhatsApp membawa detail pesanan serta estimasi total | Selesai | **PASSED** — `whatsapp_engine.test.js` |
| Login admin dan verifikasi dokumen `admins/{uid}` aktif | Selesai | Perlu uji manual dengan akun admin Firebase |
| Admin tambah, edit, dan hapus produk serta unggah foto maksimal 5 MB | Selesai | **PASSED** untuk validasi data/berkas — `admin_Product_Validator.test.js`; CRUD/Storage perlu uji manual |
| Rekap pesanan admin diurutkan berdasarkan jadwal pengambilan, termasuk kondisi kosong/gagal muat | Selesai | Perlu uji manual dengan data Firestore |
| Akses baca/tulis dibatasi melalui aturan Firestore dan Storage | Selesai pada berkas aturan | Perlu deploy dan uji aturan pada project Firebase |
| Tampilan responsif untuk katalog, formulir, dan dasbor | Selesai pada stylesheet | Perlu uji visual pada browser desktop dan mobile |

## Hasil suite otomatis

Jalankan dari root repository:

```powershell
npm test
```

**Hasil terakhir: PASSED** — 6 test suites dan 24 test cases. Tes ini menguji logika katalog, checkout, jadwal, kalkulasi harga, WhatsApp, serta validasi produk/unggahan; tes ini tidak menggantikan smoke test pada project Firebase yang sudah dikonfigurasi.

## Syarat sebelum demo langsung

- Atur Auth, Firestore, Storage, dan dokumen admin sesuai [HowToRun.md](HowToRun.md).
- Deploy aturan keamanan; jangan membiarkan aturan lama yang mengizinkan akses publik.
- Verifikasi nomor WhatsApp toko.
- Jalankan checklist manual untuk login admin, CRUD produk, penyimpanan pesanan, WhatsApp, dan rekap.
