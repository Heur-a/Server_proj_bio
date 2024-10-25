// Funció de logout universal
function logout() {
   fetch('/auth/logout', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
   }).then(response => {
       if (response.ok) {
           window.location.href = '/index.html';
       } else {
           throw new Error('Error al tancar la sessió');
       }
   }).catch(error => alert(error.message));
    
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
