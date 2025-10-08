import { getPacienteById, updatePaciente } from "./api.js";
import { loadModuleAndInit } from "./sidebar.js";
import { showAlert } from "./alerts.js";

let pacienteActual = null;

function limitarFechasAlDiaDeHoy() {
  const hoy = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.max = hoy;
  });
}

// Objeto que contiene las plantillas para dibujar cada tipo de historial
const formatters = {
  trasplantes: (item, index) => `
    <tr>
      <td>${item.fecha}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" data-tipo="trasplantes" data-index="${index}" data-modal="modalAgregarTrasplante">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-tipo="trasplantes" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  transfusiones: (item, index) => `
    <tr>
      <td>${item.fecha}</td>
      <td>${item.pd || "N/A"}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" data-tipo="transfusiones" data-index="${index}" data-modal="modalAgregarTransfusion">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-tipo="transfusiones" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  dsa: (item, index) => `
    <tr>
      <td>${item.fecha}</td>
      <td>${item.resultado}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" data-tipo="dsa" data-index="${index}" data-modal="modalAgregarDsa">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-tipo="dsa" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  crossmatch: (item, index) => `
    <tr>
      <td>${item.fecha}</td>
      <td>${item.numero}</td>
      <td>${item.anti_hla_1}%</td>
      <td>${item.anti_hla_2}%</td>
      <td>${item.anti_mica}%</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" data-tipo="crossmatch" data-index="${index}" data-modal="modalAgregarCrossmatch">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-tipo="crossmatch" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
};

function renderDatosPersonales() {
  const viewContainer = document.getElementById("datos-personales-view");
  viewContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6"><p><strong>Nombre:</strong> ${
              pacienteActual.nombre
            }</p></div>
            <div class="col-md-6"><p><strong>Apellido:</strong> ${
              pacienteActual.apellido
            }</p></div>
            <div class="col-md-6"><p><strong>DNI:</strong> ${
              pacienteActual.dni
            }</p></div>
            <div class="col-md-6"><p><strong>Nro Muestra:</strong> ${
              pacienteActual.numMuestra || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>Fecha Nacimiento:</strong> ${
              pacienteActual.fechaNacimiento || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>Teléfono:</strong> ${
              pacienteActual.telefono || "N/A"
            }</p></div>
            <div class="col-md-12"><p><strong>Domicilio:</strong> ${
              pacienteActual.domicilio || "N/A"
            }</p></div>
            <div class="col-md-4"><p><strong>Mutual:</strong> ${
              pacienteActual.mutual || "N/A"
            }</p></div>
            <div class="col-md-4"><p><strong>Centro de Tx:</strong> ${
              pacienteActual.centroTx || "N/A"
            }</p></div>
            <div class="col-md-4"><p><strong>Centro de Diálisis:</strong> ${
              pacienteActual.centroDialisis || "N/A"
            }</p></div>
        </div>
    `;

  const editForm = document.getElementById("form-edit-paciente");
  editForm.innerHTML = `
        <div class="row">
             <div class="col-md-6 mb-3"><label class="form-label">Nombre</label><input type="text" class="form-control" name="nombre" value="${
               pacienteActual.nombre
             }" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">Apellido</label><input type="text" class="form-control" name="apellido" value="${
               pacienteActual.apellido
             }" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">DNI</label><input type="text" class="form-control" name="dni" value="${
               pacienteActual.dni
             }" disabled></div>
             <div class="col-md-6 mb-3"><label class="form-label">Nro Muestra</label><input type="text" class="form-control" name="numMuestra" value="${
               pacienteActual.numMuestra || ""
             }" disabled></div>
             <div class="col-md-6 mb-3"><label class="form-label">Fecha Nacimiento</label><input type="date" class="form-control" name="fechaNacimiento" value="${
               pacienteActual.fechaNacimiento || ""
             }"></div>
             <div class="col-md-6 mb-3"><label class="form-label">Teléfono</label><input type="text" class="form-control" name="telefono" value="${
               pacienteActual.telefono || ""
             }"></div>
             <div class="col-md-12 mb-3"><label class="form-label">Domicilio</label><input type="text" class="form-control" name="domicilio" value="${
               pacienteActual.domicilio || ""
             }"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Mutual</label><input type="text" class="form-control" name="mutual" value="${
               pacienteActual.mutual || ""
             }"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Centro de Tx</label><input type="text" class="form-control" name="centroTx" value="${
               pacienteActual.centroTx || ""
             }"></div>
             <div class="col-md-4 mb-3"><label class="form-label">Centro de Diálisis</label><input type="text" class="form-control" name="centroDialisis" value="${
               pacienteActual.centroDialisis || ""
             }"></div>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" class="btn btn-secondary" id="btn-cancelar-edicion">Cancelar</button>
    `;
  document
    .getElementById("btn-cancelar-edicion")
    .addEventListener("click", toggleEditMode);
}

function renderHistorial(tipo, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const historial = pacienteActual[tipo];
  if (!historial || historial.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay registros de ${tipo}.</p>`;
    return;
  }
  container.innerHTML = historial
    .map((item, index) => formatters[tipo](item, index))
    .join("");
}

