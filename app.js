const visor = document.getElementById('visor');
const imagenGrande = document.getElementById('imagen-grande');
const videoGrande = document.getElementById('video-grande');
const cerrarVisor = document.getElementById('cerrar-visor');

const fotos = document.querySelectorAll('.galeria img');
const videos = document.querySelectorAll('.galeria video');

fotos.forEach(foto => {
    foto.addEventListener('click', () => {
        videoGrande.pause();
        videoGrande.style.display = 'none';
        imagenGrande.src = foto.src;
        imagenGrande.style.display = 'block';
        visor.style.display = 'flex';
    });
});

videos.forEach(video => {
    video.addEventListener('click', (evento) => {
        evento.preventDefault();
        video.pause();
        imagenGrande.style.display = 'none';
        videoGrande.src = video.currentSrc || video.src;
        videoGrande.style.display = 'block';
        visor.style.display = 'flex';
        videoGrande.play();
    });
});

function cerrarModal() {
    visor.style.display = 'none';
    videoGrande.pause();
    videoGrande.src = '';
}

cerrarVisor.addEventListener('click', cerrarModal);

visor.addEventListener('click', (evento) => {
    if (evento.target === visor) {
        cerrarModal();
    }
});