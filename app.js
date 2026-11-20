
/* ========================================
   TEJIDOS JOPA - FUNCIONALIDADES
======================================== */

// Número de WhatsApp en formato internacional
const NUMERO_WHATSAPP = "593994041162";

// ========================================
// FILTROS DEL CATÁLOGO
// ========================================

const filtros = document.querySelectorAll(".filter-btn");
const productos = document.querySelectorAll(".product-card");

filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {

        filtros.forEach(btn => btn.classList.remove("activa"));
        filtro.classList.add("activa");

        const categoria = filtro.dataset.filter;

        productos.forEach(producto => {
            const mostrar =
                categoria === "todos" ||
                producto.dataset.category === categoria;

            producto.style.display = mostrar ? "" : "none";
        });
    });
});

// ========================================
// GALERÍAS
// ========================================

function abrirCategoria(idCategoria) {

    const seleccionada = document.getElementById(idCategoria);

    if (!seleccionada) return;

    document.querySelectorAll(".galeria-categoria").forEach(seccion => {
        seccion.classList.remove("activa");
    });

    seleccionada.classList.add("activa");

    document.querySelectorAll("body > section").forEach(seccion => {
        if (
            seccion.id === "catalogo" ||
            seccion.id === "inicio" ||
            seccion.id === "nosotros" ||
            seccion.id === "contacto"
        ) {
            seccion.style.display = "none";
        }
    });

    document.querySelector(".benefits").style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function volverAlInicio() {

    document.querySelectorAll(".galeria-categoria").forEach(seccion => {
        seccion.classList.remove("activa");
    });

    document.querySelectorAll("body > section").forEach(seccion => {
        if (
            seccion.id === "catalogo" ||
            seccion.id === "inicio" ||
            seccion.id === "nosotros" ||
            seccion.id === "contacto"
        ) {
            seccion.style.display = "";
        }
    });

    const beneficios = document.querySelector(".benefits");

    if (beneficios) {
        beneficios.style.display = "";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ========================================
// VISOR DE FOTOS Y VIDEOS
// ========================================

const visor = document.getElementById("visor");
const imagenGrande = document.getElementById("imagen-grande");
const videoGrande = document.getElementById("video-grande");
const cerrarVisor = document.getElementById("cerrar-visor");

const fotos = document.querySelectorAll(
    ".galeria img, .cuadricula-fotos img"
);

const videos = document.querySelectorAll(
    ".galeria video, .cuadricula-fotos video"
);

function abrirFoto(src) {

    if (!visor || !imagenGrande || !videoGrande) return;

    videoGrande.pause();
    videoGrande.removeAttribute("src");
    videoGrande.load();
    videoGrande.style.display = "none";

    imagenGrande.src = src;
    imagenGrande.style.display = "block";

    visor.style.display = "flex";
}

function abrirVideo(video) {

    if (!visor || !imagenGrande || !videoGrande) return;

    imagenGrande.style.display = "none";

    videoGrande.src = video.currentSrc || video.src;
    videoGrande.style.display = "block";

    visor.style.display = "flex";

    videoGrande.play().catch(() => {});
}

fotos.forEach(foto => {
    foto.addEventListener("click", () => abrirFoto(foto.src));
});

videos.forEach(video => {

    video.removeAttribute("controls");
    video.setAttribute("playsinline", "");

    video.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        abrirVideo(video);
    });
});

function cerrarModal() {

    if (!visor) return;

    visor.style.display = "none";

    if (videoGrande) {
        videoGrande.pause();
        videoGrande.removeAttribute("src");
        videoGrande.load();
    }

    if (imagenGrande) {
        imagenGrande.removeAttribute("src");
    }
}

if (cerrarVisor) {
    cerrarVisor.addEventListener("click", cerrarModal);
}

if (visor) {
    visor.addEventListener("click", evento => {
        if (evento.target === visor) {
            cerrarModal();
        }
    });
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarModal();
        cerrarCarrito();
    }
});

// ========================================
// CARRITO
// ========================================

let carrito = [];

const abrirCarritoBtn = document.getElementById("abrir-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const contadorCarrito = document.getElementById("contador-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const enviarPedidoBtn = document.getElementById("enviar-pedido");

function agregarAlCarrito(nombre, precio) {

    const existente = carrito.find(item => item.nombre === nombre);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            nombre,
            precio,
            cantidad: 1
        });
    }

    renderizarCarrito();
    mostrarToast("Producto agregado al pedido");
}

document.querySelectorAll("[data-add]").forEach(boton => {

    boton.addEventListener("click", () => {

        const nombre = boton.dataset.add;
        const precio = Number(boton.dataset.price);

        agregarAlCarrito(nombre, precio);
    });
});

