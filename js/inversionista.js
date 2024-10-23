 // Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');
const password = localStorage.getItem('password');


// Verificar si userId es null o no

if (userId === null) {
    // Redirigir a login.html si userId es null
    window.location.href = 'login.html';
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

function loadprofile() {


    fetch('http://localhost:8080/api/usuario/' + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        fetch('http://localhost:8080/api/inversionista/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            document.querySelector('.profile-pais').textContent = data.pais;
            document.querySelector('.profile-perfil-riesgo').textContent = data.perfil_riesgo;
        }).catch(error => { 
            console.error('Error al obtener los datos del perfil:', error);
            alert('Error al cargar el perfil. Por favor, inténtelo de nuevo.');
        });
        // Insertar los datos obtenidos en el HTML

        // Nombre del perfil
        document.querySelectorAll('.profile-name').forEach(element => {
            element.textContent = data.nombre;
        });

        // Correo electrónico
        document.querySelector('.profile-email').textContent = data.email;

        // DNI (suponiendo que es el "usuario_id")
        document.querySelector('.profile-dni').textContent = data.usuario_id;

        // Fecha de nacimiento (formateada)
        const formattedDate = new Date(data.fecha_creacion).toLocaleDateString();
        document.querySelector('.profile-birthdate').textContent = formattedDate;
    })
    .catch(error => {
        console.error('Error al obtener los datos del perfil:', error);
        alert('Error al cargar el perfil. Por favor, inténtelo de nuevo.');
    });
}


function enableEditProfile() {
    document.getElementById('boton-cancelar').classList.remove('hidden');
    const nombre = document.querySelector('.profile-name').textContent;
    const pais = document.querySelector('.profile-pais').textContent;
    const perfil_riesgo = document.querySelector('.profile-perfil-riesgo').textContent;
    const email = document.querySelector('.profile-email').textContent;


    document.getElementById('input-profile-name').classList.remove('hidden');
    document.getElementById('nombre-inv').classList.add('hidden');
    document.getElementById('input-profile-name').value = nombre;

    document.getElementById('input-profile-birthdate').classList.remove('hidden');
    document.getElementById('birthdate-inv').classList.add('hidden');

    document.getElementById('input-profile-country').classList.remove('hidden');
    document.getElementById('pais-inv').classList.add('hidden');
    document.getElementById('input-profile-country').value = pais;


    document.getElementById('input-profile-risk').classList.remove('hidden');
    document.getElementById('perfil-riesgo-inv').classList.add('hidden');
    document.getElementById('input-profile-risk').value = perfil_riesgo;

    document.getElementById('input-profile-email').classList.remove('hidden');
    document.getElementById('email-inv').classList.add('hidden');
    document.getElementById('input-profile-email').value = email;

    document.getElementById('boton-actualizar').classList.add('hidden');
    document.getElementById('boton-guardar').classList.remove('hidden');
}

function cancelar(){

    document.getElementById('input-profile-name').classList.add('hidden');
    document.getElementById('nombre-inv').classList.remove('hidden');

    document.getElementById('input-profile-birthdate').classList.add('hidden');
    document.getElementById('birthdate-inv').classList.remove('hidden');

    document.getElementById('input-profile-country').classList.add('hidden');
    document.getElementById('pais-inv').classList.remove('hidden');


    document.getElementById('input-profile-risk').classList.add('hidden');
    document.getElementById('perfil-riesgo-inv').classList.remove('hidden');

    document.getElementById('input-profile-email').classList.add('hidden');
    document.getElementById('email-inv').classList.remove('hidden');

    document.getElementById('boton-cancelar').classList.add('hidden');
    document.getElementById('boton-guardar').classList.add('hidden');
    document.getElementById('boton-actualizar').classList.remove('hidden');

}

function saveProfile() {

    const nombre = document.getElementById('input-profile-name').value;
    const pais = document.getElementById('input-profile-country').value;
    const dateOfBirth = document.getElementById('input-profile-birthdate').value;
    
    const perfil_riesgo = document.getElementById('input-profile-risk').value;
    const email = document.getElementById('input-profile-email').value;


    fetch("http://localhost:8080/api/usuario/"+ userId+"?nombre="+nombre+"&email="+email+"&contraseña="+password+"&rol=Inversionista&fecha_creacion="+dateOfBirth,
        {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
          fetch("http://localhost:8080/api/inversionista/{"+ userId+"}?perfil_riesgo="+perfil_riesgo+"&pais="+pais+"&inversionista_id=" + userId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Inversionista actualizado exitosamente');
            window.location.reload();  
        })
        .catch(error=> console.error('Error al actualizar el inversionista:', error));
      
      })
      .catch(error => {
          console.error('Error al actualizar el inversionista:', error);
      });
    }



document.addEventListener('DOMContentLoaded', function() {
    loadprofile();
});




