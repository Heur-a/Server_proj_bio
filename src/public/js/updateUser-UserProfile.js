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
            id: 'name', 
            message: 'El nombre debe contener al menos 2 caracteres.', 
            pattern: /^.{2,}$/,
        },
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
            message: 'El campo de apellidos debe contener como máximo dos palabras.', 
            customCheck: () => {
                const postalValue = document.getElementById('postal').value.trim();
                const names = postalValue.split(/\s+/).filter(Boolean); // Eliminar espacios extra
                return names.length <= 2; // Verificar que no haya más de 2 palabras
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
                    // Dividir apellidos en lastName1 y lastName2
                    const names = value.split(/\s+/).filter(Boolean);
                    validatedFields.lastName1 = names[0];
                    validatedFields.lastName2 = names[1] || ''; // Si no hay segundo apellido, enviar vacío
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
