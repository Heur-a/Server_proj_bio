function verifyEmail() {
    // Aquí iría la lógica para verificar el correo electrónico
    nextStep(2);
}

function nextStep(step) {
    document.querySelectorAll('.step').forEach((el) => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function submitForm() {
    // Aquí iría la lógica para procesar el pago
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}