# Despliegue

## Build de producción

```bash
npm run build
npm start
```

`npm run build` genera los artefactos optimizados en `.next/`. `npm start` sirve la aplicación desde esos artefactos.

## Variables de entorno en producción

Definir antes del build:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.tu-dominio.com
```

Como la variable tiene el prefijo `NEXT_PUBLIC_`, se embebe en el bundle. Debe estar disponible **en tiempo de build**, no solo en runtime.

## Consideraciones de seguridad

### Headers HTTP

`next.config.ts` aplica los siguientes headers en producción:

| Header | Valor |
|--------|-------|
| `Content-Security-Policy` | Política estricta definida en config |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (solo HTTPS) |

### Source maps

Deshabilitados en producción para no exponer código fuente.

### HTTPS

HSTS solo se activa automáticamente cuando el servidor corre sobre HTTPS. Configurar un proxy reverso (Nginx, Caddy, etc.) con certificado TLS.

## Despliegue en Vercel

1. Conectar el repositorio en vercel.com
2. Configurar la variable de entorno `NEXT_PUBLIC_BACKEND_URL` en el panel de Vercel
3. Vercel detecta Next.js automáticamente y ejecuta `npm run build`

El middleware (`src/proxy.ts`) es compatible con el Edge Runtime de Vercel sin configuración adicional.

## Despliegue en servidor propio

```bash
# Instalar dependencias (incluyendo devDependencies para el build)
npm install

# Build
npm run build

# Iniciar con pm2 u otro process manager
pm2 start npm --name "admin-panel" -- start
```

### Variables de entorno con pm2

Usando un archivo `ecosystem.config.js`:

```js
module.exports = {
  apps: [{
    name: 'admin-panel',
    script: 'npm',
    args: 'start',
    env: {
      NEXT_PUBLIC_BACKEND_URL: 'https://api.tu-dominio.com',
      PORT: 3000
    }
  }]
}
```

## Proxy reverso (Nginx ejemplo)

```nginx
server {
  listen 443 ssl;
  server_name admin.tu-dominio.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Imágenes remotas

En producción, las imágenes del backend deben estar en uno de los dominios declarados en `next.config.ts`:

- `http://localhost:3001/uploads/**` (desarrollo)
- `https://web-core-storage.s3.us-east-1.amazonaws.com/**` (producción en S3)

Para agregar un nuevo dominio de imágenes, añadirlo a `remotePatterns` en `next.config.ts`.
