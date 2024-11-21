
// Inicializar el mapa
var map = L.map('map').setView([40.4168, -3.7038], 6); // Coordenadas de España

// Añadir el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Función para obtener la ubicación del usuario
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            map.setView([lat, lon], 12); // Centrar el mapa en la ubicación del usuario

            // Añadir un marcador con la ubicación del usuario
            var marker = L.marker([lat, lon]).addTo(map)
                .bindPopup("Tu ubicación")
                .openPopup();
        }, function () {
            alert("No se pudo obtener la ubicación.");
        });
    } else {
        alert("La geolocalización no está soportada por este navegador.");
    }
}

// Llamar a la función de ubicación al cargar la página
obtenerUbicacion();

// Configurar el botón para obtener la ubicación
document.getElementById('locationButton').addEventListener('click', function () {
    obtenerUbicacion();
});

// Actualizar la ubicación cada 5 minutos (300,000 ms)
setInterval(obtenerUbicacion, 300000);  // 5 minutos en milisegundos
