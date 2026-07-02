// 1. Datos iniciales
const CLAIMS_STORAGE_KEY = "moron-reclamos";

const reclamosIniciales = [
    { 
        id: 1, categoria: "Baches", ubicacion: "Av. Rivadavia 18.900, Esquina San Martín, Partido de Morón", 
        descripcion: "Hay un bache grande en la calzada que dificulta la circulación de vehículos. Ya lleva varios días sin señalización.",
        estado: "En proceso", claseEstado: "badge-proceso", 
        fotos: ["../assets/images/bache.jpg"], fecha: "2024-05-12", hora: "14:30"
    },
    { 
        id: 2, categoria: "Alumbrado", ubicacion: "Cnel. Pringles 1234, Morón - Justo cerca de la plaza central donde doblan los colectivos de la línea 238", 
        descripcion: "Foco quemado en la esquina, la calle queda muy oscura de noche.",
        estado: "Pendiente", claseEstado: "badge-pendiente", 
        fotos: ["../assets/images/alumbrado-publico.jpg"], fecha: "2024-05-08", hora: "14:30"
    },
    { 
        id: 3, categoria: "Basura", ubicacion: "José Ingenieros 567, Morón", 
        descripcion: "Montículo de basura en la vereda desde hace una semana.",
        estado: "Resuelto", claseEstado: "badge-resuelto", 
        fotos: ["../assets/images/basura-acumulada.jpeg"], fecha: "2024-05-02", hora: "14:30"
    }
];

