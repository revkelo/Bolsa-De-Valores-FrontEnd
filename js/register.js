function toggleFields() {
    const role = document.getElementById('role').value;
    document.getElementById('risk-profile-container').style.display = role === 'Inversionista' ? 'block' : 'none';
    document.getElementById('company-container').style.display = role === 'Comisionista' ? 'block' : 'none';
    document.getElementById('commission-container').style.display = role === 'Comisionista' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rol = document.getElementById('role').value;
        const dateOfBirth = document.getElementById('date-of-birth').value;

        // Primera solicitud: Crear el usuario
        fetch('http://localhost:8080/api/usuario?nombre=' + nombre + '&email=' + email +
            '&contrase%C3%B1a=' + password + '&rol=' + rol + '&fecha_creacion=' + dateOfBirth, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usuario_id) {
                // Guardar el ID del usuario para usarlo en la segunda solicitud
                const usuario_id = data.usuario_id;
                alert('Usuario creado exitosamente con ID: ' + usuario_id);

                // Guardar en localStorage para su uso posterior
                localStorage.setItem('userId', usuario_id);
                localStorage.setItem('rol', rol);

                fetch("http://localhost:8080/api/billetera?inversionista_id="+data.usuario_id+"&saldo=0",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(billetera => {
                    localStorage.setItem('billeteraId', billetera.billetera_id);
                    alert('Billetera creada con éxito');
                })
                .catch(error => console.error('Error al crear la billetera:', error));
                // Segunda solicitud: Crear el inversionista o comisionista según el rol
                if (rol === 'Inversionista') {
                    const riskProfile = document.getElementById('risk-profile').value;
                    const pais = document.getElementById('country').value;

                    fetch('http://localhost:8080/api/inversionista?perfil_riesgo=' + riskProfile + '&pais=' + pais + '&usuario_id=' + usuario_id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Inversionista creado con éxito');
                        // Redirigir a la página del inversionista
                        window.location.href = 'PanelComisionistas.html';
                    })
                    .catch(error => console.error('Error al crear el inversionista:', error));

                } else if (rol === 'Comisionista') {
                    const company = document.getElementById('company').value;
                    const commission = document.getElementById('commission').value;
                    const pais = document.getElementById('country').value;

                    fetch('http://localhost:8080/api/comisionista?empresa=' + company + '&comision=' + commission + '&pais=' + pais + '&usuarioId=' + usuario_id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Comisionista creado con éxito');
                        // Redirigir a la página del comisionista
                        window.location.href = 'comisionista.html';
                    })
                    .catch(error => console.error('Error al crear el comisionista:', error));
                }

            } else {
                throw new Error('Error al crear el usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al crear el usuario');
        });
    });
});


