const centerCoords = [-34.6534, -58.6186];
const map = L.map("map", {
  zoomControl: false,
}).setView(centerCoords, 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

function createCustomIcon(colorClass, iconClass) {
  return L.divIcon({
    className: "custom-pin-wrapper",
    html: `<div class="map-pin pin-${colorClass}"><i class="fa-solid ${iconClass}"></i></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function createActiveIcon() {
  return L.divIcon({
    className: "custom-pin-wrapper",
    html: `<div class="map-pin pin-red-active"><i class="fa-solid fa-location-dot"></i></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

const estadoColores = {
  pendiente: "blue",
  "en-proceso": "orange",
  resuelto: "green",
};

const categoriaIconos = {
  baches: "fa-triangle-exclamation",
  alumbrado: "fa-lightbulb",
  basura: "fa-trash",
  "espacios-verdes": "fa-leaf",
  desagues: "fa-droplet",
  veredas: "fa-person-walking-arrow-loop-left",
  otros: "fa-circle-question",
};

// Base de dato de ejemplo.
const listaReclamos = [
  {
    id: 1248,
    titulo: "Bache en la vía pública",
    categoria: "baches",
    estado: "en-proceso",
    fecha: "mes",
    direccion: "Av. Rivadavia 18.500, Morón",
    desc: "Gran bache en medio de la avenida que dificulta la circulación.",
    coords: [-34.662, -58.605],
  },
  {
    id: 1249,
    titulo: "Luminaria apagada",
    categoria: "alumbrado",
    estado: "pendiente",
    fecha: "hoy",
    direccion: "Belgrano 400, Morón",
    desc: "Toda la cuadra quedó a oscuras desde anoche.",
    coords: [-34.64, -58.61],
  },
  {
    id: 1250,
    titulo: "Acumulación de residuos",
    categoria: "basura",
    estado: "resuelto",
    fecha: "semana",
    direccion: "Sarmiento 800, Morón",
    desc: "Contenedor desbordado en la esquina del colegio.",
    coords: [-34.645, -58.625],
  },
  {
    id: 1251,
    titulo: "Poda de árbol urgente",
    categoria: "espacios-verdes",
    estado: "en-proceso",
    fecha: "semana",
    direccion: "Plaza San Martín, Morón",
    desc: "Rama gigante a punto de caerse sobre los cables.",
    coords: [-34.658, -58.63],
  },
  {
    id: 1252,
    titulo: "Destape de sumidero",
    categoria: "desagues",
    estado: "pendiente",
    fecha: "mes",
    direccion: "Buen Viaje 900, Morón",
    desc: "El agua no drena y se inunda la vereda cuando llueve.",
    coords: [-34.651, -58.595],
  },
];

let capaMarcadores = L.layerGroup().addTo(map);

const activeMarker = L.marker([-34.6534, -58.6186], {
  icon: createActiveIcon(),
  draggable: true,
}).addTo(map);

activeMarker.on("dragend", function () {
  console.log("El usuario movió el pin principal a:", activeMarker.getLatLng());
});

document
  .getElementById("btn-zoom-in")
  .addEventListener("click", () => map.zoomIn());
document
  .getElementById("btn-zoom-out")
  .addEventListener("click", () => map.zoomOut());
document
  .getElementById("btn-center")
  .addEventListener("click", () => map.setView(centerCoords, 14));

// Lógica de filtros.
document.addEventListener("DOMContentLoaded", () => {
  const sidebarRight = document.querySelector(".sidebar-right");
  const btnClose = document.querySelector(".btn-close");
  const btnBack = document.querySelector(".btn-back");

  const toggleFiltros = document.querySelector(".filter-section-title");
  const checkboxesEstado = document.querySelectorAll(".checkbox-label input");
  const selectCategoria = document.querySelector(
    ".filter-group select:nth-of-type(1)",
  );
  const selectFecha =
    document.querySelectorAll(".select-box")[1] ||
    document.querySelector(".filter-group:nth-of-type(4) select");
  const btnClear = document.querySelector(".btn-clear");

  // --- 1. Renderizado y filtrado de mapa.
  function actualizarMapa() {
    capaMarcadores.clearLayers();

    let estadosSeleccionados = [];
    let todosTildado = false;

    checkboxesEstado.forEach((cb) => {
      const texto = cb.parentElement.textContent.trim().toLowerCase();
      if (texto.includes("todos") && cb.checked) todosTildado = true;
      if (cb.checked && !texto.includes("todos")) {
        if (texto.includes("pendiente")) estadosSeleccionados.push("pendiente");
        if (texto.includes("proceso")) estadosSeleccionados.push("en-proceso");
        if (texto.includes("resuelto")) estadosSeleccionados.push("resuelto");
      }
    });

    const catSeleccionada = selectCategoria
      ? selectCategoria.value
      : "Todas las categorías";
    const fechaSeleccionada = selectFecha
      ? selectFecha.value
      : "Cualquier fecha";

    let contadorReclamos = 0;

    listaReclamos.forEach((reclamo) => {
      const pasaEstado =
        todosTildado || estadosSeleccionados.includes(reclamo.estado);
      const totalCategorias =
        catSeleccionada === "Todas las categorías" ||
        catSeleccionada === "todas";
      const pasaCategoria =
        totalCategorias || reclamo.categoria === catSeleccionada;
      const totalFechas =
        fechaSeleccionada === "Cualquier fecha" ||
        fechaSeleccionada === "cualquier";
      const pasaFecha = totalFechas || reclamo.fecha === fechaSeleccionada;

      if (pasaEstado && pasaCategoria && pasaFecha) {
        contadorReclamos++;
        const color = estadoColores[reclamo.estado] || "blue";
        const icono =
          categoriaIconos[reclamo.categoria] || "fa-circle-question";

        const marker = L.marker(reclamo.coords, {
          icon: createCustomIcon(color, icono),
        });

        marker.on("click", () => {
          cargarDetalleDerecho(reclamo);
          if (sidebarRight) sidebarRight.classList.remove("hidden");
          setTimeout(() => map.invalidateSize(), 300);
        });

        capaMarcadores.addLayer(marker);
      }
    });

    const txtContador = document.querySelector(".map-controls-bottom span");
    if (txtContador)
      txtContador.textContent = `Mostrando ${contadorReclamos} reclamos en esta área`;
  }

  // 2. Registrar eventos de filtrado.
  checkboxesEstado.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const texto = cb.parentElement.textContent.trim().toLowerCase();
      if (texto.includes("todos")) {
        checkboxesEstado.forEach((item) => (item.checked = cb.checked));
      } else if (!cb.checked) {
        checkboxesEstado.forEach((item) => {
          if (
            item.parentElement.textContent
              .trim()
              .toLowerCase()
              .includes("todos")
          ) {
            item.checked = false;
          }
        });
      }
      actualizarMapa();
    });
  });

  if (selectCategoria)
    selectCategoria.addEventListener("change", actualizarMapa);
  if (selectFecha) selectFecha.addEventListener("change", actualizarMapa);

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      checkboxesEstado.forEach(
        (cb) =>
          (cb.checked =
            cb.parentElement.textContent
              .trim()
              .toLowerCase()
              .includes("todos") ||
            cb.parentElement.textContent
              .trim()
              .toLowerCase()
              .includes("proceso")
              ? true
              : false),
      );
      if (selectCategoria) selectCategoria.selectedIndex = 0;
      if (selectFecha) selectFecha.selectedIndex = 0;
      actualizarMapa();
    });
  }

  if (toggleFiltros) {
    toggleFiltros.addEventListener("click", () => {
      const icono = toggleFiltros.querySelector("i");
      const filtros = document.querySelectorAll(".filter-group, .btn-clear");
      filtros.forEach((f) => {
        if (f.style.display === "none") {
          f.style.display = "block";
          if (icono) icono.className = "fa-solid fa-chevron-down";
        } else {
          f.style.display = "none";
          if (icono) icono.className = "fa-solid fa-chevron-right";
        }
      });
    });
  }

  // 3. Lógica de detalle derecho.
  if (sidebarRight) {
    sidebarRight.addEventListener("click", (e) => {
      const botonCerrar = e.target.closest(".btn-close, .btn-back");

      if (botonCerrar) {
        e.stopPropagation();
        sidebarRight.style.display = "none";
      }
    });
  }

  function cargarDetalleDerecho(reclamo) {
    if (sidebarRight) sidebarRight.style.display = "block";

    const badge = sidebarRight.querySelector(".status-badge");
    const title = sidebarRight.querySelector(".detail-title h2");
    const direccion = sidebarRight.querySelector(
      ".detail-title p:nth-of-type(1)",
    );
    const idText = sidebarRight.querySelector(".id-reclamo");
    const desc = sidebarRight.querySelector(".detail-desc");
    const iconContainer = sidebarRight.querySelector(".detail-icon i");

    if (badge) {
      badge.textContent =
        reclamo.estado === "en-proceso"
          ? "En proceso"
          : reclamo.estado === "pendiente"
            ? "Pendiente"
            : "Resuelto";
      badge.className = `status-badge status-${reclamo.estado}`;
    }
    if (title) title.textContent = reclamo.titulo;
    if (direccion) direccion.textContent = reclamo.direccion;
    if (idText) idText.textContent = `ID: #${reclamo.id}`;
    if (desc) desc.textContent = reclamo.desc;
    if (iconContainer)
      iconContainer.className = `fa-solid ${categoriaIconos[reclamo.categoria]}`;
  }

  if (sidebarRight) {
    sidebarRight.addEventListener("click", (e) => {
      const btnLike = e.target.closest(".like-count");
      if (btnLike) {
        const icon = btnLike.querySelector("i");
        let count = parseInt(btnLike.textContent.trim());

        if (icon.classList.contains("fa-regular")) {
          icon.className = "fa-solid fa-thumbs-up";
          btnLike.innerHTML = `${icon.outerHTML} ${count + 1}`;
        } else {
          icon.className = "fa-regular fa-thumbs-up";
          btnLike.innerHTML = `${icon.outerHTML} ${count - 1}`;
        }
      }
    });
  }

  const commentBtn = document.querySelector(".comment-input-box button");
  const commentInput = document.querySelector(".comment-input-box input");
  const commentsList = document.querySelector(".comments-list");

  if (commentBtn && commentInput && commentsList) {
    commentBtn.addEventListener("click", () => {
      const text = commentInput.value.trim();
      if (!text) return;

      const newComment = document.createElement("div");
      newComment.className = "comment-item";
      newComment.innerHTML = `
                <div class="comment-avatar">V</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-name">Vecino de Morón</span>
                        <span class="comment-time">Ahora mismo</span>
                    </div>
                    <p class="comment-text">${text}</p>
                    <div class="comment-actions">
                        <button class="btn-reply">Responder</button>
                        <span class="like-count"><i class="fa-regular fa-thumbs-up"></i> 0</span>
                    </div>
                </div>
            `;
      commentsList.prepend(newComment);
      commentInput.value = "";
    });
  }

  actualizarMapa();
});

// Buscador directo con enter.
const buscadorInput = document.querySelector(".search-box input");

if (buscadorInput) {
  buscadorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const direccion = buscadorInput.value.trim();
      if (!direccion) return;

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}+Moron&limit=1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 15);
            if (typeof activeMarker !== "undefined") {
              activeMarker.setLatLng([lat, lon]);
            }
          } else {
            alert("No pudimos encontrar esa dirección dentro de Morón.");
          }
        })
        .catch((err) => console.error("Error al buscar:", err));
    }
  });
}