function toggleEditMode() {
  document.getElementById("datos-personales-view").classList.toggle("d-none");
  document.getElementById("datos-personales-edit").classList.toggle("d-none");
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
    showAlert("Paciente actualizado con éxito", "success");

    // 3. Volvemos a dibujar la información para que se vean los datos actualizados
    renderDatosPersonales();

    // 4. ¡LA LÍNEA CLAVE! Cerramos el formulario y volvemos al modo vista.
    toggleEditMode();
  } catch (err) {
    showAlert("Error al actualizar el paciente", "danger");
  }
}

// --- SECCIÓN DE RENDERIZADO MEJORADA CON TABLAS ---

function renderTablaHistorial(tipo, containerId, headers, formatRow) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const historial = pacienteActual[tipo];

  if (!historial || historial.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay registros.</p>`;
    return;
  }

  const headerHtml = headers.map((h) => `<th>${h}</th>`).join("");
  const bodyHtml = historial
    .map((item, index) => formatRow(item, index))
    .join("");

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        ${headerHtml}
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${bodyHtml}
                </tbody>
            </table>
        </div>
    `;
}

function renderAllHistorials() {
  renderTablaHistorial(
    "trasplantes",
    "contenedor-tabla-trasplantes",
    ["Fecha", "Órgano"],
    (item, index) => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.organo || "N/A"}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="trasplantes" data-index="${index}" data-modal="modalAgregarTrasplante">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="trasplantes" data-index="${index}">🗑️</button>
            </td>
        </tr>
    `
  );

  renderTablaHistorial(
    "transfusiones",
    "contenedor-tabla-transfusiones",
    ["Fecha", "PD"],
    (item, index) => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.pd || "N/A"}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="transfusiones" data-index="${index}" data-modal="modalAgregarTransfusion">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="transfusiones" data-index="${index}">🗑️</button>
            </td>
        </tr>
    `
  );

  renderTablaHistorial(
    "dsa",
    "contenedor-tabla-dsa",
    ["Fecha", "Resultado"],
    (item, index) => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.resultado}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="dsa" data-index="${index}" data-modal="modalAgregarDsa">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="dsa" data-index="${index}">🗑️</button>
            </td>
        </tr>
    `
  );

  renderTablaHistorial(
    "crossmatch",
    "contenedor-tabla-crossmatch",
    ["Fecha", "Nº", "Anti-HLA I", "Anti-HLA II", "Anti MICA"],
    (item, index) => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.numero}</td>
            <td>${item.anti_hla_1}%</td>
            <td>${item.anti_hla_2}%</td>
            <td>${item.anti_mica}%</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="crossmatch" data-index="${index}" data-modal="modalAgregarCrossmatch">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="crossmatch" data-index="${index}">🗑️</button>
            </td>
        </tr>
    `
  );
}

