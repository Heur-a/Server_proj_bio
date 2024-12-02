// Crear el mapa centrado
const map = L.map('map').setView([40.4168, -3.7038], 6); // Ajusta estas coordenadas según la zona de tus datos

// Añadir capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Función para cargar los datos desde la API
async function cargarDatosMapaCalor() {
    try {
        const response = await fetch('/mediciones/mapa-calor');
        const data = await response.json();

        // Comprobar si hay datos
        if (data.length === 0) {
            alert("No se encontraron mediciones");
            return;
        }

        console.log("Datos recibidos:", data); // Comprobamos que los datos se estén recibiendo correctamente

        // Formatear datos para Leaflet Heatmap
        const heatData = data.map(d => [
            d.LocY, // Latitud
            d.LocX, // Longitud
            d.value // Valor de medición
        ]);

        // Normalizar los valores para que los colores sean proporcionados según los valores
        const maxValue = Math.max(...heatData.map(d => d[2]));
        const minValue = Math.min(...heatData.map(d => d[2]));

        // Mostrar los puntos en el mapa
        data.forEach(d => {
            const marker = L.marker([d.LocY, d.LocX]).addTo(map);
            marker.bindPopup(`<b>Valor:</b> ${d.value}<b>ppm</b><br><b>Ubicación:</b> ${d.LocY}, ${d.LocX}`);
        });

        // Añadir capa de calor con colores dependientes de la intensidad del gas
        L.heatLayer(heatData, {
            radius: 70,    // Ajusta el tamaño del radio
            blur: 10,      // Ajusta la suavidad
            maxZoom: 17,   // Zoom máximo para mostrar datos
            gradient: {
                0.0: 'green',
                0.3: 'yellow',
                0.7: 'orange',
                1.0: 'red'
            },
            minOpacity: 0.2,
            max: maxValue
        }).addTo(map);
    } catch (error) {
        console.error('Error loading heatmap data:', error);
    }
}

// Función para obtener la ubicación del usuario
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            map.setView([lat, lon], 12); // Centrar el mapa en la ubicación del usuario
            generarDatosAleatorios(lat, lon); // Mostrar datos de calidad del aire
        }, function () {
            alert("No se pudo obtener la ubicación.");
        });
    } else {
        alert("La geolocalización no está soportada por este navegador.");
    }
}

// Configurar el botón para obtener la ubicación
document.getElementById('locationButton').addEventListener('click', function () {
    obtenerUbicacion();
});

// Cargar los datos al inicializar el mapa
cargarDatosMapaCalor();