function getStoredClaims() {
    try {
        return JSON.parse(localStorage.getItem(CLAIMS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

let reclamos = [...getStoredClaims(), ...reclamosIniciales];

function persistUserClaims() {
    const initialIds = new Set(reclamosIniciales.map(r => r.id));
    const userClaims = reclamos.filter(r => !initialIds.has(r.id));
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(userClaims));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

let fotosEnEdicion = [];

document.getElementById('search-input').addEventListener('input', renderList);
document.getElementById('filter-estado').addEventListener('change', renderList);
document.getElementById('filter-fecha').addEventListener('change', renderList);
document.getElementById('btn-clear-filters').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-estado').value = 'Todos';
    document.getElementById('filter-fecha').value = 'recientes';
    renderList();
});

// NUEVO: Función para actualizar el contador de caracteres en tiempo real
function updateCharCount(textarea) {
    const counter = document.getElementById('char-counter');
    const length = textarea.value.length;
    counter.textContent = `${length}/1000 caracteres`;
}

// 2. Función principal
function renderList() {
    const container = document.getElementById('lista-reclamos');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const estadoFiltro = document.getElementById('filter-estado').value;
    const ordenFecha = document.getElementById('filter-fecha').value;

    let filtrados = reclamos.filter(r => {
        const concuerdaTexto = r.categoria.toLowerCase().includes(searchTerm)
            || r.ubicacion.toLowerCase().includes(searchTerm)
            || (r.numero || '').toLowerCase().includes(searchTerm);
        const concuerdaEstado = estadoFiltro === 'Todos' || r.estado === estadoFiltro;
        return concuerdaTexto && concuerdaEstado;
    });

    if (ordenFecha === 'recientes') {
        filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else {
        filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    document.getElementById('total-reclamos').innerText = reclamos.length;
    document.getElementById('count-pendiente').innerText = reclamos.filter(r => r.estado === 'Pendiente').length;
    document.getElementById('count-proceso').innerText = reclamos.filter(r => r.estado === 'En proceso').length;
    document.getElementById('count-resuelto').innerText = reclamos.filter(r => r.estado === 'Resuelto').length;
    document.getElementById('count-cancelado').innerText = reclamos.filter(r => r.estado === 'Cancelado').length;

    if(filtrados.length === 0) {
        container.innerHTML = "<p style='color:#666; padding: 20px;'>No se encontraron reclamos con esos filtros.</p>";
        return;
    }

    // Definición de Íconos SVG para los botones
    const iconoEditar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    const iconoBorrar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    const iconoChevron = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    const iconoPin = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

    container.innerHTML = filtrados.map(r => {
        const categoryImages = {
            Baches: '../assets/images/bache.jpg',
            Alumbrado: '../assets/images/alumbrado-publico.jpg',
            Basura: '../assets/images/basura-acumulada.jpeg'
        };
        const fotoPrincipal = (r.fotos && r.fotos.length > 0)
            ? r.fotos[0]
            : (categoryImages[r.categoria] || '../assets/images/moron.png');
        const numeroReclamo = r.numero || `RCL-2024-0054${r.id.toString().padStart(2, '0')}`;
        const categoriaSegura = escapeHtml(r.categoria);
        const ubicacionSegura = escapeHtml(r.ubicacion);
        
        let accionesHtml = '';
        if (r.estado !== 'Cancelado') {
            accionesHtml = `
            <div class="card-actions">
                <button class="btn-edit" onclick="openModal(${r.id})">${iconoEditar} Editar</button>
                <button class="btn-delete" onclick="deleteReclamo(${r.id})">${iconoBorrar} Borrar</button>
            </div>
            `;
        } else {
            accionesHtml = `
            <div class="card-actions">
                <span style="color: #999; font-size: 0.85em; font-style: italic;">Solo lectura</span>
            </div>
            `;
        }

        return `
        <article class="reclamo-card">
            <img src="${escapeHtml(fotoPrincipal)}" alt="Imagen del reclamo de ${categoriaSegura}" class="card-img">
            
            <div class="card-info" title="${categoriaSegura}">
                <h3>${categoriaSegura}</h3>
                <p title="${ubicacionSegura}">${iconoPin} <span>${ubicacionSegura}</span></p>
                <small>Creado el ${formatFecha(r.fecha)} - ${escapeHtml(r.hora || '14:30')} hs</small>
            </div>
            
            <div class="card-status">
                <div class="status-badge ${r.claseEstado}">
                    ${r.estado}
                </div>
                <div class="reclamo-id">
                    <small>Nº de reclamo</small>
                    <strong>${escapeHtml(numeroReclamo)}</strong>
                </div>
            </div>

            ${accionesHtml}
            
            <div class="card-chevron">
                ${r.estado !== 'Cancelado' ? iconoChevron : ''}
            </div>
        </article>
        `;
    }).join('');
}

function formatFecha(fechaStr) {
    const partes = fechaStr.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// LÓGICA DE BORRADO
function deleteReclamo(id) {
    document.getElementById('delete-id').value = id;
    document.getElementById('modal-delete-container').style.display = 'flex';
    document.body.classList.add('no-scroll');
}

function confirmDelete() {
    const id = parseInt(document.getElementById('delete-id').value);
    const reclamo = reclamos.find(r => r.id === id);
    if (reclamo) {
        reclamo.estado = 'Cancelado';
        reclamo.claseEstado = 'badge-cancelado';
    }
    persistUserClaims();
    renderList(); 
    closeDeleteModal(); 
}

function closeDeleteModal() {
    document.getElementById('modal-delete-container').style.display = 'none';
    document.body.classList.remove('no-scroll');
}

// LÓGICA DE EDICIÓN Y FOTOS
function openModal(id) {
    const reclamo = reclamos.find(r => r.id === id);
    document.getElementById('edit-id').value = reclamo.id;
    document.getElementById('edit-categoria').value = reclamo.categoria;
    // document.getElementById('edit-titulo').value = reclamo.titulo;
    document.getElementById('edit-ubicacion').value = reclamo.ubicacion;
    document.getElementById('edit-descripcion').value = reclamo.descripcion || '';
    // document.getElementById('edit-estado').value = reclamo.estado;
    
    // Inicializar el contador con los caracteres de la descripción existente
    updateCharCount(document.getElementById('edit-descripcion'));
    
    fotosEnEdicion = reclamo.fotos ? [...reclamo.fotos] : [];
    renderFotosModal();
    document.getElementById('modal-container').style.display = 'flex';
    document.body.classList.add('no-scroll'); // Añadido para que no baje la página de fondo al abrir el modal
}

function renderFotosModal() {
    const container = document.getElementById('photo-preview-list');
    container.innerHTML = fotosEnEdicion.map((fotoStr, index) => `
        <div class="photo-thumbnail">
            <img src="${fotoStr}" alt="Foto ${index}">
            <button class="btn-remove-photo" type="button" onclick="removeFotoModal(${index})">×</button>
        </div>
    `).join('');
}

function removeFotoModal(index) {
    fotosEnEdicion.splice(index, 1);
    renderFotosModal();
}

document.getElementById('file-input').addEventListener('change', function(e) {
    const files = e.target.files;
    for(let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fotosEnEdicion.push(event.target.result);
            renderFotosModal();
        }
        reader.readAsDataURL(file);
    }
    this.value = ''; 
});

function saveEdit() {
    const id = parseInt(document.getElementById('edit-id').value);
    const reclamo = reclamos.find(r => r.id === id);
    
    reclamo.categoria = document.getElementById('edit-categoria').value;
    // reclamo.titulo = document.getElementById('edit-titulo').value;
    reclamo.ubicacion = document.getElementById('edit-ubicacion').value;
    reclamo.descripcion = document.getElementById('edit-descripcion').value;
    
    // const nuevoEstado = document.getElementById('edit-estado').value;
    // reclamo.estado = nuevoEstado;
    // const mapaClases = {
    //     'Pendiente': 'badge-pendiente',
    //     'En proceso': 'badge-proceso',
    //     'Resuelto': 'badge-resuelto',
    //     'Cancelado': 'badge-cancelado'
    // };
    // reclamo.claseEstado = mapaClases[nuevoEstado];
    reclamo.fotos = [...fotosEnEdicion];
    persistUserClaims();
    
    renderList();
    closeModal();
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
    document.body.classList.remove('no-scroll');
}

renderList();
