import { getUsuarioLogueado, logout } from './auth.js';
import { loadModuleAndInit } from './sidebar.js'; // Reutilizamos la función de carga

export function initNavbar() {
    const usuario = getUsuarioLogueado();
    if (!usuario) return; // Si no hay usuario, no hace nada

    const userMenuBtn = document.getElementById('userMenu');
    const perfilLink = document.querySelector('a[data-module="perfil_usuario"]');
    const logoutBtn = document.getElementById('btnLogout');

    // 1. Mostrar el nombre del usuario en el botón
    if (userMenuBtn) {
        userMenuBtn.textContent = `${usuario.nombre} ${usuario.apellido}`;
    }

    // 2. Añadir listener al enlace de "Perfil"
    if (perfilLink) {
        perfilLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadModuleAndInit('perfil_usuario'); // Llama a la función reutilizada
        });
    }

    // 3. Añadir listener al botón de "Cerrar sesión"
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}