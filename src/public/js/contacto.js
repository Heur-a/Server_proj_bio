document.querySelector('form').addEventListener('submit', async function(event) {
    // Prevenir el envio  predeterminado del formulario
    event.preventDefault();

    // Limpiar los mensajes de error anteriores
    clearErrors();

    // Recoger datos del formulario
    const name = document.getElementById('name').value.trim();
    const surname_1 = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const password = document.getElementById('options').value.trim();
    const password2 = document.getElementById('description').value.trim();

    let isValid = true;

    // Validación del nombre: comprobar si no está vacio
    if (name === '') {
        showError('name', 'El nombre no puede estar vacío');
        isValid = false;
    }

    // Validación de los apellidos: comprobar si no está vacio
    if (surname_1 === '') {
        showError('surname', 'Los apellidos no pueden estar vacíos');
        isValid = false;
    }

    // Validación del correo
    const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        showError('email', 'El correo electrónico no es válido');
        isValid = false;
    }

    // Validación del teléfono: formato español (9 dígits, empezando por 6, 7 o 9)
    const telephonePattern = /^[679]\d{8}$/;
    if (!telephonePattern.test(telephone)) {
        showError('telephone', 'El teléfono ha de tener 9 zifras y empezar por 6, 7 o 9');
        isValid = false;
    }


    //asunto


    // Si todos los campos son validos, permitir enviar el formulario
    if (isValid) {
        // Build the user object
        const userData = {
            name: name,
            surname_1: surname_1,
            surname_2: surname_2,
            email: email,
            telephone: telephone,
            password: password
        };

        // Call the registerUser function
        registerUser(userData);


    }
});

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