// 1. IMPORTAMOS LAS FUNCIONES DE LA API, NO LOS MOCKS
import {
  getInformeDsaAPI,
  guardarObservacionDsaAPI,
  getInformeFamiliarAPI,
  getInformeHlaAPI,
  guardarObservacionHlaAPI,
} from "./api.js";
import { resetToHomeView } from "./sidebar.js";
import { showAlert } from "./alerts.js";
import { showLoader, hideLoader } from "./loader.js";

// ==========================================================
// === MÓDULO INFORME DSA
// ==========================================================
export function initInformeDsaModule() {
  const btnBuscar = document.getElementById("btnBuscarInforme");
  const btnDescargarPDF = document.getElementById("btnDescargarPDF");
  const reportVisualizer = document.getElementById("report-visualizer");

  const vizPaciente = document.getElementById("viz-paciente");
  const vizDni = document.getElementById("viz-dni");
  const vizMuestra = document.getElementById("viz-muestra");
  const vizMedico = document.getElementById("viz-medico");
  const inputObservaciones = document.getElementById("inputObservaciones");
  const tablaClase1Body = document.querySelector("#tabla-clase1 tbody");
  const tablaClase2Body = document.querySelector("#tabla-clase2 tbody");

  let datosActuales = null;

  if (btnBuscar) {
    // Convertido a ASYNC
    btnBuscar.addEventListener("click", async () => {
      const queryDni = document.getElementById("inputDni")?.value;
      const queryMuestra = document.getElementById("inputMuestra")?.value;

      // Usaremos DNI por ahora (como definimos en el backend)
      if (!queryDni) {
        showAlert("Por favor, ingrese un DNI para buscar.", "warning");
        return;
      }

      showLoader();
      try {
        const data = await getInformeDsaAPI(queryDni);
        cargarDatosVisualizacionDSA(data);
        inputObservaciones.value = data.dsa.observaciones || "";
      } catch (err) {
        console.error(err);
        showAlert(`Error al buscar el informe: ${err.message}`, "danger");
        reportVisualizer.classList.add("hidden");
      } finally {
        hideLoader();
      }
    });
  }

  if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener("click", async () => {
      if (!datosActuales) {
        showAlert("Primero debe buscar un paciente.", "warning");
        return;
      }

      const observaciones = inputObservaciones.value;
      const idDsa = datosActuales.dsa.idDsa;

      showLoader();
      try {
        // 1. GUARDAMOS LAS OBSERVACIONES
        await guardarObservacionDsaAPI(idDsa, observaciones);
        showAlert("Observaciones guardadas con éxito.", "success");

        // 2. SIMULAMOS LA DESCARGA (Próximo paso: JasperReports)
        console.log("Observaciones guardadas, iniciando descarga simulada...");
        alert(
          "Observaciones guardadas. La descarga real del PDF se implementará con JasperReports."
        );

        // (Aquí irá la llamada a JasperReports)
        // const idPaciente = datosActuales.dsa.idPaciente;
        // window.location.href = `http://localhost:8080/reporte/dsa/${idPaciente}/${idDsa}`;
      } catch (err) {
        console.error(err);
        showAlert(`Error al guardar observaciones: ${err.message}`, "danger");
      } finally {
        hideLoader();
      }
    });
  }

  document
    .getElementById("breadcrumb-inicio")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      resetToHomeView();
    });

  function cargarDatosVisualizacionDSA(data) {
    datosActuales = data;

    vizPaciente.textContent = data.dsa.nombrePaciente;
    vizDni.textContent = data.dsa.dniPaciente;
    vizMuestra.textContent = data.dsa.numeroMuestra;
    vizMedico.textContent = data.dsa.medicoSolicitante;

    tablaClase1Body.innerHTML = "";
    tablaClase2Body.innerHTML = "";

    // Separamos Clase1 y Clase2
    const clase1 = data.anticuerpos.filter((ac) => ac.tipo === "Clase1");
    const clase2 = data.anticuerpos.filter((ac) => ac.tipo === "Clase2");

    clase1.forEach((ac) => {
      const fila = `<tr><td>${ac.serologico}</td><td>${ac.alelico}</td><td>${ac.mfi}</td><td>${ac.resultado}</td></tr>`;
      tablaClase1Body.innerHTML += fila;
    });
    clase2.forEach((ac) => {
      const fila = `<tr><td>${ac.serologico}</td><td>${ac.alelico}</td><td>${ac.mfi}</td><td>${ac.resultado}</td></tr>`;
      tablaClase2Body.innerHTML += fila;
    });

    reportVisualizer.classList.remove("hidden");
  }
}

