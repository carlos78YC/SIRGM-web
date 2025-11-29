# 🔧 Solución Paso a Paso: Error en Render

## ❌ Si el error persiste después de configurar variables

El error `ENETUNREACH` generalmente significa que **las variables NO están llegando correctamente** al servidor en Render.

## ✅ Solución Definitiva

### Paso 1: Verificar Variables en Render (IMPORTANTE)

1. Ve a **Render Dashboard**: https://dashboard.render.com
2. Selecciona tu servicio: **sirgm-backend**
3. Ve a **Settings** (menú izquierdo)
4. Busca la sección **"Environment"** o **"Environment Variables"**
5. **Lista TODAS las variables que ves ahí**

**¿Qué debes ver?**
- Una lista de variables con Key y Value
- Si está vacío o solo ves algunas variables, ese es el problema

### Paso 2: Agregar Variables Manualmente

Para cada variable, haz clic en **"Add Environment Variable"**:

#### Variables de Base de Datos (OBLIGATORIAS):

1. **DB_HOST**
   - Key: `DB_HOST`
   - Value: El host de tu Supabase (ej: `db.abcdefghijklmnop.supabase.co`)
   - Environment: Production, Preview, Development

2. **DB_PORT**
   - Key: `DB_PORT`
   - Value: `5432`
   - Environment: Production, Preview, Development

3. **DB_NAME**
   - Key: `DB_NAME`
   - Value: `postgres`
   - Environment: Production, Preview, Development

4. **DB_USER**
   - Key: `DB_USER`
   - Value: `postgres`
   - Environment: Production, Preview, Development

5. **DB_PASSWORD**
   - Key: `DB_PASSWORD`
   - Value: Tu contraseña de Supabase
   - Environment: Production, Preview, Development

#### Variables de Supabase (OBLIGATORIAS):

6. **SUPABASE_URL**
   - Key: `SUPABASE_URL`
   - Value: `https://tu-proyecto.supabase.co`
   - Environment: Production, Preview, Development

7. **SUPABASE_KEY**
   - Key: `SUPABASE_KEY`
   - Value: Tu anon key de Supabase
   - Environment: Production, Preview, Development

8. **SUPABASE_SERVICE_KEY**
   - Key: `SUPABASE_SERVICE_KEY`
   - Value: Tu service role key de Supabase
   - Environment: Production, Preview, Development

9. **SUPABASE_STORAGE_BUCKET**
   - Key: `SUPABASE_STORAGE_BUCKET`
   - Value: `reportes-fotos`
   - Environment: Production, Preview, Development

#### Variables de JWT (OBLIGATORIAS):

10. **JWT_SECRET**
    - Key: `JWT_SECRET`
    - Value: Una clave secreta cualquiera (ej: `mi-clave-super-secreta-12345`)
    - Environment: Production, Preview, Development

11. **JWT_EXPIRES_IN**
    - Key: `JWT_EXPIRES_IN`
    - Value: `7d`
    - Environment: Production, Preview, Development

#### Variables Opcionales:

12. **NODE_ENV**
    - Key: `NODE_ENV`
    - Value: `production`
    - Environment: Production

### Paso 3: Obtener Valores desde Supabase

Si no tienes los valores, obténlos así:

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. **Settings → Database**:
   - Busca **"Connection string"** o **"Connection info"**
   - Ahí verás:
     - **Host**: algo como `db.xxxxx.supabase.co` → Este es tu `DB_HOST`
     - **Port**: `5432` → `DB_PORT`
     - **Database**: `postgres` → `DB_NAME`
     - **User**: `postgres` → `DB_USER`
     - **Password**: Tu contraseña → `DB_PASSWORD`

4. **Settings → API**:
   - **Project URL**: → `SUPABASE_URL`
   - **anon public**: → `SUPABASE_KEY`
   - **service_role**: → `SUPABASE_SERVICE_KEY`

### Paso 4: Formato Correcto en Render

**CRÍTICO**: En Render, los valores NO deben tener:
- ❌ Comillas: `"valor"`
- ❌ Espacios antes o después del `=`
- ❌ Caracteres especiales al inicio/final

**Correcto:**
```
DB_HOST=db.abcdefghijklmnop.supabase.co
```

**Incorrecto:**
```
DB_HOST="db.abcdefghijklmnop.supabase.co"
DB_HOST = db.abcdefghijklmnop.supabase.co
DB_HOST= db.abcdefghijklmnop.supabase.co
```

### Paso 5: Re-desplegar después de Cambios

1. Guarda todas las variables
2. Ve a la pestaña **"Deploys"**
3. Haz clic en **"Manual Deploy"**
4. Selecciona **"Clear build cache & deploy"**
5. Espera a que termine (1-3 minutos)

### Paso 6: Verificar en los Logs

1. Ve a la pestaña **"Logs"**
2. Busca estos mensajes:

**Si funciona:**
```
✅ Conexión a PostgreSQL exitosa
```

**Si hay error:**
- Verás qué variable falta o está mal
- El código mejorado ahora mostrará qué variables están configuradas

## 🔍 Si Aún No Funciona

**Opción A: Verificar desde tu PC**

En tu PC local, abre tu archivo `.env` y copia los valores exactos (uno por uno) a Render.

**Opción B: Verificar que el Proyecto de Supabase Esté Activo**

1. Ve a Supabase Dashboard
2. Verifica que tu proyecto NO esté pausado
3. Si está pausado, haz clic en **"Restore"**

---

## 📋 Checklist Final

Antes de hacer deploy, verifica:

- [ ] Todas las 11 variables agregadas en Render
- [ ] Los valores son correctos (copiados de Supabase)
- [ ] No hay comillas en los valores
- [ ] Proyecto de Supabase está activo
- [ ] Re-deploy realizado después de cambiar variables

---

**Después de seguir estos pasos, el error debería desaparecer.** Si persiste, comparte qué mensajes aparecen en los logs después del re-deploy.

