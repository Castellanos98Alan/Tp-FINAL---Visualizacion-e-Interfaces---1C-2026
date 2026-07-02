const categoryButtons = document.querySelectorAll(".option-card");
const subcategoryButtons = document.querySelectorAll(".subcategory-card");
const subcategoryBox = document.getElementById("subcategoryBox");
const dynamicQuestions = document.getElementById("dynamicQuestions");
const description = document.getElementById("claimDescription");
const charCount = document.getElementById("charCount");
const imageInput = document.getElementById("imageInput");
const uploadText = document.getElementById("uploadText");
const form = document.getElementById("claimForm");
const addressInput = document.getElementById("claimAddress");
const formError = document.getElementById("formError");
const successCard = document.getElementById("claimSuccess");
const claimNumber = document.getElementById("claimNumber");
const createAnotherClaimButton = document.getElementById("createAnotherClaim");

const CLAIMS_STORAGE_KEY = "moron-reclamos";

let selectedCategory = "espacios-verdes";
let selectedSubcategory = "mantenimiento";

const defaultQuestion = {
  id: "desde-cuando",
  label: "¿Desde cuándo ocurre?",
  options: [
    "Hoy",
    "Desde ayer",
    "Hace algunos días",
    "Hace más de una semana",
    "No estoy seguro/a"
  ]
};

const questionsByCategory = {
  baches: [
    {
      id: "alta-circulacion",
      label: "¿Es un punto de alta circulación?",
      options: ["Sí", "No", "No estoy seguro/a"]
    }
  ],

  alumbrado: [
    {
      id: "problema-luminaria",
      label: "¿Qué problema presenta la luminaria?",
      options: ["No enciende", "Parpadea", "Está rota", "Tiene poca intensidad"]
    },
    {
      id: "varias-luces",
      label: "¿Hay varias luces apagadas en la misma cuadra?",
      options: ["Sí", "No"]
    }
  ],

  basura: [
    {
      id: "tipo-residuo",
      label: "¿Qué tipo de problema de residuos observaste?",
      options: [
        "Contenedor lleno",
        "Basura acumulada en la calle",
        "Residuos peligrosos",
        "Otro"
      ]
    },
    {
      id: "bloquea-paso",
      label: "¿La basura bloquea el paso o la circulación?",
      options: ["Sí", "No", "No estoy seguro/a"]
    },
    {
      id: "riesgo-basura",
      label: "¿Genera algún riesgo o molestia?",
      options: [
        "Mal olor",
        "Presencia de insectos o roedores",
        "Riesgo para peatones",
        "Riesgo para vehículos",
        "Contaminación visual",
        "No genera riesgo urgente"
      ]
    }
  ],

  desagues: [
    {
      id: "problema-desague",
      label: "¿Qué problema presenta el desagüe?",
      options: ["Tapado", "Roto", "Rebalsa agua", "Falta de tapa"]
    },
    {
      id: "acumulacion-agua",
      label: "¿El problema provoca acumulación de agua o inundación?",
      options: ["Sí", "No", "Solo cuando llueve"]
    }
  ],

  veredas: [
    {
      id: "estado-vereda",
      label: "¿Cuál es el estado de la vereda?",
      options: ["Rota", "Levantada por raíces", "Hundida", "Falta un tramo"]
    },
    {
      id: "dificulta-paso",
      label: "¿La vereda dificulta el paso de peatones o personas con movilidad reducida?",
      options: ["Sí", "No", "Parcialmente"]
    }
  ],

  otros: [
    {
      id: "area-reclamo",
      label: "¿A qué área corresponde principalmente el reclamo?",
      options: ["Vía pública", "Seguridad", "Limpieza", "Servicios", "Otro"]
    },
    {
      id: "requiere-urgencia",
      label: "¿El problema requiere atención urgente?",
      options: ["Sí, representa un riesgo", "No", "No estoy seguro/a"]
    }
  ]
};

