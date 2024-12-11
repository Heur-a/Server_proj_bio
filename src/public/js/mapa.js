// Inicializar el mapa
const map = L.map('map').setView([40.4168, -3.7038], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Configurar la API de WAQI
const waqiToken = "22b63c0e5a024e696f8e541da4d6f00eae05e5ec"; // Token de API
const waqiUrl = `https://api.waqi.info/feed/geo:38.5382;-0.1300/?token=${waqiToken}`;

let heatLayer; // Para actualizar dinámicamente la capa de calor
let markerGroup = L.layerGroup().addTo(map); // Grupo para manejar marcadores

// estaciones de medida que va a mostrar el mapa
const estaciones = [
    { nombre: "Benidorm", coords: [38.5382, -0.1300] },
    { nombre: "Madrid", coords: [40.4168, -3.7038] },
    { nombre: "Barcelona", coords: [41.3851, 2.1734] },
    { nombre: "Valencia", coords: [39.4699, -0.3763] },
    { nombre: "Sevilla", coords: [37.3891, -5.9845] },
    { nombre: "Bilbao", coords: [43.2630, -2.9350] }
  ];

const calidadAire = {
    buena: { mensaje: 'Calidad del aire buena', color: 'green', icon: '😄' },
    mala: { mensaje: 'Calidad del aire mala', color: 'red', icon: '☹️' }
};

// Función para cargar datos y agregar chinchetas
async function cargarDatosMapaCalor(contaminante) {
    try {
        const response = await fetch(`/mediciones/mapa-calor?gas=${contaminante}`);
        const data = await response.json();

        if (!data.length) {
            alert("No se encontraron mediciones");
            return;
        }

        const heatData = data.map(d => [d.LocY, d.LocX, d.value]);

        // Configurar colores según contaminante
        const gradient = contaminante === "CO2" ? {
            0.0: 'cyan',
            0.3: 'lightblue',
            0.7: 'blue',
            1.0: 'darkblue'
        } : {
            0.0: 'green',
            0.3: 'yellow',
            0.7: 'orange',
            1.0: 'red'
        };

        // Eliminar capa anterior si existe
        if (heatLayer) map.removeLayer(heatLayer);
        heatLayer = L.heatLayer(heatData, {
            radius: 70,
            blur: 10,
            gradient: gradient,
            minOpacity: 0.2
        }).addTo(map);

        // Limpiar marcadores antiguos
        markerGroup.clearLayers();

        // Añadir marcadores
        data.forEach(d => {
            const calidad = d.value < 100 ? calidadAire.buena : calidadAire.mala;

            L.marker([d.LocY, d.LocX])
                .addTo(markerGroup)
                .bindPopup(`
                    <b>Gas:</b> ${contaminante}<br>
                    <b>Medición:</b> ${d.value}<br>
                    <b>Calidad:</b> ${calidad.mensaje}<br>
                    <span style="font-size: 2em;">${calidad.icon}</span>
                `);
        });
    } catch (error) {
        console.error("Error al cargar los datos del mapa de calor:", error);
    }
}

// Función para mostrar mapa general combinando contaminantes
async function mostrarMapaGeneral() {
    try {
        const response = await fetch('/mediciones/general');
        const data = await response.json();

        const estadoO3 = data.O3 < 100 ? "buena" : "mala";
        const estadoCO2 = data.CO2 < 400 ? "buena" : "mala";

        const calidad =
            estadoO3 === "mala" || estadoCO2 === "mala"
                ? calidadAire.mala
                : calidadAire.buena;

        document.getElementById('calidadAire').innerHTML = `
            <div style="color: ${calidad.color}; font-size: 1.5em;">
                ${calidad.mensaje}
            </div>
        `;

        // Limpiar marcadores antiguos
        markerGroup.clearLayers();

        // Añadir marcadores combinados
        data.mediciones.forEach(d => {
            const estado = d.O3 < 100 && d.CO2 < 400 ? calidadAire.buena : calidadAire.mala;

            L.marker([d.LocY, d.LocX])
                .addTo(markerGroup)
                .bindPopup(`
                    <b>Gas:</b> General<br>
                    <b>O3:</b> ${d.O3} µg/m³<br>
                    <b>CO2:</b> ${d.CO2} ppm<br>
                    <b>Calidad:</b> ${estado.mensaje}<br>
                    <span style="font-size: 2em;">${estado.icon}</span>
                `);
        });
    } catch (error) {
        console.error("Error al mostrar el mapa general:", error);
    }
}

// Actualizar el mapa según el contaminante seleccionado
document.getElementById('contaminanteSelect').addEventListener('change', (event) => {
    const contaminante = event.target.value;

    if (contaminante === "General") {
        mostrarMapaGeneral();
    } else {
        cargarDatosMapaCalor(contaminante);
    }
});

//Función para obtener la ubicación del usuario
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

// Función para mostrar mapa general combinando contaminantes
async function mostrarMapaGeneral() {
    try {
        const response = await fetch('/mediciones/general');
        const data = await response.json();

        const estadoO3 = data.O3 < 100 ? "buena" : "mala";
        const estadoCO2 = data.CO2 < 400 ? "buena" : "mala";

        const calidad =
            estadoO3 === "mala" || estadoCO2 === "mala"
                ? calidadAire.mala
                : calidadAire.buena;

        document.getElementById('calidadAire').innerHTML = `
            <div style="color: ${calidad.color}; font-size: 1.5em;">
                ${calidad.mensaje}
            </div>
        `;

        // Limpiar marcadores antiguos
        markerGroup.clearLayers();

        // Añadir marcadores combinados
        data.mediciones.forEach(d => {
            const estado = d.O3 < 100 && d.CO2 < 400 ? calidadAire.buena : calidadAire.mala;

            L.marker([d.LocY, d.LocX])
                .addTo(markerGroup)
                .bindPopup(`
                    <b>Gas:</b> General<br>
                    <b>O3:</b> ${d.O3} µg/m³<br>
                    <b>CO2:</b> ${d.CO2} ppm<br>
                    <b>Calidad:</b> ${estado.mensaje}<br>
                    <span style="font-size: 2em;">${estado.icon}</span>
                `);
        });
    } catch (error) {
        console.error("Error al mostrar el mapa general:", error);
    }
}
// Actualizar el mapa según el contaminante seleccionado
document.getElementById('contaminanteSelect').addEventListener('change', (event) => {
    const contaminante = event.target.value;

    if (contaminante === "General") {
        mostrarMapaGeneral();
    } else {
        cargarDatosMapaCalor(contaminante);
    }
});
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });



