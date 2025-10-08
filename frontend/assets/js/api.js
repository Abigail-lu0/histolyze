// assets/js/api.js
const API_BASE = "http://localhost:8080/api"; // Ajustar según tu back

// --- Pacientes ---
// GET /pacientes
export async function getPacientes() {
  try {
    const res = await fetch(`${API_BASE}/pacientes`);
    if (!res.ok) throw new Error("Error al obtener pacientes");
    return await res.json();
  } catch (err) {
    console.warn("getPacientes: backend unreachable, usando mock", err);
    return [
      { id: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", fechaNacimiento: "1990-06-01", sexo: "M", telefono: "987654321", domicilio: "Calle Luz 123", nroMuestra:"001", centroTx:"Centro A", medicoSolicitante:"Dr. A", antecedentes:{diagnostico:"...", medicacion:"..."}, hla:[], dsa:[], crossmatch:[], trasplantes:[], transfusiones:[] }
    ];
  }
}

// POST /pacientes
export async function crearPaciente(paciente) {
  try {
    const res = await fetch(`${API_BASE}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Error al crear paciente");
    }
    return await res.json();
  } catch (err) {
    console.error("crearPaciente:", err);
    throw err;
  }
}

// GET /pacientes/:id
export async function getPacienteById(id) {
  try {
    const res = await fetch(`${API_BASE}/pacientes/${id}`);
    if (!res.ok) throw new Error("Paciente no encontrado");
    return await res.json();
  } catch (err) {
    console.warn("getPacienteById fallback mock", err);
    return [
      { id: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", fechaNacimiento: "1990-06-01", sexo: "M", telefono: "987654321", domicilio: "Calle Luz 123", nroMuestra:"001", centroTx:"Centro A", medicoSolicitante:"Dr. A", antecedentes:{diagnostico:"...", medicacion:"..."}, hla:[], dsa:[], crossmatch:[], trasplantes:[], transfusiones:[] }
    ].find(p => p.id == id);
  }
}

// --- Usuarios ---
// POST /usuarios
export async function crearUsuario(usuario) {
  try {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Error al crear usuario");
    }
    return await res.json();
  } catch (err) {
    console.warn("crearUsuario fallback localStorage", err);
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (usuarios.some(u => u.dni === usuario.dni)) {
      return Promise.reject("El DNI ya está registrado");
    }
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return Promise.resolve({ success: true });
  }
}

// GET /usuarios
export async function getUsuarios() {
  try {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return await res.json();
  } catch (err) {
    console.warn("getUsuarios fallback localStorage", err);
    return JSON.parse(localStorage.getItem("usuarios") || "[]");
  }
}

// PUT /pacientes/:id
export async function updatePaciente(id, pacienteData) {
  try {
    const res = await fetch(`${API_BASE}/pacientes/${id}`, {
      method: "PUT", // Usamos PUT para una actualización completa del objeto
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pacienteData)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Error al actualizar el paciente");
    }
    return await res.json();
  } catch (err) {
    console.error("updatePaciente:", err);
    throw err;
  }
}