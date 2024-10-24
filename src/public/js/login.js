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

            //mirar si la token es válida
            checkIfAuthenticated(data.token);

        } catch (error) {
            alert(error.message);
        }
    });
});

// Funció per verificar si l'usuari està autenticat
async function checkIfAuthenticated(token) {
    try {
        const response = await fetch('/auth/checkAuth', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            // Si l'usuari està autenticat, redirigeix-lo
            window.location.href = '/user/user-profile.html';
        }
    } catch (error) {
        console.error('Error verificant autenticació:', error);
    }
}
