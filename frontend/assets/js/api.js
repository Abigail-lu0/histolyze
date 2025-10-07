// assets/js/api.js
const API_BASE = "http://localhost:8080/api"; // <- ajustá si tu back usa otro puerto o path

// Mocks (fallback)
function fetchPacientesMock() {
  return Promise.resolve([
    { id: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", fechaNacimiento: "1990-06-01", sexo: "M", telefono: "987654321", domicilio: "Calle Luz 123" },
    { id: 2, nombre: "Ana", apellido: "Gómez", dni: "87654321", fechaNacimiento: "1990-01-01", sexo: "F", telefono: "123456789", domicilio: "Calle Falsa 123" },
  ]);
}

// GET /pacientes
export async function getPacientes() {
  try {
    const res = await fetch(`${API_BASE}/pacientes`);
    if (!res.ok) throw new Error("Response not ok");
    return await res.json();
  } catch (err) {
    console.warn("getPacientes: backend unreachable, using mock", err);
    return fetchPacientesMock();
  }
}

// POST /pacientes
export async function crearPaciente(paciente) {
  try {
    const res = await fetch(`${API_BASE}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("crearPaciente: backend unreachable, simulating save", err);
    // fallback: simulate success
    return Promise.resolve({ success: true });
  }
}

// Usuarios: crear y listar (intenta back, sino localStorage)
export async function crearUsuario(usuario) {
  try {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error: ${res.status} ${txt}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("crearUsuario: backend unreachable, saving to localStorage", err);
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (usuarios.some(u => u.dni === usuario.dni)) {
      return Promise.reject("El DNI ya está registrado");
    }
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return Promise.resolve({ success: true });
  }
}

export async function getUsuarios() {
  try {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    console.warn("getUsuarios: backend unreachable, using localStorage", err);
    return JSON.parse(localStorage.getItem("usuarios") || "[]");
  }
}
