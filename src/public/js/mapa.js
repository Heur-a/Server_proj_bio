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
            0.5: 'lightblue',
            1.0: 'darkblue'
        } 
        : contaminante === "O3" ? {
            0.0: 'lightgreen',
            0.5: 'green',
            1.0: 'darkgreen'
        }
        : {
            0.0: 'green',
            0.5: 'yellow',
            1.0: 'red'
        };

        // Eliminar capa anterior si existe
        if (heatLayer) map.removeLayer(heatLayer);
        heatLayer = L.heatLayer(heatData, {
            radius: 10,
            blur: 10,
            gradient: gradient,
            minOpacity: 0.5
        }).addTo(map);

        
    } catch (error) {
        console.error("Error al cargar los datos del mapa de calor:", error);
    }
}
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

/// Actualizar el mapa según el contaminante seleccionado
document.getElementById('contaminanteSelect').addEventListener('change', async (event) => {
  const contaminante = event.target.value;

  // Mostrar chinchetas solo para "General"
  if (contaminante === "General") {
      await cargarDatosWAQI(); // Cargar estaciones oficiales
  } else {
      markerGroup.clearLayers(); // Limpiar marcadores si no es "General"
  }

  // Actualizar capa de calor para el contaminante seleccionado
  cargarDatosMapaCalor(contaminante);

  // Cambiar colores de la leyenda para CO2
  const legend = document.querySelector('.legend');
  if (contaminante === "CO2") {
      legend.querySelector('.good').style.background = 'cyan';
      legend.querySelector('.moderate').style.background = 'lightblue';
      legend.querySelector('.bad').style.background = 'darkblue';
  } else if (contaminante === "O3") {
      legend.querySelector('.good').style.background = 'lightgreen';
      legend.querySelector('.moderate').style.background = 'green';
      legend.querySelector('.bad').style.background = 'darkgreen';
  } else {
      legend.querySelector('.good').style.background = 'green';
      legend.querySelector('.moderate').style.background = 'yellow';
      legend.querySelector('.bad').style.background = 'red';
  }
});

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
              const { aqi, iaqi, city, time } = data.data;

              // Obtener parámetros adicionales
              const temperatura = iaqi.t ? iaqi.t.v : "N/A"; // Temperatura
              const humedad = iaqi.h ? iaqi.h.v : "N/A"; // Humedad
              const presion = iaqi.p ? iaqi.p.v : "N/A"; // Presión
              const ultimaActualizacion = time ? time.s : "N/A";

              // Crear marcador con información adicional
              const icon = determinarIconoAQI(aqi);
              const marker = L.marker(estacion.coords, { icon })
                  .addTo(markerGroup)
                  .bindPopup(
                      generarPopup(
                          estacion.nombre,
                          aqi,
                          temperatura,
                          humedad,
                          presion,
                          city.geo,
                          ultimaActualizacion
                      )
                  );

              marker.on("click", () => {
                  marker.openPopup();
              });
          }
      }

      // Ajustar la vista para mostrar todas las estaciones
      const bounds = L.latLngBounds(estaciones.map((e) => e.coords));
      map.fitBounds(bounds);
  } catch (error) {
      console.error("Error al cargar los datos de WAQI:", error);
  }
}


// Función para determinar el icono según el AQI
function determinarIconoAQI(aqi) {
  let iconUrl;
  if (aqi <= 50) {
    iconUrl =
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
  } else if (aqi <= 100) {
    iconUrl =
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png";
  } else if (aqi <= 150) {
    iconUrl =
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";
  } else {
    iconUrl =
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
  }

  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
// Función para generar el popup con pronóstico del tiempo e iconos
function generarPopup(nombreEstacion, aqi, temperatura, viento, humedad, ultimaActualizacion) {
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

  return `
    <div>
      <h3>${nombreEstacion}</h3>
      <b>Calidad del aire:</b> <span style="color: ${color}">${calidadTexto}</span><br>
      <b>AQI:</b> ${aqi}<br>
      <b>Temperatura:</b> ${temperatura}°C 🌡️<br>
      <b>Viento:</b> ${viento} km/h 💨<br>
      <b>Humedad:</b> ${humedad}% 💧<br>
      <b>Coordenadas de la estación:</b> ${ultimaActualizacion}<br>

      <hr>
      <h4>Pronóstico de calidad del aire:</h4>
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div style="text-align: center;">
          <div style="color: green;">🌥️</div>
          <b>Vie.</b><br>17°C
        </div>
        <div style="text-align: center;">
          <div style="color: green;">🌥️</div>
          <b>Sáb.</b><br>18°C
        </div>
        <div style="text-align: center;">
          <div style="color: orange;">🌤️</div>
          <b>Dom.</b><br>19°C
        </div>
        <div style="text-align: center;">
          <div style="color: orange;">☀️</div>
          <b>Lun.</b><br>20°C
        </div>
      </div>
    </div>
  `;
}


// Llamar a la función para cargar los datos y mostrar en el mapa
cargarDatosWAQI();
// Cargar mapa inicial con el contaminante por defecto
cargarDatosMapaCalor("General");
