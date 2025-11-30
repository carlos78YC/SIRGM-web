# 📋 Variables de Entorno para Render - Lista Completa

## ⚠️ Error Actual
```
Error: Faltan variables de entorno de Supabase
```

Esto significa que faltan las variables `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` en Render.

---

## ✅ Variables Requeridas en Render

Ve a **Render Dashboard → Tu servicio → Settings → Environment** y agrega TODAS estas variables:

### 1. Base de Datos (Ya configurada ✅)
```
DATABASE_URL=postgresql://postgres:Yc140904BISC@db.ndtxquwayhfkbvrxkwdn.supabase.co:5432/postgres
```

### 2. Supabase (FALTANTES - Agregar ahora)
```
SUPABASE_URL=https://ndtxquwayhfkbvrxkwdn.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdHhxdXdheWhma2J2cnhrd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTE1MDAsImV4cCI6MjA3ODg4NzUwMH0.agwD5NNMNwLvruGyi2vbJqEhtwafHqsXNs1l4xxj4DI
SUPABASE_STORAGE_BUCKET=reportes-fotos
```

### 3. JWT (Seguridad)
```
JWT_SECRET=it8qtyEoWSZACh342YiJB9+A1cnMhw+EsbD+x81arXXT2GknhDLvOc9OJgy8Sg7RU9uDSHWrmq8OJRZaPYmE7w==
JWT_EXPIRES_IN=7d
```

### 4. Servidor (Opcionales pero recomendadas)
```
PORT=10000
NODE_ENV=production
```

---

## 📝 Pasos para Agregar las Variables

### Paso 1: Ir a Configuración de Variables en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Selecciona tu servicio backend (`sirgm-backend`)
3. Ve a **Settings → Environment**

### Paso 2: Agregar las Variables Faltantes

Agrega estas variables una por una (copiar y pegar exactamente como aparecen abajo):

#### 🔴 OBLIGATORIAS (Agregar ahora):
```
SUPABASE_URL=https://ndtxquwayhfkbvrxkwdn.supabase.co
```

```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdHhxdXdheWhma2J2cnhrd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTE1MDAsImV4cCI6MjA3ODg4NzUwMH0.agwD5NNMNwLvruGyi2vbJqEhtwafHqsXNs1l4xxj4DI
```

```
JWT_SECRET=it8qtyEoWSZACh342YiJB9+A1cnMhw+EsbD+x81arXXT2GknhDLvOc9OJgy8Sg7RU9uDSHWrmq8OJRZaPYmE7w==
```

#### 🟡 RECOMENDADAS:
```
SUPABASE_STORAGE_BUCKET=reportes-fotos
```

```
JWT_EXPIRES_IN=7d
```

```
PORT=10000
```

```
NODE_ENV=production
```

### Paso 3: Guardar y Re-desplegar

1. **Guarda todas las variables** (Render las guarda automáticamente)
2. Ve a la pestaña **Deploys**
3. Haz clic en **"Manual Deploy"**
4. Elige **"Clear build cache & deploy"**
5. Espera 1-3 minutos

---

## ✅ Checklist de Variables

Después de agregarlas, deberías tener estas variables en Render:

- [x] `DATABASE_URL` ✅ (ya está configurada)
- [ ] `SUPABASE_URL` ❌ (agregar ahora)
- [ ] `SUPABASE_SERVICE_KEY` ❌ (agregar ahora)
- [ ] `SUPABASE_STORAGE_BUCKET` (recomendado)
- [ ] `JWT_SECRET` (recomendado)
- [ ] `JWT_EXPIRES_IN` (opcional)
- [ ] `PORT` (opcional, Render lo configura automáticamente)
- [ ] `NODE_ENV` (opcional)

---

## 🔍 Cómo Obtener SUPABASE_SERVICE_KEY

Si no tienes el `SUPABASE_SERVICE_KEY` o quieres verificar:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Busca la sección **"Project API keys"**
5. Copia el valor de **"service_role"** key (⚠️ mantener en secreto)

**IMPORTANTE**: Usa `SUPABASE_SERVICE_KEY` (service_role), NO `SUPABASE_KEY` (anon key).

---

## 🚀 Después de Configurar

Una vez que agregues todas las variables y re-despliegues, el error debería desaparecer y deberías ver en los logs:

```
✅ Conexión a PostgreSQL exitosa
🚀 Servidor corriendo en puerto 10000
```

---

**Después de agregar las variables faltantes, el backend debería funcionar correctamente.** 🎉

