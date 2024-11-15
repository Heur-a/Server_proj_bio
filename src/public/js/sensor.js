function validateInput() {
    const input = document.getElementById('sensorCode').value;
    const button = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');

    // Verifica si el input tiene exactamente seis dígitos numéricos
    if (/^\d{6}$/.test(input)) {
        button.disabled = false;
        errorMessage.style.display = 'none'; // Oculta el mensaje de error
    } else {
        button.disabled = true;
        errorMessage.style.display = 'block'; // Muestra el mensaje de error
    }
}
