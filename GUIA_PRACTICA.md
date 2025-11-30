# Guía Práctica - Próximos Pasos

## ✅ Paso 1: Verificar que el Servidor Funcione

Abre tu navegador o usa Postman/Thunder Client para probar:

**GET** `http://localhost:3000/health`

Deberías recibir:
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ✅ Paso 2: Verificar/Crear las Tablas en la Base de Datos

**IMPORTANTE**: Antes de usar la API, necesitas crear las tablas en PostgreSQL (Supabase).

### Opción A: Ejecutar migraciones automáticamente

```bash
npm run migrate
```

Este comando ejecutará todos los archivos SQL en `database/migrations/` para crear las tablas `usuarios` y `reportes`.

### Opción B: Ejecutar manualmente en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y ejecuta el contenido de:
   - `database/migrations/001_create_users_table.sql`
   - `database/migrations/002_create_reportes_table.sql`

### Verificar que las tablas existan:

Puedes verificar en Supabase Dashboard → **Table Editor** que existan las tablas:
- `usuarios`
- `reportes`

---

## ✅ Paso 3: Configurar Supabase Storage (para subir fotos)

1. Ve a Supabase Dashboard → **Storage**
2. Crea un nuevo bucket llamado: `reportes-fotos`
3. Configura las políticas del bucket:
   - **Public**: Marca el bucket como público si quieres URLs públicas
   - O configura políticas RLS según tus necesidades

---

## ✅ Paso 4: Probar los Endpoints

### 4.1 Registrar un Usuario

**POST** `http://localhost:3000/auth/register`

```json
{
  "email": "alumno@ejemplo.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "alumno"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "alumno@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "alumno"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **Guarda el token** - lo necesitarás para las siguientes peticiones.

---

### 4.2 Login

**POST** `http://localhost:3000/auth/login`

```json
{
  "email": "alumno@ejemplo.com",
  "password": "Password123"
}
```

**Respuesta:** Similar a register, con token y datos del usuario.

---

### 4.3 Crear un Reporte (SIN foto)

**POST** `http://localhost:3000/reportes`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Fuga de agua en el baño",
  "descripcion": "Hay una fuga constante de agua en el baño del segundo piso que necesita reparación urgente",
  "ubicacion": "Edificio A, Segundo piso, Baño 2",
  "prioridad": "alta"
}
```

---

### 4.4 Crear un Reporte (CON foto)

**POST** `http://localhost:3000/reportes`

**Headers:**
```
Authorization: Bearer tu-token-aqui
Content-Type: multipart/form-data
```

**Body (form-data):**
- `titulo`: "Luz fundida en el pasillo"
- `descripcion`: "La luz del pasillo principal no funciona"
- `ubicacion`: "Edificio B, Pasillo principal"
- `prioridad`: "media"
- `foto`: [selecciona un archivo de imagen]

---

### 4.5 Listar Reportes

**GET** `http://localhost:3000/reportes?estado=pendiente&prioridad=alta`

**Headers:**
```
Authorization: Bearer tu-token-aqui
```

**Parámetros opcionales:**
- `estado`: pendiente, en_proceso, resuelto, cerrado
- `prioridad`: baja, media, alta, urgente
- `limit`: número de resultados
- `offset`: para paginación

---

### 4.6 Ver un Reporte Específico

**GET** `http://localhost:3000/reportes/1`

**Headers:**
```
Authorization: Bearer tu-token-aqui
```

---

### 4.7 Actualizar Estado de un Reporte

**PUT** `http://localhost:3000/reportes/1/estado`

**Headers:**
```
Authorization: Bearer tu-token-aqui (debe ser admin o mantenimiento)
Content-Type: application/json
```

**Body:**
```json
{
  "estado": "en_proceso",
  "observaciones": "Se ha asignado un técnico para revisar el problema"
}
```

**Estados válidos:** `pendiente`, `en_proceso`, `resuelto`, `cerrado`

---

## 🔍 Verificar que Todo Funcione

### Checklist:

- [ ] Servidor corriendo (`/health` responde)
- [ ] Tablas creadas en Supabase (usuarios y reportes)
- [ ] Bucket de Storage creado (`reportes-fotos`)
- [ ] Puedes registrar un usuario
- [ ] Puedes hacer login
- [ ] Puedes crear un reporte (sin foto)
- [ ] Puedes crear un reporte (con foto)
- [ ] Puedes listar reportes
- [ ] Puedes ver un reporte específico
- [ ] Puedes actualizar estado (con rol admin/mantenimiento)

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica las credenciales en `.env`
- Verifica que las variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` sean correctas

### Error: "Faltan variables de entorno de Supabase"
- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` estén en `.env`
- Obtén estos valores desde Supabase Dashboard → Settings → API

### Error: "relation 'usuarios' does not exist"
- Ejecuta las migraciones: `npm run migrate`
- O crea las tablas manualmente en Supabase

### Error: "Token inválido" o "Token expirado"
- Haz login nuevamente para obtener un nuevo token
- Verifica que el header `Authorization: Bearer token` esté correctamente formateado

### Error: "No tienes permisos"
- Verifica que el usuario tenga el rol correcto
- Admin y mantenimiento pueden actualizar estados
- Solo admin puede ver todos los reportes

### Error al subir fotos
- Verifica que el bucket `reportes-fotos` exista en Supabase Storage
- Verifica que el bucket tenga permisos públicos o políticas RLS configuradas
- Verifica que el archivo no exceda 5MB
- Verifica que el formato sea: jpeg, jpg, png, gif, webp

---

## 📝 Notas Importantes

1. **Token JWT**: Los tokens expiran según `JWT_EXPIRES_IN` en `.env` (por defecto 7 días)
2. **Roles**: Solo `admin` y `mantenimiento` pueden actualizar estados de reportes
3. **Fotos**: Máximo 5MB, formatos permitidos: jpeg, jpg, png, gif, webp
4. **Base de datos**: Las tablas deben crearse antes de usar la API
5. **Storage**: El bucket debe existir antes de subir fotos

---

## 🚀 Siguiente Nivel

Una vez que todo funcione:

1. **Frontend**: Conecta tu frontend a estos endpoints
2. **Testing**: Crea tests automatizados
3. **Documentación**: Usa Swagger/OpenAPI para documentar la API
4. **Seguridad**: Revisa y ajusta las políticas RLS en Supabase
5. **Despliegue**: Prepara el backend para producción













