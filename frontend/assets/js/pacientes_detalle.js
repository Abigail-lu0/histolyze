import { getPacienteById, updatePaciente } from './api.js';
import { loadModuleAndInit } from './sidebar.js';
import { showAlert } from './alerts.js';

let pacienteActual = null;

function limitarFechasAlDiaDeHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.max = hoy;
    });
}

const formatters = {
    trasplantes: item => `<div class="card card-body mb-2"><b>Fecha:</b> ${item.fecha}</div>`,
    transfusiones: item => `<div class="card card-body mb-2"><p class="mb-1"><b>Fecha:</b> ${item.fecha}</p><p class="mb-0"><b>PD:</b> ${item.pd || 'N/A'}</p></div>`,
    dsa: item => `<div class="card card-body mb-2"><b>Fecha:</b> ${item.fecha} <br> <b>Resultado:</b> ${item.resultado}</div>`,
    crossmatch: item => `
        <div class="card card-body mb-2">
            <p class="mb-1"><b>Fecha:</b> ${item.fecha} | <b>Nº:</b> ${item.numero}</p>
            <div class="d-flex justify-content-around text-center small">
                <span><b>Anti-HLA I:</b> ${item.anti_hla_1}%</span>
                <span><b>Anti-HLA II:</b> ${item.anti_hla_2}%</span>
                <span><b>Anti MICA:</b> ${item.anti_mica}%</span>
            </div>
            <p class="mb-0 mt-2 small"><b>No Confirmados:</b> ${item.no_confirmados || 'Ninguno'}</p>
        </div>`
};

function renderDatosPersonales() {
    const viewContainer = document.getElementById('datos-personales-view');
    viewContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6"><p><strong>Nombre:</strong> ${pacienteActual.nombre}</p></div>
            <div class="col-md-6"><p><strong>Apellido:</strong> ${pacienteActual.apellido}</p></div>
            <div class="col-md-6"><p><strong>DNI:</strong> ${pacienteActual.dni}</p></div>
            <div class="col-md-6"><p><strong>Nro Muestra:</strong> ${pacienteActual.numMuestra || 'N/A'}</p></div>
            <div class="col-md-6"><p><strong>Fecha Nacimiento:</strong> ${pacienteActual.fechaNacimiento || 'N/A'}</p></div>
            <div class="col-md-6"><p><strong>Teléfono:</strong> ${pacienteActual.telefono || 'N/A'}</p></div>
            <div class="col-md-12"><p><strong>Domicilio:</strong> ${pacienteActual.domicilio || 'N/A'}</p></div>
            <div class="col-md-4"><p><strong>Mutual:</strong> ${pacienteActual.mutual || 'N/A'}</p></div>
            <div class="col-md-4"><p><strong>Centro de Tx:</strong> ${pacienteActual.centroTx || 'N/A'}</p></div>
            <div class="col-md-4"><p><strong>Centro de Diálisis:</strong> ${pacienteActual.centroDialisis || 'N/A'}</p></div>
        </div>
    `;

    const editForm = document.getElementById('form-edit-paciente');
    editForm.innerHTML = `
        <div class="row">
             <div class="col-md-6 mb-3"><label class="form-label">Nombre</label><input type="text" class="form-control" name="nombre" value="${pacienteActual.nombre}" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">Apellido</label><input type="text" class="form-control" name="apellido" value="${pacienteActual.apellido}" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">DNI</label><input type="text" class="form-control" name="dni" value="${pacienteActual.dni}" disabled></div>
             <div class="col-md-6 mb-3"><label class="form-label">Nro Muestra</label><input type="text" class="form-control" name="numMuestra" value="${pacienteActual.numMuestra || ''}" disabled></div>
             <div class="col-md-6 mb-3"><label class="form-label">Fecha Nacimiento</label><input type="date" class="form-control" name="fechaNacimiento" value="${pacienteActual.fechaNacimiento || ''}"></div>
             <div class="col-md-6 mb-3"><label class="form-label">Teléfono</label><input type="text" class="form-control" name="telefono" value="${pacienteActual.telefono || ''}"></div>
             <div class="col-md-12 mb-3"><label class="form-label">Domicilio</label><input type="text" class="form-control" name="domicilio" value="${pacienteActual.domicilio || ''}"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Mutual</label><input type="text" class="form-control" name="mutual" value="${pacienteActual.mutual || ''}"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Centro de Tx</label><input type="text" class="form-control" name="centroTx" value="${pacienteActual.centroTx || ''}"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Centro de Diálisis</label><input type="text" class="form-control" name="centroDialisis" value="${pacienteActual.centroDialisis || ''}"></div>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" class="btn btn-secondary" id="btn-cancelar-edicion">Cancelar</button>
    `;
    document.getElementById('btn-cancelar-edicion').addEventListener('click', toggleEditMode);
}

function renderHistorial(tipo, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error de Sincronización: No se encontró el contenedor con id '${containerId}'.`);
        return;
    }
    const historial = pacienteActual[tipo];
    if (!historial || historial.length === 0) {
        container.innerHTML = `<p class="text-muted">No hay registros de ${tipo}.</p>`;
        return;
    }
    container.innerHTML = historial.map(formatters[tipo]).join('');
}

