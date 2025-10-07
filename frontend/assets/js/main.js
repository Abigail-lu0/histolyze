import { getPacientes, crearPaciente } from "./api.js";
import { getUsuarioLogueado, logout } from "./auth.js";

// --- Verificar login ---
const usuario = getUsuarioLogueado();
if (!usuario && !window.location.href.includes("login.html")) {
  window.location.href = "login.html";
}

// --- Variables globales ---
let genericModal;

// --- DOMContentLoaded ---
document.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes
  Promise.all([
    loadComponent("components/navbar.html", "#navbar"),
    loadComponent("components/sidebar.html", "#sidebar"),
    loadComponent("components/modal.html", "body"),
    loadComponent("components/loader.html", "body"),
    loadComponent("components/alerts.html", "body"),
  ]).then(() => {
    initSidebarLinks();
    initModal();
    initPacienteForm();
    renderPacientes();
    initUserMenu();
  });
});

// --- Función para cargar componentes HTML ---
function loadComponent(url, selector) {
  return fetch(url)
    .then((res) => res.text())
    .then((html) => {
      if (selector === "body") {
        document.body.insertAdjacentHTML("beforeend", html);
      } else {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
      }
    });
}

// --- Sidebar ---
function initSidebarLinks() {
  const links = document.querySelectorAll("#sidebar .nav-link[data-module]");
  document
    .querySelectorAll("#sidebar .collapse")
    .forEach((el) => new bootstrap.Collapse(el, { toggle: false }));

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      const module = link.getAttribute("data-module");
      loadModule(`views/${module}.html`);
    });
  });
}

// --- Cargar módulo en #app ---
function loadModule(path) {
  const app = document.querySelector("#app");
  showLoader();
  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (app) app.innerHTML = html;
      hideLoader();

      // Inicializar formularios y tablas
      initPacienteForm();
      renderPacientes();

      // Inicializar perfil si es el módulo perfil
      if (path.includes("perfil.html")) {
        initPerfil();
      }

      // Inicializar creación de usuario si es el módulo crear usuarios
      if (path.includes("crear_usuarios.html")) {
        initCrearUsuarioForm(); 
      }
    })
    .catch((err) => {
      hideLoader();
      showAlert("Error al cargar módulo: " + err, "danger");
    });
}

// --- Loader ---
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// --- Alertas ---
function showAlert(
  message,
  type = "success",
  duration = 3000,
  containerId = "alerts-container"
) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;
  container.appendChild(alert);
  setTimeout(
    () => bootstrap.Alert.getOrCreateInstance(alert).close(),
    duration
  );
}

// --- Modal ---
function initModal() {
  const modalEl = document.getElementById("genericModal");
  if (modalEl) genericModal = new bootstrap.Modal(modalEl);

  document
    .getElementById("modalConfirmBtn")
    ?.addEventListener("click", () => hideModal());
}
function showModal(title = "Título", body = "Contenido") {
  if (!genericModal) return;
  const titleEl = document.getElementById("genericModalLabel");
  if (titleEl) titleEl.textContent = title;

  const bodyEl = document.querySelector("#genericModal .modal-body");
  if (bodyEl) bodyEl.innerHTML = body;

  genericModal.show();
}
function hideModal() {
  genericModal?.hide();
}

// --- Formulario de pacientes ---
function initPacienteForm() {
  const form = document.getElementById("formPaciente");
  if (!form) return;

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

    const paciente = {
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      dni: form.dni.value,
      fechaNacimiento: form.fechaNacimiento.value,
      sexo: form.sexo.value,
      telefono: form.telefono.value,
      domicilio: form.domicilio.value,
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
      renderPacientes();
    } catch (err) {
      hideLoader();
      showAlert("Error al guardar el paciente", "danger", 3000, "formAlerts");
    }
  });

  // Validaciones
  form.nombre?.setAttribute("pattern", "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$");
  form.apellido?.setAttribute("pattern", "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$");
  form.dni?.setAttribute("pattern", "^[0-9]{7,8}$");
  form.telefono?.setAttribute("pattern", "^[0-9]+$");
  form.domicilio?.setAttribute("pattern", "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ,.]+$");
}

