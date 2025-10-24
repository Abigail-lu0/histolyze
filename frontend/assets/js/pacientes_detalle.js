import { getPacienteById, updatePaciente } from "./api.js";
import { loadModuleAndInit } from "./sidebar.js";
import { showAlert } from "./alerts.js";
import { getUsuarioLogueado } from "./auth.js";

let pacienteActual = null;

function limitarFechasAlDiaDeHoy() {
  const hoy = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.max = hoy;
  });
}

const formatters = {
  trasplantes: (item, index) => `
    <tr>
      <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : "N/A"}</td>
      <td>${item.tipo || item.organo || "N/A"}</td> 
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="trasplantes" data-index="${index}" data-modal="modalAgregarTrasplante">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="trasplantes" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  // Acepta 'antecedente' (3er arg) para leer el 'procesoDonacion' que está en el padre
  transfusiones: (item, index, antecedente) => `
    <tr>
      <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : "N/A"}</td>
      <td>${
        antecedente && antecedente.procesoDonacion
          ? antecedente.procesoDonacion
          : "N/A"
      }</td> 
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="transfusiones" data-index="${index}" data-modal="modalAgregarTransfusion">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="transfusiones" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  dsa: (item, index) => `
    <tr>
      <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : "N/A"}</td>
      <td>${item.numeroMuestra || "N/A"}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="dsa" data-index="${index}" data-modal="modalAgregarDsa">✏️</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="dsa" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  crossmatch: (item, index) => `
    <tr>
      <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : "N/A"}</td>
      <td>${item.numeroMuestra || "N/A"}</td>
      <td>${item.antiHla1 !== null ? item.antiHla1 + "%" : "N/A"}</td> 
      <td>${item.antiHla2 !== null ? item.antiHla2 + "%" : "N/A"}</td>
      <td>${item.antiMica !== null ? item.antiMica + "%" : "N/A"}</td>
      <td class="text-end">
         <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="crossmatch" data-index="${index}" data-modal="modalAgregarCrossmatch">✏️</button>
         <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="crossmatch" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
  tipificacionesHLA: (item, index) => `
    <tr>
      <td>${
        item.fechaRegistro
          ? new Date(item.fechaRegistro).toLocaleDateString()
          : "N/A"
      }</td>
      <td>${item.numeroMuestra || "N/A"}</td>
      <td>${item.locusA01 || "-"} / ${item.locusA02 || "-"}</td> 
      <td>${item.locusB01 || "-"} / ${item.locusB02 || "-"}</td>
      <td>${item.locusC01 || "-"} / ${item.locusC02 || "-"}</td>
      <td>${item.locusDR01 || "-"} / ${item.locusDR02 || "-"}</td>
      <td>${item.locusDQA01 || "-"} / ${item.locusDQA02 || "-"}</td>
      <td>${item.locusDQB01 || "-"} / ${item.locusDQB02 || "-"}</td>
      <td>${item.locusDPA01 || "-"} / ${item.locusDPA02 || "-"}</td>
      <td>${item.locusDPB01 || "-"} / ${item.locusDPB02 || "-"}</td>
      <td class="text-end">
         <button class="btn btn-sm btn-outline-primary btn-editar" title="Editar" data-tipo="tipificacionesHLA" data-index="${index}" data-modal="modalAgregarHLA">✏️</button>
         <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-tipo="tipificacionesHLA" data-index="${index}">🗑️</button>
      </td>
    </tr>`,
};

