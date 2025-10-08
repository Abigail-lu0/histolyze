import { loginAPI } from './api.js';

function getUsuarios() {
  const usuariosStr = localStorage.getItem("usuarios");
  if (!usuariosStr) {
    // Si no hay usuarios en localStorage, creamos una lista inicial
    const usuariosIniciales = [
      { dni: "12345678", password: "1234", nombre: "Homero", apellido: "Simpson" },
      { dni: "87654321", password: "abcd", nombre: "Marge", apellido: "Simpson" },
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
  }
  return JSON.parse(usuariosStr);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export async function login(dni, password) {
  try {
    const data = await loginAPI(dni, password);
    if (data.token) {
      // Guardamos el token en localStorage. Este token es la "llave"
      // que usaremos para demostrar que estamos autenticados.
      localStorage.setItem("authToken", data.token);
      
      // Opcional: El backend podría devolver también los datos del usuario
      // localStorage.setItem("usuarioLogueado", JSON.stringify(data.usuario));
      
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function registrarUsuario(nuevoUsuario) {
  const usuarios = getUsuarios();
  if (usuarios.some(u => u.dni === nuevoUsuario.dni)) {
    // Lanza un error si el DNI ya existe
    throw new Error("El DNI ya está registrado.");
  }
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

export function cambiarContraseña(dni, nuevaContraseña) {
  const usuarios = getUsuarios();
  const usuarioIndex = usuarios.findIndex(u => u.dni === dni);

  if (usuarioIndex !== -1) {
    // Si se encuentra el usuario, actualiza su contraseña
    usuarios[usuarioIndex].password = nuevaContraseña;
    guardarUsuarios(usuarios); // Guarda la lista actualizada
    return true;
  }
  
  // Devuelve false si el usuario no se encontró (esto no debería pasar si está logueado)
  return false;
}

export function getUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
}

export function logout() {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "login.html"; // Redirige al login
}