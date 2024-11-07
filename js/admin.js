// Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');

if (userId === null) {
    // Redirigir a login.html si userId es null
    window.location.href = 'login.html';
}

const rol = localStorage.getItem('rol');

if (rol === null) {

} else {

    if (rol === 'Comisionista') {
        window.location.href = 'comisionista.html';
    } else if (rol === 'Inversionista') {
        window.location.href = 'inversionista.html';
    } else {

    }
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



function togglePanel(panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => panel.classList.add('hidden')); // Ocultar todos los paneles
    document.getElementById(panelId).classList.remove('hidden'); // Mostrar el panel solicitado
}

// Show home panel by default
togglePanel('homePanel');

//CRUD DEL ADMIN PARA COMISIONISTAS
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-commissioner-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('name-comisionista').value;
        const email = document.getElementById('email-comisionista').value;
        const password = document.getElementById('password-comisionista').value;
        const rol = 'Comisionista';
        const dateOfBirth = document.getElementById('date-of-birth-comisionista').value;
        const company = document.getElementById('company-comisionista').value;
        const commission = document.getElementById('commission-comisionista').value;
        const pais = document.getElementById('country-comisionista').value;

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
                    const usuario_id = data.usuario_id;
                    alert('Usuario creado exitosamente con ID: ' + usuario_id);

                    localStorage.setItem('userId', usuario_id);
                    localStorage.setItem('rol', rol);

                    fetch('http://localhost:8080/api/comisionista?empresa=' + company + '&comision=' + commission + '&pais=' + pais + '&usuarioId=' + usuario_id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert('Comisionista creado exitosamente');
                            form.reset();
                        })
                        .catch(error => {
                            console.error('Error al crear el comisionista:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error al crear el usuario:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-commissioner-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userId = document.getElementById('id-comisionista-update').value;
        const empresa = document.getElementById('company-comisionista-update').value;
        const nombre = document.getElementById('name-comisionista-update').value;
        const email = document.getElementById('email-comisionista-update').value;
        const password = document.getElementById('password-comisionista-update').value;
        const rol = 'Comisionista';
        const dateOfBirth = document.getElementById('date-of-birth-comisionista-update').value;
        const commission = document.getElementById('commission-comisionista-update').value;
        const pais = document.getElementById('country-comisionista-update').value;


        fetch("http://localhost:8080/api/usuario/" + userId + "?nombre=" + nombre + "&email=" + email + "&contraseña=" + password + "&rol=" + rol + "&fecha_creacion=" + dateOfBirth,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:8080/api/comisionista/{" + userId + "}?empresa=" + empresa + "&comision=" + commission + "&pais=" + pais + "&comisionista_id=" + userId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        alert('Comisionista actualizado exitosamente');
                        form.reset();
                    })
                    .catch(error => console.error('Error al actualizar el comisionista:', error));
            })
            .catch(error => {
                console.error('Error al actualizar el comisionista:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('delete-commissioner-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userId = document.getElementById('id-comisionista-delete').value;

        fetch(`http://localhost:8080/api/comisionista/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // Si la respuesta es exitosa (200-299)
                    alert('Comisionista eliminado exitosamente');
                    form.reset();
                } else {
                    // Si la respuesta no es exitosa
                    throw new Error('Error al eliminar el comisionista');
                }
            })
            .catch(error => {
                console.error('Error al eliminar el comisionista:', error);
                alert('Error al eliminar el comisionista');
            });
    });
});


function showCommissioners() {
    // Realizar solicitud para obtener la lista de comisionistas
    fetch('http://localhost:8080/api/comisionista', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de comisionistas');
            }
            return response.json();
        })
        .then(data => {
            // Obtener el cuerpo de la tabla
            const tableBody = document.getElementById('commissionerTableBody');

            // Limpiar el contenido de la tabla antes de agregar nuevos datos
            tableBody.innerHTML = '';

            // Iterar sobre los comisionistas y agregarlos a la tabla
            data.forEach(commissioner => {
                const row = document.createElement('tr');

                const cellId = document.createElement('td');
                cellId.textContent = commissioner.comisionista_id;
                cellId.className = 'border px-4 py-2';

                const cellEmpresa = document.createElement('td');
                cellEmpresa.textContent = commissioner.empresa;
                cellEmpresa.className = 'border px-4 py-2';

                const cellComision = document.createElement('td');
                cellComision.textContent = commissioner.comision;
                cellComision.className = 'border px-4 py-2';

                const cellPais = document.createElement('td');
                cellPais.textContent = commissioner.pais;
                cellPais.className = 'border px-4 py-2';

                // Añadir celdas a la fila
                row.appendChild(cellId);
                row.appendChild(cellEmpresa);
                row.appendChild(cellComision);
                row.appendChild(cellPais);

                tableBody.appendChild(row);
            });

            document.getElementById('commissionerList').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error al obtener los comisionistas:', error);
            alert('Error al obtener la lista de comisionistas. Por favor, intente nuevamente más tarde.');
        });
}


//CRUD DEL ADMIN PARA INVERSIONISTAS
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-investor-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('name-inversionista').value;
        const email = document.getElementById('email-inversionista').value;
        const password = document.getElementById('password-inversionista').value;
        const rol = 'Inversionista';
        const dateOfBirth = document.getElementById('date-of-birth-inversionista').value;
        const riskProfile = document.getElementById('risk-profile-inversionista').value;
        const pais = document.getElementById('country-inversionista').value;

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
                    const usuario_id = data.usuario_id;
                    alert('Usuario creado exitosamente con ID: ' + usuario_id);

                    localStorage.setItem('userId', usuario_id);
                    localStorage.setItem('rol', rol);

                    fetch('http://localhost:8080/api/inversionista?perfil_riesgo=' + riskProfile + '&pais=' + pais + '&usuario_id=' + usuario_id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert('Inversionista creado exitosamente');
                            form.reset();
                        })
                        .catch(error => {
                            console.error('Error al crear el inversionista:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error al crear el usuario:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-investor-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userId = document.getElementById('id-inversionista-update').value;
        const nombre = document.getElementById('name-inversionista-update').value;
        const email = document.getElementById('email-inversionista-update').value;
        const password = document.getElementById('password-inversionista-update').value;
        const rol = "Inversionista";
        const dateOfBirth = document.getElementById('date-of-birth-inversionista-update').value;
        const perfilRiesgo = document.getElementById('risk-profile-inversionista-update').value;
        const pais = document.getElementById('country-inversionista-update').value;


        fetch("http://localhost:8080/api/usuario/" + userId + "?nombre=" + nombre + "&email=" + email + "&contraseña=" + password + "&rol=" + rol + "&fecha_creacion=" + dateOfBirth,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:8080/api/inversionista/{" + userId + "}?perfil_riesgo=" + perfilRiesgo + "&pais=" + pais + "&inversionista_id=" + userId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        alert('Inversionista actualizado exitosamente');
                        form.reset();

                    })
                    .catch(error => console.error('Error al actualizar el inversionista:', error));

            })
            .catch(error => {
                console.error('Error al actualizar el inversionista:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('delete-investor-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userId = document.getElementById('id-inversionista-delete').value;

        fetch(`http://localhost:8080/api/inversionista/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Inversionista eliminado exitosamente');
                    form.reset();
                }
                else {
                    throw new Error('Error al eliminar el inversionista');
                }
            }
            )
            .catch(error => {
                console.error('Error al eliminar el inversionista:', error);
                alert('Error al eliminar el inversionista');
            });
    }
    );
});

