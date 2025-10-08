import { registrarUsuario } from "./auth.js";
import { showAlert } from "./alerts.js";

export function initUsuarioModule() {
  initCrearUsuarioForm();
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
    } catch (err) {
      showAlert(err || "Error al crear usuario", "danger", 3000, "usuarioAlert");
    }
  });
}
