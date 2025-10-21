import { getPacientes, guardarCrossmatchAPI } from "./api.js";
import { showAlert } from "./alerts.js";
import { showLoader, hideLoader } from "./loader.js";

/**
 * Carga pacientes en el select del formulario Crossmatch
 */
async function cargarPacientesEnSelect() {
  const select = document.getElementById("pacienteSelectCrossmatch");
  if (!select) return;

  try {
    const pacientes = await getPacientes(); 
    
    select.innerHTML = '<option value="" disabled selected>Seleccione un paciente...</option>';

    pacientes.forEach(paciente => {
      const option = document.createElement('option');
      option.value = paciente.idPaciente;
      option.textContent = `${paciente.nombre} ${paciente.apellido}`;
      option.dataset.numeroMuestra = paciente.numeroMuestra || "";
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Error en cargarPacientesEnSelect:', error);
    showAlert("No se pudieron cargar los pacientes.", "danger", 4000, "formAlertsCrossmatch");
  }
}

/**
 * Inicializa el módulo Crossmatch
 */
export function initCrossmatchModule() {
  const form = document.getElementById("formCrossmatch");
  if (!form) return;

  // Carga los pacientes
  cargarPacientesEnSelect();

  // Listener para auto-popular el número de muestra
  const selectPaciente = document.getElementById("pacienteSelectCrossmatch");
  const inputNumeroMuestra = document.getElementById("numeroMuestraCrossmatch");

  if (selectPaciente && inputNumeroMuestra) {
    selectPaciente.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const numeroMuestra = selectedOption.dataset.numeroMuestra || "";
      
      inputNumeroMuestra.value = numeroMuestra;
      // Lo ponemos readonly (ya lo puse en el HTML, pero reforzamos)
      inputNumeroMuestra.readOnly = !!numeroMuestra;
    });
  }

  // Listener del submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor, complete todos los campos obligatorios", "warning", 3000, "formAlertsCrossmatch");
      return;
    }

    const idPaciente = form.pacienteSelectCrossmatch.value;

    // Crear el objeto con los nombres DE LA CLASE JAVA (CrossmatchContraPanel.java)
    const crossmatchData = {
      fecha: form.fecha.value,
      numeroMuestra: form.numeroMuestraCrossmatch.value,
      antiHla1: parseInt(form.antiHla1.value, 10),
      antiHla2: parseInt(form.antiHla2.value, 10),
      antiMica: parseInt(form.antiMica.value, 10),
      anticuerposNoConfirmados: form.anticuerposNoConfirmados.value
    };

    try {
      showLoader();
      await guardarCrossmatch(idPaciente, crossmatchData); 
      hideLoader();
      showAlert("Crossmatch guardado correctamente", "success", 3000, "formAlertsCrossmatch");
      form.reset();
      form.classList.remove("was-validated");
      selectPaciente.value = "";
      inputNumeroMuestra.readOnly = true; // Volver a bloquear
    } catch (err) {
      hideLoader();
      console.error('Error al guardar:', err);
      showAlert(err.message || "Error al guardar Crossmatch", "danger", 4000, "formAlertsCrossmatch");
    }
  });
}

/**
 * Envía el Crossmatch a la API
 */
async function guardarCrossmatch(idPaciente, crossmatchData) {
  return guardarCrossmatchAPI(idPaciente, crossmatchData);
}