function renderDatosPersonales() {
  const viewContainer = document.getElementById("datos-personales-view");
  if (!pacienteActual) {
    viewContainer.innerHTML =
      '<p class="text-danger">Error: No se pudieron cargar los datos del paciente.</p>';
    return;
  }
  viewContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6"><p><strong>Nombre:</strong> ${
              pacienteActual.nombre || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>Apellido:</strong> ${
              pacienteActual.apellido || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>DNI:</strong> ${
              pacienteActual.dni || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>Nro Muestra:</strong> ${
              pacienteActual.numeroMuestra || "N/A"
            }</p></div>
            <div class="col-md-6"><p><strong>Fecha Nacimiento:</strong> ${
              pacienteActual.fechaNacimiento
                ? new Date(pacienteActual.fechaNacimiento).toLocaleDateString()
                : "N/A"
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
            <div class="col-md-6"><p><strong>Médico Solicitante:</strong> ${
              pacienteActual.medicoSolicitante || "N/A"
            }</p></div>
        </div>
        <hr>
        <div class="row mt-2 text-muted small">
             <div class="col-md-6"><p><strong>Creado por:</strong> ${
               pacienteActual.creadoPor?.nombre
                 ? `${pacienteActual.creadoPor.nombre} ${pacienteActual.creadoPor.apellido}`
                 : "No registrado"
             }</p></div>
             <div class="col-md-6"><p><strong>Última modificación por:</strong> ${
               pacienteActual.completadoPor?.nombre
                 ? `${pacienteActual.completadoPor.nombre} ${pacienteActual.completadoPor.apellido}`
                 : "N/A"
             }</p></div>
        </div>
    `;

  const editForm = document.getElementById("form-edit-paciente");
  editForm.innerHTML = `
        <div class="row">
             <div class="col-md-6 mb-3"><label class="form-label">Nombre</label><input type="text" class="form-control" name="nombre" value="${
               pacienteActual.nombre || ""
             }" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">Apellido</label><input type="text" class="form-control" name="apellido" value="${
               pacienteActual.apellido || ""
             }" required></div>
             <div class="col-md-6 mb-3"><label class="form-label">DNI</label><input type="text" class="form-control" name="dni" value="${
               pacienteActual.dni || ""
             }" disabled></div>
             <div class="col-md-6 mb-3"><label class="form-label">Nro Muestra</label><input type="text" class="form-control" name="numeroMuestra" value="${
               pacienteActual.numeroMuestra || ""
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
              <div class="col-md-6 mb-3"><label class="form-label">Médico Solicitante</label><input type="text" class="form-control" name="medicoSolicitante" value="${
                pacienteActual.medicoSolicitante || ""
              }"></div>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" class="btn btn-secondary" id="btn-cancelar-edicion">Cancelar</button>
    `;
  const cancelButton = editForm.querySelector("#btn-cancelar-edicion");
  if (cancelButton) {
    cancelButton.addEventListener("click", toggleEditMode);
  }
}

function renderAntecedentesGenerales() {
  const viewContainer = document.getElementById("antecedentes-view");
  // Acceder al primer antecedente de la lista
  const antecedente =
    pacienteActual?.antecedentes && pacienteActual.antecedentes.length > 0
      ? pacienteActual.antecedentes[0]
      : null;

  if (!antecedente) {
    viewContainer.innerHTML = `<p class="text-center text-muted fst-italic">No hay antecedentes generales registrados.</p>`;
  } else {
    viewContainer.innerHTML = `
            <p><strong>Diagnóstico:</strong> ${
              antecedente.diagnostico || "N/A"
            }</p>
            <p><strong>Medicación Actual:</strong> ${
              antecedente.medicacion || "N/A"
            }</p>
            <p><strong>Cantidad de Embarazos:</strong> ${
              antecedente.cantidadEmbarazos !== null
                ? antecedente.cantidadEmbarazos
                : 0
            }</p>
             <p><strong>Fecha Comienzo Hemodiálisis:</strong> ${
               antecedente.fechaComienzoHemodialisis
                 ? new Date(
                     antecedente.fechaComienzoHemodialisis
                   ).toLocaleDateString()
                 : "N/A"
             }</p>
             <p><strong>Tuvo Transfusiones:</strong> ${
               antecedente.tuvoTransfusiones ? "Sí" : "No"
             }</p>
             ${
               antecedente.tuvoTransfusiones
                 ? `<p><strong>Fecha Última Transfusión:</strong> ${
                     antecedente.fechaTransfusiones
                       ? new Date(
                           antecedente.fechaTransfusiones
                         ).toLocaleDateString()
                       : "N/A"
                   }</p>`
                 : ""
             }
             <p><strong>Tuvo Trasplantes Previos:</strong> ${
               antecedente.tuvoTrasplantesPrevios ? "Sí" : "No"
             }</p>
        `;
  }

  const editForm = document.getElementById("form-edit-antecedentes");
  editForm.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Diagnóstico</label>
            <textarea class="form-control" name="diagnostico" rows="3">${
              antecedente?.diagnostico || ""
            }</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Medicación Actual</label>
            <textarea class="form-control" name="medicacion" rows="3">${
              antecedente?.medicacion || ""
            }</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Cantidad de Embarazos</label>
            <input type="number" class="form-control" name="cantidadEmbarazos" value="${
              antecedente?.cantidadEmbarazos ?? 0
            }" min="0"> 
        </div> 
        <div class="mb-3">
            <label class="form-label">Grupo Sanguíneo</label>
            <select class="form-select" name="grupoSanguineo">
                <option value="" ${
                  !antecedente?.grupoSanguineo ? "selected" : ""
                }>Seleccionar...</option>
                <option value="A_POSITIVO" ${
                  antecedente?.grupoSanguineo === "A_POSITIVO" ? "selected" : ""
                }>A+</option>
                <option value="A_NEGATIVO" ${
                  antecedente?.grupoSanguineo === "A_NEGATIVO" ? "selected" : ""
                }>A-</option>
                <option value="B_POSITIVO" ${
                  antecedente?.grupoSanguineo === "B_POSITIVO" ? "selected" : ""
                }>B+</option>
                <option value="B_NEGATIVO" ${
                  antecedente?.grupoSanguineo === "B_NEGATIVO" ? "selected" : ""
                }>B-</option>
                <option value="AB_POSITIVO" ${
                  antecedente?.grupoSanguineo === "AB_POSITIVO"
                    ? "selected"
                    : ""
                }>AB+</option>
                <option value="AB_NEGATIVO" ${
                  antecedente?.grupoSanguineo === "AB_NEGATIVO"
                    ? "selected"
                    : ""
                }>AB-</option>
                <option value="O_POSITIVO" ${
                  antecedente?.grupoSanguineo === "O_POSITIVO" ? "selected" : ""
                }>O+</option>
                <option value="O_NEGATIVO" ${
                  antecedente?.grupoSanguineo === "O_NEGATIVO" ? "selected" : ""
                }>O-</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" class="btn btn-secondary" id="btn-cancelar-edicion-antecedentes">Cancelar</button>
    `;
  const cancelButtonAntecedentes = editForm.querySelector(
    "#btn-cancelar-edicion-antecedentes"
  );
  if (cancelButtonAntecedentes) {
    cancelButtonAntecedentes.addEventListener(
      "click",
      toggleAntecedentesEditMode
    );
  }
}