const questionsByGreenSubcategory = {
  plagas: [
    {
      id: "tipo-plaga",
      label: "¿Qué tipo de plaga observaste?",
      options: ["Mosquitos", "Roedores", "Cucarachas", "Hormigas", "Avispas / abejas", "Otro"]
    }
  ],

  mantenimiento: [
    {
      id: "problema-mantenimiento",
      label: "¿Qué problema de mantenimiento encontraste?",
      options: [
        "Árbol caído",
        "Rama caída",
        "Césped alto",
        "Maleza acumulada",
        "Falta de poda",
        "Otro"
      ]
    }
  ],

  juegos: [
    {
      id: "elemento-danado",
      label: "¿Qué elemento está dañado o en mal estado?",
      options: ["Hamacas", "Tobogán", "Banco", "Cesto", "Cartel", "Otro"]
    }
  ],

  limpieza: [
    {
      id: "tipo-suciedad",
      label: "¿Qué tipo de suciedad o residuo encontraste?",
      options: [
        "Bolsas de basura",
        "Botellas o latas",
        "Escombros",
        "Residuos de mascotas",
        "Ramas acumuladas",
        "Otro"
      ]
    }
  ]
};

function normalizeValue(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("/", "")
    .replaceAll(" ", "-");
}

function createSelect(question) {
  const fieldGroup = document.createElement("div");
  fieldGroup.classList.add("field-group");

  const label = document.createElement("label");
  label.setAttribute("for", question.id);
  label.textContent = question.label;

  const select = document.createElement("select");
  select.id = question.id;
  select.name = question.id;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccioná";
  select.appendChild(defaultOption);

  question.options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = normalizeValue(option);
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  fieldGroup.appendChild(label);
  fieldGroup.appendChild(select);

  return fieldGroup;
}

function getCurrentQuestions() {
  if (selectedCategory === "espacios-verdes") {
    return [
      defaultQuestion,
      ...questionsByGreenSubcategory[selectedSubcategory]
    ];
  }

  return [
    defaultQuestion,
    ...questionsByCategory[selectedCategory]
  ];
}

function renderQuestions() {
  dynamicQuestions.innerHTML = "";

  const questions = getCurrentQuestions();

  questions.forEach((question) => {
    dynamicQuestions.appendChild(createSelect(question));
  });
}

function selectCategory(button) {
  categoryButtons.forEach((item) => item.classList.remove("selected"));
  categoryButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");

  selectedCategory = button.dataset.category;

  if (selectedCategory === "espacios-verdes") {
    subcategoryBox.style.display = "block";

    const selectedSubcategoryButton = document.querySelector(".subcategory-card.selected");
    selectedSubcategory = selectedSubcategoryButton.dataset.subcategory;
  } else {
    subcategoryBox.style.display = "none";
  }

  renderQuestions();
}

function selectSubcategory(button) {
  subcategoryButtons.forEach((item) => item.classList.remove("selected"));
  subcategoryButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");

  selectedSubcategory = button.dataset.subcategory;

  renderQuestions();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => selectCategory(button));
});

subcategoryButtons.forEach((button) => {
  button.addEventListener("click", () => selectSubcategory(button));
});

description.addEventListener("input", () => {
  charCount.textContent = description.value.length;
});

