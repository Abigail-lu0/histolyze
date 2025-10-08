import { showAlert } from "./alerts.js";
import { showLoader, hideLoader } from "./loader.js";

export function initHlaModule() {
  const form = document.getElementById("formHLA");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor, complete todos los campos correctamente", "warning", 3000, "formAlerts");
      return;
    }

    const hla = {
      fecha: form.fechaHLA.value,
      grupoSanguineo: form.grupoSanguineoHLA.value,
      A1: form.hlaA1H.value,
      A2: form.hlaA2H.value,
      B1: form.hlaB1H.value,
      B2: form.hlaB2H.value,
      C1: form.hlaC1H.value,
      C2: form.hlaC2H.value,
      DR1: form.hlaDR1H.value,
      DR2: form.hlaDR2H.value,
      DQA11: form.hlaDQA11H.value,
      DQA12: form.hlaDQA12H.value,
      DQB11: form.hlaDQB11H.value,
      DQB12: form.hlaDQB12H.value,
      DPA11: form.hlaDPA11H.value,
      DPA12: form.hlaDPA12H.value,
      DPB11: form.hlaDPB11H.value,
      DPB12: form.hlaDPB12H.value,
    };

    try {
      showLoader();
      await guardarHLA(hla);
      hideLoader();
      showAlert("HLA guardado correctamente", "success", 3000, "formAlerts");
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      hideLoader();
      showAlert("Error al guardar HLA", "danger", 3000, "formAlerts");
    }
  });
}

// Mock
async function guardarHLA(hla) {
  return Promise.resolve({ success: true });
}
