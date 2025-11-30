# API Completa - SIRGM Backend

Backend Express.js con autenticación JWT, CRUD de reportes y subida de archivos a Supabase Storage.

## Estructura del Proyecto

```
SIRGM/
├── config/
│   ├── database.js      # Configuración de PostgreSQL/Supabase
│   └── supabase.js      # Cliente de Supabase
├── controllers/
│   ├── authController.js    # Autenticación (register/login)
│   ├── reporteController.js # CRUD de reportes
│   └── uploadController.js  # Subida de archivos
├── middleware/
│   ├── auth.js          # Middleware de autenticación JWT
│   ├── errorHandler.js  # Manejo de errores
│   └── upload.js        # Configuración de Multer
├── models/
│   ├── User.js          # Modelo de usuario
│   └── Reporte.js       # Modelo de reporte
├── routes/
│   ├── authRoutes.js    # Rutas de autenticación
│   ├── reporteRoutes.js # Rutas de reportes
│   └── uploadRoutes.js  # Rutas de upload
├── services/
│   └── storageService.js # Servicio de Supabase Storage
├── validators/
│   ├── authValidator.js    # Validaciones de autenticación
│   └── reporteValidator.js # Validaciones de reportes
└── utils/
    └── validationHandler.js # Manejo de validaciones
```

## Endpoints de la API

### Autenticación (`/auth`)

#### POST `/auth/register`
Registrar un nuevo usuario.

**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "alumno"
}
```

**Roles válidos:** `alumno`, `docente`, `admin`, `mantenimiento`

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "alumno"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login`
Iniciar sesión.

**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "alumno"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Reportes (`/reportes`)

**Todas las rutas requieren autenticación JWT** (header: `Authorization: Bearer <token>`)

#### POST `/reportes`
Crear un nuevo reporte.

**Body (multipart/form-data):**
- `titulo` (string, requerido): Título del reporte
- `descripcion` (string, requerido): Descripción del reporte
- `ubicacion` (string, opcional): Ubicación del problema
- `prioridad` (string, opcional): `baja`, `media`, `alta`, `urgente`
- `foto` (file, opcional): Imagen del problema (jpg, png, gif, webp, máx 5MB)

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte creado exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "titulo": "Fuga de agua",
    "descripcion": "Hay una fuga en el baño del segundo piso",
    "ubicacion": "Edificio A, Piso 2",
    "prioridad": "alta",
    "estado": "pendiente",
    "foto_url": "https://...",
    "foto_path": "reportes/...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/reportes`
Obtener todos los reportes.

**Query parameters:**
- `estado` (opcional): Filtrar por estado (`pendiente`, `en_proceso`, `resuelto`, `cerrado`)
- `prioridad` (opcional): Filtrar por prioridad
- `limit` (opcional): Límite de resultados
- `offset` (opcional): Offset para paginación

**Nota:** Los usuarios no-admin solo ven sus propios reportes.

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "titulo": "Fuga de agua",
      "estado": "pendiente",
      ...
    }
  ]
}
```

#### GET `/reportes/:id`
Obtener un reporte por ID.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Fuga de agua",
    "descripcion": "...",
    "usuario_nombre": "Juan",
    "usuario_apellido": "Pérez",
    ...
  }
}
```

#### PUT `/reportes/:id`
Actualizar un reporte.

**Body (multipart/form-data):**
- `titulo` (string, opcional)
- `descripcion` (string, opcional)
- `ubicacion` (string, opcional)
- `prioridad` (string, opcional)
- `foto` (file, opcional): Nueva imagen (reemplaza la anterior)