// Función para cargar datos de la estación y agregar una chincheta
// Función modificada para cargar datos de múltiples estaciones
async function cargarDatosWAQI() {
    try {
      // Limpiar marcadores antiguos
      markerGroup.clearLayers();
  
      // Cargar datos para cada estación
      for (const estacion of estaciones) {
        const waqiUrl = `https://api.waqi.info/feed/geo:${estacion.coords[0]};${estacion.coords[1]}/?token=${waqiToken}`;
        const response = await fetch(waqiUrl);
        const data = await response.json();
  
        if (data.status === "ok") {
          const aqi = data.data.aqi;
          const iaqi = data.data.iaqi;
  
          // Determinar el color del marcador según el AQI
          const icon = determinarIconoAQI(aqi);
  
          // Añadir marcador
          const marker = L.marker(estacion.coords, { icon })
            .addTo(markerGroup)
            .bindPopup(generarPopup(estacion.nombre, aqi, iaqi));
  
          marker.on('click', () => {
            marker.openPopup();
          });
        }
      }
  
      // Ajustar la vista para mostrar todas las estaciones
      const bounds = L.latLngBounds(estaciones.map(e => e.coords));
      map.fitBounds(bounds);
  
    } catch (error) {
      console.error("Error al cargar los datos de WAQI:", error);
    }
  }

// Función para determinar el icono según el AQI
function determinarIconoAQI(aqi) {
    let iconUrl;
    if (aqi <= 50) {
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
    } else if (aqi <= 100) {
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
    } else if (aqi <= 150) {
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
    } else {
      iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
    }
  
    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }
  
  // Función modificada para generar el popup con más información
  function generarPopup(nombreEstacion, aqi, iaqi) {
    let calidadTexto;
    let color;
    
    if (aqi <= 50) {
      calidadTexto = "Buena";
      color = "green";
    } else if (aqi <= 100) {
      calidadTexto = "Moderada";
      color = "orange";
    } else {
      calidadTexto = "Mala";
      color = "red";
    }
  
    let mediciones = "<b>Mediciones:</b><br>";
    for (const [contaminante, detalle] of Object.entries(iaqi)) {
      mediciones += `- ${contaminante.toUpperCase()}: ${detalle.v}<br>`;
    }
  
    return `
      <div>
        <h3>${nombreEstacion}</h3>
        <b>Calidad del aire:</b> <span style="color: ${color}">${calidadTexto}</span><br>
        <b>AQI:</b> ${aqi}<br>
        ${mediciones}
      </div>
    `;
  }  

// Llamar a la función para cargar los datos y mostrar en el mapa
cargarDatosWAQI();
// Cargar mapa inicial con el contaminante por defecto
cargarDatosMapaCalor("O3");