function renderizarCarrito() {

    cartItems.innerHTML = "";

    if (carrito.length === 0) {

        cartItems.innerHTML = `
            <p class="cart-empty">
                Aún no has agregado productos.
            </p>
        `;

    } else {

        carrito.forEach((item, index) => {

            const elemento = document.createElement("div");
            elemento.className = "cart-item";

            elemento.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.nombre}</strong>
                    <small>Desde $${item.precio.toFixed(2)} por unidad</small>
                    <small>Subtotal referencial: $${(item.precio * item.cantidad).toFixed(2)}</small>
                </div>

                <div class="cart-item-controls">
                    <button data-restar="${index}" aria-label="Disminuir cantidad">−</button>
                    <span>${item.cantidad}</span>
                    <button data-sumar="${index}" aria-label="Aumentar cantidad">+</button>
                    <button data-eliminar="${index}" class="remove" aria-label="Eliminar producto">×</button>
                </div>
            `;

            cartItems.appendChild(elemento);
        });
    }

    const subtotal = carrito.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );

    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    contadorCarrito.textContent = cantidadTotal;

    cartItems.querySelectorAll("[data-sumar]").forEach(btn => {
        btn.addEventListener("click", () => {
            carrito[Number(btn.dataset.sumar)].cantidad++;
            renderizarCarrito();
        });
    });

    cartItems.querySelectorAll("[data-restar]").forEach(btn => {
        btn.addEventListener("click", () => {

            const index = Number(btn.dataset.restar);

            carrito[index].cantidad--;

            if (carrito[index].cantidad <= 0) {
                carrito.splice(index, 1);
            }

            renderizarCarrito();
        });
    });

    cartItems.querySelectorAll("[data-eliminar]").forEach(btn => {
        btn.addEventListener("click", () => {

            carrito.splice(Number(btn.dataset.eliminar), 1);

            renderizarCarrito();
        });
    });
}

function abrirCarrito() {
    cartOverlay.classList.add("abierto");
    document.body.classList.add("no-scroll");
}

function cerrarCarrito() {
    cartOverlay.classList.remove("abierto");
    document.body.classList.remove("no-scroll");
}

if (abrirCarritoBtn) {
    abrirCarritoBtn.addEventListener("click", abrirCarrito);
}

if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", evento => {
        if (evento.target === cartOverlay) {
            cerrarCarrito();
        }
    });
}

if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener("click", () => {

        carrito = [];
        renderizarCarrito();

        mostrarToast("Pedido vaciado");
    });
}

// ========================================
// ENVIAR PEDIDO POR WHATSAPP
// ========================================

if (enviarPedidoBtn) {

    enviarPedidoBtn.addEventListener("click", () => {

        if (carrito.length === 0) {
            mostrarToast("Agrega productos antes de enviar");
            return;
        }

        let mensaje = "Hola, Tejidos JOPA 🧶. Quiero realizar un pedido:\n\n";

        carrito.forEach(item => {

            const subtotal = item.precio * item.cantidad;

            mensaje +=
                `• ${item.nombre}\n` +
                `  Cantidad: ${item.cantidad}\n` +
                `  Precio referencial desde: $${item.precio.toFixed(2)}\n` +
                `  Subtotal referencial: $${subtotal.toFixed(2)}\n\n`;
        });

        const total = carrito.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0
        );

        mensaje +=
            `Subtotal referencial: $${total.toFixed(2)}\n\n` +
            "Deseo confirmar disponibilidad, personalización y precio final.";

        const url =
            `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");

    });
}

// ========================================
// MENÚ MÓVIL
// ========================================

const menuButton = document.getElementById("menu-button");
const nav = document.getElementById("nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {
        nav.classList.toggle("abierto");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("abierto");
        });
    });
}

// ========================================
// AVISO
// ========================================

const toast = document.getElementById("toast");

let toastTimeout;

function mostrarToast(mensaje) {

    if (!toast) return;

    toast.textContent = mensaje;
    toast.classList.add("visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2200);
}

// ========================================
// INICIALIZACIÓN
// ========================================

renderizarCarrito();
const FIREBASE_VISITAS_URL = "https://tejidos-jopa-default-rtdb.firebaseio.com/visitas.json";

async function registrarYMostrarVisita() {
  const contadorEl = document.getElementById("contador-visitas");
  if (!contadorEl) return;

  try {
    // 1. Obtener el total actual guardado en la nube
    const respuestaGet = await fetch(FIREBASE_VISITAS_URL);
    if (!respuestaGet.ok) {
      throw new Error("No se pudo leer el contador");
    }

    const valorActual = Number(await respuestaGet.json()) || 0;
    const nuevoTotal = valorActual + 1;

    // 2. Guardar el nuevo total (+1)
    const respuestaPut = await fetch(FIREBASE_VISITAS_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoTotal)
    });

    if (!respuestaPut.ok) {
      throw new Error("No se pudo actualizar el contador");
    }

    // 3. Mostrarlo formateado para todos
    contadorEl.textContent = nuevoTotal.toLocaleString("es-EC");
  } catch (error) {
    console.error("Error en el contador de visitas:", error);
    contadorEl.textContent = "—";
  }
}

document.addEventListener("DOMContentLoaded", registrarYMostrarVisita);