imageInput.addEventListener("change", () => {
  const quantity = imageInput.files.length;

  if (quantity > 5) {
    imageInput.value = "";
    uploadText.textContent = "Agregar imágenes";
    showFormError("Podés adjuntar hasta 5 fotos por reclamo.");
    return;
  }

  if (quantity === 0) {
    uploadText.textContent = "Agregar imágenes";
    return;
  }

  uploadText.textContent = `${quantity} imagen/es seleccionada/s`;
});

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function getStoredClaims() {
  try {
    return JSON.parse(localStorage.getItem(CLAIMS_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function getCategoryLabel() {
  return document.querySelector(".option-card.selected span").textContent.trim();
}

function createClaimCode() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-6);
  return `RCL-${year}-${suffix}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.hidden = true;

  if (!form.checkValidity()) {
    form.reportValidity();
    showFormError("Revisá los campos obligatorios antes de enviar el reclamo.");
    return;
  }

  const cleanDescription = description.value.trim();
  if (cleanDescription.length < 20) {
    showFormError("La descripción debe tener al menos 20 caracteres.");
    description.focus();
    return;
  }

  const code = createClaimCode();
  const today = new Date();
  const claim = {
    id: Date.now(),
    numero: code,
    categoria: getCategoryLabel(),
    subcategoria: selectedCategory === "espacios-verdes" ? selectedSubcategory : "",
    ubicacion: addressInput.value.trim(),
    descripcion: cleanDescription,
    latitud: Number(latInput.value),
    longitud: Number(lngInput.value),
    estado: "Pendiente",
    claseEstado: "badge-pendiente",
    fotos: [],
    cantidadFotos: imageInput.files.length,
    fecha: today.toISOString().slice(0, 10),
    hora: today.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  };

  try {
    const claims = getStoredClaims();
    claims.unshift(claim);
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
  } catch (error) {
    showFormError("No pudimos guardar el reclamo en este navegador. Liberá espacio e intentá nuevamente.");
    return;
  }

  claimNumber.textContent = code;
  Array.from(form.children).forEach((element) => {
    if (element !== successCard) element.hidden = true;
  });
  successCard.hidden = false;
  successCard.focus();
});

createAnotherClaimButton.addEventListener("click", () => {
  form.reset();
  Array.from(form.children).forEach((element) => {
    element.hidden = element === successCard || element === formError;
  });
  window.scrollTo({ top: form.offsetTop, behavior: "smooth" });
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    selectedCategory = "espacios-verdes";
    selectedSubcategory = "mantenimiento";

    categoryButtons.forEach((item) => item.classList.remove("selected"));
    subcategoryButtons.forEach((item) => item.classList.remove("selected"));

    document.querySelector('[data-category="espacios-verdes"]').classList.add("selected");
    document.querySelector('[data-subcategory="mantenimiento"]').classList.add("selected");

    subcategoryBox.style.display = "block";

    description.value = "";
    charCount.textContent = "0";
    uploadText.textContent = "Agregar imágenes";
    formError.hidden = true;

    renderQuestions();
  }, 0);
});

renderQuestions();
/* =========================
   MAPA DEL RECLAMO
========================= */

const defaultLat = -34.6534;
const defaultLng = -58.6198;

const latInput = document.getElementById("claimLat");
const lngInput = document.getElementById("claimLng");
const useLocationButton = document.querySelector(".outline-button");

const claimMap = L.map("claimMap").setView([defaultLat, defaultLng], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(claimMap);

const claimMarker = L.marker([defaultLat, defaultLng], {
  draggable: true
}).addTo(claimMap);

function updateClaimLocation(lat, lng) {
  latInput.value = lat.toFixed(6);
  lngInput.value = lng.toFixed(6);

  claimMarker.setLatLng([lat, lng]);
  claimMap.setView([lat, lng], claimMap.getZoom());
}

updateClaimLocation(defaultLat, defaultLng);

claimMap.on("click", function (event) {
  updateClaimLocation(event.latlng.lat, event.latlng.lng);
});

claimMarker.on("dragend", function () {
  const markerPosition = claimMarker.getLatLng();
  updateClaimLocation(markerPosition.lat, markerPosition.lng);
});

useLocationButton.addEventListener("click", function () {
  if (!navigator.geolocation) {
    alert("Tu navegador no permite obtener la ubicación.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      updateClaimLocation(lat, lng);
    },
    function () {
      alert("No se pudo obtener tu ubicación. Podés marcar el punto manualmente en el mapa.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});
