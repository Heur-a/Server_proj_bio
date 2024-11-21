async function updateUserData(validatedFields) {
    try {
        const response = await fetch('/auth/updateUserData', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedFields),
        });

        if (response.ok) {
            document.getElementById('statusMessage').innerText = '¡Datos actualizados correctamente!';
            document.getElementById('statusMessage').style.color = 'green';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la actualización.');
        }
    } catch (error) {
        document.getElementById('statusMessage').innerText = `Error: ${error.message}`;
        document.getElementById('statusMessage').style.color = 'red';
    }
}

async function validateForm() {
    const fields = [
        { 
            id: 'password', 
            message: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.', 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
            isPassword: true,
        },
        { 
            id: 'repeat_password', 
            message: 'Las contraseñas no coinciden.', 
            customCheck: () => {
                const password = document.getElementById('password').value.trim();
                const repeatPassword = document.getElementById('repeat_password').value.trim();
                return password === repeatPassword || (!password && !repeatPassword);
            },
            isPassword: true,
        },
        { 
            id: 'telephone', 
            message: 'El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.', 
            pattern: /^[679]\d{8}$/,
        },
        { 
            id: 'postal', 
            message: 'El campo de apellidos debe contener texto válido y estar separado por espacios.', 
            customCheck: () => {
                const postalValue = document.getElementById('postal').value.trim();
                return postalValue.split(' ').length >= 2; // Verifica que haya al menos dos palabras
            },
        },
    ];

    let isValid = true;
    const validatedFields = {};

    // Limpiar errores previos
    clearErrors();

    for (const field of fields) {
        const value = document.getElementById(field.id).value.trim();
        if (value) {
            // Validación del patrón o comprobación personalizada
            if ((field.pattern && !field.pattern.test(value)) || 
                (field.customCheck && !field.customCheck())) {
                showError(field.id, field.message);
                isValid = false;
            } else {
                // Preparar los campos para la solicitud
                if (field.id === 'postal') {
                    const names = value.split(' ').map(part => part.trim());
                    validatedFields.lastName1 = names[0];
                    validatedFields.lastName2 = names.slice(1).join(' ');
                } else {
                    validatedFields[field.id === 'telephone' ? 'tel' : field.id] = value;
                }
            }
        }
    }

    // Validación específica para contraseñas
    const password = document.getElementById('password').value.trim();
    const repeatPassword = document.getElementById('repeat_password').value.trim();
    if ((password || repeatPassword) && (!validatedFields['password'] || !validatedFields['repeat_password'])) {
        showError('password', 'Ambas contraseñas deben estar llenas y coincidir.');
        showError('repeat_password', 'Ambas contraseñas deben estar llenas y coincidir.');
        isValid = false;
    }

    // Enviar la petición si hay al menos un campo válido
    if (isValid && Object.keys(validatedFields).length > 0) {
        delete validatedFields['repeat_password']; // No enviar 'repeat_password'
        await updateUserData(validatedFields);
    } else if (Object.keys(validatedFields).length === 0) {
        document.getElementById('statusMessage').innerText = 'Rellena al menos un campo para actualizar.';
        document.getElementById('statusMessage').style.color = 'red';
    }
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.style.color = 'red';
        errorElement.innerText = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.innerText = '';
    });
}
