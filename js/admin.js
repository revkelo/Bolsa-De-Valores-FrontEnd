// Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId');

// Verificar si userId es null o no
if (userId === null) {
    // Redirigir a login.html si userId es null
    window.location.href = 'login.html';
}

// Función para alternar la visibilidad de los paneles
function togglePanel(panelId) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        if (panel.id === panelId) {
            panel.classList.toggle('hidden'); // Mostrar u ocultar el panel seleccionado
        } else {
            panel.classList.add('hidden'); // Ocultar otros paneles
        }
    });
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
    panels.forEach(panel => panel.classList.add('hidden'));
    document.getElementById(panelId).classList.remove('hidden');
  }

  function showInvestors() {
    const investorList = document.getElementById('investorList');
    const investorTableBody = document.getElementById('investorTableBody');
    investorTableBody.innerHTML = '';

    const investors = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    investors.forEach(investor => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${investor.id}</td>
        <td class="border px-4 py-2">${investor.name}</td>
        <td class="border px-4 py-2">${investor.email}</td>
      `;
      investorTableBody.appendChild(row);
    });

    investorList.classList.remove('hidden');
  }

  function showCommissioners() {
    const commissionerList = document.getElementById('commissionerList');
    const commissionerTableBody = document.getElementById('commissionerTableBody');
    commissionerTableBody.innerHTML = '';

    const commissioners = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Brown', email: 'bob@example.com' },
    ];

    commissioners.forEach(comm => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${comm.id}</td>
        <td class="border px-4 py-2">${comm.name}</td>
        <td class="border px-4 py-2">${comm.email}</td>
      `;
      commissionerTableBody.appendChild(row);
    });

    commissionerList.classList.remove('hidden');
  }

  // Show home panel by default
  togglePanel('homePanel');