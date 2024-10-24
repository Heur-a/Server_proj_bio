document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    // Comprova si l'usuari ja està autenticat en carregar la pàgina
    const token = localStorage.getItem('token');
    if (token) {
        checkIfAuthenticated(token);
    }

    // Funció per enviar el formulari d'inici de sessió
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/login', {
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

            // Redirigeix a una altra pàgina, ex: `/dashboard.html`
            window.location.href = '/index.html';
        } catch (error) {
            alert(error.message);
        }
    });

    // Funció per verificar si l'usuari està autenticat
    async function checkIfAuthenticated(token) {
        try {
            const response = await fetch('/api/check-auth', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Si l'usuari està autenticat, redirigeix-lo
                window.location.href = '/index.html';
            }
        } catch (error) {
            console.error('Error verificant autenticació:', error);
        }
    }
});
