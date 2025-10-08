import { loginAPI } from './api.js'; // Asumimos que esta función existe en api.js

function getUsuarios() {
  const usuariosStr = localStorage.getItem("usuarios");
  if (!usuariosStr) {
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
    // Intenta el login con la API primero
    const data = await loginAPI(dni, password);
    if (data && data.token) {
      localStorage.setItem("authToken", data.token);
      // Aquí el backend debería devolver los datos del usuario para guardarlos
      // localStorage.setItem("usuarioLogueado", JSON.stringify(data.usuario));
      return true;
    }
    return false;
  } catch (error) {
    // --- LÓGICA DE RESPALDO ---
    // Si la API falla (porque no está lista), usamos los usuarios locales
    console.warn("API de login no disponible. Usando fallback de localStorage.");
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.dni === dni && u.password === password);
    if (usuario) {
      // Guardamos el usuario logueado (sin la contraseña)
      const { password, ...usuarioSinPassword } = usuario;
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSinPassword));
      return true;
    }
    return false;
  }
}

export async function registrarUsuario(nuevoUsuario) {
  const usuarios = getUsuarios();
  if (usuarios.some(u => u.dni === nuevoUsuario.dni)) {
    throw new Error("El DNI ya está registrado.");
  }
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

export function actualizarUsuario(dni, datosActualizados) {
  const usuarios = getUsuarios();
  const usuarioIndex = usuarios.findIndex(u => u.dni === dni);

  if (usuarioIndex !== -1) {
    // Actualizamos los datos del usuario en la lista general
    usuarios[usuarioIndex].nombre = datosActualizados.nombre;
    usuarios[usuarioIndex].apellido = datosActualizados.apellido;
    guardarUsuarios(usuarios);

    // Verificamos si el usuario editado es el que está logueado
    const usuarioLogueado = getUsuarioLogueado();
    if (usuarioLogueado && usuarioLogueado.dni === dni) {
        // Si es así, actualizamos también la información de la sesión actual
        usuarioLogueado.nombre = datosActualizados.nombre;
        usuarioLogueado.apellido = datosActualizados.apellido;
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
    }

    return true;
  }
  return false;
}

export function eliminarUsuario(dni) {
  let usuarios = getUsuarios();
  // Filtramos la lista, quedándonos con todos menos el que coincide con el DNI
  const usuariosActualizados = usuarios.filter(u => u.dni !== dni);

  // Si la lista cambió de tamaño, significa que se eliminó
  if (usuariosActualizados.length < usuarios.length) {
    guardarUsuarios(usuariosActualizados);
    return true;
  }
  return false;
}

export function cambiarContraseña(dni, nuevaContraseña) {
  const usuarios = getUsuarios();
  const usuarioIndex = usuarios.findIndex(u => u.dni === dni);
  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].password = nuevaContraseña;
    guardarUsuarios(usuarios);
    return true;
  }
  return false;
}

export function getUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
}

export function logout() {
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem("authToken"); // También borramos el token
  window.location.href = "login.html";
}

// NUEVA FUNCIÓN EXPORTADA para que usuarios.js pueda leer la lista
export function getTodosLosUsuarios() {
    return getUsuarios();
}