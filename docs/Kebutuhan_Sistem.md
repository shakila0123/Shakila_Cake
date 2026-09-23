# Kebutuhan Sistem & Kriteria Keberhasilan — Shakila Cake Web

Dokumen ini mendefinisikan rincian kendala operasional, daftar kebutuhan fitur, serta kriteria keberhasilan proyek.

---

## 1. Rincian Kendala Operasional

| No | Kendala Operasional | Dampak pada Usaha | Solusi dalam Sistem |
| :--- | :--- | :--- | :--- |
| 1 | Tidak ada katalog resmi | Waktu terbuang membalas pertanyaan menu/harga yang sama | Halaman katalog digital interaktif |
| 2 | Detail kustomisasi via *chat* acak | Risiko kesalahan pembuatan ucapan/rasa kue | Form pemesanan dengan input kustomisasi wajib |
| 3 | Pencatatan pesanan manual | Risiko *overbooking* atau lupa jadwal produksi | Rekap jadwal pesanan harian terurut |

---

## 2. Fitur Inti Sistem

### Fitur Sisi Pelanggan (Public Web)
1. **Halaman Katalog & Filter Menu:**
   * Menampilkan daftar produk kue lengkap dengan foto, deskripsi, dan harga.
   * Filter cepat berdasarkan kategori (Kue Ulang Tahun, Dessert Box, Snack Box).
2. **Kustomisasi & Form Pemesanan:**
   * Pemilihan varian rasa dan ukuran kue.
   * Input teks ucapan khusus di atas kue.
   * Pemilihan tanggal pengambilan/pengiriman.
3. **Engine Direct WhatsApp Checkout:**
   * Tombol pesan yang secara otomatis membuka WhatsApp dengan draf pesan pesanan yang rapi.

### Fitur Sisi Admin (Dashboard Mama)
1. **Autentikasi Admin:**
   * Halaman *login* aman khusus admin menggunakan Firebase Authentication.
2. **Manajemen Produk (CRUD):**
   * Tambah produk baru (Nama, Kategori, Harga, Deskripsi, URL Foto).
   * Edit data dan harga produk.
   * Hapus produk dari katalog.
3. **Rekap Pesanan:**
   * Menampilkan ringkasan daftar pesanan yang masuk berdasarkan tanggal acara/pengambilan.

---

## 3. Kriteria Keberhasilan

Aplikasi dinyatakan berhasil jika memenuhi kriteria berikut:
1. **Katalog Aksesibel:** Pelanggan dapat menjelajahi seluruh menu dan memfilter kategori tanpa hambatan (*error-free*).
2. **Format Pesanan Akurat:** Form pemesanan menghasilkan ringkasan teks WhatsApp yang lengkap (nama, tanggal, detail kustomisasi, total harga).
3. **Kemudahan Kelola Data:** Admin (Mama) dapat menambah, mengedit, dan menghapus produk di Firebase melalui dasbor web tanpa bantuan teknis.
4. **Desain Responsif:** Seluruh halaman web tampil rapi dan nyaman digunakan melalui *mobile browser* (HP).
