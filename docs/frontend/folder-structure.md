# Estructura de Carpetas

## Árbol completo de `src/`

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (html, fuentes, ToastProvider)
│   ├── page.tsx                      # / → Login
│   ├── globals.css                   # Estilos globales + Tailwind directives
│   ├── dashboard/
│   │   ├── layout.tsx                # Layout con ContenedorAdmin
│   │   └── page.tsx
│   ├── articulos/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Lista + configuración de artículos
│   │   ├── crear/page.tsx            # Formulario de creación
│   │   └── [articuloId]/
│   │       ├── ver/page.tsx          # Vista de detalle
│   │       └── modificar/page.tsx    # Formulario de edición
│   ├── equipo/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── servicios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── testimonios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── usuarios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── usuario/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Perfil del usuario autenticado
│   ├── actividad/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── superadmin/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Panel SUPERADMIN
│   └── project/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── equipo/page.tsx
│       ├── servicios/page.tsx
│       └── articulos/
│           └── [articuloId]/page.tsx
│
├── features/                         # Módulos de dominio
│   ├── index.ts                      # Barrel export de todos los módulos
│   ├── auth/
│   │   ├── services/auth.service.ts
│   │   ├── hooks/useAuth.ts
│   │   ├── components/form-inicio-sesion.tsx
│   │   └── types/auth.types.ts
│   ├── usuarios/
│   │   ├── services/usuario.service.ts
│   │   ├── entities/usuario.entity.ts
│   │   ├── dtos/usuario.dto.ts
│   │   └── components/
│   │       ├── lista-usuarios.tsx
│   │       ├── perfil-usuario.tsx
│   │       ├── user-form-info.tsx
│   │       └── user-form-password.tsx
│   ├── articulos/
│   │   ├── services/articulos.service.ts
│   │   ├── entities/
│   │   │   ├── articulo.entity.ts
│   │   │   ├── sec-articulo.entity.ts
│   │   │   └── articulos.entity.ts
│   │   ├── dtos/
│   │   │   ├── articulo.dto.ts
│   │   │   ├── sec-articulo.dto.ts
│   │   │   └── articulos.dto.ts
│   │   ├── types/articulo.types.ts
│   │   ├── interfaces/articulo.interface.ts
│   │   └── components/
│   │       ├── nuevo-articulo.tsx
│   │       ├── modificar-articulo.tsx
│   │       ├── lista-articulos.tsx
│   │       ├── articulos-form.tsx
│   │       └── sec-articulo.tsx
│   ├── equipo/
│   │   ├── services/equipo.service.ts
│   │   ├── entities/
│   │   │   ├── equipo.entity.ts
│   │   │   └── empleado.entity.ts
│   │   ├── dtos/equipo.dto.ts
│   │   └── components/
│   │       ├── equipo-form.tsx
│   │       └── empleados.tsx
│   ├── servicios/
│   │   ├── services/servicios.service.ts
│   │   ├── entities/
│   │   │   ├── servicio.entity.ts
│   │   │   └── servicios.entity.ts
│   │   ├── dtos/
│   │   │   ├── servicio.dto.ts
│   │   │   └── servicios.dto.ts
│   │   └── components/
│   │       ├── form-servicios.tsx
│   │       └── lista-servicios.tsx
│   ├── testimonios/
│   │   ├── services/
│   │   │   ├── testimonios.service.ts
│   │   │   └── testimonio.service.ts
│   │   ├── entities/
│   │   │   ├── testimonio.entity.ts
│   │   │   └── testimonios.entity.ts
│   │   ├── dtos/
│   │   │   ├── testimonio.dto.ts
│   │   │   └── testimonios.dto.ts
│   │   └── components/
│   │       ├── form-testimonios.tsx
│   │       └── lista-testimonios.tsx
│   ├── proyectos/
│   │   ├── services/proyecto.service.ts
│   │   ├── entities/proyecto.entity.ts
│   │   ├── dtos/proyecto.dto.ts
│   │   └── components/
│   │       ├── lista-proyectos.tsx
│   │       ├── modal-crear-proyecto.tsx
│   │       └── detalle-proyecto.tsx
│   ├── actividad/
│   │   ├── services/actividad.service.ts
│   │   └── entities/actividad.entity.ts
│   └── project/                      # Módulos con scope por proyecto (SUPERADMIN)
│       ├── articulos/
│       ├── equipo/
│       ├── servicios/
│       └── testimonios/
│
└── shared/
    ├── api/
    │   └── client.ts                 # apiFetch + apiFetchFormData
    ├── components/
    │   ├── container.tsx             # ContenedorAdmin (navbar + slot)
    │   ├── navbar.tsx                # NavbarAdmin (sidebar + mobile drawer)
    │   ├── input.tsx                 # Input con label flotante
    │   ├── textarea.tsx              # TextAreaArt
    │   ├── input-art.tsx             # Variante de Input
    │   ├── input-file.tsx            # Input de archivos
    │   ├── title-sec.tsx             # TitleSec
    │   ├── cont-sub-sec.tsx          # ContSubSec
    │   ├── head-sub-sec.tsx          # HeadSubSec
    │   ├── body-sub-sec.tsx          # BodySubSec
    │   ├── footer-sub-sec.tsx        # FooterSubSec
    │   ├── title-sub-sec.tsx         # TitleSubSec
    │   └── toast-provider.tsx        # ToastProvider
    └── index.ts                      # Barrel export de shared
```

## Convención de nombres de archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes React | kebab-case.tsx | `lista-articulos.tsx` |
| Servicios | kebab-case.service.ts | `articulos.service.ts` |
| Entidades | kebab-case.entity.ts | `articulo.entity.ts` |
| DTOs | kebab-case.dto.ts | `articulo.dto.ts` |
| Hooks | camelCase con prefijo `use` | `useAuth.ts` |
| Tipos | kebab-case.types.ts | `articulo.types.ts` |
| Interfaces | kebab-case.interface.ts | `articulo.interface.ts` |
