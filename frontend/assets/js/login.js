import { login } from "./auth.js";

const form = document.getElementById("loginForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dni = form.dni.value;
  const password = form.password.value;

  if (login(dni, password)) {
    window.location.href = "index.html"; // redirige al inicio
  } else {
    alert("DNI o contraseña incorrectos");
  }
});
