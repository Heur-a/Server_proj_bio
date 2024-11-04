// Configurar el mapa
const map = L.map('map').setView([40.4168, -3.7038], 6); // Centrado en España

// Agregar una capa de mapas base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Función para obtener los datos de calidad del aire
async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air-pollution?lat=${lat}&lon=${lon}&appid=d024fff28be7de44160d3945394f358c`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Datos no encontrados para la ubicación: (${lat}, ${lon})`);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        const data = await response.json();
        console.log(data); // Esto te mostrará la respuesta completa de la API

        if (!data.list || data.list.length === 0) {
            throw new Error('No air quality data found');
        }

        return data.list[0].main.aqi; // Modifica según la estructura de la respuesta de tu API
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        return null; // Devolver null si hay un error
    }
}

// Función para añadir marcadores al mapa
async function addMarkers() {
    // Asumiendo que tienes datos de varios puntos en España
    const locations = [
        { lat: 40.4168, lon: -3.7038, name: 'Madrid' },           // Madrid
        { lat: 41.3851, lon: 2.1734, name: 'Barcelona' },        // Barcelona
        { lat: 39.4699, lon: -0.3763, name: 'Valencia' },        // Valencia
        { lat: 37.3886, lon: -5.9823, name: 'Sevilla' },         // Sevilla
        { lat: 41.6488, lon: -0.8842, name: 'Zaragoza' },        // Zaragoza
        { lat: 36.7213, lon: -4.4214, name: 'Málaga' },          // Málaga
        { lat: 37.9922, lon: -1.1306, name: 'Murcia' },          // Murcia
        { lat: 39.5694, lon: 2.6502, name: 'Palma de Mallorca' }, // Palma de Mallorca
        { lat: 43.3623, lon: -8.4115, name: 'A Coruña' },        // A Coruña
        { lat: 41.6592, lon: -0.8839, name: 'Valladolid' },      // Valladolid
        { lat: 42.8125, lon: -1.6458, name: 'Pamplona' },        // Pamplona
        { lat: 43.2630, lon: -2.9350, name: 'Bilbao' },          // Bilbao
        { lat: 37.1882, lon: -3.6016, name: 'Granada' },         // Granada
        { lat: 38.9951, lon: -1.8587, name: 'Albacete' },        // Albacete
        { lat: 36.5160, lon: -6.2864, name: 'Cádiz' },           // Cádiz
        { lat: 39.8628, lon: -4.0273, name: 'Toledo' },          // Toledo
        { lat: 38.9884, lon: -0.1395, name: 'Elche' },           // Elche
        { lat: 37.6561, lon: -0.6318, name: 'Cartagena' },       // Cartagena
        { lat: 38.9705, lon: -1.8500, name: 'Almería' },         // Almería
        { lat: 38.5654, lon: -0.0155, name: 'Torrevieja' },      // Torrevieja
        { lat: 41.3640, lon: -1.8966, name: 'Huesca' },          // Huesca
        { lat: 43.4190, lon: -5.8527, name: 'Gijón' },           // Gijón
        { lat: 42.4443, lon: -8.5806, name: 'Vigo' },            // Vigo
        { lat: 38.9124, lon: -1.2314, name: 'Córdoba' },         // Córdoba
    ];

    // Obtener el AQI de cada ubicación y añadir al mapa
    for (const location of locations) {
        const aqi = await getAirQuality(location.lat, location.lon);
        location.aqi = aqi; // Almacenar el AQI en la ubicación

        let color;
        if (aqi <= 50) {
            color = 'green'; // Buena calidad
        } else if (aqi <= 100) {
            color = 'yellow'; // Calidad moderada
        } else {
            color = 'red'; // Mala calidad
        }

        // Añadir un círculo al mapa
        const circle = L.circle([location.lat, location.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 5000 // Ajusta el tamaño del círculo según sea necesario
        }).addTo(map);

        // Mostrar el AQI sobre el punto verde
        circle.bindPopup(`Calidad del aire en ${location.name}: ${location.aqi}<br>AQI: ${aqi}`, {
            closeButton: true,
            minWidth: 150
        });
    }
}

// Llamar a la función para añadir marcadores
addMarkers();
