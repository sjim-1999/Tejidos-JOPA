const visor = document.getElementById('visor');
const imagenGrande = document.getElementById('imagen-grande');
const videoGrande = document.getElementById('video-grande');
const cerrarVisor = document.getElementById('cerrar-visor');

const fotos = document.querySelectorAll('.galeria img');
const videos = document.querySelectorAll('.galeria video');

function abrirFoto(src) {
    if (!visor) return;
    videoGrande.pause();
    videoGrande.style.display = 'none';
    imagenGrande.src = src;
    imagenGrande.style.display = 'block';
    visor.style.display = 'flex';
}

function abrirVideo(videoElement) {
    if (!visor) return;
    videoElement.pause();
    imagenGrande.style.display = 'none';
    videoGrande.src = videoElement.currentSrc || videoElement.src;
    videoGrande.style.display = 'block';
    visor.style.display = 'flex';
    videoGrande.play().catch(() => {});
}

fotos.forEach(foto => {
    foto.addEventListener('click', () => abrirFoto(foto.src));
});

videos.forEach(video => {
    // Quitamos controles nativos en la miniatura para que el toque abra el visor
    video.removeAttribute('controls');
    video.setAttribute('playsinline', '');
    
    video.addEventListener('click', (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        abrirVideo(video);
    });
});

function cerrarModal() {
    if (!visor) return;
    visor.style.display = 'none';
    videoGrande.pause();
    videoGrande.removeAttribute('src');
    videoGrande.load();
}

if (cerrarVisor) {
    cerrarVisor.addEventListener('click', cerrarModal);
}

if (visor) {
    visor.addEventListener('click', (evento) => {
        if (evento.target === visor) {
            cerrarModal();
        }
    });
}