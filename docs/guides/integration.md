# INTEGRACIÓN DE CMS EN UN NUEVO PROYECTO WEB

# 1. Iniciamos sesión en el CMS con el usuario superadmin@gmail.com

# 2. Vamos a la sección Superadmin, donde creamos un nuevo proyecto en conjunto con un usuario admin para este proyecto

# 3. Completamos las variables de .env
## NEXT_PUBLIC_BACKEND_CMS_URL lo obtenemos de railway
## NEXT_PUBLIC_PROYECTO_ID lo obtenemos de supabase

# 4. Copiar contenido de next.config, lo que importa es el rewrite, pero copiamos todo no más

# 5. Traspasamos el contenido de este proyecto al nuevo proyecto, para eso:
## 5.1. Copiar y pegar el contenido de 'app/project' dentro de 'app' del nuevo proyecto.
## 5.2. Copiar y pegar el contenido de 'features/integration' dentro del features del nuevo proyecto
## 5.3. Copiar y pegar el contenido de 'shared/integration' dentro del shared del nuevo proyecto

# 6. Instalar dependencias que falten
