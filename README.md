# 🧬 Histolyze - Sistema de Gestión de Pacientes para INCAIMEN

![Logo de Histolyze](assets/logo-nombre.png)

Histolyze es una aplicación de escritorio desarrollada para el **Laboratorio de Histocompatibilidad del INCAIMEN** (ubicado en el Hospital Central de Mendoza). El sistema centraliza y automatiza la gestión de pacientes y estudios de histocompatibilidad, reemplazando el seguimiento manual en planillas de papel y Excel.

## ✨ Características Principales

El sistema está diseñado para optimizar el flujo de trabajo del laboratorio y reducir errores, incluyendo las siguientes funcionalidades:

* **Gestión de Pacientes:** Módulo completo para el alta, baja, modificación y consulta de datos de pacientes.
* **Registro de Estudios:** Almacenamiento centralizado de tipificaciones HLA y resultados de DSA.
* **Crossmatch Virtual:** Un algoritmo que calcula la compatibilidad entre donante y receptor para facilitar la toma de decisiones.
* **Generación de Informes:** Creación automática de reportes estandarizados en formato PDF (integrado con JasperReports).
* **Seguridad:** Control de acceso mediante roles y usuarios para garantizar la confidencialidad de los datos.

---

## 🚀 Stack Tecnológico

| Área              | Tecnología                                       |
| ----------------- | ------------------------------------------------ |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA, Spring Security |
| **Base de Datos** | MySQL                                            |
| **Frontend** | HTML, CSS, JavaScript, Bootstrap                 |
| **Reportes** | JasperReports                                    |
| **Testing** | JUnit, Mockito                                   |
| **Dependencias** | Maven                                            |
| **Logging** | SLF4J + Logback                                  |
| **Control de Versiones** | Git / GitHub                                     |

---

## 🛠️ Configuración del Entorno

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Base de Datos

Es necesario tener MySQL instalado.

```sql
-- Crear la base de datos
CREATE DATABASE pacientes_db;
```

### 2. Backend

1.  **Configurar credenciales:**
    Modifica el archivo `backend/src/main/resources/application.properties` con tus datos de MySQL:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/pacientes_db
    spring.datasource.username=tu_usuario
    spring.datasource.password=tu_password
    spring.jpa.hibernate.ddl-auto=update
    ```

2.  **Ejecutar el proyecto:**
    Navega a la carpeta del backend y corre el siguiente comando. Las tablas se crearán automáticamente gracias a JPA.

    ```bash
    cd backend
    mvn spring-boot:run
    ```

### 3. Frontend

Simplemente abre el archivo `frontend/index.html` en tu navegador web.

---

## 📂 Estructura del Proyecto

```
/histolyze
 ├── backend/
 │    ├── src/main/java/... (Controladores, Servicios, Entidades, Repositorios)
 │    ├── src/main/resources/
 │    │    ├── application.properties
 │    │    └── reportes/ (Archivos JasperReports .jrxml)
 │    └── pom.xml
 ├── frontend/
 │    ├── index.html
 │    ├── css/
 │    └── js/
 ├── docs/ (Informes, diagramas, modelo de datos)
 └── README.md
```

---

## 👥 Equipo de Desarrollo

* **Aliaga, Jazmín** - Coordinación / Backend / Frontend
* **Huaman, Michael** - Backend / Infra
* **Lucero, Abigail** - Tester / Manual de Usuario / Documentación
* **Moro, Iriel** - Backend / Frontend
* **Redolfi, Bruno** - Backend / Infra
