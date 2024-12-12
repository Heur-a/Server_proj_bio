const saveButton = document.getElementById('saveButton');
    const overlay = document.getElementById('overlay');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    // Show popup
    saveButton.addEventListener('click', () => {
      overlay.style.display = 'block';
      confirmationPopup.style.display = 'block';
    });

    // Confirm action
    confirmButton.addEventListener('click', () => {
      alert('¡Cambios guardados con éxito!');
      closePopup();
    });

    // Cancel action
    cancelButton.addEventListener('click', closePopup);

    // Close popup function
    function closePopup() {
      overlay.style.display = 'none';
      confirmationPopup.style.display = 'none';
    }

  
// Seleccionar todos los inputs
const inputs = document.querySelectorAll('.form-group input');

// Función para bloquear los inputs
function bloquearInputs() {
  inputs.forEach(input => {
    input.disabled = true;
  });
}

// Función para habilitar los inputs cuando el usuario haga click
function habilitarInputs() {
  inputs.forEach(input => {
    input.disabled = false;
  });
}

// Función para habilitar la edición cuando se hace clic en el icono
const editIcons = document.querySelectorAll('.edit-icon');

editIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.previousElementSibling; // Obtener el input asociado
    input.disabled = false; // Habilitar el input
    input.focus(); // Focalizar en el input para comenzar a editar
  });
});


// Llamar a estas funciones según lo que desees hacer
// Ejemplo: bloquear inputs al cargar la página
bloquearInputs();

// Ejemplo: habilitar inputs al hacer clic en un botón
document.getElementById('editarButton').addEventListener('click', habilitarInputs);

document.addEventListener('DOMContentLoaded', () => {
    const confirmationPopup = document.getElementById('confirmationPopup');
    const successPopup = document.getElementById('successPopup');
    const noChangePopup = document.getElementById('noChangePopup');

    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const successOk = document.getElementById('successOk');
    const noChangeOk = document.getElementById('noChangeOk');

    let isChanged = false;
    const inputs = document.querySelectorAll('#simpleForm input');

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        isChanged = true;
      });
    });

    window.validateForm = function() {
      if (isChanged) {
        confirmationPopup.style.display = 'block';
      } else {
        noChangePopup.style.display = 'block';
      }
    };

    confirmYes.addEventListener('click', () => {
      confirmationPopup.style.display = 'none';
      successPopup.style.display = 'block';
      isChanged = false; // Resetear el estado
    });

    confirmNo.addEventListener('click', () => {
      confirmationPopup.style.display = 'none';
    });

    successOk.addEventListener('click', () => {
      successPopup.style.display = 'none';
    });

    noChangeOk.addEventListener('click', () => {
      noChangePopup.style.display = 'none';
    });
  });