function renderTablaHistorial(tipo, containerId, headers, formatRow) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const antecedente =
    pacienteActual?.antecedentes && pacienteActual.antecedentes.length > 0
      ? pacienteActual.antecedentes[0]
      : null;

  let historial;
  if (tipo === "trasplantes" || tipo === "transfusiones") {
    historial = antecedente
      ? antecedente[
          tipo === "trasplantes" ? "listaTrasplantes" : "listaTransfusiones"
        ]
      : [];
  } else {
    const nombreLista =
      tipo === "crossmatch"
        ? "crossmatchContraPanel"
        : tipo === "tipificacionesHLA"
        ? "tipificacionesHLA"
        : tipo;
    historial = pacienteActual ? pacienteActual[nombreLista] : [];
  }

  historial = Array.isArray(historial) ? historial : [];

  if (historial.length === 0) {
    container.innerHTML = `<p class="text-center text-muted fst-italic">No hay registros.</p>`;
    return;
  }

  const headerHtml = headers.map((h) => `<th>${h}</th>`).join("");
  // Pasa 'antecedente' como tercer argumento al formatter (útil para transfusiones)
  const bodyHtml =
    typeof formatRow === "function"
      ? historial
          .map((item, index) => formatRow(item, index, antecedente))
          .join("")
      : `<tr><td colspan="${
          headers.length + 1
        }" class="text-danger">Error: Formatter no definido</td></tr>`;

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-sm caption-top"> 
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
  const configHistorial = {
    trasplantes: {
      containerId: "contenedor-tabla-trasplantes",
      headers: ["Fecha", "Tipo/Órgano"],
      formatter: formatters.trasplantes,
    },
    transfusiones: {
      containerId: "contenedor-tabla-transfusiones",
      headers: ["Fecha", "Proceso Donación"],
      formatter: formatters.transfusiones,
    },
    tipificacionesHLA: {
      containerId: "contenedor-tabla-hla",
      headers: [
        "Fecha Reg.",
        "Nro. Muestra",
        "A",
        "B",
        "C",
        "DR",
        "DQA",
        "DQB",
        "DPA",
        "DPB",
      ],
      formatter: formatters.tipificacionesHLA,
    },
    dsa: {
      containerId: "contenedor-tabla-dsa",
      headers: ["Fecha", "Nro. Muestra"],
      formatter: formatters.dsa,
    },
    crossmatch: {
      containerId: "contenedor-tabla-crossmatch",
      headers: ["Fecha", "Nro. Muestra", "HLA I (%)", "HLA II (%)", "MICA (%)"],
      formatter: formatters.crossmatch,
    },
  };

  for (const tipo in configHistorial) {
    const config = configHistorial[tipo];
    if (typeof config.formatter === "function") {
      renderTablaHistorial(
        tipo,
        config.containerId,
        config.headers,
        config.formatter
      );
    } else {
      console.error(`Formatter no encontrado para el tipo: ${tipo}`);
      const container = document.getElementById(config.containerId);
      if (container) {
        container.innerHTML = `<p class="text-danger">Error al configurar la tabla de ${tipo}.</p>`;
      }
    }
  }
  attachHistorialActionListeners();
}

