 // Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');

// Verificar si userId es null o no
if (userId === null) {
    // Redirigir a login.html si userId es null
    window.location.href = 'login.html';
}

// Función para alternar la visibilidad de los paneles
function togglePanel(panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        if (panel.id === panelId) {
            panel.classList.toggle('hidden'); // Mostrar u ocultar el panel seleccionado
        } else {
            panel.classList.add('hidden'); // Ocultar otros paneles
        }
    });
}

// Función para cerrar sesión
function logout() {
    // Eliminar el ID del usuario de localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('rol');
    
    // Mostrar un mensaje de alerta
    alert('Sesión cerrada exitosamente.');
    
    // Redirigir a login.html
    window.location.href = 'login.html';
}


 
 

 
 
 
 // Función para alternar la visibilidad de los paneles
  function togglePanel(panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        if (panel.id === panelId) {
            panel.classList.toggle('hidden'); // Mostrar u ocultar el panel seleccionado
        } else {
            panel.classList.add('hidden'); // Ocultar otros paneles
        }
    });
}

