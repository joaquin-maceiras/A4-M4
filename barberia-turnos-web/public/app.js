const BLOQUES_HORARIOS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30", "19:00"
];

let turnos = JSON.parse(localStorage.getItem('turnos_barberia')) || [];

const inputFecha = document.getElementById('fecha');
const filtroFechaAdmin = document.getElementById('filtro-fecha-admin');
const grillaHorarios = document.getElementById('grilla-horarios');
const inputHora = document.getElementById('hora-seleccionada');
const alertaBox = document.getElementById('alerta');

function obtenerFechaHoy() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const hoy = obtenerFechaHoy();
    inputFecha.min = hoy;
    inputFecha.value = hoy;
    filtroFechaAdmin.value = hoy;

    // Cargar un turno de ejemplo si está vacío
    if (turnos.length === 0) {
        turnos.push({
            id: Date.now(),
            nombre: "Álvaro (Ejemplo)",
            telefono: "1133332222",
            servicio: "Corte Clásico / Degradé ($8.000)",
            fecha: hoy,
            hora: "10:30",
            estado: "confirmado"
        });
        guardarTurnos();
    }

    renderizarHorarios();
    renderizarAdmin();
    renderizarMisTurnos();
});

inputFecha.addEventListener('change', () => {
    inputHora.value = '';
    ocultarAlerta();
    renderizarHorarios();
});

filtroFechaAdmin.addEventListener('change', renderizarAdmin);

function guardarTurnos() {
    localStorage.setItem('turnos_barberia', JSON.stringify(turnos));
}

function mostrarAlerta(mensaje, tipo) {
    alertaBox.textContent = mensaje;
    alertaBox.className = `alerta ${tipo}`;
}

function ocultarAlerta() {
    alertaBox.className = 'alerta oculto';
}

function renderizarHorarios() {
    grillaHorarios.innerHTML = '';
    const fechaElegida = inputFecha.value;
    if (!fechaElegida) return;

    const diaSemana = new Date(fechaElegida + 'T00:00:00').getDay();
    if (diaSemana === 0) {
        grillaHorarios.innerHTML = '<p style="grid-column: 1/-1; color: #b91c1c;">Cerrado los domingos. Seleccioná otro día.</p>';
        return;
    }

    const ocupados = turnos
        .filter(t => t.fecha === fechaElegida && t.estado === 'confirmado')
        .map(t => t.hora);

    BLOQUES_HORARIOS.forEach(hora => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hora-btn';
        btn.textContent = hora;

        if (ocupados.includes(hora)) {
            btn.disabled = true;
            btn.title = 'Horario ocupado';
        } else {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                inputHora.value = hora;
                ocultarAlerta();
            });
        }
        grillaHorarios.appendChild(btn);
    });
}

document.getElementById('form-turno').addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const servicio = document.getElementById('servicio').value;
    const fecha = inputFecha.value;
    const hora = inputHora.value;

    if (!hora) {
        mostrarAlerta('Por favor, seleccioná un bloque horario disponible.', 'error');
        return;
    }

    // Validación de concurrencia
    const yaOcupado = turnos.some(t => t.fecha === fecha && t.hora === hora && t.estado === 'confirmado');
    if (yaOcupado) {
        mostrarAlerta('Ese horario acaba de ser reservado. Elegí otro.', 'error');
        renderizarHorarios();
        return;
    }

    turnos.push({
        id: Date.now(),
        nombre,
        telefono,
        servicio,
        fecha,
        hora,
        estado: 'confirmado'
    });

    guardarTurnos();
    inputHora.value = '';
    mostrarAlerta(`¡Turno confirmado para ${nombre} el ${fecha} a las ${hora} hs!`, 'exito');
    renderizarHorarios();
    renderizarAdmin();
    renderizarMisTurnos();
});

function cambiarEstadoTurno(id, nuevoEstado) {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
        turno.estado = nuevoEstado;
        guardarTurnos();
        renderizarHorarios();
        renderizarAdmin();
        renderizarMisTurnos();
    }
}

function renderizarMisTurnos() {
    const contenedor = document.getElementById('lista-mis-turnos');
    const activos = turnos.filter(t => t.estado === 'confirmado');

    if (activos.length === 0) {
        contenedor.innerHTML = '<p style="color:#6b7280;">No hay turnos activos registrados.</p>';
        return;
    }

    contenedor.innerHTML = activos.map(t => `
        <div class="turno-item">
            <div>
                <strong>${t.fecha} - ${t.hora} hs</strong><br>
                <span>${t.servicio} (${t.nombre})</span>
            </div>
            <button class="btn-sm btn-cancel" onclick="cambiarEstadoTurno(${t.id}, 'cancelado')">Cancelar</button>
        </div>
    `).join('');
}

function renderizarAdmin() {
    const tbody = document.getElementById('tabla-admin-body');
    const fechaFiltro = filtroFechaAdmin.value;
    const filtrados = turnos
        .filter(t => t.fecha === fechaFiltro)
        .sort((a, b) => a.hora.localeCompare(b.hora));

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#6b7280;">Sin turnos para esta fecha.</td></tr>';
        return;
    }

    tbody.innerHTML = filtrados.map(t => `
        <tr>
            <td><strong>${t.hora}</strong></td>
            <td>${t.nombre}</td>
            <td>${t.telefono}</td>
            <td>${t.servicio}</td>
            <td><span class="badge ${t.estado}">${t.estado}</span></td>
            <td>
                ${t.estado === 'confirmado' ? `
                    <button class="btn-sm btn-ok" onclick="cambiarEstadoTurno(${t.id}, 'completado')">Completado</button>
                    <button class="btn-sm btn-cancel" onclick="cambiarEstadoTurno(${t.id}, 'cancelado')">Cancelar</button>
                ` : '-'}
            </td>
        </tr>
    `).join('');
}

function cambiarVista(vista) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${vista}`).classList.add('active');

    document.getElementById('vista-cliente').classList.add('oculto');
    document.getElementById('vista-mis-turnos').classList.add('oculto');
    document.getElementById('vista-admin').classList.add('oculto');

    document.getElementById(`vista-${vista}`).classList.remove('oculto');
}
