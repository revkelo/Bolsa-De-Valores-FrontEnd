document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;

    fetch('http://localhost:8080/api/login?email=' + email + '&contraseña=' + contraseña, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Obtener la respuesta como JSON
        } else {
            throw new Error('Error en el inicio de sesión');
        }
    })
    .then(data => {
        console.log(data);
        // Asegúrate de que 'usuario_id' es parte de la respuesta JSON
        if (data.usuario_id) {
            localStorage.setItem('userId', data.usuario_id); // Almacena el ID del usuario
            alert('Sesión iniciada exitosamente. ID de usuario almacenado: ' + data.usuario_id);
        } else {
            throw new Error('ID de usuario no encontrado en la respuesta');
        }
    })
    .catch(error => {
        alert(error.message);
    });
});
