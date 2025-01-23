function verify() {
    const fields = [
        { id: 'name', message: 'El nombre no puede estar vacío' },
        { id: 'surname', message: 'Los apellidos no pueden estar vacíos' },
        { id: 'email', message: 'El correo electrónico no es válido', pattern: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ },
        { id: 'telephone', message: 'El teléfono ha de tener 9 cifras y empezar por 6, 7 o 9', pattern: /^[679]\d{8}$/ },
        { id: 'options', message: 'Debe seleccionar un asunto' },
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
        // Build the user object
        const userData = {
            name: name,
            surname: surname,
            email: email,
            telephone: telephone,
            options: options,
        };

        // Call the registerUser function
        registerUser(userData);
    }
}

// Función para mostrar un mensaje de error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.color = 'red';
    error.innerText = message;
    field.parentElement.appendChild(error);
}

// Función para limpiar todos los mensajes de error anteriores
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

async function registerUser(userData) {
    // Make the POST request to register the user
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
           //redirect to user profile
           window.location.href = response.headers.get('Location');
        } else if (response.status === 409) {
            throw new Error('El usuario ya existe');
        } 
        else {
            throw new Error('Error en el registre: ', response.statusText);
        }
    })
}
function verify(event) {
    event.preventDefault(); // Evita que se envíe el formulario de inmediato

    // Seleccionar todos los campos del formulario
    const fields = ['name', 'surname', 'email', 'telephone', 'options', 'description'];
    let hasContent = false;

    // Verificar si al menos uno de los campos tiene contenido
    fields.forEach(fieldId => {
        const value = document.getElementById(fieldId).value.trim();
        if (value !== '' && value !== null) {
            hasContent = true;
        }
    });

    if (hasContent) {
        // Mostrar el pop-up si hay al menos un campo relleno
        const popup = document.getElementById('popup');
        popup.classList.remove('hidden');
    } else {
        alert('Por favor, complete al menos un campo antes de enviar.');
    }
}

function closePopup() {
    // Ocultar el pop-up
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}
