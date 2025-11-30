# 🔍 Verificación de Configuración

## Problema Detectado

El servidor está corriendo, pero hay un error de conexión a la base de datos:

```
getaddrinfo ENOTFOUND db.ndtxquwayhfkbvrxkwdn.supabase.co
```

Esto significa que **falta configurar el archivo `.env`** con tus credenciales de Supabase.

---

## ✅ Solución: Configurar el archivo .env

### Paso 1: Crear el archivo `.env`

Crea un archivo llamado `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Puerto del servidor
PORT=3000

# Base de datos PostgreSQL (Supabase)
# ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Supabase
DB_HOST=tu-host-de-supabase.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase

# Supabase
# ⚠️ Obtén estos valores desde: Supabase Dashboard → Settings → API
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key
SUPABASE_SERVICE_KEY=tu-supabase-service-role-key
SUPABASE_STORAGE_BUCKET=reportes-fotos

# JWT
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# Entorno
NODE_ENV=development
```

### Paso 2: Obtener tus credenciales de Supabase

1. **Ve a tu proyecto en Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**
3. **Ve a Settings → Database** para obtener:
   - `DB_HOST`: Está en "Connection string" o "Host"
   - `DB_PORT`: Generalmente es 5432
   - `DB_NAME`: Generalmente es "postgres"
   - `DB_USER`: Generalmente es "postgres"
   - `DB_PASSWORD`: Tu contraseña de base de datos

4. **Ve a Settings → API** para obtener:
   - `SUPABASE_URL`: Project URL
   - `SUPABASE_KEY`: anon public key
   - `SUPABASE_SERVICE_KEY`: service_role key (⚠️ mantener en secreto)

### Paso 3: Crear el bucket de Storage

1. Ve a **Storage** en el Dashboard de Supabase
2. Haz clic en **"New bucket"**
3. Nombra el bucket: `reportes-fotos`
4. Marca **"Public bucket"** si quieres URLs públicas
5. Crea el bucket

### Paso 4: Ejecutar migraciones

Después de configurar `.env`, ejecuta:

```bash
npm run migrate
```

Esto creará las tablas `usuarios` y `reportes` en tu base de datos.

---

## 🧪 Probar los Endpoints

Una vez configurado todo, puedes usar el script de pruebas:

```bash
node scripts/testEndpoints.js
```

Este script probará automáticamente todos los endpoints.

---

## 📝 Ejemplo de .env completo

```env
PORT=3000

DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-aqui

SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1NTc2MDAwfQ.example
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMwMDAwMDAwLCJleHAiOjE5NDU1NzYwMDB9.example
SUPABASE_STORAGE_BUCKET=reportes-fotos

JWT_SECRET=mi-clave-secreta-super-segura-123456789
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

⚠️ **IMPORTANTE**: Nunca subas el archivo `.env` a Git. Ya está en `.gitignore`.

---

## ✅ Checklist antes de probar

- [ ] Archivo `.env` creado con todas las variables
- [ ] Credenciales de Supabase correctas
- [ ] Bucket `reportes-fotos` creado en Supabase Storage
- [ ] Migraciones ejecutadas (`npm run migrate`)
- [ ] Servidor reiniciado después de crear `.env`

---

## 🚀 Una vez configurado todo

Ejecuta las pruebas:

```bash
node scripts/testEndpoints.js
```

O prueba manualmente con Postman/Thunder Client siguiendo los ejemplos en `API_EXAMPLES.md`













