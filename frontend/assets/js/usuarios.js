// Función para mostrar alerta
function showAlert(message, type = "success", duration = 3000) {
  const container = document.getElementById("usuarioAlert");
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;

  setTimeout(() => {
    container.innerHTML = "";
  }, duration);
}

// Guardar usuario en localStorage
function crearUsuario(usuario) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  if (usuarios.some((u) => u.dni === usuario.dni)) {
    throw "El DNI ya está registrado";
  }

  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Obtener usuarios
function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

// Renderizar tabla
function renderUsuarios() {
  const usuarios = getUsuarios();
  const tbody = document.querySelector("#usuariosTable tbody");
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
}

// Inicializar formulario
function initCrearUsuarioForm() {
  const form = document.getElementById("formCrearUsuario");

  // Evitar que recargue la página
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const nuevoUsuario = {
      nombre: form.nombre.value.trim(),
      apellido: form.apellido.value.trim(),
      dni: form.dni.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      crearUsuario(nuevoUsuario);
      form.reset();
      showAlert("Usuario creado correctamente", "success");
      renderUsuarios();
    } catch (err) {
      showAlert(err, "danger");
    }
  });
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  initCrearUsuarioForm();
  renderUsuarios();
});
