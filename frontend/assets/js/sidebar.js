export function initSidebarLinks() {
  const links = document.querySelectorAll("#sidebar .nav-link[data-module]");
  
  document.querySelectorAll("#sidebar .collapse").forEach(el => new bootstrap.Collapse(el, { toggle: false }));

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const moduleName = link.getAttribute("data-module");
      loadModuleAndInit(moduleName);
    });
  });
}

export async function loadModuleAndInit(moduleName, id = null) {
  const appContainer = document.querySelector("#app");
  if (!appContainer) {
    console.error("Error Crítico: El contenedor principal #app no fue encontrado.");
    return;
  }

  try {
    const htmlPath = `views/${moduleName}.html`;
    const response = await fetch(htmlPath);
    
    if (!response.ok) {
      throw new Error(`No se pudo encontrar el archivo de la vista: ${htmlPath} (Estado: ${response.status})`);
    }
    appContainer.innerHTML = await response.text();

    switch (moduleName) {
      case "pacientes_alta":
      case "pacientes_historial": {
        const { initPacienteModule } = await import('./pacientes.js');
        initPacienteModule();
        break;
      }
      case "crear_usuarios": {
        const { initUsuarioModule } = await import('./usuarios.js');
        initUsuarioModule();
        break;
      }
      case "perfil_usuario": {
        const { initPerfilModule } = await import('./perfil.js');
        initPerfilModule();
        break;
      }
      case "pacientes_detalle": {
        const { initPacienteDetalleModule } = await import('./pacientes_detalle.js');
        initPacienteDetalleModule(id);

        break;
      }
      // Agrega aquí más casos para tus otros módulos
    }
  } catch (err) {
    console.error(`Error al cargar el módulo '${moduleName}':`, err);
    appContainer.innerHTML = `<div class="alert alert-danger">Error al cargar la sección. Revisa la consola para más detalles.</div>`;
  }
}