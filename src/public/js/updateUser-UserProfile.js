async function updateUserData() {
    const name = document.getElementById('name').value.trim();
    const lastName1 = document.getElementById('lastName1').value.trim();
    const lastName2 = document.getElementById('lastName2').value.trim();
    const tel = document.getElementById('tel').value.trim();
    const password = document.getElementById('password').value.trim();

    const userData = {
        name,
        lastName1,
        lastName2,
        tel,
        password
    };

    try {
        const response = await fetch('/updateUserData', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            document.getElementById('statusMessage').innerText = 'Dades actualitzades correctament!';
            document.getElementById('statusMessage').style.color = 'green';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en l\'actualització.');
        }
    } catch (error) {
        document.getElementById('statusMessage').innerText = `Error: ${error.message}`;
        document.getElementById('statusMessage').style.color = 'red';
    }
}

async function validateForm() {
    const fields = [
        { 
            id: 'email', 
            message: 'El correo electrónico no es válido', 
            pattern: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ 
        },
        { 
            id: 'password', 
            message: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número', 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ 
        },
        { 
            id: 'repeat_password', 
            message: 'Las contraseñas no coinciden', 
            customCheck: () => document.getElementById('password').value === document.getElementById('repeat_password').value 
        },
        { 
            id: 'telephone', 
            message: 'El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9', 
            pattern: /^[679]\d{8}$/ 
        },
        { 
            id: 'postal', 
            message: 'El código postal debe tener 5 dígitos', 
            pattern: /^\d{5}$/ 
        },
    ];

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => error.remove());

    fields.forEach(field => {
        const value = document.getElementById(field.id).value.trim();
        const existingError = document.querySelector(`#${field.id} + .error-message`);

        if ((field.pattern && !field.pattern.test(value)) || 
            (field.customCheck && !field.customCheck())) {
            if (!existingError) {
                showError(field.id, field.message);
            }
            isValid = false;
        }
    });

    if (isValid) {
        await updateUserData();
    }
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.color = 'red';
    error.innerText = message;
    field.parentElement.appendChild(error);
}

