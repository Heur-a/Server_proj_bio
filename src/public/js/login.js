
const loginHref = '/user/login.html';  // Modifica aquest camí si cal
const recupContrasenya = document.getElementById('recupContrasenya');

// Escolta l'esdeveniment DOMContentLoaded per inicialitzar el formulari
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    // Funció per enviar el formulari d'inici de sessió
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Error en l\'inici de sessió. Comprova les teves credencials.');
            } else {
                window.location.href = response.headers.get('Location');
            }

        } catch (error) {
            alert(error.message);
        }
    });




});

recupContrasenya.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailInput').value;
    const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if(!emailPattern.test(email)) {
        alert("Email no valido")
    } else {
        await sendRecupContrasenya(email);
    }

})

async function sendRecupContrasenya(email) {

    //create URL
    const url = new URL('/auth/resetPassword',window.location.origin);
    url.searchParams.set('email', email)

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
        })

        if (response.ok) {
            alert("Se ha enviado el correo con la nueva contraseña")
        } else if(response.statusCode === 401) {
            alert("El correo no tiene usuario asociado")
        }
    } catch (e) {
        alert(e.message);
    }

}
