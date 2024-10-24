// Funció de logout universal
function logout() {
    // Esborra el token de localStorage
    localStorage.removeItem('token');

    // Redirigeix l'usuari a la pàgina d'inici de sessió
    window.location.href = '/index.html';  // Modifica aquest camí si cal
    
}

// Afegeix l'esdeveniment de logout al botó o enllaç amb ID 'logoutButton'
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();  // Evita el comportament per defecte de l'enllaç o botó
            logout();
        });
    }
});
