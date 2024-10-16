document.getElementById('btnObtenerUsuario').addEventListener('click', function() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde localStorage
console.log(userId);
    if (!userId) {
        alert('No has iniciado sesión.');
        return;
    }

    // Realizar la solicitud para obtener información del usuario
    fetch(`http://localhost:8080/api/usuario/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Obtener la respuesta como JSON
        } else if (response.status === 404) {
            return response.json().then(err => { // Manejar error 404
                throw new Error(err.message);
            });
        } else {
            throw new Error('Error al obtener la información del usuario');
        }
    })
    .then(data => {
        console.log(data); // Mostrar la información del usuario
        alert(`Usuario: ${JSON.stringify(data)}`); // Mostrar datos en un formato legible
    })
    .catch(error => {
        alert(error.message); // Manejar errores
    });
});
