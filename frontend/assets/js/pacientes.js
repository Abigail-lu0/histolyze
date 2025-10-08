import { getPacientes, crearPaciente } from "./api.js";
import { showAlert } from "./alerts.js";
import { showLoader, hideLoader } from "./loader.js";
import { loadModuleAndInit } from "./sidebar.js";
import { initAntecedentesModule } from "./antecedentes.js";
import { getUsuarioLogueado } from "./auth.js";

function limitarFechas() {
    const hoy = new Date().toISOString().split('T')[0];
    const form = document.getElementById("formPaciente");
    if (form) {
        form.querySelectorAll('input[type="date"]').forEach(input => {
            input.max = hoy;
        });
    }
}

export function initPacienteModule() {
  const form = document.getElementById("formPaciente");
  if (form) {
    initPacienteForm(form);
    initAntecedentesModule();
    limitarFechas();
  }

  renderPacientes();
  initSearchInputs();
}

function initPacienteForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert(
        "Por favor, completa todos los campos correctamente",
        "warning",
        3000,
        "formAlerts"
      );
      return;
    }

    const usuarioLogueado = getUsuarioLogueado();

    // Objeto 'paciente' con el 'antecedente' anidado, tal como lo define tu modelo de datos.
    const paciente = {
      // Datos que pertenecen a la tabla Paciente
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      dni: form.dni.value,
      fechaNacimiento: form.fechaNacimiento.value,
      telefono: form.telefono.value,
      domicilio: form.domicilio.value,
      numMuestra: form.muestra.value,
      mutual: form.mutual.value,
      centroTx: form.tx.value,
      centroDialisis: form.dialisis.value,
      medicoSolicitante: form.medico.value,
      creadoPor: usuarioLogueado
        ? `${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`
        : "Sistema",

      // Objeto anidado que se guardará en la tabla Antecedente.
      // Se envía como un array porque un paciente puede tener más de uno a futuro.
      antecedentes: [
        {
          diagnostico: form.diagnostico.value,
          medicacion: form.medicacion.value,
          embarazos: form.cantidadEmbarazos.value || 0,
          // Los arrays de transfusiones y trasplantes se inicializan vacíos dentro del antecedente.
          transfusiones: [],
          trasplantes: [],
        },
      ],
    };

    try {
      showLoader();
      await crearPaciente(paciente);
      hideLoader();
      showAlert(
        "Paciente guardado correctamente",
        "success",
        3000,
        "formAlerts"
      );
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      hideLoader();
      console.error("Error al guardar el paciente:", err);
      showAlert("Error al guardar el paciente", "danger", 3000, "formAlerts");
    }
  });
}

function initSearchInputs() {
  const searchDni = document.getElementById("searchDni");
  if (searchDni) {
    searchDni.addEventListener("input", renderPacientes);
  }

  const searchMuestra = document.getElementById("searchMuestra");
  if (searchMuestra) {
    searchMuestra.addEventListener("input", renderPacientes);
  }
}

export async function renderPacientes() {
  const tbody = document.querySelector("#pacientesTable tbody");
  if (!tbody) return;

  try {
    const pacientes = await getPacientes();
    const dniFilter = document.getElementById("searchDni")?.value.trim() || "";
    const muestraFilter =
      document.getElementById("searchMuestra")?.value.trim() || "";

    tbody.innerHTML = "";

    pacientes
      .filter(
        (p) =>
          (!dniFilter || p.dni.includes(dniFilter)) &&
          (!muestraFilter || (p.numMuestra || "").includes(muestraFilter))
      )
      .forEach((p) => {
        const tr = document.createElement("tr");
        tr.dataset.id = p.idPaciente;
        tr.innerHTML = `
          <td>${p.idPaciente}</td>
          <td>${p.nombre}</td>
          <td>${p.apellido}</td>
          <td>${p.dni}</td>
          <td>${p.numMuestra || ""}</td>
          <td>${p.centroTx || ""}</td>
          <td>${p.medicoSolicitante || ""}</td> <td class="text-end">
            <button class="btn btn-sm btn-info btn-ver">Ver Perfil</button>
          </td>
        `;
        tr.querySelector(".btn-ver").addEventListener("click", () =>
          verPerfilPaciente(p.idPaciente)
        );
        tbody.appendChild(tr);
      });
  } catch (err) {
    console.error("Error al renderizar pacientes:", err);
    showAlert("Error al cargar pacientes", "danger");
  }
}

function verPerfilPaciente(pacienteId) {
  loadModuleAndInit("pacientes_detalle", pacienteId);
}
