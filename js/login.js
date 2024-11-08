
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
                localStorage.setItem('userId', data.usuario_id);
                localStorage.setItem('password', data.contraseña); // Almacena la contraseña del usuario
                localStorage.setItem('rol', data.rol); // Almacena el rol del usuario
        
                fetch("http://localhost:8080/api/billetera/usuario/" + data.usuario_id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(billeteraData => {
                    if (billeteraData.length > 0) {
                        const billetera = billeteraData[0];
                        localStorage.setItem('billeteraId', billetera.billetera_id);
               
        
                        // Redirigir según el rol
                        if (data.rol === 'Inversionista') {
                            fetch("http://localhost:8080/api/contrato/inversionista/" + data.usuario_id + "/comisionistaContrato", {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => response.json())
                            .then(contratoData => {
                                console.log(contratoData);
                                if (contratoData.length > 0 && contratoData[0].length === 2) {
                                    const comisionistaId = contratoData[0][0];
                                    const contratoId = contratoData[0][1];
        
                                    localStorage.setItem('contratoId', contratoId); // Almacena el ID del contrato
                                    localStorage.setItem('comisionista_seleccionado', comisionistaId); // Almacena el ID del comisionista
        
                               
        
                                    window.location.href = 'inversionista.html';
                                } else {
                                    throw new Error('Datos del contrato no encontrados en la respuesta');
                                }
                            })
                            .catch(error => {
                                alert('Error al obtener los datos del contrato: ' + error.message);
                            });
                        } else if (data.rol === 'Comisionista') {
                  
                            window.location.href = 'comisionista.html';
                        } else if (data.rol === 'Administrador') {
               
                            window.location.href = 'admin.html';
                        } else {
                            throw new Error('Rol desconocido');
                        }
                    } else {
                        throw new Error('No se encontró la billetera para el usuario');
                    }
                })
                .catch(error => console.error('Error al obtener la billetera:', error));
            } else {
                throw new Error('ID de usuario no encontrado en la respuesta');
            }
        })
        .catch(error => {
            alert(error.message);
        });


    });
});
