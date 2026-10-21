# Cara Menjalankan Shakila Cake

## Persyaratan

- Node.js 18 atau lebih baru dan npm.
- Akses ke project Firebase yang digunakan aplikasi.
- Firebase Authentication (Email/Password), Cloud Firestore, dan Firebase Storage aktif.

## Menyiapkan Firebase

1. Pastikan konfigurasi pada [firebase_config.js](shakila_cake_web/public/JS/firebase_config.js) mengarah ke project Firebase yang benar. Project yang tercantum saat ini adalah `shakila-cake-web`.
2. Di Firebase Console, aktifkan **Authentication > Sign-in method > Email/Password**.
3. Buat satu akun admin di **Authentication > Users**, lalu salin UID akun tersebut.
4. Buat database Cloud Firestore dan aktifkan Firebase Storage untuk project.
5. Deploy aturan keamanan sebelum mencoba aplikasi:

   ```powershell
   npx firebase-tools deploy --only firestore:rules,storage --project shakila-cake-web
   ```

6. Di Firestore Console, buat dokumen `admins/{UID_ADMIN}` (ID dokumen harus sama persis dengan UID akun) dengan data:

   ```json
   {
     "active": true
   }
   ```

   Pembuatan dokumen admin hanya dapat dilakukan melalui Firebase Console atau lingkungan admin tepercaya; aplikasi tidak menyediakan pendaftaran/promosi admin.
7. Pastikan nomor WhatsApp toko pada konstanta `WA_NUMBER` di [fitur_wa.js](shakila_cake_web/public/JS/fitur_wa.js) benar dan berformat kode negara, tanpa tanda `+`.

## Instalasi, tes, dan menjalankan lokal

Jalankan dari direktori utama repository:

```powershell
npm install
npm test
npx firebase-tools emulators:start --only hosting --project shakila-cake-web
```

Buka alamat Hosting Emulator yang ditampilkan Firebase CLI (biasanya `http://127.0.0.1:5000`). Hosting Emulator menyajikan berkas lokal, tetapi konfigurasi aplikasi tetap menunjuk ke layanan Firebase project pada [firebase_config.js](shakila_cake_web/public/JS/firebase_config.js); alur login, data, dan unggah foto memerlukan layanan tersebut serta aturan yang telah dideploy.

## Demo alur utama

1. Buka katalog, coba pencarian dan filter kategori.
2. Pilih **Pesan**, isi nama, rasa, ukuran, jumlah lilin, tanggal/jam pengambilan, dan ucapan opsional.
3. Jadwal harus berjarak minimal 48 jam dan berada pada pukul 08.00 sampai sebelum 18.00 waktu lokal.
4. Pilih **Simpan & lanjut ke WhatsApp**. Pesanan dicatat ke Firestore dahulu; WhatsApp dibuka hanya jika penyimpanan berhasil.
5. Login dengan akun yang UID-nya terdaftar di `admins/{UID_ADMIN}`. Tambah, edit, dan hapus produk serta periksa rekap pesanan.

Jika gagal memuat atau menyimpan data, periksa koneksi, konfigurasi project, status layanan Firebase, serta aturan Firestore/Storage. Jangan gunakan aturan terbuka untuk demo publik. Aktifkan Firebase App Check sebelum penggunaan produksi untuk mengurangi penyalahgunaan endpoint publik pembuatan pesanan.

## Deploy Hosting

Setelah pengujian lokal dan konfigurasi Firebase selesai:

```powershell
npx firebase-tools deploy --only hosting --project shakila-cake-web
```

Aturan Firestore dan Storage dideploy terpisah dengan perintah pada langkah persiapan Firebase.
