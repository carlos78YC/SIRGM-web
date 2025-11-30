# 🔍 Verificar si el Proyecto de Supabase está Activo

## ⚠️ Problema Posible

El error `ENETUNREACH` con direcciones IPv6 puede indicar que:
1. El proyecto de Supabase está **pausado**
2. Hay problemas de conectividad desde Render
3. El proyecto necesita ser activado

---

## ✅ Paso 1: Verificar Estado del Proyecto

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (`ndtxquwayhfkbvrxkwdn`)
3. Verifica el estado en la parte superior:
   - ✅ **Activo/Active**: El proyecto está funcionando
   - ⏸️ **Paused/Suspendido**: El proyecto está pausado (esto causa errores de conexión)

### Si el proyecto está pausado:

1. Haz clic en **"Restore"** o **"Resume"** para reactivarlo
2. Espera 1-2 minutos a que se active completamente
3. Intenta conectarte nuevamente

---

## ✅ Paso 2: Verificar Connection String

1. Ve a **Settings → Database**
2. Busca la sección **"Connection string"**
3. Verifica que la URL sea correcta
4. Copia la URL completa

---

## ✅ Paso 3: Probar Connection Pooler

El Connection Pooler de Supabase es más estable para Render:

1. Ve a **Settings → Database**
2. Busca **"Connection Pooling"** o **"Connection string"**
3. Selecciona el modo **"Transaction"** o **"Session"**
4. Copia la URL del pooler (puerto 6543)

---

## 🔧 Si el Proyecto está Activo y Sigue Fallando

Prueba usar el **Connection Pooler** en lugar de la conexión directa:

### En Render, cambia DATABASE_URL a:

```
DATABASE_URL=postgresql://postgres:Yc140904BISC@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

O busca la URL del pooler en:
- Supabase Dashboard → Settings → Database → Connection Pooling

---

**Verifica primero si el proyecto está activo antes de continuar con otras soluciones.** 🎯

