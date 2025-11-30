# 📦 Configurar Supabase Storage - Alternativas

## Si no aparece "public" como target role

En Supabase, dependiendo de la versión, puedes usar:

### Opción 1: Usar "anon" en lugar de "public"

1. **Policy para INSERT (subir archivos):**
   - Policy name: `Allow public uploads`
   - Allowed operation: **INSERT**
   - Target roles: **anon** (o déjalo vacío)
   - USING expression: `bucket_id = 'reportes-fotos'`
   - WITH CHECK expression: `bucket_id = 'reportes-fotos'`

2. **Policy para SELECT (leer archivos):**
   - Policy name: `Allow public reads`
   - Allowed operation: **SELECT**
   - Target roles: **anon** (o déjalo vacío)
   - USING expression: `bucket_id = 'reportes-fotos'`
   - WITH CHECK expression: (dejar vacío)

---

### Opción 2: Dejar el campo "Target roles" vacío

Si no hay opción de roles, simplemente:
- Deja el campo **"Target roles"** vacío o selecciona **"All users"**
- Esto aplicará la política a todos los usuarios

---

### Opción 3: Usar SQL directamente

Si el editor visual no funciona, puedes usar el **SQL Editor**:

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta estas consultas:

```sql
-- Política para permitir subidas (INSERT)
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'reportes-fotos');

-- Política para permitir lectura (SELECT)
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'reportes-fotos');
```

---

### Opción 4: Desactivar RLS temporalmente (solo para desarrollo)

Si solo estás probando, puedes desactivar RLS:

1. Ve a **Storage** → `reportes-fotos`
2. Busca la opción **"Enable RLS"** o **"Row Level Security"**
3. **Desactívala** temporalmente
4. ⚠️ **IMPORTANTE**: Solo para desarrollo, no para producción

---

### Opción 5: Configuración manual del bucket

1. Ve a **Storage** → `reportes-fotos`
2. Haz clic en **"Settings"** o **"Configuración"**
3. Busca la opción **"Public bucket"** y actívala
4. Esto puede ser suficiente si el bucket es público

---

## 🔍 Verificar qué roles están disponibles

En el editor de políticas, busca:
- **anon** - Usuarios anónimos (no autenticados)
- **authenticated** - Usuarios autenticados
- **service_role** - Solo para uso interno
- **All users** o campo vacío - Todos los usuarios

---

## ✅ Después de configurar

Ejecuta la prueba:

```bash
npm run test:file
```

Si aún hay errores, comparte el mensaje de error exacto y te ayudo a solucionarlo.