async function handleAddOrEditHistorial(e, tipo, modalId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const registro = Object.fromEntries(formData.entries());
  const index = form.dataset.editingIndex;

  if (index) {
    // Editando
    pacienteActual[tipo][index] = registro;
  } else {
    // Agregando
    if (!pacienteActual[tipo]) pacienteActual[tipo] = [];
    pacienteActual[tipo].push(registro);
  }

  try {
    await updatePaciente(pacienteActual.idPaciente, pacienteActual);
    showAlert(
      `Registro ${index ? "actualizado" : "agregado"} con éxito`,
      "success"
    );
    renderAllHistorials(); // Refrescamos todas las tablas

    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
    form.reset();
    delete form.dataset.editingIndex;
  } catch (err) {
    showAlert(`Error al guardar el registro`, "danger");
  }
}

async function handleEliminarHistorial(tipo, index) {
  const item = pacienteActual[tipo][index];
  if (
    confirm(
      `¿Estás seguro de que deseas eliminar el registro de ${tipo} del ${item.fecha}?`
    )
  ) {
    pacienteActual[tipo].splice(index, 1);
    try {
      await updatePaciente(pacienteActual.idPaciente, pacienteActual);
      showAlert("Registro eliminado con éxito", "success");
      renderAllHistorials(); // Refrescamos todas las tablas
    } catch (err) {
      showAlert("Error al eliminar el registro", "danger");
    }
  }
}

function handleEditarHistorial(tipo, index, modalId) {
  const item = pacienteActual[tipo][index];
  const modalElement = document.getElementById(modalId);
  const form = modalElement.querySelector("form");

  for (const key in item) {
    if (form.elements[key]) {
      form.elements[key].value = item[key];
    }
  }

  form.dataset.editingIndex = index;
  new bootstrap.Modal(modalElement).show();
}

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
export async function initPacienteDetalleModule(id) {
  if (!id) {
    showAlert("No se especificó un ID de paciente.", "danger");
    loadModuleAndInit("pacientes_historial");
    return;
  }

  try {
    pacienteActual = await getPacienteById(id);

    limitarFechasAlDiaDeHoy();
    document.getElementById(
      "nombre-paciente-header"
    ).textContent = `Perfil de ${pacienteActual.nombre} ${pacienteActual.apellido}`;

    renderDatosPersonales();
    renderAllHistorials(); // Llamada única para renderizar todas las tablas

    document
      .getElementById("btn-volver-historial")
      .addEventListener("click", () =>
        loadModuleAndInit("pacientes_historial")
      );
    document
      .getElementById("btn-editar-personales")
      .addEventListener("click", toggleEditMode);
    document
      .getElementById("form-edit-paciente")
      .addEventListener("submit", handleEditSubmit);

    document
      .getElementById("form-add-trasplante")
      .addEventListener("submit", (e) =>
        handleAddOrEditHistorial(e, "trasplantes", "modalAgregarTrasplante")
      );
    document
      .getElementById("form-add-transfusion")
      .addEventListener("submit", (e) =>
        handleAddOrEditHistorial(e, "transfusiones", "modalAgregarTransfusion")
      );
    document
      .getElementById("form-add-dsa")
      .addEventListener("submit", (e) =>
        handleAddOrEditHistorial(e, "dsa", "modalAgregarDsa")
      );
    document
      .getElementById("form-add-crossmatch")
      .addEventListener("submit", (e) =>
        handleAddOrEditHistorial(e, "crossmatch", "modalAgregarCrossmatch")
      );

    document
      .getElementById("historialAccordion")
      .addEventListener("click", (e) => {
        const target = e.target.closest(
          "button.btn-editar, button.btn-eliminar"
        );
        if (!target) return;
        const { tipo, index, modal } = target.dataset;
        if (target.classList.contains("btn-eliminar")) {
          handleEliminarHistorial(tipo, parseInt(index));
        } else if (target.classList.contains("btn-editar")) {
          handleEditarHistorial(tipo, parseInt(index), modal);
        }
      });
  } catch (err) {
    console.error("Error al inicializar el perfil del paciente:", err);
    showAlert("No se pudo cargar el perfil del paciente.", "danger");
  }
}
