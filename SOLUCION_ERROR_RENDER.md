# Solución: Error de Conexión PostgreSQL en Render

## ❌ Error Detectado

```
❌ Error al conectar con PostgreSQL:
   Mensaje: connect ENETUNREACH 2600:1f18:2e13:9d29:47cb:23d7:5b49:601f:5432
```

Este error indica que las **variables de entorno no están configuradas correctamente en Render**.

## ✅ Solución: Verificar Variables de Entorno en Render

### Paso 1: Ir a Render Dashboard

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Selecciona tu servicio: **sirgm-backend**
3. Ve a **Settings** (en el menú izquierdo)
4. Busca la sección **"Environment"** o **"Environment Variables"**

### Paso 2: Verificar Variables de Entorno

Asegúrate de que **TODAS** estas variables estén configuradas:

#### Variables de Base de Datos (REQUERIDAS):

```
DB_HOST=db.tu-proyecto.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase
```

#### Variables de Supabase (REQUERIDAS):

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
SUPABASE_SERVICE_KEY=tu-service-role-key
SUPABASE_STORAGE_BUCKET=reportes-fotos
```

#### Variables de JWT (REQUERIDAS):

```
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=7d
```

#### Variables Opcionales:

```
PORT=3000
NODE_ENV=production
```

### Paso 3: Obtener Valores Correctos desde Supabase

Si no tienes los valores, obténlos desde Supabase:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. **Settings → Database**:
   - `DB_HOST`: Está en "Connection string" (formato: `db.xxxxx.supabase.co`)
   - `DB_PORT`: 5432
   - `DB_NAME`: postgres
   - `DB_USER`: postgres
   - `DB_PASSWORD`: Tu contraseña (si la olvidaste, puedes resetearla)

4. **Settings → API**:
   - `SUPABASE_URL`: Project URL
   - `SUPABASE_KEY`: anon public key
   - `SUPABASE_SERVICE_KEY`: service_role key

### Paso 4: Formato Correcto en Render

**IMPORTANTE**: En Render:
- ✅ **NO pongas comillas** alrededor de los valores
- ✅ **NO pongas espacios** antes o después del `=`
- ✅ El valor debe ser exacto, sin espacios extra

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

### Paso 5: Re-desplegar después de Cambiar Variables

Después de agregar/corregir las variables:

1. Ve a la pestaña **"Deploys"**
2. Haz clic en **"Manual Deploy"** (o en los tres puntos del último deploy)
3. Selecciona **"Clear build cache & deploy"**
4. Espera a que termine el deploy

### Paso 6: Verificar los Logs

1. Ve a la pestaña **"Logs"**
2. Busca estos mensajes:
   - ✅ `✅ Conexión a PostgreSQL exitosa` → ¡Funciona!
   - ❌ Si sigue apareciendo error → Verifica las variables de nuevo

## 🔍 Diagnóstico

Si el error persiste, verifica en los logs:

1. **¿Aparece algún mensaje sobre variables faltantes?**
   - Si dice "Faltan variables de entorno requeridas" → Agrega las que faltan

2. **¿El DB_HOST es correcto?**
   - Debe ser un hostname, no una IP
   - Debe terminar en `.supabase.co`

3. **¿Está el proyecto de Supabase activo?**
   - Ve a Supabase Dashboard
   - Verifica que el proyecto no esté pausado

## 📝 Checklist

- [ ] Todas las variables de entorno configuradas en Render
- [ ] DB_HOST tiene formato correcto (ej: `db.xxxxx.supabase.co`)
- [ ] No hay comillas en los valores
- [ ] No hay espacios extra
- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Re-deploy realizado después de cambiar variables
- [ ] Logs muestran conexión exitosa

---

Una vez que corrijas las variables y re-deployes, el error debería desaparecer. 🚀

