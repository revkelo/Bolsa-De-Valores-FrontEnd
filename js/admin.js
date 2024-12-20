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
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const nombre = document.getElementById('name-comisionista').value;
        const email = document.getElementById('email-comisionista').value;
        const password = document.getElementById('password-comisionista').value;
        const rol = 'Comisionista';
        const dateOfBirth = document.getElementById('date-of-birth-comisionista').value;
        const company = document.getElementById('company-comisionista').value;
        const commission = document.getElementById('commission-comisionista').value;
        const pais = document.getElementById('country-comisionista').value;

        try {
            // Verificar si el email ya existe
            const emailResponse = await fetch('http://localhost:8080/api/emails');
            const emailList = await emailResponse.json();

            if (emailList.includes(email)) {
                alert('El email ingresado ya existe. Por favor, ingrese un email diferente.');
                return; // Se detiene el proceso si el email ya existe
            }

            // Crear usuario
            const usuarioResponse = await fetch(`http://localhost:8080/api/usuario?nombre=${nombre}&email=${email}&contrase%C3%B1a=${password}&rol=${rol}&fecha_creacion=${dateOfBirth}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const usuarioData = await usuarioResponse.json();

            if (!usuarioData.usuario_id) {
                throw new Error('No se pudo crear el usuario');
            }

            const usuario_id = usuarioData.usuario_id;
            alert('Usuario creado exitosamente con ID: ' + usuario_id);

            // Crear comisionista
            const comisionistaResponse = await fetch(`http://localhost:8080/api/comisionista?empresa=${company}&comision=${commission}&pais=${pais}&usuarioId=${usuario_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const comisionistaData = await comisionistaResponse.json();

            alert('Comisionista creado exitosamente');

            // Crear billetera
            const billeteraResponse = await fetch(`http://localhost:8080/api/billetera?inversionista_id=${usuario_id}&saldo=0`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const billeteraData = await billeteraResponse.json();

            alert('Billetera creada con éxito');
            form.reset();

        } catch (error) {
            console.error('Error en el proceso de creación:', error);
            alert('Hubo un error en el proceso de creación: ' + error.message);
        }
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-commissioner-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const user_Id = document.getElementById('id-comisionista-update').value;
        const empresa = document.getElementById('company-comisionista-update').value;
        const nombre = document.getElementById('name-comisionista-update').value;
        const email = document.getElementById('email-comisionista-update').value;
        const password = document.getElementById('password-comisionista-update').value;
        const rol = 'Comisionista';
        const dateOfBirth = document.getElementById('date-of-birth-comisionista-update').value;
        const commission = document.getElementById('commission-comisionista-update').value;
        const pais = document.getElementById('country-comisionista-update').value;


        fetch("http://localhost:8080/api/usuario/" + user_Id + "?nombre=" + nombre + "&email=" + email + "&contraseña=" + password + "&rol=" + rol + "&fecha_creacion=" + dateOfBirth,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:8080/api/comisionista/{" + user_Id + "}?empresa=" + empresa + "&comision=" + commission + "&pais=" + pais + "&comisionista_id=" + user_Id, {
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

        const user_Id = document.getElementById('id-comisionista-delete').value;

        fetch(`http://localhost:8080/api/comisionista/${user_Id}`, {
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
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const nombre = document.getElementById('name-inversionista').value;
        const email = document.getElementById('email-inversionista').value;
        const password = document.getElementById('password-inversionista').value;
        const rol = 'Inversionista';
        const dateOfBirth = document.getElementById('date-of-birth-inversionista').value;
        const riskProfile = document.getElementById('risk-profile-inversionista').value;
        const pais = document.getElementById('country-inversionista').value;

        try {
            // Verificar si el email ya existe
            const emailResponse = await fetch('http://localhost:8080/api/emails');
            const emailList = await emailResponse.json();

            if (emailList.includes(email)) {
                alert('El email ingresado ya existe. Por favor, ingrese un email diferente.');
                return; // Se detiene el proceso si el email ya existe
            }

            // Crear usuario
            const usuarioResponse = await fetch(`http://localhost:8080/api/usuario?nombre=${nombre}&email=${email}&contrase%C3%B1a=${password}&rol=${rol}&fecha_creacion=${dateOfBirth}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const usuarioData = await usuarioResponse.json();

            if (!usuarioData.usuario_id) {
                throw new Error('No se pudo crear el usuario');
            }

            const usuario_id = usuarioData.usuario_id;
            alert('Usuario creado exitosamente con ID: ' + usuario_id);


            // Crear inversionista
            const inversionistaResponse = await fetch(`http://localhost:8080/api/inversionista?perfil_riesgo=${riskProfile}&pais=${pais}&usuario_id=${usuario_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const inversionistaData = await inversionistaResponse.json();

            alert('Inversionista creado exitosamente');

            // Crear billetera
            const billeteraResponse = await fetch(`http://localhost:8080/api/billetera?inversionista_id=${usuario_id}&saldo=0`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const billeteraData = await billeteraResponse.json();

            alert('Billetera creada con éxito');
            form.reset();

        } catch (error) {
            console.error('Error en el proceso de creación:', error);
            alert('Hubo un error en el proceso de creación: ' + error.message);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-investor-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const user_Id = document.getElementById('id-inversionista-update').value;
        const nombre = document.getElementById('name-inversionista-update').value;
        const email = document.getElementById('email-inversionista-update').value;
        const password = document.getElementById('password-inversionista-update').value;
        const rol = "Inversionista";
        const dateOfBirth = document.getElementById('date-of-birth-inversionista-update').value;
        const perfilRiesgo = document.getElementById('risk-profile-inversionista-update').value;
        const pais = document.getElementById('country-inversionista-update').value;


        fetch("http://localhost:8080/api/usuario/" + user_Id + "?nombre=" + nombre + "&email=" + email + "&contraseña=" + password + "&rol=" + rol + "&fecha_creacion=" + dateOfBirth,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:8080/api/inversionista/{" + user_Id + "}?perfil_riesgo=" + perfilRiesgo + "&pais=" + pais + "&inversionista_id=" + user_Id, {
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

        const user_Id = document.getElementById('id-inversionista-delete').value;

        fetch(`http://localhost:8080/api/inversionista/${user_Id}`, {
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

function showLogs() {
    fetch('http://localhost:8080/api/log_usuario', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de logs');
        }
        return response.json();
      })
      .then(data => {
        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('logTableBody');
  
        // Limpiar el contenido de la tabla antes de agregar nuevos datos
        tableBody.innerHTML = '';
  
        // Iterar sobre los logs y agregarlos a la tabla
        data.forEach(log => {
          const row = document.createElement('tr');
  
          const cellTransaccionId = document.createElement('td');
          cellTransaccionId.textContent = log.transaccion_id;
          cellTransaccionId.className = 'border px-4 py-2';
  
          const cellUsuarioId = document.createElement('td');
          cellUsuarioId.textContent = log.usuario_id;
          cellUsuarioId.className = 'border px-4 py-2';
  
          const cellNombreUsuario = document.createElement('td');
          cellNombreUsuario.textContent = log.nombre_usuario;
          cellNombreUsuario.className = 'border px-4 py-2';
  
          const cellEmailUsuario = document.createElement('td');
          cellEmailUsuario.textContent = log.email_usuario;
          cellEmailUsuario.className = 'border px-4 py-2';
  
          const cellRolUsuario = document.createElement('td');
          cellRolUsuario.textContent = log.rol_usuario;
          cellRolUsuario.className = 'border px-4 py-2';
  
          const cellTipoModificacion = document.createElement('td');
          cellTipoModificacion.textContent = log.tipo_modificacion;
          cellTipoModificacion.className = 'border px-4 py-2';
  
          const cellFechaModificacion = document.createElement('td');
          cellFechaModificacion.textContent = new Date(log.fecha_modificacion).toLocaleString();
          cellFechaModificacion.className = 'border px-4 py-2';
  
          // Añadir celdas a la fila
          row.appendChild(cellTransaccionId);
          row.appendChild(cellUsuarioId);
          row.appendChild(cellNombreUsuario);
          row.appendChild(cellEmailUsuario);
          row.appendChild(cellRolUsuario);
          row.appendChild(cellTipoModificacion);
          row.appendChild(cellFechaModificacion);
  
          tableBody.appendChild(row);
        });
  
        document.getElementById('logList').classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error al obtener los logs:', error);
        alert('Error al obtener la lista de logs. Por favor, intente nuevamente más tarde.');
      });
  }
  