function toggleEditMode() {
  document.getElementById("datos-personales-view").classList.toggle("d-none");
  document.getElementById("datos-personales-edit").classList.toggle("d-none");
}

function toggleAntecedentesEditMode() {
  document.getElementById("antecedentes-view").classList.toggle("d-none");
  document.getElementById("antecedentes-edit").classList.toggle("d-none");
}

async function handleEditSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const usuarioLogueado = getUsuarioLogueado();

  const datosEditados = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    fechaNacimiento: form.fechaNacimiento.value || null,
    telefono: form.telefono.value || null,
    domicilio: form.domicilio.value || null,
    mutual: form.mutual.value || null,
    centroTx: form.centroTx.value || null,
    centroDialisis: form.centroDialisis.value || null,
    medicoSolicitante: form.medicoSolicitante.value || null,
    completadoPor: usuarioLogueado
      ? { idUsuario: usuarioLogueado.idUsuario }
      : null,
  };

  datosEditados.creadoPor = pacienteActual.creadoPor
    ? { idUsuario: pacienteActual.creadoPor.idUsuario }
    : null;

  try {
    await updatePaciente(pacienteActual.idPaciente, datosEditados);
    pacienteActual = await getPacienteById(pacienteActual.idPaciente);

    showAlert("Paciente actualizado con éxito", "success");
    renderDatosPersonales();
    toggleEditMode();
  } catch (err) {
    console.error("Error al actualizar paciente:", err);
    showAlert(`Error al actualizar el paciente: ${err.message}`, "danger");
  }
}

