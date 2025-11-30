# 📦 Guía para Configurar Supabase Storage - Opción B

## Configurar Políticas del Bucket usando el Editor del Dashboard

### Paso 1: Acceder al Bucket

1. Ve a tu proyecto en **Supabase Dashboard**: https://supabase.com/dashboard
2. En el menú lateral, haz clic en **Storage**
3. Busca el bucket `reportes-fotos` y haz clic en él
4. Ve a la pestaña **"Policies"** o **"Políticas"**

---

### Paso 2: Crear Política para Subir Archivos (INSERT)

1. Haz clic en **"New Policy"** o **"Nueva Política"**
2. Selecciona **"Create a policy from scratch"** o **"Crear política desde cero"**

3. **Configura la política:**
   - **Policy name**: `Allow public uploads` (o `Permitir subidas públicas`)
   - **Allowed operation**: Selecciona **INSERT**
   - **Target roles**: Selecciona **public** (o deja el campo vacío para todos)
   - **USING expression**: Deja vacío o usa: `bucket_id = 'reportes-fotos'`
   - **WITH CHECK expression**: Usa: `bucket_id = 'reportes-fotos'`

4. Haz clic en **"Review"** y luego en **"Save policy"** o **"Guardar política"**

---

### Paso 3: Crear Política para Leer Archivos (SELECT)

1. Haz clic nuevamente en **"New Policy"**

2. **Configura la política:**
   - **Policy name**: `Allow public reads` (o `Permitir lectura pública`)
   - **Allowed operation**: Selecciona **SELECT**
   - **Target roles**: Selecciona **public**
   - **USING expression**: Usa: `bucket_id = 'reportes-fotos'`
   - **WITH CHECK expression**: Deja vacío

3. Haz clic en **"Review"** y luego en **"Save policy"**

---

### Paso 4: Verificar las Políticas

Deberías ver dos políticas creadas:
- ✅ `Allow public uploads` (INSERT)
- ✅ `Allow public reads` (SELECT)

---

### Paso 5: Probar la Subida

Una vez configuradas las políticas, ejecuta:

```bash
npm run test:file
```

O usa el script de PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File test-foto.ps1
```

---

## 🔍 Verificación Rápida

Si las políticas están bien configuradas, deberías poder:
- ✅ Subir archivos al bucket
- ✅ Obtener URLs públicas de los archivos
- ✅ Ver las imágenes en el navegador usando la URL pública

---

## ⚠️ Notas de Seguridad

- Estas políticas hacen el bucket **público** (cualquiera puede subir y leer)
- Para producción, considera políticas más restrictivas:
  - Solo usuarios autenticados pueden subir
  - Solo usuarios autenticados pueden leer
  - O políticas basadas en roles específicos

---

## 🐛 Solución de Problemas

### Error: "new row violates row-level security policy"
- Verifica que las políticas estén creadas correctamente
- Asegúrate de que el bucket esté marcado como público (opcional pero recomendado)
- Verifica que las expresiones `bucket_id = 'reportes-fotos'` sean correctas

### Error: "Bucket not found"
- Verifica que el bucket `reportes-fotos` exista
- Verifica que el nombre del bucket en `.env` coincida: `SUPABASE_STORAGE_BUCKET=reportes-fotos`

### Error: "Permission denied"
- Verifica que `SUPABASE_SERVICE_KEY` esté correctamente configurada en `.env`
- La service key debe tener permisos de administrador












