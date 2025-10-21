import { getPacientes } from "./api.js";
import { showAlert } from "./alerts.js";
import { showLoader, hideLoader } from "./loader.js";

/**
 * Carga la lista de pacientes desde la API y la Muestra
 * en el <select> del formulario HLA.
 */
async function cargarPacientesEnSelect() {
  // Asumimos que el <select> tiene este ID, como en el HTML que te mostré.
  const select = document.getElementById("pacienteSelectHLA");
  if (!select) return;

  try {
    // Reutilizamos tu función de api.js en lugar de 'fetch'
    const pacientes = await getPacientes();

    // Limpia opciones existentes (excepto la primera de placeholder)
    select.innerHTML =
      '<option value="" disabled selected>Seleccione un paciente...</option>';

    // Llena el select con los pacientes
    pacientes.forEach((paciente) => {
      // Usamos los campos que vimos en tu 'paciente.js'
      const option = document.createElement("option");
      option.value = paciente.idPaciente;
      option.textContent = `${paciente.nombre} ${paciente.apellido}`;
      // Guardamos el número de muestra en el 'dataset' de la opción
      option.dataset.numeroMuestra = paciente.numeroMuestra || "";
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error en cargarPacientesEnSelect:", error);
    showAlert(
      "No se pudieron cargar los pacientes.",
      "danger",
      4000,
      "formAlertsHLA"
    );
  }
}

/**
 * Inicializa el módulo HLA:
 * 1. Carga los pacientes en el dropdown.
 * 2. Configura el listener para guardar el formulario.
 */
export function initHlaModule() {
  const form = document.getElementById("formHLA");
  if (!form) return;

  // Carga los pacientes en el select
  cargarPacientesEnSelect();

  // Listener para auto-popular el número de muestra
  const selectPaciente = document.getElementById("pacienteSelectHLA");
  const inputNumeroMuestra = document.getElementById("numeroMuestraHLA");

  if (selectPaciente && inputNumeroMuestra) {
    selectPaciente.addEventListener("change", (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const numeroMuestra = selectedOption.dataset.numeroMuestra || "";

      inputNumeroMuestra.value = numeroMuestra;
      inputNumeroMuestra.readOnly = !!numeroMuestra;
    });
  }

  // Listener del submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert(
        "Por favor, complete todos los campos obligatorios",
        "warning",
        3000,
        "formAlertsHLA"
      );
      return;
    }

    // 1. Obtener ID del paciente y nombre de muestra
    const idPaciente = form.pacienteSelectHLA.value;
    const numeroMuestra = form.numeroMuestraHLA.value;

    // 2. Crear el objeto con los nombres DE LA CLASE JAVA (TipificacionesHLA.java)
    const hlaData = {
      // 1. Leemos del input 'numeroMuestraHLA'
      // 2. Lo asignamos a 'nombreMuestra' (el campo de tu clase Java 'TipificacionesHLA')
      numeroMuestra: form.numeroMuestraHLA.value,
      fechaRegistro: form.fechaHLA.value,
      grupoSanguineo: form.grupoSanguineoHLA.value,

      locusA01: form.hlaA1H.value,
      locusA02: form.hlaA2H.value,
      locusB01: form.hlaB1H.value,
      locusB02: form.hlaB2H.value,
      locusC01: form.hlaC1H.value,
      locusC02: form.hlaC2H.value,
      locusDR01: form.hlaDR1H.value,
      locusDR02: form.hlaDR2H.value,
      locusDQA01: form.hlaDQA11H.value,
      locusDQA02: form.hlaDQA12H.value,
      locusDQB101: form.hlaDQB11H.value,
      locusDQB102: form.hlaDQB12H.value,
      locusDPA01: form.hlaDPA11H.value,
      locusDPA02: form.hlaDPA12H.value,
      locusDPB101: form.hlaDPB11H.value,
      locusDPB102: form.hlaDPB12H.value,
    };

    try {
      showLoader();
      // 3. Llamar a la función real de guardado
      await guardarHLA(idPaciente, hlaData);
      hideLoader();
      showAlert("HLA guardado correctamente", "success", 3000, "formAlertsHLA");
      form.reset();
      form.classList.remove("was-validated");
      selectPaciente.value = "";
      inputNumeroMuestra.readOnly = false;
    } catch (err) {
      hideLoader();
      console.error("Error al guardar:", err);
      showAlert(
        err.message || "Error al guardar HLA",
        "danger",
        4000,
        "formAlertsHLA"
      );
    }
  });
}

// Envía la tipificación HLA a la API para guardarla.
async function guardarHLA(idPaciente, hlaData) {
  // Usamos el endpoint del Controller: /api/pacientes/{id}/hla
  const url = `/api/pacientes/${idPaciente}/hla`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hlaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error del servidor: ${response.statusText}`
    );
  }

  return response.json();
}