async function handleEditAntecedentesSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const usuarioLogueado = getUsuarioLogueado();

  const antecedenteActual =
    pacienteActual?.antecedentes && pacienteActual.antecedentes.length > 0
      ? pacienteActual.antecedentes[0]
      : null;

  const antecedenteEditado = {
    idAntecedente: antecedenteActual?.idAntecedente || null,
    diagnostico: form.diagnostico.value || null,
    medicacion: form.medicacion.value || null,
    cantidadEmbarazos: form.cantidadEmbarazos.value
      ? parseInt(form.cantidadEmbarazos.value)
      : 0,
    grupoSanguineo: form.grupoSanguineo.value || null,
    usuario: usuarioLogueado ? { idUsuario: usuarioLogueado.idUsuario } : null,
    listaTransfusiones: antecedenteActual?.listaTransfusiones || [],
    listaTrasplantes: antecedenteActual?.listaTrasplantes || [],
  };

  const payload = {
    ...pacienteActual,
    antecedentes: [antecedenteEditado],
    completadoPor: usuarioLogueado
      ? { idUsuario: usuarioLogueado.idUsuario }
      : null,
    creadoPor: pacienteActual.creadoPor
      ? { idUsuario: pacienteActual.creadoPor.idUsuario }
      : null,
  };
  delete payload.dsa;
  delete payload.crossmatchContraPanel;
  delete payload.tipificacionesHLA;

  try {
    await updatePaciente(pacienteActual.idPaciente, payload);
    pacienteActual = await getPacienteById(pacienteActual.idPaciente);

    showAlert("Antecedentes actualizados con éxito", "success");
    renderAntecedentesGenerales();
    toggleAntecedentesEditMode();
  } catch (err) {
    console.error("Error al actualizar antecedentes:", err);
    showAlert(`Error al actualizar los antecedentes: ${err.message}`, "danger");
  }
}

