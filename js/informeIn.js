document.getElementById("generarPdf").addEventListener("click", function () {
    const userId = localStorage.getItem('userId');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Llama a las funciones de generación de contenido
    cargarLogo(doc);
    agregarTitulo(doc);

    const promesas = [
        agregarDatosPersonales(doc),
        obtenerDatosYGenerarTabla(doc, userId, 0, 'compra', 'Compras Sin aceptar'),
        obtenerDatosYGenerarTabla(doc, userId, 1, 'venta', 'Ventas Hechas'),
        obtenerDatosYGenerarTabla(doc, userId, 1, 'compra', 'Compra Aceptadas'),
        obtenerDatosYGenerarTabla(doc, userId, 0, 'venta', 'Ventas Sin aceptar')
    ];

    Promise.all(promesas).then(() => {
        abrirPDFEnVentana(doc);
    }).catch(error => {
        console.error("Error al generar las tablas:", error);
    });
});


function cargarLogo(doc) {
    const logo = new Image();
    logo.src = "./images/logo.png";  // URL de la imagen
    logo.onload = function () {
        doc.addImage(logo, 'JPEG', 10, 13, 50, 10); // (imagen, tipo, X, Y, ancho, alto)
    }
}

function agregarTitulo(doc) {
    doc.setFontSize(20);
    doc.text('Informe', 105, 20, null, null, 'center');
}

function agregarDatosPersonales(doc) {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem('userId');
        fetch('http://localhost:8080/api/inversionista/'+userId)
            .then(response => response.json())
            .then(data => {
                // Configurar el tamaño de la fuente
                doc.setFontSize(12);

                // Añadir los datos del inversionista al PDF
                doc.text('Datos Personales:', 10, 40);
                doc.text('Nombre: ' + data.usuario.nombre, 10, 50);
                doc.text('Email: ' + data.usuario.email, 10, 60);
                doc.text('País: ' + data.pais, 10, 70);

                resolve();  // Resolver la promesa cuando los datos se agreguen
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                reject(error);  // Rechazar la promesa en caso de error
            });
    });
}

// Función para obtener los datos desde la API y generar la tabla en el PDF
function obtenerDatosYGenerarTabla(doc, inversionistaId, estado, tipo, tablaTitulo) {
    const url = `http://localhost:8080/api/transaccion/inversionista/${inversionistaId}/${estado}/${tipo}`;
    return fetch(url)
        .then(response => {
            console.log(response);
            if (response.status === 404) {

                return [];  // Devolver un array vacío si no hay datos
            } else if (!response.ok) {
                throw new Error('Error en la solicitud de datos');
            }
            return response.json();  // Convertir la respuesta a JSON
        })
        .then(data => {

            if (data && Array.isArray(data) && data.length > 0) {
                const headers = Object.keys(data[0]); // Obtener las claves del primer objeto como encabezados
                const tableData = data.map(item => Object.values(item)); // Mapear los datos
                agregarTabla(doc, headers, tableData, tablaTitulo);
            } else {

            }
        })
        .catch(error => {

            alert("Hubo un problema al obtener los datos. Intenta nuevamente.");
        });
}
let posY = 80; // Posición inicial para la primera tabla

function agregarTabla(doc, headers, tableData, tablaTitulo) {
    let fontSize = 8;
    let cellPadding = 4;

    if (tableData.length > 10) {
        fontSize = 7;
        cellPadding = 3;
    }

    doc.setFontSize(14);
    doc.text(tablaTitulo, 10, posY);

    // Agregar la tabla justo debajo del título
    doc.autoTable({
        startY: posY + 10, // Posición ajustada para la tabla
        head: [headers],
        body: tableData,
        theme: 'grid',
        styles: {
            cellPadding: 4,
            fontSize: 8,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
        },
        margin: { top: 40, left: 10, bottom: 10, right: 10 },
        pageBreak: 'auto',
    });

    // Actualiza `posY` con la posición final de la tabla más un margen adicional
    posY = doc.autoTable.previous.finalY + 20;
}


// Función para abrir el PDF en una nueva ventana
function abrirPDFEnVentana(doc) {
    const pdfOutput = doc.output('dataurlnewwindow');
    window.open(pdfOutput, '_blank');
}