// ==========================================================
// === MÓDULO INFORME FAMILIAR (Aún con MOCK)
// ==========================================================
// (Dejamos este con MOCK hasta que programes su backend)
export function initInformeFamiliarModule() {
  const btnBuscar = document.getElementById("btnBuscarInforme");
  const btnDescargarPDF = document.getElementById("btnDescargarPDF");
  const reportVisualizer = document.getElementById("report-visualizer");

  const vizPaciente = document.getElementById("viz-paciente");
  const tablaAbcBody = document.querySelector("#tabla-familiar-abc tbody");
  const tablaDrqBody = document.querySelector("#tabla-familiar-drq tbody");

  let datosActuales = null;

  if (btnBuscar) {
    btnBuscar.addEventListener("click", async () => {
      // CAMBIAR ESTO POR LA LLAMADA A LA API CUANDO ESTÉ LISTA
      // const data = await getInformeFamiliarAPI(dni);
      // cargarDatosVisualizacionFamiliar(data);
      showAlert("Este módulo aún usa datos de simulación (MOCK).", "info");
      cargarDatosVisualizacionFamiliar(MOCK_DATOS_FAMILIAR);
    });
  }

  if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener("click", () => {
      alert("Simulación de descarga FAMILIAR");
    });
  }

  document
    .getElementById("breadcrumb-inicio")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      resetToHomeView();
    });

  function cargarDatosVisualizacionFamiliar(data) {
    datosActuales = data;
    vizPaciente.textContent = data.paciente.nombre;
    tablaAbcBody.innerHTML = "";
    tablaDrqBody.innerHTML = "";
    const crearFilaAbc = (actor) =>
      `<td>${actor.abc[0]}</td><td>${actor.abc[1]}</td><td>${actor.abc[2]}</td><td>${actor.abc[3]}</td><td>${actor.abc[4]}</td><td>${actor.abc[5]}</td>`;
    const crearFilaDrq = (actor) =>
      `<td>${actor.drq[0]}</td><td>${actor.drq[1]}</td><td>${actor.drq[2]}</td><td>${actor.drq[3]}</td><td>${actor.drq[4]}</td><td>${actor.drq[5]}</td><td>${actor.drq[6]}</td><td>${actor.drq[7]}</td><td>${actor.drq[8]}</td><td>${actor.drq[9]}</td>`;
    tablaAbcBody.innerHTML += `<tr><td><strong>Paciente</strong></td><td>${
      data.paciente.muestra
    }</td>${crearFilaAbc(data.paciente)}</tr>`;
    tablaDrqBody.innerHTML += `<tr><td><strong>Paciente</strong></td><td>${
      data.paciente.muestra
    }</td>${crearFilaDrq(data.paciente)}</tr>`;
    data.donantes.forEach((donante) => {
      tablaAbcBody.innerHTML += `<tr><td>${donante.nombre} (${
        donante.vinculo
      })</td><td>${donante.muestra}</td>${crearFilaAbc(donante)}</tr>`;
      tablaDrqBody.innerHTML += `<tr><td>${donante.nombre} (${
        donante.vinculo
      })</td><td>${donante.muestra}</td>${crearFilaDrq(donante)}</tr>`;
    });
    reportVisualizer.classList.remove("hidden");
  }
}

