import { getUsuarioLogueado, logout } from './auth.js';
import { loadModuleAndInit, resetToHomeView } from './sidebar.js'; // Reutilizamos la función de carga

export function renderNavbarUsuario() {
    const usuario = getUsuarioLogueado();
    const userMenuBtn = document.getElementById('userMenu');

    if (usuario && userMenuBtn) {
        userMenuBtn.textContent = `${usuario.nombre} ${usuario.apellido}`;
    }
}

export function initNavbar() {
    renderNavbarUsuario(); 

    const perfilLink = document.querySelector('a[data-module="perfil_usuario"]');
    const logoutBtn = document.getElementById('btnLogout');
    const brandLink = document.getElementById('brand-link');

    if (perfilLink) {
        perfilLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadModuleAndInit('perfil_usuario');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    if (brandLink) {
        brandLink.addEventListener('click', (e) => {
            e.preventDefault();
            resetToHomeView(); // Llamamos a la función de reseteo
        });
    }
}