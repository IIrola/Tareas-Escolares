# Frontend - Sistema de Gestión Académica

Este es el frontend de la plataforma de gestión académica, desarrollado con React, Vite y TypeScript, siguiendo un diseño visual moderno tipo "Glassmorphism" con colores oscuros (Dark Mode nativo).

El frontend se conecta a una API REST (Backend en Node.js) y gestiona de manera reactiva la información del usuario, periodos escolares, materias, horarios de clase y tareas o entregas.

## 🚀 Tecnologías y Herramientas

El proyecto está construido sobre las siguientes tecnologías:

- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v3 (Configurado con diseño Glassmorphism personalizado)
- **Componentes Base:** Shadcn/ui (Cards, Tables, Inputs, Modals, Buttons)
- **Ruteo:** React Router DOM v7 (Manejo de rutas públicas y privadas)
- **Estado de Servidor:** TanStack Query v5 (React Query para data-fetching y caché)
- **Cliente HTTP:** Axios (Con interceptores para inyección y validación de tokens JWT)
- **Calendario:** `react-big-calendar` + `moment.js` (Para la renderización de clases y tareas)
- **Notificaciones:** Sonner (Toasts personalizados que combinan con el esquema de colores)
- **Íconos:** Lucide React

## 📦 Estructura del Proyecto

```text
frontend/
├── src/
│   ├── api/          # Interceptores y cliente Axios (apiClient.ts)
│   ├── components/
│   │   ├── auth/     # ProtectedRoute (Validación automática de sesión)
│   │   ├── layout/   # DashboardLayout (Sidebar y navegación)
│   │   └── ui/       # Componentes reusables UI (Shadcn modificados con glassmorphism)
│   ├── contexts/     # AuthContext (Gestión de estado global de sesión y JWT)
│   ├── lib/          # Utilidades (función cn para Tailwind merge)
│   ├── pages/        # Vistas principales (Login, Periodos, Materias, Tareas, Calendario, Horarios)
│   ├── providers/    # QueryProvider (Configuración de React Query)
│   └── types/        # Definiciones de tipos (Interfaces alineadas 1:1 con backend)
├── index.html        # Entry point del HTML
├── index.css         # Estilos globales y reglas Glassmorphism / Dark Mode
├── tailwind.config.js# Configuración extendida de colores y utilidades
├── tsconfig.json     # Configuración de TypeScript con aliases (@/)
└── vite.config.ts    # Configuración de empaquetado y servidor de desarrollo
```

## ⚙️ Configuración y Ejecución Local

Para hacer funcionar este frontend en tu máquina local junto al servidor, sigue estos pasos:

### 1. Variables de Entorno

Asegúrate de tener el archivo `.env` en la raíz de `frontend/` con la URL base de tu backend local:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Instalación de Dependencias

Abre la terminal en la carpeta `frontend/` y ejecuta:

```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo

Para levantar el servidor de desarrollo en vivo con HMR, ejecuta:

```bash
npm run dev
```

La aplicación estará corriendo normalmente en `http://localhost:5173`. Al modificar los archivos en `src/`, el navegador se actualizará automáticamente.

### 4. Construcción para Producción (Build)

Para compilar la aplicación para producción:

```bash
npm run build
```

Esto generará una carpeta `dist/` optimizada y lista para ser desplegada en Vercel, Netlify, o cualquier servidor web.

## 🛡️ Sistema de Autenticación (Proxy de Sesión)

El frontend incluye un sistema robusto de validación de JWT para garantizar la seguridad:

1. **AuthContext:** Al cargar la app, se decodifica en el navegador el JWT (`exp`) y se valida que la sesión no haya caducado de manera proactiva. Si caducó, se borra todo rastro local y expulsa al usuario al login.
2. **apiClient:** Contiene un interceptor Axios que captura todos los errores HTTP `401 Unauthorized` y `403 Forbidden` desde el backend, forzando la redirección en vivo ante tokens caducados que ocurran en segundo plano.
3. **ProtectedRoute:** Un componente wrapper que niega el acceso visual a las páginas del Dashboard (`/periodos`, `/calendario`, etc) si el contexto no detecta el objeto `User` presente.

## 🎨 Arquitectura de Diseño (Glassmorphism)

El diseño visual está centralizado en el archivo `index.css` global y se apoya fuertemente en `border-white/10`, fondos de color translúcidos (`bg-white/5` o similares) y `backdrop-blur`. Adicionalmente:
- Los componentes nativos (`<select>`, inputs `<input type="date">` o `<input type="time">`) han sido forzados vía CSS a renderizar sus popups internos acatando la directiva de sistema nativo `color-scheme: dark;`.
- La librería de notificaciones UI, los modales `Dialog` y los componentes de UI reutilizables han sido modificados para adherirse a esta arquitectura transparente en lugar del blanco plano/solido tradicional.
