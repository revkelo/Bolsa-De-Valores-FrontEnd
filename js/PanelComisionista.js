const usuario = localStorage.getItem('usuerId');    
function loadComisionistas() {
    // Realizar la solicitud para obtener los comisionistas
    fetch('http://localhost:8080/api/comisionista', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(comisionistas => {
        // Realizar la solicitud para obtener los usuarios
        fetch('http://localhost:8080/api/usuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(usuarios => {
            const comisionistasPanel = document.getElementById('comisionistasPanel');
            const comisionistasContainer = document.createElement('div');
            comisionistasContainer.classList.add('grid', 'grid-cols-[repeat(auto-fit,minmax(158px,1fr))]', 'gap-3', 'p-4');

            // Recorrer cada comisionista
            comisionistas.forEach(comisionista => {
                // Encontrar el usuario correspondiente al comisionista
                const usuario = usuarios.find(user => user.usuario_id === comisionista.comisionista_id);

                // Crear la tarjeta para cada comisionista
                const comisionistaCard = document.createElement('div');
                comisionistaCard.classList.add('flex', 'flex-col', 'gap-3', 'pb-3');

                // Crear el elemento de imagen para la foto del comisionista (si está disponible)
                const comisionistaImage = document.createElement('div');
                comisionistaImage.classList.add('w-full', 'bg-center', 'bg-no-repeat', 'aspect-square', 'bg-cover', 'rounded-xl');
                comisionistaImage.style.backgroundImage = `url(${usuario.foto || '../images/profile-com.jpg'})`; // Usa la foto del API o una predeterminada

                // Crear el contenedor para el nombre y la descripción del comisionista
                const comisionistaInfo = document.createElement('div');
                comisionistaInfo.classList.add('p-4', 'bg-white', 'rounded-b-xl', 'shadow-md');

                const comisionistaName = document.createElement('h3');
                comisionistaName.classList.add('text-lg', 'font-semibold');
                comisionistaName.textContent = usuario.nombre;

                const comisionistaEmail = document.createElement('p');
                comisionistaEmail.classList.add('text-sm', 'text-gray-600');
                comisionistaEmail.textContent = usuario.email;

                const comisionistaEmpresa = document.createElement('p');
                comisionistaEmpresa.classList.add('text-sm', 'text-gray-600');
                comisionistaEmpresa.textContent = `Empresa: ${comisionista.empresa}`;

                const comisionistaComision = document.createElement('p');
                comisionistaComision.classList.add('text-sm', 'text-gray-600');
                comisionistaComision.textContent = `Comisión: ${comisionista.comision}%`;

                const comisionistaPais = document.createElement('p');
                comisionistaPais.classList.add('text-sm', 'text-gray-600');
                comisionistaPais.textContent = `País: ${comisionista.pais}`;

                // Agregar los elementos al contenedor de información del comisionista
                comisionistaInfo.appendChild(comisionistaName);
                comisionistaInfo.appendChild(comisionistaEmail);
                comisionistaInfo.appendChild(comisionistaEmpresa);
                comisionistaInfo.appendChild(comisionistaComision);
                comisionistaInfo.appendChild(comisionistaPais);

                // Agregar los elementos a la tarjeta del comisionista
                comisionistaCard.appendChild(comisionistaImage);
                comisionistaCard.appendChild(comisionistaInfo);

                // Agregar evento de clic para imprimir el ID del comisionista
                comisionistaCard.addEventListener('click', () => {
                    console.log(comisionista.comisionista_id);
                    localStorage.setItem('comisionista_seleccionado', comisionista.comisionista_id);
                    window.location.href = 'contrato.html';
                });

                // Agregar la tarjeta al contenedor de comisionistas
                comisionistasContainer.appendChild(comisionistaCard);
            });

            // Limpiar el panel y agregar el nuevo contenido
            comisionistasPanel.innerHTML = ''; // Limpiar el panel antes de agregar nuevos comisionistas
            comisionistasPanel.appendChild(comisionistasContainer); // Agregar el contenedor con las tarjetas
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
    })
    .catch(error => console.error('Error al cargar los comisionistas:', error));
}

document.addEventListener('DOMContentLoaded', function(){
    loadComisionistas();
    console.log(usuario);

});