# Pasos Después de Configurar .env

## ✅ Checklist de Pasos

### 1. Verificar Configuración
```bash
npm run test:config
```
Este comando verifica que todas las variables de entorno estén correctas y que puedas conectarte a PostgreSQL y Supabase.

### 2. Crear las Tablas en la Base de Datos
```bash
npm run migrate
```
Esto ejecutará las migraciones SQL para crear las tablas `usuarios` y `reportes`.

### 3. Configurar Supabase Storage (Opcional - solo si vas a subir fotos)
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Storage** → **Buckets**
3. Crea un nuevo bucket llamado: `reportes-fotos`
4. Configura el bucket como **Público** (si quieres URLs públicas)

### 4. Iniciar el Servidor
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

### 5. Probar los Endpoints
```bash
npm test
```

---

## 🚀 Ejecución Rápida (Todo en Orden)

```bash
# 1. Verificar configuración
npm run test:config

# 2. Crear tablas
npm run migrate

# 3. Iniciar servidor (en una terminal)
npm start

# 4. Probar endpoints (en otra terminal)
npm test
```

---

## 📝 Variables de Entorno Requeridas

Asegúrate de que tu `.env` tenga:

```env
# Base de datos PostgreSQL (Supabase)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.xxxxx
DB_PASSWORD=tu_password

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=tu_service_key

# Servidor
PORT=3000
JWT_SECRET=tu_secret_key_muy_segura
NODE_ENV=development
```

---

## ❓ Solución de Problemas

### Error: "Faltan variables de entorno"
- Verifica que tu archivo `.env` esté en la raíz del proyecto
- Asegúrate de que todas las variables estén definidas
- No dejes espacios alrededor del `=` en el .env

### Error: "No se puede conectar a PostgreSQL"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que tu proyecto Supabase esté activo
- Verifica que la IP esté permitida en Supabase (Settings → Database → Connection Pooling)

### Error: "relation does not exist"
- Ejecuta las migraciones: `npm run migrate`
- Verifica en Supabase Dashboard → Table Editor que existan las tablas

### Error al subir archivos
- Asegúrate de haber creado el bucket `reportes-fotos` en Supabase Storage
- Verifica que el bucket tenga políticas públicas o RLS configuradas

---

## 🎯 Siguiente Paso Recomendado

Una vez que todo esté funcionando, puedes:
1. Probar los endpoints manualmente con Postman/Thunder Client
2. Ver ejemplos en `API_EXAMPLES.md`
3. Revisar la guía práctica en `GUIA_PRACTICA.md`