async function handleAddOrEditHistorial(e, tipo, modalId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const registro = Object.fromEntries(formData.entries());
  const indexStr = form.dataset.editingIndex;
  const index = indexStr !== undefined ? parseInt(indexStr, 10) : null;
  const isEditing = index !== null;
  const usuarioLogueado = getUsuarioLogueado();

  if (registro.fecha) registro.fecha = registro.fecha || null;
  if (registro.fechaRegistro)
    registro.fechaRegistro = registro.fechaRegistro || null;
  if (tipo === "crossmatch") {
    registro.antiHla1 = registro.antiHla1 ? parseInt(registro.antiHla1) : null;
    registro.antiHla2 = registro.antiHla2 ? parseInt(registro.antiHla2) : null;
    registro.antiMica = registro.antiMica ? parseInt(registro.antiMica) : null;
  }

  let lista;
  let esAntecedente = tipo === "trasplantes" || tipo === "transfusiones";
  let antecedente;

  if (esAntecedente) {
    if (
      !pacienteActual.antecedentes ||
      pacienteActual.antecedentes.length === 0
    ) {
      pacienteActual.antecedentes = [
        { listaTrasplantes: [], listaTransfusiones: [] },
      ];
    }
    antecedente = pacienteActual.antecedentes[0];

    if (tipo === "transfusiones" && registro.procesoDonacion) {
      antecedente.procesoDonacion = registro.procesoDonacion;
    }

    const nombreLista =
      tipo === "trasplantes" ? "listaTrasplantes" : "listaTransfusiones";
    if (!antecedente[nombreLista]) antecedente[nombreLista] = [];
    lista = antecedente[nombreLista];
  } else {
    const nombreLista =
      tipo === "crossmatch"
        ? "crossmatchContraPanel"
        : tipo === "tipificacionesHLA"
        ? "tipificacionesHLA"
        : tipo;
    if (!pacienteActual[nombreLista]) pacienteActual[nombreLista] = [];
    lista = pacienteActual[nombreLista];
  }

  let itemOriginal = null;
  if (isEditing && lista[index]) {
    itemOriginal = { ...lista[index] };
    const idKey = Object.keys(itemOriginal).find((key) =>
      key.toLowerCase().startsWith("id")
    );
    const originalId = idKey ? itemOriginal[idKey] : null;

    lista[index] = { ...itemOriginal, ...registro };
  } else if (!isEditing) {
    lista.push(registro);
  } else {
    console.error(`Índice de edición ${index} inválido para ${tipo}.`);
    showAlert(
      `Error interno: No se pudo encontrar el registro a editar.`,
      "danger"
    );
    return;
  }

  pacienteActual.completadoPor = usuarioLogueado
    ? { idUsuario: usuarioLogueado.idUsuario }
    : null;

  try {
    // Preparamos un payload limpio para el backend, quitando referencias circulares
    const payload = {
      ...pacienteActual,
      creadoPor: pacienteActual.creadoPor
        ? { idUsuario: pacienteActual.creadoPor.idUsuario }
        : null,
      completadoPor: pacienteActual.completadoPor,
      antecedentes:
        pacienteActual.antecedentes?.map((ant) => ({
          ...ant,
          usuario: ant.usuario ? { idUsuario: ant.usuario.idUsuario } : null,
          paciente: undefined,
        })) || [],
    };
    payload.dsa =
      payload.dsa?.map((d) => ({ ...d, paciente: undefined })) || [];
    payload.crossmatchContraPanel =
      payload.crossmatchContraPanel?.map((c) => ({
        ...c,
        paciente: undefined,
      })) || [];
    payload.tipificacionesHLA =
      payload.tipificacionesHLA?.map((h) => ({ ...h, paciente: undefined })) ||
      [];

    await updatePaciente(pacienteActual.idPaciente, payload);
    pacienteActual = await getPacienteById(pacienteActual.idPaciente);

    showAlert(
      `Registro de ${tipo} ${isEditing ? "actualizado" : "agregado"} con éxito`,
      "success"
    );
    renderAllHistorials();

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    form.reset();
    delete form.dataset.editingIndex;
  } catch (err) {
    console.error(`Error al guardar registro de ${tipo}:`, err);
    showAlert(
      `Error al guardar el registro de ${tipo}: ${err.message}`,
      "danger"
    );

    // Revertir el cambio local si falla la API
    if (isEditing && itemOriginal) {
      lista[index] = itemOriginal;
    } else if (!isEditing) {
      lista.pop();
    }
    renderAllHistorials();
  }
}

async function handleEliminarHistorial(tipo, index) {
  let lista;
  let item;
  let esAntecedente = tipo === "trasplantes" || tipo === "transfusiones";
  let antecedente;

  if (esAntecedente) {
    antecedente =
      pacienteActual?.antecedentes && pacienteActual.antecedentes.length > 0
        ? pacienteActual.antecedentes[0]
        : null;
    if (!antecedente) return;
    const nombreLista =
      tipo === "trasplantes" ? "listaTrasplantes" : "listaTransfusiones";
    lista = antecedente[nombreLista];
  } else {
    const nombreLista =
      tipo === "crossmatch"
        ? "crossmatchContraPanel"
        : tipo === "tipificacionesHLA"
        ? "tipificacionesHLA"
        : tipo;
    lista = pacienteActual ? pacienteActual[nombreLista] : null;
  }

  if (!Array.isArray(lista) || index < 0 || index >= lista.length) {
    console.error(
      `Índice ${index} fuera de rango o lista inválida para ${tipo} en handleEliminar`
    );
    return;
  }
  item = lista[index];

  const fechaItem = item.fecha || item.fechaRegistro || "este registro";
  const fechaFormateada =
    fechaItem instanceof Date
      ? fechaItem.toLocaleDateString()
      : typeof fechaItem === "string" && fechaItem !== "este registro"
      ? new Date(fechaItem).toLocaleDateString()
      : fechaItem;

  if (
    confirm(
      `¿Estás seguro de que deseas eliminar el registro de ${tipo} del ${fechaFormateada}?`
    )
  ) {
    const itemEliminado = lista.splice(index, 1)[0];

    const usuarioLogueado = getUsuarioLogueado();
    pacienteActual.completadoPor = usuarioLogueado
      ? { idUsuario: usuarioLogueado.idUsuario }
      : null;

    try {
      const payload = {
        ...pacienteActual,
        creadoPor: pacienteActual.creadoPor
          ? { idUsuario: pacienteActual.creadoPor.idUsuario }
          : null,
        completadoPor: pacienteActual.completadoPor,
        antecedentes:
          pacienteActual.antecedentes?.map((ant) => ({
            ...ant,
            usuario: ant.usuario ? { idUsuario: ant.usuario.idUsuario } : null,
            paciente: undefined,
          })) || [],
      };
      payload.dsa =
        payload.dsa?.map((d) => ({ ...d, paciente: undefined })) || [];
      payload.crossmatchContraPanel =
        payload.crossmatchContraPanel?.map((c) => ({
          ...c,
          paciente: undefined,
        })) || [];
      payload.tipificacionesHLA =
        payload.tipificacionesHLA?.map((h) => ({
          ...h,
          paciente: undefined,
        })) || [];

      await updatePaciente(pacienteActual.idPaciente, payload);
      pacienteActual = await getPacienteById(pacienteActual.idPaciente);

      showAlert("Registro eliminado con éxito", "success");
      renderAllHistorials();
    } catch (err) {
      console.error(`Error al eliminar registro de ${tipo}:`, err);
      showAlert(`Error al eliminar el registro: ${err.message}`, "danger");
      // Revertir el cambio local
      lista.splice(index, 0, itemEliminado);
      renderAllHistorials();
    }
  }
}

