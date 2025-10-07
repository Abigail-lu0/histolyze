// Mocks actuales
function fetchPacientes() {
  return Promise.resolve([
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      dni: "12345678",
      fechaNacimiento: "1990-06-01",
      sexo: "M",
      telefono: "987654321",
      domicilio: "Calle Luz 123",
    },
    {
      id: 2,
      nombre: "Ana",
      apellido: "Gómez",
      dni: "87654321",
      fechaNacimiento: "1990-01-01",
      sexo: "M",
      telefono: "123456789",
      domicilio: "Calle Falsa 123",
    },
  ]);
}

function savePaciente(data) {
  return Promise.resolve({ success: true });
}

// Export para usar en main.js
export async function getPacientes() {
  // cambiar a fetch real cuando backend esté listo:
  // return fetch("/api/pacientes").then(res => res.json());
  return fetchPacientes();
}

export async function crearPaciente(paciente) {
  // cambiar a fetch real cuando backend esté listo:
  /*
  return fetch("/api/pacientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente)
  }).then(res => res.json());
  */
  return savePaciente(paciente);
}

export async function crearUsuario(usuario) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  if (usuarios.some((u) => u.dni === usuario.dni)) {
    return Promise.reject("El DNI ya está registrado");
  }

  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return Promise.resolve({ success: true });
}

export async function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}
