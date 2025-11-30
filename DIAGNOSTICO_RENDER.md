# 🔍 Diagnóstico: Error de Conexión en Render

## ❌ Si el error persiste, necesitamos verificar paso a paso

### Paso 1: Verificar que las Variables Existan en Render

1. Ve a Render Dashboard → Tu servicio **sirgm-backend**
2. Ve a **Settings** → **Environment**
3. **Toma una captura** o lista TODAS las variables que ves ahí

**¿Qué variables ves configuradas?**
- ¿Aparece `DB_HOST`?
- ¿Aparece `DB_PASSWORD`?
- ¿Cuántas variables en total?

### Paso 2: Verificar el Formato del DB_HOST

En Render, verifica que `DB_HOST` tenga este formato:
- ✅ Debe ser un hostname: `db.xxxxx.supabase.co`
- ❌ NO debe ser una IP
- ❌ NO debe estar vacío
- ❌ NO debe tener comillas

### Paso 3: Verificar que el Proyecto de Supabase Esté Activo

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Verifica que tu proyecto NO esté pausado
3. Si está pausado, haz clic en **"Restore"** o **"Resume"**

### Paso 4: Obtener el DB_HOST Correcto

1. En Supabase Dashboard → Tu proyecto
2. **Settings** → **Database**
3. Busca **"Connection string"** o **"Connection info"**
4. El host debe verse así: `db.xxxxxxxxxxxxx.supabase.co`
5. **Copia ese host completo**

### Paso 5: Configurar Variables en Render (Paso a Paso)

1. Render → Tu servicio → **Settings** → **Environment**
2. Para cada variable, haz clic en **"Add Environment Variable"**:

   **Variable 1:**
   - Key: `DB_HOST`
   - Value: `db.xxxxxxxxxxxxx.supabase.co` (el que copiaste de Supabase)
   - Save

   **Variable 2:**
   - Key: `DB_PORT`
   - Value: `5432`
   - Save

   **Variable 3:**
   - Key: `DB_NAME`
   - Value: `postgres`
   - Save

   **Variable 4:**
   - Key: `DB_USER`
   - Value: `postgres`
   - Save

   **Variable 5:**
   - Key: `DB_PASSWORD`
   - Value: `tu-password-de-supabase`
   - Save

3. Repite para las demás variables (SUPABASE_URL, SUPABASE_KEY, etc.)

### Paso 6: Re-desplegar

Después de agregar TODAS las variables:

1. Ve a **Deploys**
2. Haz clic en **"Manual Deploy"**
3. Selecciona **"Clear build cache & deploy"**
4. Espera a que termine

---

## 📋 Lista Completa de Variables Necesarias

Copia esta lista y verifica que TODAS estén en Render:

```
✅ DB_HOST
✅ DB_PORT
✅ DB_NAME
✅ DB_USER
✅ DB_PASSWORD
✅ SUPABASE_URL
✅ SUPABASE_KEY
✅ SUPABASE_SERVICE_KEY
✅ SUPABASE_STORAGE_BUCKET
✅ JWT_SECRET
✅ JWT_EXPIRES_IN
✅ NODE_ENV
```

---

**¿Puedes decirme cuáles de estas variables tienes configuradas en Render?**


