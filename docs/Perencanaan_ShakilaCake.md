# Perencanaan Proyek — Shakila Cake Web

Dokumen ini berisi gambaran umum perencanaan proyek web **Shakila Cake Web**, mencakup latar belakang masalah, profil pengguna target, dan solusi yang ditawarkan.

---

## 1. Latar Belakang Masalah

Shakila Cake merupakan usaha UMKM toko kue lokal yang melayani pemesanan kue ulang tahun, *dessert box*, dan *snack box*. Saat ini, seluruh proses operasional mulai dari pemasaran, tanya-jawab menu, hingga pemesanan masih dilakukan secara manual melalui obrolan pesan (*chat*) di WhatsApp dan Instagram.

Proses manual ini menimbulkan beberapa kendala mendasar:
1. **Pertanyaan Berulang:** Pelanggan sering menanyakan menu, pilihan rasa, ukuran, dan harga yang sama karena tidak ada katalog terpusat.
2. **Detail Pesanan Terselip:** Informasi penting seperti tanggal pengiriman, ucapan di atas kue, atau pilihan rasa sering terlewat di antara tumpukan *chat*.
3. **Pencatatan Manual:** Pemilik toko harus mencatat kembali pesanan dari pesan WhatsApp ke buku catatan harian secara manual.

---

## 2. Profil Target Pengguna

### A. Pelanggan (Customer)
* **Profil:** Pembeli umum (mahasiswa, ibu rumah tangga, atau anak muda) yang membutuhkan kue untuk perayaan atau konsumsi pribadi.
* **Kebutuhan:**
  * Ingin melihat daftar menu lengkap beserta harga secara transparan tanpa perlu bertanya via *chat*.
  * Ingin proses pemesanan yang cepat dari *smartphone* tanpa wajib membuat akun (*login*).
  * Ingin kepastian bahwa detail kustomisasi kue tercatat dengan benar.

### B. Admin / Pemilik Toko (Mama)
* **Profil:** Pemilik usaha Shakila Cake.
* **Kebutuhan:**
  * Membutuhkan antarmuka pembaruan menu kue yang simpel dan mudah digunakan tanpa latar belakang IT.
  * Membutuhkan rekapitulasi pesanan harian yang terstruktur agar jadwal produksi kue berjalan rapi.

---

## 3. Ide Solusi

Mengembangkan **Shakila Cake App**, yaitu platform web katalog digital dan sistem pemesanan *pre-order* terintegrasi:
* **Katalog Digital Interaktif:** Menyajikan daftar produk lengkap dengan foto, harga, deskripsi, dan fitur filter kategori berbasis HTML/CSS/JS.
* **Direct WhatsApp Checkout:** Mengonversi data formulir pemesanan menjadi format pesan teks WhatsApp yang terstruktur dan otomatis terkirim ke WhatsApp toko.
* **Dasbor Admin Berbasis Firebase:** Antarmuka khusus bagi pemilik toko untuk menambah, mengedit, dan menghapus data produk (*CRUD*) secara *real-time* menggunakan Firebase Cloud Firestore.