// ==========================================================
// === MÓDULO INFORME HLA
// ==========================================================
export function initInformeHlaModule() {
  const btnBuscar = document.getElementById("btnBuscarInforme");
  const btnDescargarPDF = document.getElementById("btnDescargarPDF");
  const reportVisualizer = document.getElementById("report-visualizer");
  const inputObservaciones = document.getElementById("inputObservaciones");

  let datosActuales = null; // Guardará la respuesta completa: { paciente: {...} }

  if (btnBuscar) {
    btnBuscar.addEventListener("click", async () => {
      const queryDni = document.getElementById("inputDni")?.value;
      if (!queryDni) {
        showAlert("Por favor, ingrese un DNI para buscar.", "warning");
        return;
      }

      showLoader();
      try {
        const data = await getInformeHlaAPI(queryDni);
        cargarDatosVisualizacionHla(data);

        // Precargamos las observaciones si ya existen
        inputObservaciones.value = data.paciente.observaciones || "";
      } catch (err) {
        console.error(err);
        showAlert(`Error al buscar el informe: ${err.message}`, "danger");
        reportVisualizer.classList.add("hidden");
      } finally {
        hideLoader();
      }
    });
  }

  if (btnDescargarPDF) {
    // --- EVENT LISTENER ACTUALIZADO ---
    btnDescargarPDF.addEventListener("click", async () => {
      if (!datosActuales || !datosActuales.paciente) {
        showAlert("Primero debe buscar un paciente.", "warning");
        return;
      }

      const observaciones = inputObservaciones.value;
      // El ID que guardamos en el DTO en el Paso 1
      const idHla = datosActuales.paciente.idHla;

      if (!idHla) {
        showAlert(
          "Error: No se pudo encontrar el ID del registro HLA para guardar.",
          "danger"
        );
        return;
      }

      showLoader();
      try {
        // 1. LLAMAMOS A LA NUEVA FUNCIÓN DE LA API
        await guardarObservacionHlaAPI(idHla, observaciones);
        showAlert("Observaciones guardadas con éxito.", "success");

        // 2. SIMULAMOS LA DESCARGA
        console.log(
          "Observaciones HLA guardadas, iniciando descarga simulada..."
        );
        alert(
          "Observaciones guardadas. La descarga real del PDF se implementará con JasperReports."
        );
      } catch (err) {
        console.error(err);
        showAlert(`Error al guardar observaciones: ${err.message}`, "danger");
      } finally {
        hideLoader();
      }
    });
  }

  document
    .getElementById("breadcrumb-inicio")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      resetToHomeView();
    });

  function cargarDatosVisualizacionHla(data) {
    datosActuales = data;
    const p = data.paciente;

    document.getElementById("viz-paciente").textContent = p.nombre;
    document.getElementById("viz-dni").textContent = p.dni;
    document.getElementById("viz-muestra").textContent = p.muestra;
    document.getElementById("viz-grupo").textContent = p.grupoSanguineo;
    document.getElementById("viz-hla-a1").textContent = p.hla.a1;
    document.getElementById("viz-hla-a2").textContent = p.hla.a2;
    document.getElementById("viz-hla-b1").textContent = p.hla.b1;
    document.getElementById("viz-hla-b2").textContent = p.hla.b2;
    document.getElementById("viz-hla-bw1").textContent = p.hla.bw1 || "-"; // Relleno si es null
    document.getElementById("viz-hla-bw2").textContent = p.hla.bw2 || "-"; // Relleno si es null
    document.getElementById("viz-hla-c1").textContent = p.hla.c1;
    document.getElementById("viz-hla-c2").textContent = p.hla.c2;
    document.getElementById("viz-hla-dr1").textContent = p.hla.dr1;
    document.getElementById("viz-hla-dr2").textContent = p.hla.dr2;
    document.getElementById("viz-hla-dq1").textContent = p.hla.dq1;
    document.getElementById("viz-hla-dq2").textContent = p.hla.dq2;
    document.getElementById("viz-hla-dp1").textContent = p.hla.dp1;
    document.getElementById("viz-hla-dp2").textContent = p.hla.dp2;
    reportVisualizer.classList.remove("hidden");
  }
}