// --- Tabla de pacientes ---
async function renderPacientes() {
  const pacientes = await getPacientes();
  const tableBody = document.querySelector("#pacientesTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  pacientes.forEach((p) => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    tr.innerHTML = `
      <td>${p.id}</td>
      <td class="nombre">${p.nombre}</td>
      <td class="apellido">${p.apellido}</td>
      <td class="dni">${p.dni}</td>
      <td class="fechaNacimiento">${p.fechaNacimiento}</td>
      <td class="sexo">${p.sexo}</td>
      <td class="telefono">${p.telefono}</td>
      <td class="domicilio">${p.domicilio}</td>
      <td><button class="btn btn-sm btn-warning btn-editar">Editar</button></td>
    `;
    tr.querySelector(".btn-editar").addEventListener("click", () =>
      editarPaciente(p.id)
    );
    tableBody.appendChild(tr);
  });
}

// --- Editar paciente ---
async function editarPaciente(id) {
  const pacientes = await getPacientes();
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) return;

  showModal(
    "Editar Paciente",
    `
    <form id="editPacienteForm" novalidate>
      <div class="row mb-2">
        <div class="col-md-6">
          <label>Nombre</label>
          <input type="text" class="form-control" name="nombre" value="${
            paciente.nombre
          }" required pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$">
        </div>
        <div class="col-md-6">
          <label>Apellido</label>
          <input type="text" class="form-control" name="apellido" value="${
            paciente.apellido
          }" required pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-4">
          <label>DNI</label>
          <input type="text" class="form-control" name="dni" value="${
            paciente.dni
          }" required pattern="^[0-9]{7,8}$">
        </div>
        <div class="col-md-4">
          <label>Fecha Nacimiento</label>
          <input type="date" class="form-control" name="fechaNacimiento" value="${
            paciente.fechaNacimiento
          }" required>
        </div>
        <div class="col-md-4">
          <label>Sexo</label>
          <select class="form-select" name="sexo" required>
            <option value="M" ${
              paciente.sexo === "M" ? "selected" : ""
            }>Masculino</option>
            <option value="F" ${
              paciente.sexo === "F" ? "selected" : ""
            }>Femenino</option>
            <option value="O" ${
              paciente.sexo === "O" ? "selected" : ""
            }>Otro</option>
          </select>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-6">
          <label>Teléfono</label>
          <input type="text" class="form-control" name="telefono" value="${
            paciente.telefono
          }" required pattern="^[0-9]+$">
        </div>
        <div class="col-md-6">
          <label>Domicilio</label>
          <input type="text" class="form-control" name="domicilio" value="${
            paciente.domicilio
          }" required pattern="^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ,.]+$">
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-2">Guardar Cambios</button>
    </form>
    `
  );

  const form = document.getElementById("editPacienteForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosActualizados = {
      ...paciente,
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      dni: form.dni.value,
      fechaNacimiento: form.fechaNacimiento.value,
      sexo: form.sexo.value,
      telefono: form.telefono.value,
      domicilio: form.domicilio.value,
    };

    try {
      await actualizarPaciente(datosActualizados);
      hideModal();
      showAlert(
        "Paciente actualizado correctamente",
        "success",
        3000,
        "formAlerts"
      );

      // Actualizar solo la fila
      const fila = document.querySelector(
        `#pacientesTable tbody tr[data-id="${paciente.id}"]`
      );
      if (fila) {
        fila.querySelector(".nombre").textContent = datosActualizados.nombre;
        fila.querySelector(".apellido").textContent =
          datosActualizados.apellido;
        fila.querySelector(".dni").textContent = datosActualizados.dni;
        fila.querySelector(".fechaNacimiento").textContent =
          datosActualizados.fechaNacimiento;
        fila.querySelector(".sexo").textContent = datosActualizados.sexo;
        fila.querySelector(".telefono").textContent =
          datosActualizados.telefono;
        fila.querySelector(".domicilio").textContent =
          datosActualizados.domicilio;
      }
    } catch (err) {
      showAlert(
        "Error al actualizar el paciente",
        "danger",
        3000,
        "formAlerts"
      );
    }
  });
}

