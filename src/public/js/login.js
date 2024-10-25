// Comprova si l'usuari ja està autenticat tan aviat com es carrega el codi
const token = localStorage.getItem('token');
if (token) {
    checkIfAuthenticated(token);
}

const loginHref = '/user/login.html';  // Modifica aquest camí si cal

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
            }

            const data = await response.json();

            // Desa el token JWT a `localStorage`
            localStorage.setItem('token', data.token);

            // Redirigeix l'usuari a la pàgina de perfil
            window.location.href = '/user/user-profile.html';

        } catch (error) {
            alert(error.message);
        }
    });
});
