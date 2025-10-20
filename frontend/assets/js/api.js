import { getToken, logout } from './auth.js';

const API_BASE = "http://localhost:8080/api";

async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        logout();
      }
      const errorText = await response.text();
      throw new Error(errorText || `Error en la petición: ${response.status}`);
    }

    if (response.status === 204) {
        return { success: true };
    }
    
    return await response.json();
  } catch (err) {
    console.error(`Error en fetchAPI para ${endpoint}:`, err);
    throw err;
  }
}

// --- Autenticación ---
export async function loginAPI(dni, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni, password })
  });
  if (!response.ok) {
      throw new Error("Credenciales inválidas");
  }
  return response.json();
}

export async function registerAPI(usuario) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al registrar usuario");
    }
    return response.json();
}

// --- Pacientes ---
export function getPacientes() { return fetchAPI('/pacientes'); }
export function getPacienteById(id) { return fetchAPI(`/pacientes/${id}`); }
export function crearPaciente(paciente) { return fetchAPI('/pacientes', { method: 'POST', body: JSON.stringify(paciente) }); }
export function updatePaciente(id, pacienteData) { return fetchAPI(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(pacienteData) }); }

// --- Usuarios ---
export function getUsuariosAPI() {
  return fetchAPI('/usuarios');
}

export function deleteUsuarioAPI(id) {
  return fetchAPI(`/usuarios/${id}`, { method: 'DELETE' });
}

// --- NUEVA FUNCIÓN PARA ACTUALIZAR USUARIO ---
export function updateUsuarioAPI(id, datosUsuario) {
  return fetchAPI(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datosUsuario)
  });
}

// --- NUEVA FUNCIÓN PARA CAMBIAR CONTRASEÑA ---
export function changePasswordAPI(datosPassword) {
  // Asumiendo que el backend tiene un endpoint como '/auth/change-password'
  return fetchAPI('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(datosPassword)
  });
}