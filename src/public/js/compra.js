function nextStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function verifyEmail() {
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    const existingError = document.querySelector('#email + .error-message');

    if (!emailPattern.test(email)) {
        if (!existingError) {
            showError('email', 'El correo electrónico no es válido');
        }
    } else {
        clearErrors();
        nextStep(2);
    }
}

function verifyStep2() {
    const fields = [
        { id: 'name', message: 'El nombre no puede estar vacío' },
        { id: 'surname', message: 'Los apellidos no pueden estar vacíos' },
        { id: 'telephone', message: 'El teléfono ha de tener 9 cifras y empezar por 6, 7 o 9', pattern: /^[679]\d{8}$/ },
        { id: 'address', message: 'La dirección no puede estar vacía' },
        { id: 'population', message: 'La población no puede estar vacía' },
        { id: 'cp', message: 'El código postal debe tener 5 dígitos', pattern: /^\d{5}$/ }
    ];

    let isValid = true;

    fields.forEach(field => {
        const value = document.getElementById(field.id).value.trim();
        const existingError = document.querySelector(`#${field.id} + .error-message`);

        if ((field.pattern && !field.pattern.test(value)) || (!field.pattern && value === '')) {
            if (!existingError) {
                showError(field.id, field.message);
            }
            isValid = false;
        } else if (existingError) {
            existingError.remove();
        }
    });

    if (isValid) {
        clearErrors();
        nextStep(3);
    }
}

function submitForm() {
    const fields = [
        { id: 'card', message: 'El número de tarjeta debe tener 16 dígitos', pattern: /^\d{16}$/ },
        { id: 'expiration', message: 'La fecha de expiración debe tener el formato MM/AA', pattern: /^(0[1-9]|1[0-2])\/\d{2}$/ },
        { id: 'cvc', message: 'El CVC debe tener 3 dígitos', pattern: /^\d{3}$/ },
        { id: 'privacy', message: 'El checkbox de privacidad debe estar marcado', isCheckbox: true }
    ];

    let isValid = true;

    fields.forEach(field => {
        const value = field.isCheckbox ? document.getElementById(field.id).checked : document.getElementById(field.id).value.trim();
        const existingError = document.querySelector(`#${field.id} + .error-message`);

        if ((field.pattern && !field.pattern.test(value)) || (!field.pattern && !value)) {
            if (!existingError) {
                showError(field.id, field.message);
            }
            isValid = false;
        } else if (existingError) {
            existingError.remove();
        }
    });

    if (isValid) {
        clearErrors();
        document.getElementById('popup').style.display = 'block';
        document.getElementById('purchaseForm').style.display = 'none';
        document.getElementById('titulo').style.display = 'none';

    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';

}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.color = 'red';
    error.innerText = message;
    field.parentElement.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
}
