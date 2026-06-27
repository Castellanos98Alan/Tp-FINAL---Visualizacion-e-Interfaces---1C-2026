// Mapa centrado en el partido de morón.
const centerCoords = [-34.6534, -58.6186];
const map = L.map('map', {
    zoomControl: false
}).setView(centerCoords, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Iconos htmls personalizados.
function createCustomIcon(colorClass, iconClass) {
    return L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="map-pin pin-${colorClass}"><i class="fa-solid ${iconClass}"></i></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

function createActiveIcon() {
    return L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="map-pin pin-red-active"><i class="fa-solid fa-location-dot"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });
}

// Pines de ejemplo distribuidos por morón.
L.marker([-34.6450, -58.6250], { icon: createCustomIcon('blue', 'fa-trash') }).addTo(map);
L.marker([-34.6580, -58.6300], { icon: createCustomIcon('green', 'fa-leaf') }).addTo(map);
L.marker([-34.6620, -58.6050], { icon: createCustomIcon('orange', 'fa-triangle-exclamation') }).addTo(map);
L.marker([-34.6400, -58.6100], { icon: createCustomIcon('blue', 'fa-bell') }).addTo(map);
L.marker([-34.6510, -58.5950], { icon: createCustomIcon('orange', 'fa-trash') }).addTo(map);

// Pin rojo activo (draggable para que el usuario pueda moverlo).
const activeMarker = L.marker([-34.6534, -58.6186], {
    icon: createActiveIcon(),
    draggable: true
}).addTo(map);

activeMarker.on('dragend', function (e) {
    console.log("El usuario movió el pin principal a:", activeMarker.getLatLng());
});

// Conectar botones html flotantes con la api de leaflet.
document.getElementById('btn-zoom-in').addEventListener('click', () => map.zoomIn());
document.getElementById('btn-zoom-out').addEventListener('click', () => map.zoomOut());
document.getElementById('btn-center').addEventListener('click', () => {
    map.setView(centerCoords, 14);
});