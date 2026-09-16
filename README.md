# Shakila Cake: Web Katalog Kue & Manajemen Pemesanan Pre-Order

## Masalah Nyata yang Akan Diselesaikan

Toko kue Shakila Cake saat ini masih mengandalkan obrolan manual (WhatsApp/Instagram) untuk seluruh proses operasional. Hal ini menimbulkan beberapa kendala nyata: pemasaran dan informasi tidak terstruktur karena pelanggan berulang kali menanyakan menu, pilihan rasa, ukuran, dan harga yang sama. Selain itu, terdapat risiko kesalahan pesanan (human error) di mana detail penting seperti tanggal pengiriman, ucapan kue, atau pilihan varian sering terselip di dalam chat yang menumpuk. Pemilik toko juga kesulitan mengatur batasan jumlah pesanan kue per hari (slot kuota pre-order), sehingga rawan terjadi overbooking.

## Profil Target Pengguna

* **Pelanggan (Customer):** Pembeli umum (anak muda, mahasiswa, ibu rumah tangga) yang membutuhkan kue untuk acara ulang tahun, wisuda, atau perayaan tertentu. Menyukai tampilan visual yang jelas, ingin memilih varian kue dengan cepat via HP, dan membutuhkan kepastian tanggal pemesanan.
* **Pengelola Toko / Admin :** Pemilik toko Shakila Cake (mama). Membutuhkan antarmuka admin yang sederhana dan intuitif (mudah dipahami tanpa latar belakang IT) untuk memperbarui menu dan melihat rekap pesanan harian.

## Manfaat Aplikasi

* **Efisiensi Informasi (Pelanggan):** Memudahkan melihat seluruh varian kue, ukuran, dan harga secara transparan kapan saja tanpa perlu bertanya manual.
* **Kemudahan Kustomisasi (Pelanggan):** Mempermudah proses pengisian formulir pemesanan khusus (custom ucapan, tanggal kirim, pilihan lilin).
* **Efisiensi Operasional (Pemilik Toko):** Menghemat waktu operasional karena tidak perlu membalas pertanyaan harga/menu secara berulang-ulang.
* **Manajemen Pesanan Terstruktur (Pemilik Toko):** Rekap pesanan menjadi rapi, terstruktur, dan meminimalkan kesalahan pembuatan kue.

## Daftar Fitur Inti

* **Halaman Katalog & Filter Menu:** Menampilkan foto kue, deskripsi, harga, dan filter berdasarkan kategori (Kue Ulang Tahun, Bolu, Pie Buah, dll.).
* **Detail Produk & Opsi Kustomisasi:** Pelanggan dapat memilih ukuran, varian rasa, serta memasukkan teks ucapan di atas kue.
* **Formulir Pemesanan & Pemilihan Tanggal:** Pelanggan memilih tanggal pengambilan/pengiriman dan metode pembayaran/pengambilan.
* **Direct WhatsApp Checkout:** Mengonversi data pesanan menjadi format pesan teks yang rapi dan otomatis mengarahkan pelanggan ke WhatsApp Admin untuk konfirmasi pembayaran.
* **Manajemen Produk (CRUD Admin):** Admin dapat menambah produk kue baru, mengedit harga/foto, atau menghapus produk.
* **Manajemen Rekap Pesanan (Admin):** Halaman sederhana untuk melihat daftar pesanan yang masuk berdasarkan tanggal acara agar Mama tahu jadwal pembuatan kue setiap harinya.

## Fitur yang Tidak Dikerjakan (Out of Scope)

* **Payment Gateway Otomatis:** Pembayaran tidak menggunakan sistem otomatis (Midtrans/Xendit), melainkan tetap menggunakan transfer manual atau konfirmasi via WhatsApp.
* **Sistem Tracking Kurir / Integrasi Ekspedisi:** Tidak ada fitur pelacakan kurir real-time (Grab/Gojek). Pengiriman dikordinasikan secara manual via WhatsApp.
* **Akun Pelanggan (Login/Register):** Pelanggan bisa langsung memesan tanpa perlu membuat akun untuk mengurangi kompleksitas sistem.
* **Sistem Rekomendasi AI / AR 3D Cake Visualizer:** Tidak menyediakan fitur rekomendasi berbasis AI maupun visualisasi kue 3D.

## Kriteria Aplikasi Dinyatakan Berhasil

* **Fungsionalitas Katalog:** Pelanggan dapat menjelajahi menu kue, melihat harga, dan memfilter berdasarkan kategori tanpa error.
* **Akurasi Pemesanan:** Form pemesanan berhasil menghasilkan ringkasan pesanan yang rapi (lengkap dengan tanggal, detail kustomisasi, dan total harga) lalu terkirim ke nomor WhatsApp toko.
* **Kemudahan Kelola Data (Admin):** Admin berhasil menambah/mengubah data kue di halaman admin tanpa perlu menyentuh kode program (database CRUD berjalan baik).
* **Responsivitas Tampilan:** Tampilan web dapat diakses dengan baik dan nyaman melalui perangkat mobile (smartphone).
