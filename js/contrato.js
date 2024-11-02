const user = localStorage.getItem('userId');
const comisionista_seleccionado = localStorage.getItem('comisionista_seleccionado');

// Obtener el contrato del comisionista seleccionado
function loadComisionista(){
    fetch('http://localhost:8080/api/usuario/'+comisionista_seleccionado,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(usuario => {
        fetch('http://localhost:8080/api/comisionista/'+comisionista_seleccionado,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(comisionista => {
            document.querySelector('.profile-pais-com').textContent = comisionista.pais;
            document.querySelector('.profile-comision-com').textContent = comisionista.comision;
            document.querySelector('.profile-empresa-com').textContent = comisionista.empresa;
        }).catch(error => {
            console.error('Error:', error);
        });
       // Insertar los datos obtenidos en el HTML
        // Nombre del perfil
        document.querySelectorAll('.profile-name-com').forEach(element => {
            element.textContent = usuario.nombre;
        });

        // Correo electrónico
        document.querySelector('.profile-email-com').textContent = usuario.email;


    })
    .catch(error => {
        console.error('Error al obtener los datos del perfil:', error);
        alert('Error al cargar el perfil. Por favor, inténtelo de nuevo.');
    });
}

function loadInversionista(){
    fetch('http://localhost:8080/api/usuario/'+user,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(usuario => {
        fetch('http://localhost:8080/api/inversionista/'+user,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(inversersionista => {
            document.querySelector('.profile-pais-inv').textContent = inversersionista.pais;
            document.querySelector('.profile-riesgo-inv').textContent = inversersionista.perfil_riesgo;
        }).catch(error => {
            console.error('Error:', error);
        });
       // Insertar los datos obtenidos en el HTML

        // Nombre del perfil
        document.querySelectorAll('.profile-name-inv').forEach(element => {
            element.textContent = usuario.nombre;
        });

        // Correo electrónico
        document.querySelector('.profile-email-inv').textContent = usuario.email;


    })
    .catch(error => {
        console.error('Error al obtener los datos del perfil:', error);
        alert('Error al cargar el perfil. Por favor, inténtelo de nuevo.');
    });
}

function firmarContrato(){

    
    const inversionista_id = user;
    const comisionista_id = comisionista_seleccionado;
    const fecha_firma = "2021-10-10";
    const monto_inicial = 12000;
    const condiciones = 'Ninguna';
    const estado = true;
    fetch('http://localhost:8080/api/contrato?inversionista_id='+inversionista_id+'&comisionista_id='+comisionista_id+'&fecha_firma='+fecha_firma+'&monto_inicial='+monto_inicial+'&condiciones='+condiciones+'&estado='+ estado,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.contrato_id){
            const contrato_id = data.contrato_id;
            alert('Contrato firmado con éxito');
            localStorage.setItem('contratoId', contrato_id);
            window.location.href = 'inversionista.html';
        } 
        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al firmar el contrato. Por favor, inténtelo de nuevo.');
    });
}
    
// Verificar el estado de los checkboxes y habilitar/deshabilitar el botón
function verificarCheckboxes() {
    const checkbox1 = document.getElementById('know-terms');
    const checkbox2 = document.getElementById('terms-condition');
    const button = document.getElementById('firmar');

    // Habilitar el botón si ambos checkboxes están seleccionados
    button.disabled = !(checkbox1.checked && checkbox2.checked);
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar los datos del comisionista y del inversionista
    loadComisionista();
    loadInversionista();

    // Agregar listeners para los checkboxes
    document.getElementById('know-terms').addEventListener('change', verificarCheckboxes);
    document.getElementById('terms-condition').addEventListener('change', verificarCheckboxes);
});