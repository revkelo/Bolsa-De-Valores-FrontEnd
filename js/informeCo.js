
document.getElementById("generarPdf").addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    cargarLogo(doc);
    agregarTitulo(doc);

    try {
        // Obtener las transacciones y las ventas
        const transacciones = await fetchTransactions();
        const ventas = await fetchVentas();

        // Generar las tablas en el PDF
        if (transacciones.length > 0) {
            agregarTabla(doc, 'Transacciones del Comisionista', transacciones);
        }
        if (ventas.length > 0) {
            agregarTabla(doc, 'Ventas del Comisionista', ventas);
        }

        abrirPDFEnVentana(doc);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al generar el PDF. Por favor, intenta nuevamente.");
    }
});

function cargarLogo(doc) {
    const logo = new Image();
    logo.src = "./images/logo.png";
    logo.onload = function () {
        doc.addImage(logo, 'JPEG', 10, 13, 50, 10);
    }
}

function agregarTitulo(doc) {
    doc.setFontSize(20);
    doc.text('Informe', 105, 20, null, null, 'center');
}

async function fetchTransactions() {
    var userId = localStorage.getItem('userId');
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

async function fetchVentas() {
    var userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`http://localhost:8080/api/transaccion/comisionista/${userId}/ventas/venta`, {
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

function agregarTabla(doc, titulo, data) {
    if (data && Array.isArray(data) && data.length > 0) {
        // Filtrar las claves del primer objeto para evitar incluir columnas que contienen objetos
        const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object');

        // Filtrar cada fila para incluir solo los valores que corresponden a los headers seleccionados
        const tableData = data.map(item =>
            headers.map(header => typeof item[header] !== 'object' ? item[header] : "")
        );

        doc.setFontSize(14);
        doc.text(titulo, 10, doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 80);

        doc.autoTable({
            startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 20 : 90,
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
    }
}


function abrirPDFEnVentana(doc) {
    const pdfOutput = doc.output('dataurlnewwindow');
    window.open(pdfOutput, '_blank');
}