function toggleEditMode() {
    document.getElementById('datos-personales-view').classList.toggle('d-none');
    document.getElementById('datos-personales-edit').classList.toggle('d-none');
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Actualizamos el objeto 'pacienteActual' con los nuevos valores del formulario
    pacienteActual.nombre = form.nombre.value;
    pacienteActual.apellido = form.apellido.value;
    pacienteActual.fechaNacimiento = form.fechaNacimiento.value;
    pacienteActual.telefono = form.telefono.value;
    pacienteActual.domicilio = form.domicilio.value;
    pacienteActual.mutual = form.mutual.value;
    pacienteActual.centroTx = form.centroTx.value;
    pacienteActual.centroDialisis = form.centroDialisis.value;
    
    try {
        // 1. Guardamos los datos en el backend
        await updatePaciente(pacienteActual.idPaciente, pacienteActual);
        
        // 2. Mostramos una alerta de éxito
        showAlert('Paciente actualizado con éxito', 'success');
        
        // 3. Volvemos a dibujar la información para que se vean los datos actualizados
        renderDatosPersonales();
        
        // 4. ¡LA LÍNEA CLAVE! Cerramos el formulario y volvemos al modo vista.
        toggleEditMode(); 

    } catch (err) {
        showAlert('Error al actualizar el paciente', 'danger');
    }
}

async function handleAddHistorial(e, tipo, modalId, renderFunction) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const nuevoRegistro = Object.fromEntries(formData.entries());

    if (!pacienteActual[tipo]) {
        pacienteActual[tipo] = [];
    }
    pacienteActual[tipo].push(nuevoRegistro);

    try {
        await updatePaciente(pacienteActual.idPaciente, pacienteActual);
        showAlert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} agregado con éxito`, 'success');
        renderFunction();
        
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        form.reset();
    } catch (err) {
        pacienteActual[tipo].pop();
        showAlert(`Error al agregar ${tipo}`, 'danger');
    }
}

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
export async function initPacienteDetalleModule(id) {
    if (!id) {
        showAlert('No se especificó un ID de paciente.', 'danger');
        loadModuleAndInit('pacientes_historial');
        return;
    }
    
    try {
        pacienteActual = await getPacienteById(id);
        
        limitarFechasAlDiaDeHoy();
        
        document.getElementById('nombre-paciente-header').textContent = `Perfil de ${pacienteActual.nombre} ${pacienteActual.apellido}`;
        
        renderDatosPersonales();
        
        // Renderizado usando los formatters
        renderHistorial('trasplantes', 'lista-trasplantes');
        renderHistorial('transfusiones', 'lista-transfusiones');
        renderHistorial('dsa', 'lista-dsa');
        renderHistorial('crossmatch', 'lista-crossmatch');

        document.getElementById('btn-volver-historial').addEventListener('click', () => loadModuleAndInit('pacientes_historial'));
        document.getElementById('btn-editar-personales').addEventListener('click', toggleEditMode);
        document.getElementById('form-edit-paciente').addEventListener('submit', handleEditSubmit);
        
        document.getElementById('form-add-trasplante').addEventListener('submit', (e) => handleAddHistorial(e, 'trasplantes', 'modalAgregarTrasplante', () => renderHistorial('trasplantes', 'lista-trasplantes')));
        document.getElementById('form-add-transfusion').addEventListener('submit', (e) => handleAddHistorial(e, 'transfusiones', 'modalAgregarTransfusion', () => renderHistorial('transfusiones', 'lista-transfusiones')));
        document.getElementById('form-add-dsa').addEventListener('submit', (e) => handleAddHistorial(e, 'dsa', 'modalAgregarDsa', () => renderHistorial('dsa', 'lista-dsa')));
        document.getElementById('form-add-crossmatch').addEventListener('submit', (e) => handleAddHistorial(e, 'crossmatch', 'modalAgregarCrossmatch', () => renderHistorial('crossmatch', 'lista-crossmatch')));

    } catch (err) {
        console.error("Error al inicializar el perfil del paciente:", err);
        showAlert('No se pudo cargar el perfil del paciente.', 'danger');
    }
}