function handleEditarHistorial(tipo, index, modalId) {
  let lista;
  let item;
  let esAntecedente = tipo === "trasplantes" || tipo === "transfusiones";
  let antecedente;

  if (esAntecedente) {
    antecedente =
      pacienteActual?.antecedentes && pacienteActual.antecedentes.length > 0
        ? pacienteActual.antecedentes[0]
        : null;
    if (!antecedente) return;
    const nombreLista =
      tipo === "trasplantes" ? "listaTrasplantes" : "listaTransfusiones";
    lista = antecedente[nombreLista];
  } else {
    const nombreLista =
      tipo === "crossmatch"
        ? "crossmatchContraPanel"
        : tipo === "tipificacionesHLA"
        ? "tipificacionesHLA"
        : tipo;
    lista = pacienteActual ? pacienteActual[nombreLista] : null;
  }

  if (!Array.isArray(lista) || index < 0 || index >= lista.length) {
    console.error(
      `Índice ${index} fuera de rango o lista inválida para ${tipo} en handleEditarHistorial`
    );
    return;
  }
  item = lista[index];

  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;
  const form = modalElement.querySelector("form");
  if (!form) return;

  form.reset();

  for (const key in item) {
    if (form.elements[key]) {
      if (form.elements[key].type === "date" && item[key]) {
        try {
          // Ajuste para zona horaria
          const date = new Date(item[key]);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          form.elements[key].value = date.toISOString().split("T")[0];
        } catch (e) {
          form.elements[key].value = "";
        }
      } else {
        form.elements[key].value = item[key] ?? "";
      }
    }
  }

  // Caso especial para 'procesoDonacion' en 'transfusiones'
  if (
    tipo === "transfusiones" &&
    antecedente &&
    form.elements["procesoDonacion"]
  ) {
    form.elements["procesoDonacion"].value = antecedente.procesoDonacion || "";
  }

  form.dataset.editingIndex = index;
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
}

