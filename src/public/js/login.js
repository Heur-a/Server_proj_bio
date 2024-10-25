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
            } else {
                window.location.href = response.headers.get('Location');
            }

        } catch (error) {
            alert(error.message);
        }
    });
});
