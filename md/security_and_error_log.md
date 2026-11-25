# Security and Error Log

## 1. Insiden Keamanan

### Ringkasan
Password admin Firebase sempat tertulis di riwayat commit GitHub. Kejadian ini berpotensi membuka akses tidak sah ke akun admin dan data operasional aplikasi jika kredensial tersebut digunakan oleh pihak yang tidak berwenang.

### Penyebab
Kredensial admin Firebase sebelumnya disimpan dalam source code atau konfigurasi yang kemudian ikut masuk ke histori commit GitHub. Kondisi ini terjadi sebelum dilakukan review terhadap data sensitif pada repositori.

### Dampak
- Potensi penyalahgunaan akun admin Firebase.
- Risiko akses tidak sah ke dashboard admin dan pengelolaan produk.
- Risiko terpaparnya data internal aplikasi dan konfigurasi operasional toko.

### Perbaikan yang dilakukan
- Kredensial telah dihapus dari source code dan histori repositori yang relevan.
- Password Auth pada akun admin telah di-reset melalui Firebase Console.
- Semua konfigurasi sensitif dilindungi agar tidak dikirim kembali ke repositori publik.

### Status
Tertutup / diperbaiki.

---

## 2. Insiden Error (Troubleshooting)

### Ringkasan
Terjadi error CORS saat unggah foto ke Firebase Storage dari localhost. Masalah ini muncul karena proses upload dari lingkungan lokal sering dibatasi oleh konfigurasi CORS dan kebijakan keamanan browser yang tidak mengizinkan akses antar origin secara langsung.

### Penyebab
Aplikasi berjalan di localhost, sementara Firebase Storage menerima request dari origin yang tidak sepenuhnya kompatibel dengan skenario local development. Akibatnya, unggah file dari browser ditolak karena batasan keamanan CORS.

### Dampak
- Unggah foto produk gagal saat dilakukan dari lingkungan localhost.
- Proses admin menambah produk menjadi terhambat.
- Pengalaman pengembangan dan testing lokal terganggu.

### Perbaikan yang dilakukan
- Arsitektur penyimpanan diubah dengan melepas Firebase Storage sepenuhnya.
- Gambar diproses langsung di frontend menggunakan Canvas HTML5.
- Gambar dikompresi menjadi teks Base64 dan disimpan langsung ke Firestore.
- Dengan pendekatan ini, kebutuhan upload file ke storage lokal tidak lagi bergantung pada konfigurasi CORS Firebase.

### Status
Tertutup / resolved dengan arsitektur baru.

---

## Kesimpulan
Kedua insiden tersebut menjadi pembelajaran penting dalam pengelolaan keamanan dan arsitektur aplikasi. Sebagai tindakan preventif, penyimpanan data sensitif tidak lagi dilakukan di konfigurasi repo publik, dan pengolahan gambar produk telah disesuaikan agar kompatibel dengan lingkungan localhost tanpa menimbulkan error CORS.
