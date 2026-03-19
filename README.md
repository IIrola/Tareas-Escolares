# 📚 Scholar — Sistema de Gestión Académica

<p align="center">
  <strong>Plataforma integral para la organización de periodos escolares, materias, horarios de clase, tareas y calendario académico.</strong>
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-v24.x-339933?logo=nodedotjs&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
</p>

---

## 📖 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura de Archivos](#-estructura-de-archivos)
5. [Configuración y Ejecución Local](#-configuración-y-ejecución-local)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Base de Datos](#-base-de-datos)
8. [API REST — Documentación de Endpoints](#-api-rest--documentación-de-endpoints)
9. [Sistema de Autenticación](#-sistema-de-autenticación)
10. [Frontend — Páginas y Funcionalidades](#-frontend--páginas-y-funcionalidades)
11. [Modelo de Datos (TypeScript)](#-modelo-de-datos-typescript)
12. [Arquitectura de Diseño (Glassmorphism)](#-arquitectura-de-diseño-glassmorphism)
13. [Scripts Disponibles](#-scripts-disponibles)
14. [Créditos](#-créditos)

---

## 🌐 Descripción General

**Scholar** es una aplicación web fullstack diseñada para que estudiantes universitarios gestionen de forma centralizada toda su vida académica:

- **Periodos Escolares:** Crear y administrar ciclos como semestres o cuatrimestres con sus fechas de inicio y fin.
- **Materias:** Registrar asignaturas asociadas a un periodo, con nombre y profesor.
- **Horarios de Clase:** Configurar los horarios semanales de cada materia (día, hora inicio, hora fin).
- **Tareas y Entregas:** Dar seguimiento a actividades con fecha de entrega, estado de completado y filtros por estado (pendientes, completadas, vencidas).
- **Calendario Integrado:** Visualización unificada de horarios recurrentes y tareas en vistas de mes, semana y día.

El sistema implementa autenticación segura mediante **JWT**, con validación tanto en el servidor como en el cliente. Cada usuario solo puede acceder y manipular sus propios datos.

---

## 🏗 Arquitectura del Proyecto

El proyecto sigue una arquitectura **cliente-servidor** desacoplada:

```
┌─────────────────────┐         HTTP/REST          ┌──────────────────────┐
│                     │  ◄────────────────────────► │                      │
│   Frontend (React)  │     JSON + JWT Bearer       │  Backend (Express)   │
│   Puerto: 5173      │                             │  Puerto: 3000        │
│                     │                             │                      │
└─────────────────────┘                             └──────────┬───────────┘
                                                               │
                                                               │  SQL
                                                               ▼
                                                    ┌──────────────────────┐
                                                    │                      │
                                                    │     PostgreSQL       │
                                                    │     Puerto: 5432     │
                                                    │                      │
                                                    └──────────────────────┘
```

**Flujo de datos:**

1. El usuario interactúa con la interfaz React.
2. Las peticiones HTTP se envían a través de **Axios** con interceptores que inyectan el token JWT automáticamente.
3. El backend **Express** valida el token mediante middleware, ejecuta la lógica de negocio y consulta **PostgreSQL**.
4. Las respuestas JSON se gestionan en el frontend con **TanStack Query** (React Query), que provee caché, revalidación y estado de carga reactivo.

---

## 🛠 Stack Tecnológico

### Backend

| Herramienta / Librería | Versión    | Descripción                                      |
| :---------------------- | :--------- | :----------------------------------------------- |
| **Node.js**             | `v24.x`    | Entorno de ejecución para JavaScript del lado servidor. |
| **npm**                 | `11.x`     | Gestor de paquetes.                              |
| **Express**             | `^5.2.1`   | Framework web minimalista para Node.js.          |
| **TypeScript**          | `^5.0`     | Superset de JavaScript con tipado estático.      |
| **PostgreSQL (pg)**     | `^8.19.0`  | Cliente/driver de PostgreSQL para Node.js.       |
| **Bcrypt**              | `^6.0.0`   | Hashing seguro de contraseñas (10 salt rounds).  |
| **jsonwebtoken**        | `^9.0.3`   | Generación y verificación de JSON Web Tokens.    |
| **dotenv**              | `^17.3.1`  | Carga de variables de entorno desde `.env`.      |
| **cors**                | `^2.8.6`   | Middleware para habilitar Cross-Origin Requests.  |
| **tsx**                 | `^4.21.0`  | Ejecutor de TypeScript directo (dev).            |
| **nodemon**             | `^3.1.14`  | Reinicio automático del servidor en desarrollo.   |

### Frontend

| Herramienta / Librería      | Versión     | Descripción                                      |
| :--------------------------- | :---------- | :----------------------------------------------- |
| **React**                    | `^19.2.4`   | Librería de interfaz de usuario basada en componentes.  |
| **Vite**                     | `^6.x`      | Bundler ultrarrápido con HMR nativo.             |
| **TypeScript**               | `~5.8.x`    | Tipado estático para mayor robustez.             |
| **Tailwind CSS**             | `v3`        | Framework de utilidades CSS (Glassmorphism personalizado). |
| **Shadcn/ui**                | —           | Componentes base (Cards, Tables, Inputs, Modals, Buttons). |
| **React Router DOM**         | `^7.13.1`   | Enrutamiento declarativo con rutas públicas y protegidas. |
| **TanStack Query (React Query)** | `^5.91.0` | Gestión de estado de servidor, caché y data-fetching. |
| **Axios**                    | `^1.13.6`   | Cliente HTTP con interceptores de autenticación.  |
| **react-big-calendar**       | `^1.19.4`   | Componente de calendario con vistas mes/semana/día. |
| **moment.js**                | `^2.30.1`   | Parsing y formateo de fechas (localización en español). |
| **Sonner**                   | `^2.0.7`    | Sistema de notificaciones toast personalizable.   |
| **Lucide React**             | `^0.577.0`  | Librería de íconos SVG modernos.                 |
| **Zod**                      | `^3.x`      | Validación de esquemas en formularios.            |
| **React Hook Form**          | `^7.x`      | Gestión de formularios con validación integrada.  |

---

## 📂 Estructura de Archivos

```text
servicios/
├── README.md                         # ← Este archivo
│
├── backend/
│   ├── package.json                  # Dependencias y scripts del servidor
│   ├── .env                          # Variables de entorno (no versionado)
│   └── src/
│       ├── app.ts                    # Entry point — Configuración Express, CORS, rutas
│       ├── config/
│       │   └── db.ts                 # Pool de conexión PostgreSQL (pg)
│       ├── middleware/
│       │   └── middleware.ts         # verificarToken() — Middleware JWT
│       ├── controllers/
│       │   ├── auth.controller.ts    # Registro e inicio de sesión
│       │   ├── periodos.controller.ts# CRUD de periodos académicos
│       │   ├── materias.controller.ts# CRUD de materias/asignaturas
│       │   ├── tareas.controller.ts  # CRUD + filtros de tareas
│       │   └── horarios.controller.ts# CRUD de horarios semanales
│       └── routes/
│           ├── auth.routes.ts        # POST /register, /login
│           ├── periodos.routes.ts    # CRUD /periodos
│           ├── materias.routes.ts    # CRUD /materias
│           ├── tareas.routes.ts      # CRUD + estados /tareas
│           └── horarios.routes.ts    # CRUD /horarios
│
└── frontend/
    ├── package.json                  # Dependencias y scripts del cliente
    ├── index.html                    # Entry HTML de Vite
    ├── vite.config.ts                # Configuración de Vite + alias @/
    ├── tailwind.config.js            # Extensión de colores y utilidades Glassmorphism
    ├── tsconfig.json                 # Configuración TypeScript con paths @/
    ├── .env                          # VITE_API_URL (no versionado)
    └── src/
        ├── main.tsx                  # Punto de entrada React + ReactDOM
        ├── App.tsx                   # Router principal + Providers
        ├── index.css                 # Estilos globales (Glassmorphism, Dark Mode)
        ├── api/
        │   └── apiClient.ts          # Instancia Axios + interceptores JWT
        ├── contexts/
        │   └── AuthContext.tsx        # Estado global de autenticación
        ├── providers/
        │   └── QueryProvider.tsx      # Configuración TanStack Query
        ├── types/
        │   └── index.ts              # Interfaces TypeScript (User, Periodo, Materia, etc.)
        ├── lib/
        │   └── utils.ts              # Utilidad cn() para Tailwind merge
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoute.tsx # Wrapper de rutas protegidas
        │   ├── layout/
        │   │   └── DashboardLayout.tsx# Sidebar + header + contenido
        │   └── ui/                   # Componentes Shadcn/ui personalizados
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── dialog.tsx
        │       ├── form.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── sonner.tsx
        │       └── table.tsx
        └── pages/
            ├── LoginPage.tsx          # Pantalla de Login / Registro
            ├── PeriodosPage.tsx       # Gestión de periodos académicos
            ├── MateriasPage.tsx       # Gestión de materias
            ├── TareasPage.tsx         # Gestión de tareas con filtros
            ├── HorariosPage.tsx       # Gestión de horarios semanales
            └── CalendarioPage.tsx     # Calendario integrado
```

---

## ⚙ Configuración y Ejecución Local

### Prerrequisitos

- **Node.js** v24.x o superior
- **npm** v11.x o superior
- **PostgreSQL** 16+ con una base de datos creada

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd servicios
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` en `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_secreto_super_seguro
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea el archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

Inicia la aplicación:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## 🔐 Variables de Entorno

### Backend (`backend/.env`)

| Variable        | Requerida | Descripción                              | Ejemplo                        |
| :-------------- | :-------: | :--------------------------------------- | :----------------------------- |
| `PORT`          |    Sí     | Puerto del servidor Express              | `3000`                         |
| `DB_HOST`       |    Sí     | Host de la base de datos PostgreSQL      | `localhost`                    |
| `DB_PORT`       |    No     | Puerto de PostgreSQL (default: 5432)     | `5432`                         |
| `DB_NAME`       |    Sí     | Nombre de la base de datos               | `scholar_db`                   |
| `DB_USER`       |    Sí     | Usuario de PostgreSQL                    | `postgres`                     |
| `DB_PASSWORD`   |    Sí     | Contraseña del usuario                   | `mi_password`                  |
| `JWT_SECRET`    |    Sí     | Clave secreta para firmar tokens JWT     | `clave_secreta_256bits`        |

### Frontend (`frontend/.env`)

| Variable        | Requerida | Descripción                              | Ejemplo                        |
| :-------------- | :-------: | :--------------------------------------- | :----------------------------- |
| `VITE_API_URL`  |    Sí     | URL base de la API del backend           | `http://localhost:3000/api`    |

> ⚠️ **Importante:** Los archivos `.env` no deben ser versionados. Asegúrate de incluirlos en `.gitignore`.

---

## 🗄 Base de Datos

El proyecto utiliza **PostgreSQL** como motor de base de datos relacional. La conexión se gestiona mediante un **pool de conexiones** con la librería `pg`.

### Modelo Entidad-Relación

```
┌──────────────┐
│   usuarios   │
├──────────────┤
│ id_usuario PK│
│ nombre       │
│ correo (UQ)  │
│ password     │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│   periodos   │
├──────────────┤
│ id_periodo PK│
│ nombre       │
│ fecha_inicio │
│ fecha_fin    │
│ id_usuario FK│───► usuarios
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────┐
│   materias   │
├──────────────┤
│ id_materia PK│
│ nombre       │
│ profesor     │
│ id_periodo FK│───► periodos
└──────┬───────┘
       │ 1:N
       ├────────────────────┐
       ▼                    ▼
┌──────────────┐    ┌──────────────┐
│    tareas    │    │   horarios   │
├──────────────┤    ├──────────────┤
│ id_tarea  PK │    │ id_horario PK│
│ titulo       │    │ dia_semana   │
│ descripcion  │    │ hora_inicio  │
│ fecha_entrega│    │ hora_fin     │
│ completada   │    │ id_materia FK│───► materias
│ id_materia FK│───►└──────────────┘
└──────────────┘     materias
```

### Relaciones

| Relación             | Tipo | Descripción                                         |
| :------------------- | :--: | :-------------------------------------------------- |
| Usuario → Periodos   | 1:N  | Un usuario puede tener múltiples periodos.          |
| Periodo → Materias   | 1:N  | Un periodo contiene múltiples materias.             |
| Materia → Tareas     | 1:N  | Una materia puede tener múltiples tareas asignadas. |
| Materia → Horarios   | 1:N  | Una materia puede tener múltiples bloques horarios. |

### Script SQL de Creación (Referencia)

```sql
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE periodos (
    id_periodo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE materias (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    profesor VARCHAR(100),
    id_periodo INTEGER NOT NULL REFERENCES periodos(id_periodo) ON DELETE CASCADE
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    id_materia INTEGER NOT NULL REFERENCES materias(id_materia) ON DELETE CASCADE
);

CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    dia_semana VARCHAR(3) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_materia INTEGER NOT NULL REFERENCES materias(id_materia) ON DELETE CASCADE
);
```

---

## 📡 API REST — Documentación de Endpoints

Todos los endpoints (excepto autenticación) requieren el header:

```
Authorization: Bearer <token_jwt>
```

Base URL: `http://localhost:3000/api`

---

### 🔑 Autenticación (`/api/auth`)

| Método | Endpoint              | Protegido | Descripción                  |
| :----: | :-------------------- | :-------: | :--------------------------- |
| `POST` | `/api/auth/register`  |    No     | Registrar un nuevo usuario   |
| `POST` | `/api/auth/login`     |    No     | Iniciar sesión y obtener JWT |

#### `POST /api/auth/register`

**Request Body:**
```json
{
  "nombre": "José Ángel",
  "correo": "jose@correo.com",
  "password": "miContraseña123"
}
```

**Response (201):**
```json
{
  "id_usuario": 1,
  "nombre": "José Ángel",
  "correo": "jose@correo.com"
}
```

**Errores:**
- `400` — Campos faltantes o correo ya registrado.
- `500` — Error interno del servidor.

#### `POST /api/auth/login`

**Request Body:**
```json
{
  "correo": "jose@correo.com",
  "password": "miContraseña123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "José Ángel",
    "correo": "jose@correo.com"
  }
}
```

**Errores:**
- `401` — Credenciales inválidas.
- `500` — Error interno del servidor.

> 🔒 El token JWT tiene una **expiración de 2 horas**. Después de ese tiempo, el usuario debe volver a iniciar sesión.

---

### 📅 Periodos (`/api/periodos`)

| Método   | Endpoint              | Protegido | Descripción                          |
| :------: | :-------------------- | :-------: | :----------------------------------- |
| `GET`    | `/api/periodos`       |    Sí     | Obtener todos los periodos del usuario |
| `POST`   | `/api/periodos`       |    Sí     | Crear un nuevo periodo               |
| `GET`    | `/api/periodos/:id`   |    Sí     | Obtener un periodo específico        |
| `PUT`    | `/api/periodos/:id`   |    Sí     | Actualizar un periodo                |
| `DELETE` | `/api/periodos/:id`   |    Sí     | Eliminar un periodo                  |

#### `POST /api/periodos`

**Request Body:**
```json
{
  "nombre": "Enero - Abril 2026",
  "fecha_inicio": "2026-01-13",
  "fecha_fin": "2026-04-25"
}
```

**Response (201):**
```json
{
  "id_periodo": 1,
  "nombre": "Enero - Abril 2026",
  "fecha_inicio": "2026-01-13",
  "fecha_fin": "2026-04-25",
  "id_usuario": 1
}
```

> 📌 Los periodos se ordenan por `fecha_inicio` descendente (más recientes primero).

---

### 📘 Materias (`/api/materias`)

| Método   | Endpoint                              | Protegido | Descripción                                |
| :------: | :------------------------------------ | :-------: | :----------------------------------------- |
| `POST`   | `/api/materias`                       |    Sí     | Crear una nueva materia                    |
| `GET`    | `/api/materias`                       |    Sí     | Obtener todas las materias del usuario     |
| `GET`    | `/api/materias/periodo/:id_periodo`   |    Sí     | Obtener materias de un periodo específico  |
| `GET`    | `/api/materias/:id`                   |    Sí     | Obtener una materia por ID                 |
| `PUT`    | `/api/materias/:id`                   |    Sí     | Actualizar nombre y/o profesor             |
| `DELETE` | `/api/materias/:id`                   |    Sí     | Eliminar una materia                       |

#### `POST /api/materias`

**Request Body:**
```json
{
  "nombre": "Cálculo Diferencial",
  "profesor": "Dr. García López",
  "id_periodo": 1
}
```

**Response (201):**
```json
{
  "id_materia": 1,
  "nombre": "Cálculo Diferencial",
  "profesor": "Dr. García López",
  "id_periodo": 1
}
```

> 📌 Al obtener todas las materias, se incluye el nombre del periodo como alias `periodo` mediante JOIN. Ordenamiento: por fecha del periodo (DESC) y luego por nombre de materia (ASC).

---

### ✅ Tareas (`/api/tareas`)

| Método   | Endpoint                            | Protegido | Descripción                              |
| :------: | :---------------------------------- | :-------: | :--------------------------------------- |
| `POST`   | `/api/tareas`                       |    Sí     | Crear una nueva tarea                    |
| `GET`    | `/api/tareas`                       |    Sí     | Obtener todas las tareas del usuario     |
| `GET`    | `/api/tareas/estado/pendientes`     |    Sí     | Tareas pendientes (no completadas, futuras) |
| `GET`    | `/api/tareas/estado/vencidas`       |    Sí     | Tareas vencidas (no completadas, pasadas)   |
| `GET`    | `/api/tareas/estado/completadas`    |    Sí     | Tareas completadas                       |
| `GET`    | `/api/tareas/:id`                   |    Sí     | Obtener una tarea por ID                 |
| `PUT`    | `/api/tareas/:id`                   |    Sí     | Actualizar una tarea                     |
| `PATCH`  | `/api/tareas/:id/completar`         |    Sí     | Marcar tarea como completada             |
| `DELETE` | `/api/tareas/:id`                   |    Sí     | Eliminar una tarea                       |

#### `POST /api/tareas`

**Request Body:**
```json
{
  "titulo": "Tarea 3 - Derivadas",
  "descripcion": "Resolver ejercicios del capítulo 4",
  "fecha_entrega": "2026-03-25",
  "id_materia": 1
}
```

**Response (201):**
```json
{
  "id_tarea": 1,
  "titulo": "Tarea 3 - Derivadas",
  "descripcion": "Resolver ejercicios del capítulo 4",
  "fecha_entrega": "2026-03-25",
  "completada": false,
  "id_materia": 1
}
```

#### `PATCH /api/tareas/:id/completar`

**Response (200):**
```json
{
  "id_tarea": 1,
  "titulo": "Tarea 3 - Derivadas",
  "completada": true
}
```

> 📌 Las tareas se ordenan por `fecha_entrega` ascendente (más próximas primero). Se incluye el nombre de la materia como alias `materia` mediante JOIN.

---

### 🕐 Horarios (`/api/horarios`)

| Método   | Endpoint                               | Protegido | Descripción                                   |
| :------: | :------------------------------------- | :-------: | :-------------------------------------------- |
| `POST`   | `/api/horarios`                        |    Sí     | Crear un nuevo bloque horario                 |
| `GET`    | `/api/horarios`                        |    Sí     | Obtener horario completo del usuario          |
| `GET`    | `/api/horarios/materia/:id_materia`    |    Sí     | Obtener horarios de una materia específica    |
| `PUT`    | `/api/horarios/:id`                    |    Sí     | Actualizar un bloque horario                  |
| `DELETE` | `/api/horarios/:id`                    |    Sí     | Eliminar un bloque horario                    |

#### `POST /api/horarios`

**Request Body:**
```json
{
  "dia_semana": "Lun",
  "hora_inicio": "08:00",
  "hora_fin": "10:00",
  "id_materia": 1
}
```

**Response (201):**
```json
{
  "id_horario": 1,
  "dia_semana": "Lun",
  "hora_inicio": "08:00",
  "hora_fin": "10:00",
  "id_materia": 1
}
```

**Códigos de día válidos:**

| Código | Día       |
| :----: | :-------- |
| `Lun`  | Lunes     |
| `Mar`  | Martes    |
| `Mie`  | Miércoles |
| `Jue`  | Jueves    |
| `Vie`  | Viernes   |
| `Sab`  | Sábado    |

> 📌 El horario completo incluye los nombres de `materia` y `periodo` mediante JOINs. Ordenamiento: por `dia_semana` y luego por `hora_inicio`.

---

## 🛡 Sistema de Autenticación

La autenticación se implementa en **3 capas** que garantizan la seguridad end-to-end:

### Capa 1 — Backend: Middleware JWT (`verificarToken`)

- Extrae el token del header `Authorization: Bearer <token>`.
- Verifica la firma del token con `JWT_SECRET`.
- Decodifica el payload y adjunta `req.usuario` con los datos del usuario autenticado.
- Retorna `401 Unauthorized` si no hay token.
- Retorna `403 Forbidden` si el token es inválido o expiró.
- **Expiración del token:** 2 horas.
- **Hashing de contraseñas:** Bcrypt con 10 salt rounds.

### Capa 2 — Frontend: AuthContext (Validación Proactiva)

- Al cargar la aplicación, se decodifica el JWT almacenado en `localStorage`.
- Verifica el campo `exp` del token para detectar expiración local.
- Si el token expiró, borra `localStorage` y `sessionStorage`, y redirige al login.
- Provee funciones `login()`, `register()` y `logout()` al contexto global.
- `logout()` invalida también la caché de React Query.

### Capa 3 — Frontend: Interceptor Axios (Defensa Reactiva)

- **Request Interceptor:** Inyecta automáticamente `Authorization: Bearer <token>` en cada petición.
- **Response Interceptor:** Captura respuestas `401` y `403` del backend, limpia el almacenamiento local y redirige a `/login` en tiempo real.

### Capa 4 — Frontend: ProtectedRoute (Guardia Visual)

- Componente wrapper que envuelve las rutas del dashboard.
- Si no hay usuario autenticado en el contexto → redirige a `/login`.
- Si está cargando → muestra spinner de carga.
- Si el usuario está autenticado → renderiza la página solicitada.

---

## 🖥 Frontend — Páginas y Funcionalidades

### 🔐 LoginPage — Inicio de Sesión y Registro

- Pantalla de pantalla completa con fondo degradado y orbes decorativos.
- **Modo dual:** Login y Registro intercambiables con un botón toggle.
- **Campos de registro:** Nombre, Correo electrónico, Contraseña.
- **Campos de login:** Correo electrónico, Contraseña.
- Visibilidad de contraseña toggleable (ojo abierto/cerrado).
- Notificaciones toast para éxito y errores.
- Redirección automática a `/periodos` tras login exitoso.
- Branding "Scholar" con logo y badge degradado púrpura→azul.

### 📅 PeriodosPage — Gestión de Periodos Académicos

- **CRUD completo** de periodos escolares.
- Tabla de datos con columnas: Nombre, Fecha Inicio, Fecha Fin, Acciones.
- Modal de creación/edición con campos de fecha.
- Validación de formularios con **React Hook Form** + **Zod**.
- Estado vacío con mensaje cuando no hay periodos.
- Notificaciones toast en cada operación.

### 📘 MateriasPage — Gestión de Materias

- **CRUD completo** de materias/asignaturas.
- Tabla con columnas: Nombre, Profesor, Periodo Académico, Acciones.
- Selector de periodo al crear (dropdown enlazado a los periodos del usuario).
- Edición limitada a nombre y profesor (periodo fijo tras creación).
- Estado vacío con ícono ilustrativo.

### ✅ TareasPage — Gestión de Tareas y Entregas

- **CRUD completo** con funcionalidad adicional de completado (`PATCH`).
- **Sistema de filtros por pestañas:**
  - **Todas** → `GET /tareas`
  - **Pendientes** → `GET /tareas/estado/pendientes`
  - **Completadas** → `GET /tareas/estado/completadas`
  - **Vencidas** → `GET /tareas/estado/vencidas`
- Botón para marcar como completada.
- Indicador visual de tareas vencidas.
- Selector de materia al crear.
- Campos: Título (requerido), Descripción (opcional), Fecha de entrega (requerido), Materia (requerido).

### 🕐 HorariosPage — Gestión de Horarios Semanales

- **CRUD completo** de bloques horarios.
- Tabla con columnas: Día, Hora Inicio, Hora Fin, Materia, Acciones.
- Agrupación visual por día de la semana.
- Nombres completos de días (Lunes, Martes, Miércoles...).
- Selector de materia y de día con inputs de tipo `time`.

### 📆 CalendarioPage — Calendario Integrado

- **Vista unificada** de horarios recurrentes y tareas en un calendario interactivo.
- Implementado con **react-big-calendar** y **moment.js** (localizado en español).
- **Vistas disponibles:** Mes, Semana (por defecto), Día.

#### Tipos de Eventos:

| Tipo     | Color                           | Comportamiento                                          |
| :------- | :------------------------------ | :------------------------------------------------------ |
| Horario  | Púrpura (`#8b5cf6`)            | Recurrente semanalmente dentro del rango del periodo.   |
| Tarea    | Ámbar (`#f59e0b`) / Verde (`#10b981`) | Evento de día completo. Color según estado de completado. |

- **Click en evento:** Muestra detalles (materia, horario, descripción, estado).
- **Navegación personalizada:** Botones anterior/siguiente, "Hoy", selector de vista.
- **Procesamiento de datos:**
  - Mapa `materiaPeriodoMap` para asociar materias con rangos de fecha de periodos.
  - Cálculo de rango visible extendido para eventos recurrentes.
  - Mapeo de códigos de día: `Lun=1, Mar=2, Mie=3, Jue=4, Vie=5, Sab=6`.

### 🧭 DashboardLayout — Layout Principal

- **Sidebar** (64px width) con efecto glass y navegación.
- **Elementos de navegación:** Periodos, Materias, Tareas, Horarios, Calendario (con íconos Lucide).
- **Sección de usuario:** Avatar con iniciales, nombre, correo, botón de logout.
- **Responsive:** Sidebar fijo en desktop, drawer con overlay en mobile.
- **Header sticky:** Menú hamburguesa en mobile + mensaje de bienvenida.
- **Resaltado de ruta activa** en la navegación.

---

## 📋 Modelo de Datos (TypeScript)

Interfaces alineadas 1:1 con la estructura de la base de datos:

```typescript
// === Autenticación ===

interface User {
  id: number;
  nombre: string;
  correo: string;
}

interface LoginRequest {
  correo: string;
  password: string;
}

interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  usuario: User;
}

// === Datos Académicos ===

interface Periodo {
  id_periodo: number;
  nombre: string;
  fecha_inicio: string;    // Formato: YYYY-MM-DD
  fecha_fin: string;        // Formato: YYYY-MM-DD
  id_usuario: number;
}

interface Materia {
  id_materia: number;
  nombre: string;
  profesor: string;
  id_periodo: number;
  periodo?: string;         // Nombre del periodo (JOIN alias)
}

interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  fecha_entrega: string;    // Formato: YYYY-MM-DD
  completada: boolean;
  id_materia: number;
  materia?: string;         // Nombre de la materia (JOIN alias)
}

interface Horario {
  id_horario: number;
  dia_semana: string;       // Lun | Mar | Mie | Jue | Vie | Sab
  hora_inicio: string;      // Formato: HH:MM
  hora_fin: string;         // Formato: HH:MM
  id_materia: number;
  materia?: string;         // Nombre de la materia (JOIN alias)
  periodo?: string;         // Nombre del periodo (JOIN alias)
}
```

---

## 🎨 Arquitectura de Diseño (Glassmorphism)

El diseño visual del frontend implementa un esquema **Glassmorphism** en modo oscuro nativo:

### Principios de Diseño

| Elemento               | Implementación                                       |
| :--------------------- | :--------------------------------------------------- |
| **Fondos**             | Translúcidos con `bg-white/5`, `bg-white/10`        |
| **Bordes**             | Sutiles con `border-white/10`                         |
| **Desenfoque**         | `backdrop-blur` para efecto cristal                   |
| **Modo oscuro**        | Nativo vía `color-scheme: dark` en CSS global         |
| **Sombras**            | Efectos de sombra en tarjetas y modales               |
| **Transiciones**       | Animaciones suaves en navegación y hover              |

### Personalización de Componentes

- Todos los componentes **Shadcn/ui** (Cards, Tables, Inputs, Modals, Buttons) han sido modificados para adherirse al tema glassmórfico en lugar de los estilos sólidos predeterminados.
- Los elementos nativos del navegador (`<select>`, `<input type="date">`, `<input type="time">`) se fuerzan a renderizar con el esquema oscuro mediante directivas CSS.
- La librería de notificaciones **Sonner** y los diálogos **Dialog** utilizan fondos translúcidos acordes al tema.

### Configuración Tailwind

Los colores y utilidades están extendidos en `tailwind.config.js` con paletas personalizadas y clases utilitarias como `glass-card` y `glow-text`.

---

## 📜 Scripts Disponibles

### Backend

| Script          | Comando           | Descripción                                              |
| :-------------- | :---------------- | :------------------------------------------------------- |
| `npm run dev`   | `tsx watch src/app.ts` | Inicia el servidor con recarga automática en desarrollo. |

### Frontend

| Script            | Comando                    | Descripción                                              |
| :---------------- | :------------------------- | :------------------------------------------------------- |
| `npm run dev`     | `vite`                     | Inicia el servidor de desarrollo con HMR.                |
| `npm run build`   | `tsc -b && vite build`     | Compila TypeScript y genera el bundle de producción.     |
| `npm run lint`    | `eslint .`                 | Ejecuta el linter para verificar calidad de código.      |
| `npm run preview` | `vite preview`             | Previsualiza el build de producción localmente.          |

---

## 🧩 Configuración de React Query

El **QueryProvider** configura TanStack Query con los siguientes valores:

| Parámetro                | Valor        | Descripción                                          |
| :----------------------- | :----------- | :--------------------------------------------------- |
| `staleTime`              | 5 minutos    | Tiempo antes de considerar los datos como obsoletos. |
| `retry`                  | 1 intento    | Número máximo de reintentos en caso de fallo.        |
| `refetchOnWindowFocus`   | `false`      | No recarga datos automáticamente al enfocar la ventana. |

---

## 🗺 Mapa de Rutas del Frontend

| Ruta            | Componente       | Protegida | Descripción                     |
| :-------------- | :--------------- | :-------: | :------------------------------ |
| `/login`        | `LoginPage`      |    No     | Pantalla de acceso              |
| `/periodos`     | `PeriodosPage`   |    Sí     | Gestión de periodos académicos  |
| `/materias`     | `MateriasPage`   |    Sí     | Gestión de materias             |
| `/tareas`       | `TareasPage`     |    Sí     | Gestión de tareas y entregas    |
| `/horarios`     | `HorariosPage`   |    Sí     | Gestión de horarios semanales   |
| `/calendario`   | `CalendarioPage` |    Sí     | Calendario integrado            |
| `*`             | Redirect         |    —      | Redirige a `/periodos`          |

---

## 👤 Créditos

| Concepto         | Detalle                              |
| :--------------- | :----------------------------------- |
| **Autor**        | José Ángel Irola Canto               |
| **Institución**  | Universidad Politécnica de Bacalar   |
| **Fecha**        | Marzo 2026                           |

---

> Desarrollado con ❤️ como proyecto de servicios académicos.