export const WA_NUMBER = "6285656125421";

// Inisialisasi event listener modal WA
export function initWAModal() {
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productName = document.getElementById('product-name').value;
            const name = document.getElementById('customer-name').value;
            const date = document.getElementById('order-date').value;
            const variant = document.getElementById('order-variant').value;
            const text = document.getElementById('order-text').value;

            const waText = `Halo Shakila Cake, saya ingin memesan:\n\n*Produk:* ${productName}\n*Nama:* ${name}\n*Tanggal Ambil:* ${date}\n*Varian/Ukuran:* ${variant}\n*Tulisan di Kue:* ${text || '-'}\n\nMohon info total harga dan pembayarannya. Terima kasih!`;
            const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            modal.classList.add('hidden');
            e.target.reset();
        });
    }
}

// Buka modal dari tombol "Pesan" di katalog
export function openOrderModal(productName) {
    const modal = document.getElementById('order-modal');
    if (modal) {
        document.getElementById('product-name').value = productName;
        modal.classList.remove('hidden');
    }
}

// Pesan kue custom via WA
export function requestCustomWA() {
    const pesan = "Halo kak, saya ingin tanya-tanya tentang pesan kue custom.";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// Pesan langsung via WA
export function orderViaWA(namaKue, harga) {
    const pesan = `Halo kak, saya ingin memesan ${namaKue} seharga Rp ${Number(harga).toLocaleString('id-ID')}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// Supaya fungsi tetap bisa dipanggil langsung dari inline onclick di HTML
window.openOrderModal = openOrderModal;
window.requestCustomWA = requestCustomWA;
window.orderViaWA = orderViaWA;