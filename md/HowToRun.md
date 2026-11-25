# Cara Menjalankan Proyek Shakila Cake

Panduan ini untuk menjalankan aplikasi secara lokal di komputer  menggunakan Python. Tidak perlu menjalankan `npm install` untuk membuka halaman dengan server ini.

## Persiapan

1. Pastikan **Python 3** sudah terpasang. Periksa melalui terminal VS Code:

   ```powershell
   python --version
   ```

   Jika perintah `python` tidak dikenali di Windows, coba:

   ```powershell
   py --version
   ```

2. Buka folder utama repository **Shakila_Cake** di VS Code.
3. Buka terminal VS Code melalui menu **Terminal > New Terminal**. Pastikan terminal berada di folder proyek utama `Shakila_Cake`.

   Jika terminal belum berada di folder proyek, arahkan ke folder tersebut. Contoh untuk komputer pengembang:

   ```powershell
   cd "C:\kuliah\rpl smstr 3\New folder\Shakila_Cake"
   ```

   Pada komputer lain, ganti lokasi di atas dengan lokasi folder `Shakila_Cake` yang sudah diunduh/diekstrak.

## Menjalankan aplikasi

1. Dari folder utama `Shakila_Cake`, pastikan folder `public` aktif (bila perlu masuk ke folder public):

   ```powershell
   cd "public"
   ```

   Pastikan folder aktif benar dengan menjalankan:

   ```powershell
   Get-Location
   ```

   Hasilnya harus berakhir dengan `Shakila_Cake\public`.

2. Jalankan server lokal:

   ```powershell
   python -m http.server 8000
   ```

   Jika Windows tidak mengenali perintah `python`, gunakan:

   ```powershell
   py -m http.server 8000
   ```

3. Biarkan terminal tetap terbuka selama aplikasi digunakan.
4. Buka browser dan akses halaman katalog:

   **http://localhost:8000/**

5. Untuk halaman pengelola produk, akses:

   **http://localhost:8000/admin.html**

   Halaman admin memerlukan login akun Firebase yang sudah diberi akses admin. Setelah login, admin dapat mengelola produk dan melihat rekap pesanan.

## Menjalankan test

Proyek ini sudah memiliki script test yang diatur di `package.json`, jadi Anda bisa menjalankannya dengan perintah berikut dari folder utama repository:

```powershell
npm install
npm test
```

Jika ingin melihat daftar test yang terdeteksi tanpa menjalankannya semua, gunakan:

```powershell
npm test -- --listTests
```

Catatan:

- Jalankan perintah di folder utama proyek `Shakila_Cake`, bukan di dalam folder `public`.
- Jika `npm` belum terinstal atau perintah tidak dikenali, pastikan Node.js dan npm sudah terpasang di komputer Anda.
- Jika ingin mengecek versi Node.js:

  ```powershell
  node --version
  npm --version
  ```

## Menghentikan server

Kembali ke terminal VS Code yang sedang menjalankan server, lalu tekan **Ctrl+C**.

## Catatan Firebase

Server Python hanya menyajikan file web secara lokal; server ini tidak menggantikan Firebase. Fitur katalog, login admin, penyimpanan produk/pesanan, dan unggah foto memerlukan koneksi internet dan konfigurasi Firebase yang valid pada [firebase_config.js](public/JS/firebase_config.js).

Untuk demo fitur tersebut, project Firebase perlu mengaktifkan **Authentication Email/Password**, **Cloud Firestore**, dan **Firebase Storage**.

Gunakan akun admin demo yang telah disiapkan untuk aplikasi saat membuka halaman admin. Detail kredensial tidak dicantumkan di file ini.

Jika halaman menampilkan pesan gagal memuat/menyimpan data, periksa koneksi internet, konfigurasi project Firebase, layanan Firebase yang aktif, serta aturan keamanan Firestore dan Storage. Jangan mengganti aturan keamanan dengan aturan yang mengizinkan semua pengguna membaca dan menulis data.