export async function initPacienteDetalleModule(id) {
  pacienteActual = null;
  const accordion = document.getElementById("historialAccordion");
  if (accordion && accordion._historialActionListener) {
    accordion.removeEventListener("click", accordion._historialActionListener);
    delete accordion._historialActionListener;
  }

  if (!id) {
    showAlert("No se especificó un ID de paciente.", "danger");
    loadModuleAndInit("pacientes_historial");
    return;
  }

  try {
    pacienteActual = await getPacienteById(id);
    if (!pacienteActual) {
      throw new Error("No se encontró el paciente con el ID proporcionado.");
    }

    limitarFechasAlDiaDeHoy();
    document.getElementById(
      "nombre-paciente-header"
    ).textContent = `Perfil de ${pacienteActual.nombre || "Paciente"} ${
      pacienteActual.apellido || ""
    }`;

    renderDatosPersonales();
    renderAntecedentesGenerales();
    renderAllHistorials(); // Renderiza tablas Y adjunta listeners de acción

    // Listeners principales
    document
      .getElementById("btn-volver-historial")
      ?.addEventListener("click", () =>
        loadModuleAndInit("pacientes_historial")
      );
    document
      .getElementById("btn-editar-personales")
      ?.addEventListener("click", toggleEditMode);
    document
      .getElementById("form-edit-paciente")
      ?.addEventListener("submit", handleEditSubmit);
    document
      .getElementById("btn-editar-antecedentes")
      ?.addEventListener("click", toggleAntecedentesEditMode);
    document
      .getElementById("form-edit-antecedentes")
      ?.addEventListener("submit", handleEditAntecedentesSubmit);

    const setupModalFormListener = (modalId, tipo) => {
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        console.warn(`Modal con ID "${modalId}" no encontrado.`);
        return;
      }
      const form = modalElement.querySelector("form");
      if (!form) {
        console.warn(`No se encontró <form> dentro de "${modalId}".`);
        return;
      }

      // Remove old listener if exists to prevent duplicates
      // (This requires storing a reference, or a more complex setup)
      // For simplicity, we assume init cleans up.

      form.addEventListener("submit", (e) =>
        handleAddOrEditHistorial(e, tipo, modalId)
      );
    };

    // Adjuntamos listeners para "Guardar" (Submit) en todos los modales
    setupModalFormListener("modalAgregarTrasplante", "trasplantes");
    setupModalFormListener("modalAgregarTransfusion", "transfusiones");
    setupModalFormListener("modalAgregarDsa", "dsa");
    setupModalFormListener("modalAgregarCrossmatch", "crossmatch");
    setupModalFormListener("modalAgregarHLA", "tipificacionesHLA");
  } catch (err) {
    console.error("Error al inicializar el perfil del paciente:", err);
    const appContainer = document.querySelector("#app");
    if (appContainer) {
      appContainer.innerHTML = `<div class="alert alert-danger m-4" role="alert">Error al cargar el perfil: ${err.message}.</div>`;
    } else {
      showAlert(
        `No se pudo cargar el perfil del paciente: ${err.message}`,
        "danger"
      );
    }
  }
}

// Adjunta un único listener delegado al acordeón para manejar botones de Editar/Eliminar
function attachHistorialActionListeners() {
  const accordion = document.getElementById("historialAccordion");
  if (!accordion) return;

  if (accordion._historialActionListener) {
    accordion.removeEventListener("click", accordion._historialActionListener);
  }

  const handleHistorialActions = (e) => {
    const target = e.target.closest("button.btn-editar, button.btn-eliminar");
    if (!target) return;

    e.stopPropagation();

    const { tipo, index, modal } = target.dataset;
    const numericIndex = parseInt(index, 10);
    if (isNaN(numericIndex) || numericIndex < 0) {
      console.error("Índice inválido:", index);
      return;
    }

    if (target.classList.contains("btn-eliminar")) {
      handleEliminarHistorial(tipo, numericIndex);
    } else if (target.classList.contains("btn-editar")) {
      if (!modal) {
        console.error(
          `Atributo 'data-modal' no encontrado en el botón editar.`
        );
        return;
      }
      handleEditarHistorial(tipo, numericIndex, modal);
    }
  };

  accordion.addEventListener("click", handleHistorialActions);
  accordion._historialActionListener = handleHistorialActions;
}
