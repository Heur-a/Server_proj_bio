// Document JavaScript que fa una petició GET a '/nodes/all' quan la pàgina i el CSS estan completament carregats.

document.addEventListener("DOMContentLoaded", () => {
    // Comprovar si el CSS de la pàgina ha estat carregat
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
 * @param {Object} jsonObject - L'objecte JSON del qual es crearan les cel·les.
 * @returns {HTMLTableRowElement} - Una fila de taula HTML.
 */
function createTableRow(jsonObject) {
    const row = document.createElement('tr');
    Object.values(jsonObject).forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });
    return row;
}
