# 🔧 Solución: Error de Conexión a PostgreSQL

## ❌ Problema Detectado

El error `ENOTFOUND db.ndtxquwayhfkbvrxkwdn.supabase.co` indica que **el host de Supabase no se puede resolver**.

## 🔍 Causas Posibles

1. **Proyecto de Supabase pausado** (más común)
2. Host incorrecto en el archivo `.env`
3. Problemas de conexión a internet
4. El proyecto fue eliminado o suspendido

## ✅ Soluciones

### Solución 1: Verificar Estado del Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Verifica que tu proyecto esté **activo** (no pausado)
3. Si está pausado, haz clic en **"Restore"** o **"Resume"** para reactivarlo

**Nota:** Los proyectos gratuitos de Supabase se pausan automáticamente después de 7 días de inactividad.

### Solución 2: Verificar y Actualizar el Host

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Settings → Database**
3. Busca la sección **"Connection string"** o **"Connection info"**
4. Verifica que el host sea correcto. Debería verse así:
   ```
   db.xxxxx.supabase.co
   ```
5. Si el host es diferente, actualiza `DB_HOST` en tu archivo `.env`

### Solución 3: Obtener Nuevas Credenciales

Si el proyecto fue recreado o las credenciales cambiaron:

1. Ve a **Settings → Database** en Supabase Dashboard
2. Copia los siguientes valores:
   - **Host**: De la sección "Connection string" (ej: `db.xxxxx.supabase.co`)
   - **Port**: Generalmente `5432`
   - **Database**: Generalmente `postgres`
   - **User**: Generalmente `postgres`
   - **Password**: Tu contraseña de base de datos (si la olvidaste, puedes resetearla)

3. Actualiza tu archivo `.env`:

```env
DB_HOST=db.xxxxx.supabase.co  # Reemplaza con tu host real
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-actual
```

### Solución 4: Verificar Conexión a Internet

1. Verifica que tengas conexión a internet activa
2. Intenta hacer ping al host (si es posible):
   ```bash
   ping db.ndtxquwayhfkbvrxkwdn.supabase.co
   ```

### Solución 5: Usar Connection Pooler (Recomendado para Supabase)

Supabase ofrece un "Connection Pooler" que es más estable. Para usarlo:

1. Ve a **Settings → Database** en Supabase Dashboard
2. Busca la sección **"Connection Pooling"**
3. Usa el host del pooler (generalmente termina en `.pooler.supabase.com`)
4. El puerto del pooler suele ser `6543` en lugar de `5432`

Actualiza tu `.env`:

```env
DB_HOST=db.xxxxx.pooler.supabase.com  # Host del pooler
DB_PORT=6543  # Puerto del pooler
DB_NAME=postgres
DB_USER=postgres.xxxxx  # Usuario con el ID del proyecto
DB_PASSWORD=tu-password
```

## 🧪 Verificar la Solución

Después de aplicar cualquiera de las soluciones, ejecuta el diagnóstico:

```bash
npm run diagnostico:db
```

O prueba la conexión directamente:

```bash
npm run test:config
```

## 📝 Checklist de Verificación

- [ ] El proyecto de Supabase está activo (no pausado)
- [ ] El archivo `.env` existe y tiene todas las variables
- [ ] `DB_HOST` es correcto y coincide con Supabase Dashboard
- [ ] `DB_PASSWORD` es la contraseña correcta
- [ ] Tienes conexión a internet
- [ ] El diagnóstico muestra "✅ CONEXIÓN EXITOSA"

## 🆘 Si Nada Funciona

1. **Crea un nuevo proyecto en Supabase** (si el actual está corrupto)
2. **Obtén las nuevas credenciales** del nuevo proyecto
3. **Actualiza tu archivo `.env`** con las nuevas credenciales
4. **Ejecuta las migraciones** nuevamente:
   ```bash
   npm run migrate
   ```

## 💡 Prevención

Para evitar que el proyecto se pause:
- Úsalo regularmente (al menos una vez por semana)
- O actualiza a un plan de pago si necesitas disponibilidad 24/7












