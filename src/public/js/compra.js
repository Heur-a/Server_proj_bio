// --- Validació de Formulari ---


document.querySelector('form').addEventListener('submit', async function(event) {
    // Prevenir l'enviament predeterminat del formulari
    event.preventDefault();

    // Netejar els missatges d'error anteriors
    clearErrors();

    // Recollir les dades del formulari
    const name = document.getElementById('name').value.trim();
    const surname_1 = document.getElementById('surname_1').value.trim();
    const surname_2 = document.getElementById('surname_2').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const password = document.getElementById('password').value.trim();

    let isValid = true;

    // Validació del nom: comprovar si no està buit
    if (name === '') {
        showError('name', 'El nombre no puede estar vacío');
        isValid = false;
    }

    // Validació del primer cognom: comprovar si no està buit
    if (surname_1 === '') {
        showError('surname_1', 'El primer apellido no puede estar vacío');
        isValid = false;
    }

    // Validació del segon cognom: opcional, però comprovar si és correcte si està omplert
    if (surname_2 === '') {
        showError('surname_2', 'El segundo apellido no puede estar vacío');
        isValid = false;
    }

    // Validació de l'email
    const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        showError('email', 'El correo electrónico no es válido');
        isValid = false;
    }

    // Validació del telèfon: format espanyol (9 dígits, començant per 6, 7 o 9)
    const telephonePattern = /^[679]\d{8}$/;
    if (!telephonePattern.test(telephone)) {
        showError('telephone', 'El teléfono ha de tener 9 zifras y empezar por 6, 7 o 9');
        isValid = false;
    }

    // Contraseña: min 6 caracteres, 1 mayúscula, 1 minúscula, 1 número
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    //Contraseña: sin caracteres especiales
    const passwordPattern2 = /^[a-zA-Z0-9]*$/;
    if (!passwordPattern2.test(password)) {
        showError('password', 'La contraseña no puede tener caracteres especiales');
        isValid = false;
    }
    else if (!passwordPattern.test(password)) {
        showError('password', 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número');
        isValid = false;
    }
    

    //Repetir contraseña, comprobar si es igual
    const password2 = document.getElementById('password2').value.trim();
    if (password !== password2) {
        showError('password2', 'Las contraseñas no coinciden');
        isValid = false;
    }

    // Si tots els camps són vàlids, permetre l'enviament del formulari
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

// Funció per mostrar un missatge d'error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.color = 'red';
    error.innerText = message;
    field.parentElement.appendChild(error);
}

// Funció per netejar tots els missatges d'error anteriors
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
            return response.json();
        } else if (response.status === 409) {
            throw new Error('El usuario ya existe');
        } 
        else {
            throw new Error('Error en el registre: ', response.statusText);
        }
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        fetch('/user/user-profile.html', {
            headers: {
                'Authorization' : `Bearer ${data.token}`
            }
        }
        ).then(response => {
            if (response.ok) {
                window.location.href = '/user/user-profile.html';
            } else {
                throw new Error('Error en la redirecció: ', response.statusText);
            }
        })
    })
    .catch(error => {
        // Handle error (e.g., display error message)
        alert('Error: ' + error.message);
    });
}