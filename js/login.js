
const rol = localStorage.getItem('rol');

// Verificar si userId es null o no
if (rol === null) {
  
}else{

    if (rol === 'Inversionista') {
        window.location.href = 'inversionista.html';
    } else if (rol === 'Comisionista') {
        window.location.href = 'comisionista.html';
    } else if (rol === 'Administrador') {
        window.location.href = 'admin.html';
    } else {
    
    }    
}




document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch('http://localhost:8080/api/login?email=' + username + '&contraseña=' + password, {
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
                localStorage.setItem('rol', data.rol); // Almacena el ID del usuario
                alert('Sesión iniciada exitosamente. ID de usuario almacenado: ' + data.usuario_id);
                 // Redirigir según el rol
                 if (data.rol === 'Inversionista') {
                    window.location.href = 'inversionista.html';
                } else if (data.rol === 'Comisionista') {
                    window.location.href = 'comisionista.html';
                } else if (data.rol === 'Administrador') {
                    window.location.href = 'admin.html';
                } else {
                    throw new Error('Rol desconocido');
                }
            } else {
                throw new Error('ID de usuario no encontrado en la respuesta');
            }
        })
        .catch(error => {
            alert(error.message);
        });




    });
});
