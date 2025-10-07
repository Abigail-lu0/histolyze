const usuarios = [
  { dni: "12345678", password: "1234", nombre: "Homero", apellido: "Simpson" },
  { dni: "87654321", password: "abcd", nombre: "Marge", apellido: "Simpson" },
];

export function login(dni, password) {
  const usuario = usuarios.find(u => u.dni === dni && u.password === password);
  if (usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    return true;
  }
  return false;
}

export function getUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuario"));
}

export function logout() {
  localStorage.removeItem("usuario");
}
