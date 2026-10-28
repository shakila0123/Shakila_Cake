export const WA_NUMBER = '6285656125421';

export function initWAModal() {
    const modal = document.getElementById('order-modal');
    const closeButton = document.querySelector('.close-btn');
    if (closeButton && modal) {
        closeButton.addEventListener('click', () => modal.classList.add('hidden'));
    }
    document.getElementById('request-wa')?.addEventListener('click', requestCustomWA);
}

export function requestCustomWA() {
    const message = 'Halo kak, saya ingin tanya-tanya tentang pesan kue custom.';
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}
