// Document JavaScript que fa una petició GET a '/nodes/all' quan la pàgina i el CSS estan completament carregats.

document.addEventListener("DOMContentLoaded", () => {
    // Un cop el CSS estigui carregat, fer la petició GET
    fetch('../node/all')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la resposta: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dades rebudes:', data);
            const tableId = 'tbody'; // Assegura't que existeix un element amb aquest id a la teva pàgina HTML
            appendRowsToTable(data, tableId);
        })
        .catch(error => {
            console.error('Error en la petició:', error);
        });
});

/**
 * Crea i afegeix files a una taula HTML especificada per l'ID.
 * @param {Object[]} jsonData - Una llista d'objectes JSON del qual es crearan les files.
 * @param {string} tableId - L'ID de la taula on s'afegiran les files.
 */
function appendRowsToTable(jsonData, tableId) {
    const tableBody = document.querySelector(`#${tableId}`);
    if (!tableBody) {
        console.error(`No s'ha trobat cap element amb id="${tableId}".`);
        return;
    }
    tableBody.innerHTML = '';
    jsonData.forEach(item => {
        tableBody.appendChild(createTableRow(item));
    });
}

/**
 * Crea una fila de taula HTML a partir d'un objecte JSON.
 * Si el camp "status" és "Inactivo" o "Activo", es canvia el color del text corresponent.
 * @param {Object} jsonObject - L'objecte JSON del qual es crearan les cel·les.
 * @returns {HTMLTableRowElement} - Una fila de taula HTML.
 */
function createTableRow(jsonObject) {
    const row = document.createElement('tr');
    Object.entries(jsonObject).forEach(([key, value]) => {
        const cell = document.createElement('td');
        cell.textContent = value;

        // Si el camp és "status", canvia el color del text segons el valor
        if (key === 'status') {
            if (value === 'Inactivo') {
                cell.style.color = 'red';
            } else if (value === 'Activo') {
                cell.style.color = 'green';
            }
        }

        row.appendChild(cell);
    });
    return row;
}
// Inicializar el mapa
// Inicializar el mapa
const map = L.map('map').setView([40.4168, -3.7038], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Grupo para manejar los marcadores
let markerGroup = L.layerGroup().addTo(map);

// Crear un icono personalizado para los marcadores
const customIcon = L.icon({
    iconUrl: 'path/to/pin-icon.png', // Ruta al archivo de imagen del icono
    iconSize: [32, 32], // Tamaño del icono
    iconAnchor: [16, 32], // Punto de anclaje del icono (centro en la base)
    popupAnchor: [0, -32] // Ubicación del popup respecto al icono
});

// Función para obtener las mediciones y mostrarlas en el mapa
// Función para obtener las mediciones y mostrarlas en el mapa
// Función para obtener las mediciones y mostrarlas en el mapa
async function obtenerMediciones() {
    // Obtener las fechas seleccionadas por el usuario
    const date1 = document.getElementById('fecha-inicial').value;
    const date2 = document.getElementById('fecha-final').value;

    // Verificar que las fechas sean válidas
    if (!date1 || !date2) {
        alert('Por favor, selecciona ambas fechas.');
        return;
    }

    try {
        // Realizar la petición GET al servidor
        const respuesta = await fetch(`/mediciones/admin?date1=${date1}&date2=${date2}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (respuesta.ok) {
            const data = await respuesta.json();
            console.log("Datos recibidos:", data); // Añadido para ver la respuesta completa

            // Verificar si 'mediciones' está presente y es un array
            if (Array.isArray(data.mediciones)) {
                markerGroup.clearLayers();

                data.mediciones.forEach(medicion => {
                    const { LocX, LocY, value, date, nodes_idnodes, gasType_idgasType, threshold_idthreshold } = medicion;
                    const marker = L.marker([LocY, LocX], { icon: customIcon }).addTo(markerGroup)
                        .bindPopup(`
                            <b>Fecha:</b> ${date} <br>
                            <b>Valor:</b> ${value} <br>
                            <b>Nodo ID:</b> ${nodes_idnodes} <br>
                            <b>Gas Tipo ID:</b> ${gasType_idgasType} <br>
                            <b>Umbral ID:</b> ${threshold_idthreshold}
                        `);
                });
            } else {
                console.error("La respuesta no contiene un array de 'mediciones'");
                alert("No se encontraron mediciones para el rango de fechas seleccionado.");
            }
        }
    } catch (error) {
        console.error("Error al hacer la petición:", error);
        alert("Hubo un error al realizar la consulta.");
    }
}


