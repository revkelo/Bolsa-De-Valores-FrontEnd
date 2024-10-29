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

        fetch('http://localhost:8080/api/comisionista/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            document.querySelector('.profile-pais').textContent = data.pais;
            document.querySelector('.profile-comision').textContent = data.comision;
            document.querySelector('.profile-empresa').textContent = data.empresa;
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

function formatDateToInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}${day}`;
}

function enableEditProfile() {
    document.getElementById('boton-cancelar').classList.remove('hidden');

    const nombre = document.querySelector('.profile-name').textContent;
    const pais = document.querySelector('.profile-pais').textContent;
    const comision = document.querySelector('.profile-comision').textContent;
    const empresa = document.querySelector('.profile-empresa').textContent;
    const email = document.querySelector('.profile-email').textContent;


    document.getElementById('input-profile-name').classList.remove('hidden');
    document.getElementById('nombre-com').classList.add('hidden');
    document.getElementById('input-profile-name').value = nombre;

    document.getElementById('input-profile-birthdate').classList.remove('hidden');
    document.getElementById('birthdate-com').classList.add('hidden');

    document.getElementById('input-profile-country').classList.remove('hidden');
    document.getElementById('pais-com').classList.add('hidden');
    document.getElementById('input-profile-country').value = pais;

    document.getElementById('input-profile-email').classList.remove('hidden');
    document.getElementById('email-com').classList.add('hidden');
    document.getElementById('input-profile-email').value = email;

    document.getElementById('input-profile-commision').classList.remove('hidden');
    document.getElementById('comision-com').classList.add('hidden');
    document.getElementById('input-profile-commision').value = comision;

    document.getElementById('input-profile-company').classList.remove('hidden');
    document.getElementById('empresa-com').classList.add('hidden');
    document.getElementById('input-profile-company').value = empresa;

    document.getElementById('boton-actualizar').classList.add('hidden');
    document.getElementById('boton-guardar').classList.remove('hidden');
}

function cancelar(){

    
    document.getElementById('input-profile-name').classList.add('hidden');
    document.getElementById('nombre-com').classList.remove('hidden');

    document.getElementById('input-profile-birthdate').classList.add('hidden');
    document.getElementById('birthdate-com').classList.remove('hidden');

    document.getElementById('input-profile-country').classList.add('hidden');
    document.getElementById('pais-com').classList.remove('hidden');

    document.getElementById('input-profile-email').classList.add('hidden');
    document.getElementById('email-com').classList.remove('hidden');

    document.getElementById('input-profile-commision').classList.add('hidden');
    document.getElementById('comision-com').classList.remove('hidden');

    document.getElementById('input-profile-company').classList.add('hidden');
    document.getElementById('empresa-com').classList.remove('hidden');


    document.getElementById('boton-cancelar').classList.add('hidden');
    document.getElementById('boton-guardar').classList.add('hidden');
    document.getElementById('boton-actualizar').classList.remove('hidden');

}

function saveProfile() {

    const nombre = document.getElementById('input-profile-name').value;
    const pais = document.getElementById('input-profile-country').value;
    const dateOfBirth = document.getElementById('input-profile-birthdate').value;
    const comision = document.getElementById('input-profile-commision').value;
    const empresa = document.getElementById('input-profile-company').value;
    const email = document.getElementById('input-profile-email').value;


    fetch("http://localhost:8080/api/usuario/"+ userId+"?nombre="+nombre+"&email="+email+"&contraseña="+password+"&rol=Comisionista&fecha_creacion="+dateOfBirth,
        {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
      fetch("http://localhost:8080/api/comisionista/{"+ userId+"}?empresa="+empresa+"&comision="+comision+"&pais="+pais+"&comisionista_id=" + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Comisionista actualizado exitosamente');
        window.location.reload();
    })
      .catch(error => console.error('Error al actualizar el comisionista:', error));
    })
    .catch(error => {
        console.error('Error al actualizar el comisionista:', error);
    });
    }



// Función para obtener los inversores de la API de Inversionistas y crear las tarjetas dinámicamente
function loadInvestors() {
    fetch('http://localhost:8080/api/contrato/comisionista/'+userId+'/inversionistas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
        const investorsPanel = document.getElementById('investorsPanel');
        const investorsContainer = document.createElement('div');
        investorsContainer.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-6');

        // Recorrer cada inversionista
        data.forEach(inversionista => {
            const investor = inversionista.usuario; // Acceder al usuario relacionado dentro de inversionista

            // Crear la tarjeta para cada inversionista
            const investorCard = document.createElement('div');
            investorCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'flex', 'flex-col', 'items-center');

            // Crear el elemento de imagen para la foto del inversionista (si está disponible)
            const investorImage = document.createElement('div');
            investorImage.classList.add('w-24', 'h-24', 'bg-gray-200', 'rounded-full', 'mb-4');
            const img = document.createElement('img');
            img.src = investor.foto ? investor.foto : '../images/profile-inv.jpg'; // Usa la foto del API o una predeterminada
            img.alt = `Foto de ${investor.nombre}`;
            img.classList.add('w-full', 'h-full', 'object-cover', 'rounded-full');
            investorImage.appendChild(img);

            // Crear el contenedor para el nombre y el correo del inversionista
            const investorInfo = document.createElement('div');
            investorInfo.classList.add('text-center');

            const investorName = document.createElement('p');
            investorName.classList.add('text-lg', 'font-semibold', 'text-gray-900');
            investorName.textContent = investor.nombre;

            const investorEmail = document.createElement('p');
            investorEmail.classList.add('text-sm', 'text-gray-500');
            investorEmail.textContent = investor.email;

            // Crear el contenedor adicional para el perfil de riesgo y el país
            const investorDetails = document.createElement('div');
            investorDetails.classList.add('mt-2', 'text-sm', 'text-gray-600');

            const perfilRiesgo = document.createElement('p');
            perfilRiesgo.textContent = `Perfil de Riesgo: ${inversionista.perfil_riesgo}`;

            const pais = document.createElement('p');
            pais.textContent = `País: ${inversionista.pais}`;

            // Agregar los elementos creados a la tarjeta
            investorInfo.appendChild(investorName);
            investorInfo.appendChild(investorEmail);
            investorDetails.appendChild(perfilRiesgo);
            investorDetails.appendChild(pais);
            investorCard.appendChild(investorImage);
            investorCard.appendChild(investorInfo);
            investorCard.appendChild(investorDetails);

            // Agregar la tarjeta al contenedor de inversores
            investorsContainer.appendChild(investorCard);
        });

        // Limpiar el panel y agregar el nuevo contenido
        investorsPanel.innerHTML = '';
        investorsPanel.appendChild(investorsContainer);
    })
    .catch(error => console.error('Error al cargar los inversionistas:', error));
}

// Llamar a la función para cargar los inversores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    loadInvestors();
    loadprofile();
});



