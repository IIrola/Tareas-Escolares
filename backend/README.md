# Backend Service - Gestión de Servicios

Este proyecto constituye el **Backend** de la aplicación, desarrollado con **Node.js**, **Express** y **TypeScript**. Proporciona una API robusta para la gestión de autenticación, periodos, materias, tareas y horarios.

---

## 🚀 Características Principales

- **Autenticación**: Sistema seguro mediante JWT (JSON Web Tokens).
- **Gestión de Periodos**: Control total sobre los ciclos académicos.
- **Materias y Tareas**: Organización eficiente de contenido educativo.
- **Horarios**: Módulo integrado para la gestión de tiempos.
- **Base de Datos**: Integración con PostgreSQL para persistencia de datos.

---

## 🛠️ Backend - Stack Tecnológico

Para que un desarrollador externo pueda replicar este proyecto en un equipo diferente, se detallan a continuación las herramientas y librerías fundamentales utilizadas:

### Herramientas y Versiones

La siguiente tabla resume las versiones exactas basadas en la configuración del proyecto y la bitácora de desarrollo:

| Herramienta / Librería | Versión | Descripción |
| :--- | :--- | :--- |
| **Node.js** | `v24.11.1` | Entorno de ejecución para JavaScript. |
| **npm** | `11.6.2` | Gestor de paquetes. |
| **Express** | `^5.2.1` | Framework web para Node.js. |
| **TypeScript** | `^5.0.0` (Target) | Superset de JavaScript con tipado estático. |
| **PostgreSQL (pg)** | `^8.19.0` | Cliente de base de datos para Node.js. |
| **Bcrypt** | `^6.0.0` | Librería para hashing de contraseñas. |
| **jsonwebtoken** | `^9.0.3` | Implementación de JWT para seguridad. |
| **dotenv** | `^17.3.1` | Gestión de variables de entorno. |
| **tsx** | `^4.21.0` | Herramienta para ejecutar TypeScript directamente. |

---

## ⚙️ Configuración del Entorno

### 1. Prerrequisitos
- Tener instalado **Node.js** (Versión recomendada: 24.x).
- Una instancia de **PostgreSQL** activa.

### 2. Instalación de Dependencias
Ejecute el siguiente comando en la raíz del proyecto:
```bash
npm install
```

### 3. Variables de Entorno
Cree un archivo `.env` en la raíz con el siguiente formato:
```env
PORT=3000
DATABASE_URL=postgres://usuario:password@localhost:5432/nombre_db
JWT_SECRET=tu_secreto_super_seguro
```

### 4. Ejecución en Desarrollo
Para iniciar el servidor con recarga automática:
```bash
npm run dev
```

---

## 📂 Estructura de Rutas (API)

| Prefijo | Recurso | Descripción |
| :--- | :--- | :--- |
| `/api/auth` | Autenticación | Login y Registro de usuarios. |
| `/api/periodos` | Periodos | Gestión de ciclos académicos. |
| `/api/materias` | Materias | CRUD de materias. |
| `/api/tareas` | Tareas | Seguimiento de actividades. |
| `/api/horarios` | Horarios | Configuración de horarios. |

---

> [!NOTE]
> Universidad Politecnica de Bacalar
> Jose Angel Irola Canto 
> 12-03-2026