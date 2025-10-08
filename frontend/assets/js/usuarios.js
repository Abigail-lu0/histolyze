import { registrarUsuario, getTodosLosUsuarios, eliminarUsuario, actualizarUsuario } from "./auth.js";
import { showAlert } from "./alerts.js";
import { renderNavbarUsuario } from "./navbar.js";

let modalEditar = null;

// Función para dibujar la tabla de usuarios existentes
function renderUsuarios() {
    const usuarios = getTodosLosUsuarios();
    const tbody = document.querySelector("#usuariosTable tbody");
    if (!tbody) return;

    tbody.innerHTML = ""; // Limpiamos la tabla
    usuarios.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.dni}</td>
            <td>${user.nombre}</td>
            <td>${user.apellido}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-editar" data-dni="${user.dni}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-dni="${user.dni}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

export function initUsuarioModule() {
  const modalEl = document.getElementById('modalEditarUsuario');
  if (modalEl) {
    modalEditar = new bootstrap.Modal(modalEl);
  }

  initCrearUsuarioForm();
  initTablaUsuariosActions();
  renderUsuarios();
}

export function initCrearUsuarioForm() {
  const form = document.getElementById("formCrearUsuario");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      showAlert("Por favor completa todos los campos correctamente", "warning", 3000, "usuarioAlert");
      return;
    }

    const nuevoUsuario = {
      nombre: form.nombre.value.trim(),
      apellido: form.apellido.value.trim(),
      dni: form.dni.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      await registrarUsuario(nuevoUsuario);
      form.reset();
      form.classList.remove("was-validated");
      showAlert("Usuario creado correctamente", "success", 3000, "usuarioAlert");
      renderUsuarios();
    } catch (err) {
      showAlert(err || "Error al crear usuario", "danger", 3000, "usuarioAlert");
    }
  });
}

function initTablaUsuariosActions() {
    const tabla = document.querySelector("#usuariosTable tbody");
    if (!tabla) return;

    tabla.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const dni = e.target.dataset.dni;
            if (confirm(`¿Estás seguro de que deseas eliminar al usuario con DNI ${dni}?`)) {
                eliminarUsuario(dni);
                showAlert('Usuario eliminado con éxito', 'success');
                renderUsuarios(); // Refrescamos la tabla
            }
        }

        if (e.target.classList.contains('btn-editar')) {
            const dni = e.target.dataset.dni;
            const usuarios = getTodosLosUsuarios();
            const usuario = usuarios.find(u => u.dni === dni);

            if (usuario && modalEditar) {
                const form = document.getElementById('formEditarUsuario');
                form.dniOriginal.value = usuario.dni;
                form.dni.value = usuario.dni;
                form.nombre.value = usuario.nombre;
                form.apellido.value = usuario.apellido;
                modalEditar.show();
            }
        }
    });

    // Listener para el formulario DENTRO del modal de edición
    const formEditar = document.getElementById('formEditarUsuario');
    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            e.preventDefault();
            const dni = formEditar.dniOriginal.value;
            const datosActualizados = {
                nombre: formEditar.nombre.value,
                apellido: formEditar.apellido.value
            };

            actualizarUsuario(dni, datosActualizados);
            showAlert('Usuario actualizado con éxito', 'success');
            modalEditar.hide();
            renderUsuarios(); // Refrescamos la tabla
            renderNavbarUsuario(); // Refrescamos el navbar
        });
    }
}