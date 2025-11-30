# Configurar DATABASE_URL en Render

## 🎯 Nueva Configuración: Usar DATABASE_URL (Más Simple)

He actualizado el código para usar `DATABASE_URL` de Supabase, que es más simple y confiable.

## ✅ Paso 1: Obtener DATABASE_URL desde Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → Database**
4. Busca la sección **"Connection string"** o **"Connection pooling"**
5. Selecciona **"URI"** o **"Connection string"**
6. Copia la URL completa. Debe verse así:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

O también puede ser:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**IMPORTANTE**: Reemplaza `[YOUR-PASSWORD]` con tu contraseña real de Supabase.

## ✅ Paso 2: Configurar en Render

### Opción A: Usar solo DATABASE_URL (Recomendado)

1. Ve a Render → Tu servicio → **Settings → Environment**
2. **Elimina** las variables individuales (DB_HOST, DB_PORT, etc.) si las tienes
3. Agrega **una sola variable**:

   - **Key**: `DATABASE_URL`
   - **Value**: La URL completa que copiaste de Supabase (con la contraseña reemplazada)
   - **Environment**: Production, Preview, Development

   Ejemplo:
   ```
   DATABASE_URL=postgresql://postgres:Yc140904BISC@db.ndtxquwayhfkbvrxkwdn.supabase.co:5432/postgres
   ```

### Opción B: Mantener variables individuales (Fallback)

Si prefieres, puedes seguir usando las variables individuales:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

El código ahora soporta ambas opciones, pero **DATABASE_URL es más simple**.

## ✅ Paso 3: Re-desplegar

1. Guarda la variable `DATABASE_URL` en Render
2. Ve a **Deploys → Manual Deploy → Clear build cache & deploy**
3. Espera a que termine
4. Revisa los logs

## 🔍 Ventajas de usar DATABASE_URL

- ✅ Una sola variable en lugar de 5
- ✅ Supabase la proporciona lista para usar
- ✅ Incluye SSL automáticamente
- ✅ Menos errores de configuración

## 📝 Formato de DATABASE_URL

```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[base_de_datos]
```

Ejemplo completo:
```
postgresql://postgres:Yc140904BISC@db.ndtxquwayhfkbvrxkwdn.supabase.co:5432/postgres
```

## 🔒 SSL Automático

El código ahora configura SSL automáticamente cuando usa `DATABASE_URL` de Supabase, por lo que no necesitas configurar nada adicional.

---

**Después de configurar `DATABASE_URL` y re-desplegar, el error debería desaparecer.** 🚀

