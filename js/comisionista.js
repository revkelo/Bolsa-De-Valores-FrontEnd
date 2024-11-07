// Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');
const password = localStorage.getItem('password');
// comisionista.js
const storedData = localStorage.getItem('AAPL');
if (storedData) {
    const parsedData = JSON.parse(storedData);
    const timestamp = parsedData.timestamp;
    const data = parsedData.data;
    
    // Supongamos que quieres obtener el último precio de cierre
    // Si 'data' es un array de datos históricos
    const latestPrice = data[data.length - 1].close;
    console.log('Último precio de AAPL:', latestPrice);
    
    // Aquí puedes utilizar 'latestPrice' como lo necesites
} else {
    console.log('No hay datos almacenados para AAPL.');
}


// Verificar si userId es null o no
if (userId === null) {
    // Redirigir a login.html ssi userId es null
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
        document.querySelecGtor('.profile-dni').textContent = data.usuario_id;

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
function simboloEmpresa(nombreEmpresa) {
    // Define la lógica para obtener el símbolo de la empresa basado en su nombre
    // Esto es solo un ejemplo, ajusta según tu lógica
    return nombreEmpresa.toLowerCase().replace(/\s+/g, '-');
}

async function fetchTransactions() {
    try {
        const response = await fetch(`http://localhost:8080/api/transaccion/comisionista/${userId}/transacciones`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        return [];
    }
}


async function fetchVentas(){
    try {
        const response = await fetch("http://localhost:8080/api/transaccion/comisionista/"+userId+"/ventas/venta", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        return [];
    }
}
async function loadTransactions() {
    const comisionistaId = localStorage.getItem('comisionistaId');
    if (!comisionistaId) {
        console.error('No se encontró el ID del comisionista en localStorage.');
        return;
    }

    // Obtener transacciones
    const transactions = await fetchTransactions();
    const ventas = await fetchVentas();

    renderTransactions(transactions,ventas, 'transactionBody', 'ventaBody');

}

function renderTransactions(transactions,ventas, containerId, containerVenta) {
    const container = document.getElementById(containerId);
    const containerVentaId = document.getElementById(containerVenta);
    containerVentaId.innerHTML = '';
    container.innerHTML = ''; // Limpiar contenido previo
    transactions.forEach(transaction => {
        // Obtener el símbolo de la empresa a partir del nombre
        const stock = stocks.find(s => s.name === transaction.empresa.nombre);
        const symbol = stock ? stock.symbol : null;

        // Obtener el último precio desde localStorage usando el símbolo
        let latestPrice = 'N/A';
        if (symbol) {
            const storedData = JSON.parse(localStorage.getItem(symbol));
            if (storedData && storedData.data && storedData.data.length > 0) {
                latestPrice = storedData.data[storedData.data.length - 1].close;
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border-b border-gray-200 px-4 py-2">${transaction.empresa.nombre}</td>
            <td class="border-b border-gray-200 px-4 py-2">${transaction.cantidad}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${transaction.precio}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${latestPrice}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${transaction.monto_total}</td>
            <td class="border-b border-gray-200 px-4 py-2">${transaction.inversionista.usuario.nombre}</td>
            <td class="border-b border-gray-200 px-4 py-2">
                <button class="bg-green-500 text-white px-3 py-1 rounded" onclick="acceptTransaction(${transaction.transaccion_id})">Aceptar</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="rejectTransaction(${transaction.transaccion_id})">Rechazar</button>
            </td>
        `;
        container.appendChild(row);
    });

    ventas.forEach(venta => {

        const stock = stocks.find(s => s.name === venta.empresa.nombre);
        const symbol = stock ? stock.symbol : null;

        // Obtener el último precio desde localStorage usando el símbolo
        let latestPrice = 'N/A';
        if (symbol) {
            const storedData = JSON.parse(localStorage.getItem(symbol));
            if (storedData && storedData.data && storedData.data.length > 0) {
                latestPrice = storedData.data[storedData.data.length - 1].close;
            }
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border-b border-gray-200 px-4 py-2">${venta.empresa.nombre}</td>
            <td class="border-b border-gray-200 px-4 py-2">${venta.cantidad}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${venta.precio}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${latestPrice}</td>
            <td class="border-b border-gray-200 px-4 py-2">$${venta.monto_total}</td>
            <td class="border-b border-gray-200 px-4 py-2">${venta.inversionista.usuario.nombre}</td>
            <td class="border-b border-gray-200 px-4 py-2">
                <button class="bg-green-500 text-white px-3 py-1 rounded" onclick="aceptarVenta(${venta.transaccion_id},${latestPrice},${venta.inversionista.inversionista_id})">Realizar Venta</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="rejectTransaction(${venta.transaccion_id})"> Rechazar Venta</button>
            </td>

        `;
        containerVentaId.appendChild(row);

    });


}

function acceptTransaction(transactionId) {
    // Lógica para aceptar la transacción
    fetch(`http://localhost:8080/api/transaccion/aceptar/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Transacción aceptada con éxito');
            loadTransactions(); // Recargar las transacciones
        } else {
            throw new Error('Error al aceptar la transacción');
        }
    })
    .catch(error => {
        console.error('Error al aceptar la transacción:', error);
        alert('Error al aceptar la transacción. Por favor, inténtelo de nuevo.');
    });
}

function rejectTransaction(transactionId) {
    // Lógica para rechazar la transacción
    fetch(`http://localhost:8080/api/transaccion/{id}?id=${transactionId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Transacción rechazada con éxito');
            loadTransactions(); // Recargar las transacciones
        } else {
            throw new Error('Error al rechazar la transacción');
        }
    })
    .catch(error => {
        console.error('Error al rechazar la transacción:', error);
        alert('Error al rechazar la transacción. Por favor, inténtelo de nuevo.');
    });
}

async function obtenerCantidadCompra(transaccionId) {
    try {
        const response = await fetch(`http://localhost:8080/api/cantidad/${transaccionId}`);
        if (response.ok) {
            const cantidadText = await response.text(); // Obtiene la respuesta como texto
            const cantidad = parseInt(cantidadText, 10); // Convierte el texto a un número entero
            return cantidad;
        } else {
            console.error('Error al obtener la cantidad de la compra');
            return null;
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return null;
    }
}
// comisionista.js

async function aceptarVenta(id_transaccion, lastPrice, inversionista_id) {
    alert("Procesando transacción ID: " + id_transaccion);

    console.log('ID de inversor:', inversionista_id);

    try {
        // Obtener la cantidad de la compra
        const cantidad = await obtenerCantidadCompra(id_transaccion);

        if (cantidad === null) {
            alert('No se pudo obtener la cantidad de la compra.');
            return;
        }

        // Obtener el billeteraId del inversionista
        // Obtener el billeteraId del inversionista
const billeteraResponse = await fetch(`http://localhost:8080/api/billetera/usuario/${inversionista_id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});

if (!billeteraResponse.ok) {
    throw new Error('Error al obtener la billetera del inversionista.');
}

const billeteraData = await billeteraResponse.json();

// Accede al primer elemento del arreglo para obtener el billetera_id
const billeteraId = billeteraData.length > 0 ? billeteraData[0].billetera_id : null;

if (billeteraId === null) {
    throw new Error('No se encontró billetera_id en la respuesta.');
}

// Calcular el valor de la venta
const valorVenta = cantidad * lastPrice;

// Actualizar el saldo de la billetera del inversionista
const saldoResponse = await fetch(`http://localhost:8080/api/billetera/${billeteraId}/saldo?suma=${valorVenta}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
});

if (!saldoResponse.ok) {
    throw new Error('Error al actualizar el saldo de la billetera.');
}

alert('Saldo del inversionista actualizado exitosamente');


        // Procesar la transacción como 'venta aceptada'
        const ventaResponse = await fetch(`http://localhost:8080/api/transaccion/aceptar/${id_transaccion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!ventaResponse.ok) {
            throw new Error('Transacción no encontrada o fallo al actualizar.');
        }

        const ventaData = await ventaResponse.json();
        alert('Transacción procesada exitosamente: ' + JSON.stringify(ventaData));

    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}


// Llamar a la función para cargar los inversores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    loadInvestors();
    loadprofile();
    loadTransactions();

});



