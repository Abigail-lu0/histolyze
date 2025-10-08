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

export function login(dni, password) {
  const usuarios = getUsuarios();
  const usuario = usuarios.find(u => u.dni === dni && u.password === password);
  
  if (usuario) {
    // Guarda solo la información necesaria del usuario logueado, sin la contraseña
    const { password, ...usuarioSinPassword } = usuario;
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSinPassword));
    return true;
  }
  return false;
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