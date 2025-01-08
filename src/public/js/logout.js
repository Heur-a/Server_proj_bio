 // Función de logout universal
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
            throw new Error('Error al cerrar la sesión');
        }
    }).catch(error => alert(error.message));
}

// Abrir el popup al hacer clic en el botón de logout
document.getElementById("logoutButton").addEventListener("click", function () {
    document.getElementById("confirmationPopupLogout").style.display = "block";
});

// Cerrar el popup al hacer clic en "No"
document.getElementById("logoutConfirmNo").addEventListener("click", function () {
    document.getElementById("confirmationPopupLogout").style.display = "none";
});

// Confirmar logout al hacer clic en "Sí"
document.getElementById("logoutConfirmYes").addEventListener("click", function () {
    logout(); // Llamar a la función de logout
    document.getElementById("confirmationPopupLogout").style.display = "none";
});

