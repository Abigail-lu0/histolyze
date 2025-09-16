# 🧬 Histolyze  - Sistema de Gestión de Pacientes – INCAIMEN

Aplicación para la administración de pacientes y estudios médicos en el Laboratorio de Histocompatibilidad, con base de datos local MySQL y generación de reportes en PDF.

---

## 🚀 Tecnologías usadas
- **Backend**: Java 17 + Spring Boot 3, Spring Data JPA, Spring Security, JasperReports  
- **Base de datos**: MySQL  
- **Frontend**: HTML, CSS, JS, Bootstrap  
- **Logs**: SLF4J + Logback  
- **Testing**: JUnit, Mockito  
- **Gestor dependencias**: Maven  
- **Control de versiones**: GitHub/GitLab  

---

## ▶️ Cómo correr el backend
```bash
cd backend
mvn spring-boot:run
```

## ▶️ Cómo correr el frontend
```bash
Abrir frontend/index.html directamente en el navegador.
(Opcional) Usar un servidor liviano como live-server.
```
## 🛠 Configuración de la base de datos

1.Instalar MySQL

2.Crear la base de datos:
```bash
CREATE DATABASE pacientes_db;
```
3.Configurar credenciales en backend/src/main/resources/application.properties:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/pacientes_db
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```
4.Levantar el backend → las tablas se generan automáticamente con JPA.

## 📂 Estructura del proyecto
```bash
/proyecto-pacientes
 ├── backend/
 │    ├── src/main/java/... (controladores, servicios, entidades)
 │    ├── src/main/resources/
 │    │    ├── application.properties
 │    │    └── reportes/ (archivos JasperReports .jrxml)
 │    └── pom.xml
 ├── frontend/
 │    ├── index.html
 │    ├── css/
 │    └── js/
 ├── docs/ (informes, diagramas, actas de reunión)
 └── README.md
```

## 🔑 Convenciones del equipo
### Repositorio Git

- **Rama principal**: main
- **Rama de desarrollo**: develop
- **Ramas de feature**: feature/<nombre_funcionalidad> (ej: feature/login)
- **Ramas de hotfix**: hotfix/<descripcion_corta>


### Commits
- **feat**: nueva funcionalidad
- **fix**: corrección de bug
- **docs**: documentación
- **test**: pruebas
- **refactor**: cambios sin alterar funcionalidad

Ejemplo:

**feat**: agregar endpoint login con validación de usuario

### Código
**Java** → nombres en inglés, camelCase

**DB** → tablas y columnas en snake_case

**Frontend** → archivos .js y .css con nombres claros


## 👥 Equipo
- Aliaga, Jazmín - **Coordinación/Backend/Frontend**
- Huaman, Michael - **Backend/Infra**
- Lucero, Abigail
- Moro, Iriel - **Backend/Frontend**
- Redolfi, Bruno - **Backend/Infra**
