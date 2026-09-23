
# Shakila Cake App

Aplikasi web katalog digital dan pengelola pemesanan *pre-order* untuk toko kue lokal, dengan integrasi langsung ke WhatsApp dan dasbor manajemen berbasis Firebase.

---

## Deskripsi Proyek

**Shakila Cake App** membantu pelanggan melihat katalog kue, menyesuaikan pesanan (seperti tulisan ucapan dan varian rasa), dan melakukan pemesanan dengan mudah. Di sisi lain, aplikasi ini membantu pemilik toko (Mama) untuk mengelola daftar produk dan melihat rekap pesanan harian tanpa perlu mencatat manual dari obrolan WhatsApp yang menumpuk.

## Latar Belakang

Saat ini operasional Shakila Cake masih mengandalkan obrolan manual di WhatsApp. Pelanggan berulang kali menanyakan menu dan daftar harga yang sama karena belum ada katalog terpusat. Selain itu, detail penting seperti tanggal pengambilan dan tulisan di atas kue rentan terselip, serta rekapitulasi pesanan harian masih dilakukan secara manual yang menyita waktu pemilik toko. Aplikasi ini menjawabnya dengan digitalisasi katalog dan format pesanan terstruktur.

## Tujuan

* Menyediakan katalog produk digital yang bisa diakses pelanggan kapan saja.
* Mempermudah pelanggan dalam memilih kustomisasi kue (ukuran, rasa, ucapan).
* Mengonversi data pesanan secara otomatis menjadi pesan WhatsApp yang rapi dan terstruktur.
* Menyediakan dasbor admin yang intuitif untuk mengelola produk (CRUD).
* Menyimpan data produk secara *real-time* dan aman menggunakan Firebase.

## Target Pengguna

Terdapat dua peran utama dalam aplikasi ini:

* **Pelanggan:** Pembeli umum yang ingin melihat katalog, mencari kue untuk acara tertentu, dan melakukan pemesanan tanpa harus registrasi akun.
* **Admin (Mama):** Pemilik toko yang bertugas menambah/mengedit produk di katalog dan melihat rekap jadwal produksi harian.

## Rencana Fitur

* Autentikasi Login (Khusus Admin/Mama)
* Tampilan katalog digital interaktif
* Filter produk berdasarkan kategori (Kue Ulang Tahun, Dessert Box, Snack Box)
* Form pemesanan dengan input kustomisasi (tanggal ambil, tulisan ucapan, varian rasa)
* *Direct WhatsApp Checkout Engine*
* Pencatatan dan pengelolaan produk (Tambah, Edit, Hapus) di dasbor admin
* Tampilan rekap pesanan otomatis di sisi admin

## Rencana Tech Stack

| Bagian | Teknologi |
| :--- | :--- |
| **Frontend** | HTML, CSS |
| **Backend & Logic** | JavaScript (ES6+ Vanilla) |
| **Database** | Firebase (Cloud Firestore / Realtime Database) |
| **Autentikasi** | Firebase Authentication |
| **Infrastruktur** | Firebase Hosting / GitHub Pages |

## Rencana Struktur Proyek

shakila-cake-app/
  public/
    index.html          (Halaman Katalog untuk Pelanggan)
    admin.html          (Halaman Dasbor Manajemen)
    css/
      style.css         (Styling aplikasi)
    js/
      app.js            (Logika UI pelanggan & integrasi WhatsApp)
      admin.js          (Logika dasbor admin & autentikasi)
      firebase-config.js (Inisialisasi Firebase SDK)
  docs/
    README.md           (Dokumen proyek)



## Dokumen Proyek

| Dokumen | Isi |
| --- | --- |
| `Perencanaan_ShakilaCake.md` | Latar belakang masalah, profil pengguna, dan ide solusi |
| `Kebutuhan_Sistem.md` | Rincian kendala operasional, fitur inti, dan kriteria keberhasilan |
| `Panduan_Teknis_Firebase.md` | Spesifikasi teknis integrasi Firebase dan struktur HTML/CSS/JS |

## Bagian yang Akan Ditambahkan Setelah Aplikasi Jadi

* [ ] Tautan (Link) aplikasi yang sudah di-hosting (Live URL)
* [ ] Tangkapan layar (Screenshot) antarmuka aplikasi versi akhir
* [ ] Panduan singkat penggunaan dasbor admin untuk Mama
* [ ] Struktur data produk di Firebase
* [ ] Daftar keterbatasan aplikasi pada rilis pertama
* [ ] Rencana pengembangan fitur selanjutnya

```

```
