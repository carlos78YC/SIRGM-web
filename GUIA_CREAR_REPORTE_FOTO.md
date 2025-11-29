# 📸 Guía: Crear un Reporte con Foto

## 🚀 Opción 1: Usar el Script Automático (Recomendado)

He creado un script de PowerShell que te guía paso a paso:

```powershell
.\crear-reporte-con-foto.ps1
```

El script te pedirá:
1. ✅ Email y contraseña para hacer login
2. ✅ Título del reporte
3. ✅ Descripción
4. ✅ Ubicación
5. ✅ Prioridad (baja/media/alta/urgente)
6. ✅ Ruta de la imagen

---

## 🔧 Opción 2: Usar Postman o Thunder Client

### Paso 1: Hacer Login

**POST** `http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
  "email": "tu-email@ejemplo.com",
  "password": "tu-contraseña"
}
```

**Guarda el token** de la respuesta:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Paso 2: Crear Reporte con Foto

**POST** `http://localhost:3000/reportes`

**Headers:**
```
Authorization: Bearer [tu-token-aqui]
```

**Body (form-data):**
- `titulo`: "Fuga de agua en el baño"
- `descripcion`: "Hay una fuga constante de agua en el baño del segundo piso"
- `ubicacion`: "Edificio A, Segundo piso, Baño 2"
- `prioridad`: "alta" (opciones: baja, media, alta, urgente)
- `foto`: [Selecciona un archivo de imagen]

---

## 💻 Opción 3: Usar PowerShell Manualmente

```powershell
# 1. Hacer login
$loginBody = @{
    email = "tu-email@ejemplo.com"
    password = "tu-contraseña"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $loginResponse.data.token

# 2. Crear reporte con foto
$formFields = @{
    titulo = "Fuga de agua"
    descripcion = "Descripción del problema"
    ubicacion = "Edificio A"
    prioridad = "alta"
    foto = Get-Item "ruta/a/tu/imagen.jpg"
}

$response = Invoke-RestMethod -Uri "http://localhost:3000/reportes" `
    -Method POST `
    -Headers @{Authorization = "Bearer $token"} `
    -Form $formFields

$response
```

---

## 📋 Opción 4: Desde el Dashboard Web

Si el dashboard tiene un formulario para crear reportes:

1. Inicia sesión en `http://localhost:5173`
2. Busca la opción "Crear Reporte" o "Nuevo Reporte"
3. Completa el formulario
4. Selecciona una imagen
5. Envía el formulario

---

## ✅ Requisitos

### Formato de Imagen:
- ✅ **Permitidos**: JPG, JPEG, PNG, GIF, WEBP
- ❌ **No permitidos**: Otros formatos
- 📏 **Tamaño máximo**: 5MB

### Prioridades:
- `baja`
- `media`
- `alta`
- `urgente`

### Autenticación:
- ✅ Debes estar autenticado (tener un token JWT válido)
- ✅ Cualquier usuario autenticado puede crear reportes

---

## 📝 Ejemplo Completo

### Paso 1: Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "alumno@ejemplo.com",
  "password": "Password123"
}
```

### Paso 2: Crear Reporte
```bash
POST http://localhost:3000/reportes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
- titulo: "Luz fundida en el pasillo"
- descripcion: "La luz del pasillo principal no funciona y necesita reparación urgente"
- ubicacion: "Edificio B, Pasillo principal, Piso 1"
- prioridad: "media"
- foto: [seleccionar archivo imagen.jpg]
```

### Respuesta Exitosa:
```json
{
  "success": true,
  "message": "Reporte creado exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "titulo": "Luz fundida en el pasillo",
    "descripcion": "La luz del pasillo principal no funciona...",
    "ubicacion": "Edificio B, Pasillo principal, Piso 1",
    "estado": "pendiente",
    "prioridad": "media",
    "foto_url": "https://...supabase.co/storage/v1/object/public/reportes-fotos/reportes/1234567890-imagen.jpg",
    "foto_path": "reportes/1234567890-imagen.jpg",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Token no proporcionado"
- ✅ Asegúrate de incluir el header `Authorization: Bearer [token]`

### Error: "Token inválido" o "Token expirado"
- ✅ Haz login nuevamente para obtener un nuevo token

### Error: "Error al subir la foto"
- ✅ Verifica que el bucket `reportes-fotos` exista en Supabase Storage
- ✅ Verifica que la imagen sea menor a 5MB
- ✅ Verifica que el formato sea permitido (jpg, png, gif, webp)

### Error: "Solo se permiten imágenes"
- ✅ Verifica que el archivo sea una imagen válida
- ✅ Verifica la extensión del archivo

### La imagen no se muestra después de crear el reporte
- ✅ Verifica que el bucket de Supabase Storage sea público
- ✅ Verifica que la URL de la imagen sea accesible

---

## 💡 Tips

1. **Tamaño de imagen**: Comprime las imágenes grandes antes de subirlas para acelerar el proceso
2. **Formato recomendado**: JPG para fotos, PNG para capturas de pantalla
3. **Nombres descriptivos**: Nombra tus imágenes con nombres descriptivos (ej: `fuga-agua-baño.jpg`)
4. **Guardar token**: Si usas scripts, guarda el token para no tener que hacer login cada vez

---

## 🎯 Próximos Pasos

Después de crear el reporte:
1. ✅ Puedes verlo en el dashboard
2. ✅ Puedes verlo usando `GET /reportes/:id`
3. ✅ El personal de mantenimiento puede cambiar su estado
4. ✅ La foto quedará almacenada en Supabase Storage