**Nota:** Solo el dueño del reporte o un admin puede actualizarlo.

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte actualizado exitosamente",
  "data": {
    "id": 1,
    "titulo": "Fuga de agua - Actualizado",
    ...
  }
}
```

#### PUT `/reportes/:id/estado`
Actualizar el estado de un reporte.

**Body (JSON):**
```json
{
  "estado": "en_proceso",
  "observaciones": "Trabajando en la solución"
}
```

**Estados válidos:** `pendiente`, `en_proceso`, `resuelto`, `cerrado`

**Nota:** Solo admin y mantenimiento pueden actualizar el estado.

**Respuesta:**
```json
{
  "success": true,
  "message": "Estado del reporte actualizado exitosamente",
  "data": {
    "id": 1,
    "estado": "en_proceso",
    "observaciones": "Trabajando en la solución",
    ...
  }
}
```

#### DELETE `/reportes/:id`
Eliminar un reporte.

**Nota:** Solo el dueño del reporte o un admin puede eliminarlo. Si tiene foto, se elimina también de Supabase Storage.

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte eliminado exitosamente"
}
```

---

### Upload (`/upload`)

**Todas las rutas requieren autenticación JWT**

#### POST `/upload`
Subir un archivo a Supabase Storage.

**Body (multipart/form-data):**
- `file` (file, requerido): Archivo a subir (jpg, png, gif, webp, máx 5MB)
- `folder` (string, opcional): Carpeta donde guardar (default: `uploads`)

**Respuesta:**
```json
{
  "success": true,
  "message": "Archivo subido exitosamente",
  "data": {
    "url": "https://...",
    "path": "uploads/1234567890-foto.jpg",
    "filename": "foto.jpg",
    "size": 123456,
    "mimetype": "image/jpeg"
  }
}
```

#### DELETE `/upload/:path`
Eliminar un archivo de Supabase Storage.

**Parámetros:**
- `path` (string): Ruta del archivo en storage (ej: `uploads/1234567890-foto.jpg`)

**Respuesta:**
```json
{
  "success": true,
  "message": "Archivo eliminado exitosamente"
}
```

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# Base de datos PostgreSQL/Supabase
DB_HOST=tu-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
SUPABASE_STORAGE_BUCKET=reportes-fotos

# JWT
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=7d

# Entorno
NODE_ENV=development
```

## Instalación y Uso

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copia .env.example a .env y completa los valores
```

3. **Ejecutar migraciones:**
```bash
npm run migrate
```

4. **Iniciar servidor:**
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Validaciones

### Contraseña
- Mínimo 6 caracteres
- Debe contener al menos una mayúscula, una minúscula y un número

### Reporte
- Título: 3-255 caracteres
- Descripción: mínimo 10 caracteres
- Ubicación: máximo 255 caracteres
- Prioridad: `baja`, `media`, `alta`, `urgente`
- Estado: `pendiente`, `en_proceso`, `resuelto`, `cerrado`

### Archivos
- Formatos permitidos: jpg, jpeg, png, gif, webp
- Tamaño máximo: 5MB

## Permisos por Rol

- **alumno/docente:** Pueden crear, ver y actualizar sus propios reportes
- **admin:** Acceso completo a todos los reportes
- **mantenimiento:** Puede ver todos los reportes y actualizar estados

## Ejemplos de Uso

### Crear reporte con imagen (cURL)
```bash
curl -X POST http://localhost:3000/reportes \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "titulo=Fuga de agua" \
  -F "descripcion=Hay una fuga en el baño" \
  -F "ubicacion=Edificio A, Piso 2" \
  -F "prioridad=alta" \
  -F "foto=@/ruta/a/imagen.jpg"
```

### Actualizar estado (cURL)
```bash
curl -X PUT http://localhost:3000/reportes/1/estado \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "en_proceso",
    "observaciones": "Trabajando en ello"
  }'
```

### Subir archivo (cURL)
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "file=@/ruta/a/archivo.jpg" \
  -F "folder=reportes"
```

## Scripts Disponibles

- `npm start` - Iniciar servidor
- `npm run dev` - Iniciar con nodemon (desarrollo)
- `npm run migrate` - Ejecutar migraciones de base de datos
- `npm test` - Ejecutar pruebas de endpoints
- `npm run test:config` - Probar configuración
- `npm run test:file` - Probar subida de archivos
- `npm run create:bucket` - Crear bucket en Supabase Storage
- `npm run diagnostico:db` - Diagnóstico de base de datos