// --- Mock actualización ---
async function actualizarPaciente(paciente) {
  return Promise.resolve({ success: true });
}

// --- Navbar usuario ---
function initUserMenu() {
  const usuarioBtn = document.getElementById("userMenu");
  const logoutBtn = document.querySelector(".dropdown-item.text-danger");

  const usuario = getUsuarioLogueado();
  if (!usuario && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  }

  const perfilLink = document.querySelector(
    '.dropdown-item[data-module="perfil"]'
  );
  perfilLink?.addEventListener("click", (e) => {
    e.preventDefault();
    loadModule("views/perfil.html").then(() => {
      initPerfil(); // inicializa el formulario de perfil
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "login.html";
    });
  }
}

// --- Inicializar perfil ---
function initPerfil() {
  const usuario = getUsuarioLogueado();
  if (!usuario) return;

  // Mostrar datos
  document.getElementById("datoNombre").textContent = usuario.nombre;
  document.getElementById("datoApellido").textContent = usuario.apellido;
  document.getElementById("datoDni").textContent = usuario.dni;

  const btnEditar = document.getElementById("btnEditarPerfil");
  const formEditar = document.getElementById("formEditarPerfil");
  const btnCancelar = document.getElementById("btnCancelarEdicion");

  // Mostrar formulario al hacer clic en "Editar Contraseña"
  btnEditar.addEventListener("click", () => {
    formEditar.classList.remove("d-none");
    btnEditar.classList.add("d-none");
  });

  // Cancelar edición
  btnCancelar.addEventListener("click", () => {
    formEditar.classList.add("d-none");
    btnEditar.classList.remove("d-none");
    formEditar.reset();
  });

  // Manejar envío del formulario
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = formEditar.password.value;
    const confirmPassword = formEditar.confirmPassword.value;

    if (password !== confirmPassword) {
      showAlert("Las contraseñas no coinciden", "warning");
      return;
    }

    const usuarioActualizado = { ...usuario, password };

    try {
      await actualizarUsuario(usuarioActualizado);
      showAlert("Contraseña actualizada correctamente", "success");
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      formEditar.reset();
      formEditar.classList.add("d-none");
      btnEditar.classList.remove("d-none");
    } catch (err) {
      showAlert("Error al actualizar la contraseña", "danger");
    }
  });
}

// --- Mock de actualización de usuario ---
async function actualizarUsuario(usuario) {
  // Aquí iría tu llamada a backend
  return Promise.resolve({ success: true });
}

import { crearUsuario, getUsuarios } from "./api.js";

function renderUsuarios() {
  const tbody = document.querySelector("#usuariosTable tbody");
  if (!tbody) return;

  getUsuarios().then((usuarios) => {
    tbody.innerHTML = "";
    usuarios.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.dni}</td>
        <td>${u.nombre}</td>
        <td>${u.apellido}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

export function initCrearUsuarioForm() {
  const form = document.getElementById("formCrearUsuario");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert(
        "Por favor completa todos los campos correctamente",
        "warning",
        3000,
        "usuarioAlert"
      );
      return;
    }

    const nuevoUsuario = {
      nombre: form.nombre.value.trim(),
      apellido: form.apellido.value.trim(),
      dni: form.dni.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      await crearUsuario(nuevoUsuario); // Guarda en localStorage
      form.reset();
      form.classList.remove("was-validated");
      showAlert(
        "Usuario creado correctamente",
        "success",
        3000,
        "usuarioAlert"
      );
      renderUsuarios(); // Actualiza la tabla
    } catch (err) {
      showAlert(
        err || "Error al crear usuario",
        "danger",
        3000,
        "usuarioAlert"
      );
    }
  });

  renderUsuarios(); // Cargar usuarios existentes al inicio
}