document.addEventListener('DOMContentLoaded', function () { });

function showInvestors() {
    // Realizar solicitud para obtener la lista de comisionistas
    fetch('http://localhost:8080/api/inversionista', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de comisionistas');
            }
            return response.json();
        })
        .then(data => {
            // Obtener el cuerpo de la tabla
            const tableBody = document.getElementById('InvestorTableBody');

            // Limpiar el contenido de la tabla antes de agregar nuevos datos
            tableBody.innerHTML = '';

            // Iterar sobre los comisionistas y agregarlos a la tabla
            data.forEach(investor => {
                const row = document.createElement('tr');

                const cellId = document.createElement('td');
                cellId.textContent = investor.inversionista_id;
                cellId.className = 'border px-4 py-2';

                const cellPais = document.createElement('td');
                cellPais.textContent = investor.pais;
                cellPais.className = 'border px-4 py-2';

                const cellPerfilRiesgo = document.createElement('td');
                cellPerfilRiesgo.textContent = investor.perfil_riesgo;
                cellPerfilRiesgo.className = 'border px-4 py-2';




                // Añadir celdas a la fila
                row.appendChild(cellId);
                row.appendChild(cellPais);
                row.appendChild(cellPerfilRiesgo);

                tableBody.appendChild(row);
            });

            document.getElementById('investorList').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error al obtener los inversionistas:', error);
            alert('Error al obtener la lista de inversionistas. Por favor, intente nuevamente más tarde.');
        });
}