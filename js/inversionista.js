// Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');
const password = localStorage.getItem('password');
const comisionista_seleccionado = localStorage.getItem('comisionista_seleccionado');
const contrato_id = localStorage.getItem('contratoId');

// Verificar si userId es null o no

if (userId === null) {
    // Redirigir a login.html si userId es null
    window.location.href = 'login.html';
}

const rol = localStorage.getItem('rol');

// Verificar si userId es null o no
if (rol === null) {
  
}else{

    if (rol === 'Comisionista') {
        window.location.href = 'comisionista.html';
    } else if (rol === 'Administrador') {
        window.location.href = 'admin.html';
    } else {
    
    }    
}


// Función para cerrar sesión
function logout() {
    // Eliminar el ID del usuario de localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('rol');
    localStorage.removeItem('comisionista_seleccionado');
    localStorage.removeItem('contratoId');

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

    fetch('http://localhost:8080/api/usuario/' + comisionista_seleccionado, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(usuario => {
            // Insertar los datos obtenidos en el HTML

            // Nombre del comisionista
            document.querySelector('.comisionista-name').textContent = usuario.nombre ? usuario.nombre : 'No hay contrato con comisionista';

            // Correo electrónico
            document.querySelector('.comisionista-email').textContent = usuario.email ? usuario.email : 'No hay contrato con comisionista';

        })
        .catch(error => {
            console.error('Error al obtener los datos del comisionista:', error);
            alert('Error al cargar el comisionista. Por favor, inténtelo de nuevo.');
        });
}


function enableEditProfile() {
    document.getElementById('boton-cancelar').classList.remove('hidden');
    const nombre = document.querySelector('.profile-name').textContent;
    const pais = document.querySelector('.profile-pais').textContent;
    const perfil_riesgo = document.querySelector('.profile-perfil-riesgo').textContent;
    const email = document.querySelector('.profile-email').textContent;
    const dateOfBirth = document.querySelector('.profile-birthdate').textContent;

    // Convertir la fecha de nacimiento al formato YYYY-MM-DD
    const dateParts = dateOfBirth.split('/');
    const formattedDateOfBirth = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    document.getElementById('input-profile-name').classList.remove('hidden');
    document.getElementById('nombre-inv').classList.add('hidden');
    document.getElementById('input-profile-name').value = nombre;

    document.getElementById('input-profile-birthdate').classList.remove('hidden');
    document.getElementById('birthdate-inv').classList.add('hidden');
    document.getElementById('input-profile-birthdate').value = formattedDateOfBirth; // Establecer el valor predeterminado

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
function cancelar() {

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


    fetch("http://localhost:8080/api/usuario/" + userId + "?nombre=" + nombre + "&email=" + email + "&contraseña=" + password + "&rol=Inversionista&fecha_creacion=" + dateOfBirth,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            fetch("http://localhost:8080/api/inversionista/{" + userId + "}?perfil_riesgo=" + perfil_riesgo + "&pais=" + pais + "&inversionista_id=" + userId, {
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
                .catch(error => console.error('Error al actualizar el inversionista:', error));

        })
        .catch(error => {
            console.error('Error al actualizar el inversionista:', error);
        });
}

function cancelarContrato() {
    fetch("http://localhost:8080/api/contrato/cancelar/" + contrato_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            alert('Contrato cancelado exitosamente');
            window.location.href = 'PanelComisionistas.html';
        }).catch(error => {
            console.error('Error al cancelar el contrato:', error);
            alert('Error al cancelar el contrato. Por favor, inténtelo de nuevo.');
        });
}



document.addEventListener('DOMContentLoaded', function () {
    loadprofile();





});




async function fetchInvestments(investmentBodyhtml, inversionistaId, estado, tipo, accion) {
    try {
        const response = await fetch(`http://localhost:8080/api/transaccion/inversionista/${inversionistaId}/${estado}/${tipo}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }
        const inversiones = await response.json();
        const investmentBody = document.getElementById(investmentBodyhtml);
        investmentBody.innerHTML = ''; // Limpiar contenido previo

        inversiones.forEach(inversion => {
            const row = document.createElement('tr');
            console.log(inversion)
            // Obtener los datos de la acción almacenada en localStorage
            const storedData = JSON.parse(localStorage.getItem(simboloEmpresa(inversion[2])));
            const latestPrice = storedData ? storedData.data[storedData.data.length - 1].close : 'N/A';

            // Construir el contenido del row
            let rowContent = `
                <td class="border-b border-gray-200 px-4 py-2">${inversion[2]}</td>
                <td class="border-b border-gray-200 px-4 py-2">${inversion[3]}</td>
                <td class="border-b border-gray-200 px-4 py-2">$${inversion[4]}</td>
                <td class="border-b border-gray-200 px-4 py-2">$${latestPrice}</td>
                <td class="border-b border-gray-200 px-4 py-2">$${inversion[5]}</td>
            `;

            // Añadir el precio más reciente si accion es 0
            if (accion === 0) {
                // Añadir el resto de columnas comunes
                rowContent += `
              
                <td class="border-b border-gray-200 px-4 py-2">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="venta(${inversion[0]})">Vender</button>
                </td>
            `;
            }
            row.innerHTML = rowContent;
            investmentBody.appendChild(row);
        });

        // Muestra el panel de inversiones
        document.getElementById('investmentPanel').classList.remove('hidden');

    } catch (error) {
        console.error('Error fetching investments:', error);
    }
}






const stocks = [
    { name: 'Ecopetrol', symbol: 'EC' },
    { name: 'Apple', symbol: 'AAPL' },
    { name: 'Tesla', symbol: 'TSLA' },
    { name: 'Microsoft', symbol: 'MSFT' },
    { name: 'Amazon', symbol: 'AMZN' },
    { name: 'Google', symbol: 'GOOGL' },
    { name: 'NVIDIA', symbol: 'NVDA' },
    { name: 'Mazda', symbol: 'TYO' },
    { name: 'Coca-Cola', symbol: 'KO' },
    { name: 'Walmart', symbol: 'WMT' },
    { name: 'Disney', symbol: 'DIS' },
    { name: 'IBM', symbol: 'IBM' }

];


function createStockCard(stock) {
    return `
<div class="col-md-6">
    <div class="card">
        <div class="card-body">
            <h3 class="card-title text-center">${stock.name} (${stock.symbol})</h3>
            <div class="chart-container" id="container-${stock.symbol}"></div>
            <div class="text-center">
                <p id="price-${stock.symbol}" class="font-weight-bold"></p>
                <button class="btn btn-success" onclick="buyStock('${stock.symbol}')">Comprar</button>
                <button class="btn btn-danger" onclick="sellStock('${stock.symbol}')">Vender</button>
            </div>
        </div>
    </div>
</div>
`;
}

function renderStocks() {
    const stockContainer = document.getElementById('stock-container');
    let html = '<div class="row mb-4">';
    stocks.forEach((stock, index) => {
        html += createStockCard(stock);
        // Cerrar la fila cada dos columnas
        if ((index + 1) % 2 === 0 && index !== stocks.length - 1) {
            html += '</div><div class="row mb-4">';
        }
    });
    html += '</div>'; // Cerrar la última fila
    stockContainer.innerHTML = html;
}

// Llama a la función para renderizar las acciones
renderStocks();




const apiKey = 'BI2G66ESVQSXQZ0F';
const expirationTime = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Función para verificar si los datos están en localStorage y no han expirado
function getStoredData(symbol) {
    const storedData = localStorage.getItem(symbol);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const now = new Date().getTime();
        if (now - parsedData.timestamp < expirationTime) {
            return parsedData.data;
        }
    }
    return null;
}

// Función para guardar los datos en localStorage
function storeData(symbol, data) {
    const now = new Date().getTime();
    const storedData = {
        timestamp: now,
        data: data
    };
    localStorage.setItem(symbol, JSON.stringify(storedData));
}

let apiLimitReached = false; // Variable para controlar si el límite ya fue alcanzado

function fetchDataAndCreateChart(symbol, containerId) {
    const storedData = getStoredData(symbol);
    if (storedData) {
        createChart(storedData, containerId);
        console.log("LOCAL");
    } else {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;
        console.log("API");
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Information && !apiLimitReached) {
                    // Verifica si el mensaje de límite se recibe y no se ha mostrado antes
                    alert("Se llegó el límite de la API"); // O usa console.log() si prefieres
                    apiLimitReached = true; // Cambia el estado a verdadero para no mostrarlo nuevamente
                    return; // Salir de la función si se alcanzó el límite
                }

                const timeSeries = data['Time Series (Daily)'];
                if (!timeSeries) {
                    console.error('No se encontraron datos.');
                    return;
                }

                const candlestickData = [];
                const dates = Object.keys(timeSeries).reverse();

                for (let date of dates) {
                    const dailyData = timeSeries[date];
                    candlestickData.push({
                        time: new Date(date).getTime() / 1000,
                        open: parseFloat(dailyData['1. open']),
                        high: parseFloat(dailyData['2. high']),
                        low: parseFloat(dailyData['3. low']),
                        close: parseFloat(dailyData['4. close']),
                    });
                }

                storeData(symbol, candlestickData); // Almacenar los datos en localStorage
                createChart(candlestickData, containerId); // Crear la gráfica
            })
            .catch(error => console.error('Error al obtener los datos:', error));
    }
}


// Función para crear la gráfica con los datos
function createChart(data, containerId) {
    const chart = LightweightCharts.createChart(document.getElementById(containerId), {
        layout: {
            textColor: '#000',
            background: { type: 'solid', color: '#fff' }
        },
        width: document.getElementById(containerId).offsetWidth,
        height: 400
    });
    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(data);
}

var graficas = false;

function togglePanel(panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        if (panel.id === panelId) {
            panel.classList.toggle('hidden');

            if ("marketPanel" === panelId) {
                if (graficas === false) {
                    stocks.forEach(stock => {
                        const containerId = `container-${stock.symbol}`;
                        fetchDataAndCreateChart(stock.symbol, containerId);

                    });
                    graficas = true;
                }
            }

            if ("investmentPanel" === panelId) {

                const inversionistaId = localStorage.getItem('userId'); // Asegúrate de que 'userId' esté guardado en localStorage
                if (inversionistaId) {
                    obtenerSaldoBilletera(inversionistaId);
                    fetchInvestments('investmentBody', inversionistaId, true, 'compra', 0);
                    fetchInvestments('investmentBodyInactive', inversionistaId, false, 'compra', 1);
                    fetchInvestments('ventaBody', inversionistaId, true, 'venta', 1);
                    fetchInvestments('ventaBodyInactive', inversionistaId, false, 'venta', 1);
                } else {
                    console.error('No se encontró el ID del inversionista en localStorage.');
                }



            }



        } else {
            panel.classList.add('hidden'); // Ocultar otros paneles
        }
    });
}


async function obtenerSaldoBilletera(userId) {
    try {
        // Llamada al endpoint de tu API
        const response = await fetch(`http://localhost:8080/api/billetera/usuario/${userId}`);
        if (response.ok) {
            const billeteras = await response.json();

            // Selecciona el contenedor donde se mostrarán los datos
            const container = document.getElementById('billetera-container');
            container.innerHTML = ''; // Limpia el contenedor

            // Itera sobre cada billetera y muestra su saldo
            billeteras.forEach(billetera => {
                const saldoElemento = document.createElement('p');
                saldoElemento.textContent = `Saldo: ${billetera.saldo}`;
                container.appendChild(saldoElemento);
            });
        } else {
            console.error('No se encontraron billeteras para este usuario');
        }
    } catch (error) {
        console.error('Error al obtener el saldo de las billeteras:', error);
    }
}


function buyStock(symbol) {
    // Obtener los datos de la acción almacenada en localStorage
    const storedData = JSON.parse(localStorage.getItem(symbol));
    const latestPrice = storedData.data[storedData.data.length - 1].close;

    localStorage.setItem('cvempresa', symbol);
    localStorage.setItem('cvprecio', latestPrice);
    window.location.href = 'compra.html';

}


function venta(id_trasacion) {
    alert("Processing transaction ID: " + id_trasacion);

    // Make an API request to the backend to process the transaction as a 'venta'
    fetch(`http://localhost:8080/api/transaccion/venta/${id_trasacion}`, {
        method: 'PUT',  // Use PUT or PATCH depending on your API
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Transaction not found or failed to update');
            }
        })
        .then(data => {
            alert('Transaction successfully processed: ' + JSON.stringify(data));
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
}


// Función para obtener el nombre de la empresa a partir del símbolo
function nombreEmpresa(symbol) {
    const stock = stocks.find(s => s.symbol === symbol);
    return stock ? stock.name : 'Símbolo no encontrado';
}

// Función para obtener el símbolo de la empresa a partir del nombre
function simboloEmpresa(name) {
    const stock = stocks.find(s => s.name === name);
    return stock ? stock.symbol : 'Nombre no encontrado';
}


function sellStock(symbol) {
    // Obtener los datos de la acción almacenada en localStorage
    const storedData = JSON.parse(localStorage.getItem(symbol));
    const latestPrice = storedData.data[storedData.data.length - 1].close;

    localStorage.setItem('cvempresa', symbol);
    localStorage.setItem('cvprecio', latestPrice);


    // Función para obtener el ID de la empresa
    fetch('http://localhost:8080/api/transaccion/' + localStorage.getItem('userId') + '/' + nombreEmpresa(localStorage.getItem('cvempresa')), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                response.json().then(isVerified => {
     
                    if (isVerified) {
                    
                        togglePanel("investmentPanel");
                   
                    } else {
                        alert("No ha comprado ninguna acción de esta empresa");
                    }
                });
            } else {
                alert("Error al verificar la compra");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error, por favor intenta de nuevo.");
        });

}






