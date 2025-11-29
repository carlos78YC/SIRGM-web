# Ejemplos de Uso de la API

## Autenticación

### 1. Registro de Usuario

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "alumno"
}
```

**Respuesta exitosa:**
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

### 2. Login

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

**Respuesta exitosa:**
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

## Reportes

### 3. Crear Reporte (con foto)

```bash
POST http://localhost:3000/reportes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

{
  "titulo": "Fuga de agua en el baño",
  "descripcion": "Hay una fuga constante de agua en el baño del segundo piso",
  "ubicacion": "Edificio A, Segundo piso, Baño 2",
  "prioridad": "alta",
  "foto": [archivo de imagen]
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Reporte creado exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "titulo": "Fuga de agua en el baño",
    "descripcion": "Hay una fuga constante de agua en el baño del segundo piso",
    "ubicacion": "Edificio A, Segundo piso, Baño 2",
    "estado": "pendiente",
    "prioridad": "alta",
    "foto_url": "https://...supabase.co/storage/v1/object/public/reportes-fotos/...",
    "foto_path": "reportes/1234567890-foto.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Crear Reporte (sin foto)

```bash
POST http://localhost:3000/reportes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "titulo": "Luz fundida en el pasillo",
  "descripcion": "La luz del pasillo principal no funciona",
  "ubicacion": "Edificio B, Pasillo principal",
  "prioridad": "media"
}
```

### 5. Listar Reportes

```bash
GET http://localhost:3000/reportes?estado=pendiente&prioridad=alta
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Parámetros opcionales:**
- `estado`: pendiente, en_proceso, resuelto, cerrado
- `prioridad`: baja, media, alta, urgente
- `limit`: número de resultados (ej: 10)
- `offset`: desplazamiento para paginación (ej: 0)

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "titulo": "Fuga de agua en el baño",
      "descripcion": "...",
      "estado": "pendiente",
      "prioridad": "alta",
      "usuario_nombre": "Juan",
      "usuario_apellido": "Pérez",
      "usuario_email": "usuario@ejemplo.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 6. Obtener Reporte por ID

```bash
GET http://localhost:3000/reportes/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuario_id": 1,
    "titulo": "Fuga de agua en el baño",
    "descripcion": "...",
    "estado": "pendiente",
    "prioridad": "alta",
    "foto_url": "https://...",
    "usuario_nombre": "Juan",
    "usuario_apellido": "Pérez",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 7. Actualizar Estado de Reporte

```bash
PUT http://localhost:3000/reportes/1/estado
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "estado": "en_proceso",
  "observaciones": "Se ha asignado un técnico para revisar el problema"
}
```

**Estados válidos:**
- `pendiente`
- `en_proceso`
- `resuelto`
- `cerrado`

**Respuesta:**
```json
{
  "success": true,
  "message": "Estado del reporte actualizado exitosamente",
  "data": {
    "id": 1,
    "estado": "en_proceso",
    "observaciones": "Se ha asignado un técnico para revisar el problema",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

## Permisos por Rol

### Alumno
- ✅ Crear reportes
- ✅ Ver sus propios reportes
- ❌ Actualizar estados

### Docente
- ✅ Crear reportes
- ✅ Ver reportes
- ❌ Actualizar estados

### Admin
- ✅ Crear reportes
- ✅ Ver todos los reportes
- ✅ Actualizar estados

### Mantenimiento
- ✅ Ver reportes
- ✅ Actualizar estados
- ✅ Cerrar reportes

## Notas Importantes

1. **Token JWT**: Todas las rutas de reportes requieren el header `Authorization: Bearer <token>`
2. **Fotos**: Máximo 5MB, formatos permitidos: jpeg, jpg, png, gif, webp
3. **Validaciones**: Todos los endpoints tienen validaciones de entrada
4. **Errores**: Los errores se devuelven con formato `{ success: false, message: "..." }`















