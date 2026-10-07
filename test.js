function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

const tesHarga = formatRupiah(50000);
if (tesHarga === 'Rp 50.000') {
  console.log('Berhasil: Format harga kue valid!');
} else {
  console.error('Gagal');
  process.exit(1);
}