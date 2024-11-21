/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-11-21 09:19:49 
 * @Last Modified by: Alex Escrivà Caravaca
 * @Last Modified time: 2024-11-21 09:57:23
 */
let userFields = {
    email: '',
    name: '',
    surname_1: '',
    surname_2: '',
    telephone: '',
    password: ''
}



function nextStep(step) {
    document.getElementById('popup-step2').style.display = 'none';
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

async function verifyEmail() {
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    const existingError = document.querySelector('#email + .error-message');

    if (!emailPattern.test(email)) {
        if (!existingError) {
            showError('email', 'El correo electrónico no es válido');
        }
    } else {
        clearErrors();
        userFields.email = email;
        let userExists = await checkEmailAvailability(email);
        if (userExists) {
            showError('email', 'El correo electrónico ya está en uso');
        } else {
            clearErrors();
            await popupCorreoEnviado();
        }
    }
}

async function popupCorreoEnviado() {
    let emailsent = await sendVerficationEmail(userFields.email);
    if (!emailsent) {
        showError('email', 'Error al enviar el correo de verificación');
    } else {
        clearErrors();
        document.getElementById('popup-step2').style.display = 'block';
    }
}

async function verifyStep2() {
    const codigo = document.getElementById('codigo').value.trim();
    const codigoPattern = /^\d{6}$/;
    const existingError = document.querySelector('#codigo + .error-message');

    //comprobar codigo bbdd


    if (!codigoPattern.test(codigo)) {
        if (!existingError) {
            showError('codigo', 'El código debe tener 6 dígitos');
        }
    } else {

        let codeSent = await sendVerificationCode(userFields.email, codigo);
        if (!codeSent) {
            showError('codigo', 'El código no es correcto');
        } else {
            clearErrors();
            nextStep(3);
        }
    }
}

function verifyStep3() {
    const fields = [
        { id: 'name', message: 'El nombre no puede estar vacío' },
        { id: 'surname', message: 'Los apellidos no pueden estar vacíos' },
        { id: 'password', message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ },
        { id: 'repeat_password', message: 'Las contraseñas no coinciden', pattern: new RegExp(document.getElementById('password').value) },
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
        userFields.name = document.getElementById('name').value.trim();
        // Split surname into two parts
        const surname = document.getElementById('surname').value.trim().split(' ');
        userFields.surname_1 = surname[0];
        // Check if there is a second surname
        userFields.surname_2 = surname.length > 1 ? surname[1] : '';
        userFields.telephone = document.getElementById('telephone').value.trim();
        userFields.password = document.getElementById('password').value.trim();

        nextStep(4);
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
        registerUser();

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

async function registerUser() {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userFields)
        });

        if (response.ok) {
            document.getElementById('popup').style.display = 'block';
            document.getElementById('purchaseForm').style.display = 'none';
            document.getElementById('titulo').style.display = 'none';
        } else {
            throw new Error('Error al registrar el usuario, ' + response.statusText);

        }
    }
    catch (error) {
        alert(error.message);
    }
}

async function checkEmailAvailability(email) {
    try {
        const response = await fetch(`/users/checkemail?email=${email}`);
        if (response.ok) {
            return true;
        } else if (response.status === 404) {
            return false;
        } else {
            throw new Error('Error al comprobar si el usuario existe, ' + response.statusText);
        }
    } catch (error) {
        alert(error.message);
    }
}

async function sendVerficationEmail(email) {
    try {
        const response = await fetch(`auth/sendVerificationEmail?email=${email}`, {
            method: 'POST'
        });
        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        alert(error.message);
    }
}

async function sendVerificationCode(email, code) {
    try {
        const response = await fetch(`auth/verifyEmail?email=${email}&code=${code}`,
            {
                method: 'PUT'
            });
        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        alert(error.message);
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
        
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bi-eye-slash-fill');
        toggleIcon.classList.add('bi-eye-fill'); 
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bi-eye-fill');
        toggleIcon.classList.add('bi-eye-slash-fill'); 
    }
}

function togglePassword2() {
    const passwordRepeatInput = document.getElementById('repeat_password');
    const toggleIcon2 = document.querySelector('.toggle-password2');
        
    if (passwordRepeatInput.type === 'password') {
        passwordRepeatInput.type = 'text';
        toggleIcon2.classList.remove('bi-eye-slash-fill');
        toggleIcon2.classList.add('bi-eye-fill'); 
    } else {
        passwordRepeatInput.type = 'password';
        toggleIcon2.classList.remove('bi-eye-fill');
        toggleIcon2.classList.add('bi-eye-slash-fill'); 
    }
}