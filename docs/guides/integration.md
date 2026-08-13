# INTEGRACIÓN DE CMS EN UN NUEVO PROYECTO WEB

# 1. Iniciamos sesión en el CMS con el usuario superadmin@gmail.com

# 2. Vamos a la sección Superadmin, donde creamos un nuevo proyecto en conjunto con un usuario admin para este proyecto

# 3. Completamos las variables de .env
## NEXT_PUBLIC_BACKEND_URL lo obtenemos de railway
## NEXT_PUBLIC_PROYECTO_ID lo obtenemos de supabase

# 4. Traspasamos el contenido de este proyecto al nuevo proyecto, para eso:
## 4.1. Copiar y pegar el contenido de 'app/project' dentro de 'app' del nuevo proyecto.
## 4.2. Copiar y pegar 'features/integration' dentro del src del nuevo proyecto. modificamos el nombre 'integration' por 'features'
## 4.3. Copiar y pegar 'shared/integration' dentro del src del nuevo proyecto. modificamos el nombre 'integration' por 'shared'
