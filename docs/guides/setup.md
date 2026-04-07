# Instalación y Configuración

## Requisitos previos

- **Node.js** 18 o superior
- **npm** 9 o superior
- Backend del proyecto ejecutándose (ver repositorio `web-core-root/web-api` o equivalente)

## Pasos

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd web-admin-panel
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Ajustar la URL según el entorno donde corre el backend.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:3000`.

## Variables de entorno

| Variable | Requerida | Descripción | Default |
|----------|-----------|------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Sí | URL base del backend | `http://localhost:3001` |

Al ser una variable pública (`NEXT_PUBLIC_`), se embebe en el bundle del cliente. No colocar datos sensibles en esta variable.

## Conexión con el backend

El frontend se comunica con el backend a través de:

1. **Cookies HttpOnly** — el backend las establece en login (`access_token`, `refresh_token`)
2. **CSRF token** — el middleware genera un UUID y lo expone como cookie no-HttpOnly
3. **`apiFetch()`** — envía ambos automáticamente con `credentials: 'include'`

El backend debe permitir CORS con `credentials: true` desde el origen del frontend.

## Primer acceso

Al navegar a `http://localhost:3000` se muestra el formulario de login. Las credenciales las gestiona el backend. Tras autenticarse, el sistema redirige automáticamente a `/dashboard`.
