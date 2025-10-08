import { login } from "./auth.js";

const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dni = form.dni.value;
  const password = form.password.value;
  const esExitoso = await login(dni, password); 

  if (esExitoso) {
    window.location.href = "index.html"; // Redirige al inicio
  } else {
    alert("DNI o contraseña incorrectos");
  }
});
