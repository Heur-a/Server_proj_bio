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
const map = L.map('map').setView([40.4168, -3.7038], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let markerGroup = L.layerGroup().addTo(map); // Grupo para manejar marcadores

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
        const respuesta = await fetch(`/medicion/admin?date1=${date1}&date2=${date2}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Procesar la respuesta
        const data = await respuesta.json();

        if (data.success) {
            // Mostrar las mediciones obtenidas en la página
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = '<h3>Mediciones:</h3><ul>';

            // Limpiar los marcadores anteriores en el mapa
            markerGroup.clearLayers();

            // Mostrar las mediciones en el mapa
            data.mediciones.forEach(medicion => {
                // Suponiendo que las mediciones tienen propiedades `lat` y `lng` para la ubicación
                const { lat, lng, medida, lugar, tipo_gas, hora } = medicion;

                // Crear un marcador para cada medición
                const marker = L.marker([lat, lng]).addTo(markerGroup)
                    .bindPopup(`<b>Lugar:</b> ${lugar} <br><b>Tipo de Gas:</b> ${tipo_gas} <br><b>Medida:</b> ${medida} <br><b>Hora:</b> ${hora}`);
                
                // También se puede agregar iconos personalizados si se necesita
            });

            resultadoDiv.innerHTML += '</ul>';
        } else {
            console.error("Error al obtener las mediciones:", data.error);
            alert("No se pudieron obtener las mediciones.");
        }
    } catch (error) {
        console.error("Error al hacer la petición:", error);
        alert("Hubo un error al realizar la consulta.");
    }
}
