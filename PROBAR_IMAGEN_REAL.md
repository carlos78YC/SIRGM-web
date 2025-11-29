# Cómo Probar con una Imagen Real

Este documento explica cómo probar la subida de reportes con una imagen real usando diferentes métodos.

## Método 1: Script de PowerShell (Recomendado)

### Opción A: Buscar automáticamente una imagen

El script buscará automáticamente una imagen en ubicaciones comunes (Pictures, Desktop, Downloads):

```powershell
.\test-imagen-real.ps1
```

### Opción B: Especificar la ruta de la imagen

```powershell
.\test-imagen-real.ps1 -RutaImagen "C:\Users\TuUsuario\Pictures\mi-foto.jpg"
```

### Requisitos

- El servidor debe estar corriendo (`npm start`)
- Debes tener una imagen en formato: jpg, jpeg, png, gif o webp
- Tamaño máximo: 5MB (el script te avisará si es más grande)

## Método 2: Usando cURL (Windows)

### Paso 1: Obtener un token de autenticación

```powershell
# Registrar un nuevo usuario
$registerBody = @{
    email = "test@ejemplo.com"
    password = "Password123"
    nombre = "Test"
    apellido = "Usuario"
    rol = "alumno"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
$token = $registerResponse.data.token
Write-Host "Token: $token"
```

O hacer login:

```powershell
$loginBody = @{
    email = "test@ejemplo.com"
    password = "Password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.data.token
Write-Host "Token: $token"
```

### Paso 2: Subir el reporte con imagen usando cURL

```powershell
# Reemplaza TU_TOKEN con el token obtenido
# Reemplaza C:\ruta\a\tu\imagen.jpg con la ruta real de tu imagen

curl -X POST http://localhost:3000/reportes `
  -H "Authorization: Bearer TU_TOKEN" `
  -F "titulo=Reporte con imagen real" `
  -F "descripcion=Esta es una prueba con una imagen real" `
  -F "ubicacion=Edificio de Pruebas" `
  -F "prioridad=media" `
  -F "foto=@C:\ruta\a\tu\imagen.jpg"
```

### Ejemplo completo con PowerShell

```powershell
# 1. Login
$loginBody = @{
    email = "test@ejemplo.com"
    password = "Password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.data.token

# 2. Subir imagen
$rutaImagen = "C:\Users\TuUsuario\Pictures\mi-foto.jpg"

curl.exe -X POST http://localhost:3000/reportes `
  -H "Authorization: Bearer $token" `
  -F "titulo=Reporte con imagen real" `
  -F "descripcion=Prueba con imagen real" `
  -F "ubicacion=Prueba" `
  -F "prioridad=media" `
  -F "foto=@$rutaImagen"
```

## Método 3: Usando Postman

1. **Crear una nueva solicitud POST** a `http://localhost:3000/reportes`

2. **En la pestaña Headers**, agregar:
   - Key: `Authorization`
   - Value: `Bearer TU_TOKEN`

3. **En la pestaña Body**, seleccionar `form-data`

4. **Agregar los campos**:
   - `titulo` (Text): "Reporte con imagen real"
   - `descripcion` (Text): "Prueba con imagen"
   - `ubicacion` (Text): "Prueba"
   - `prioridad` (Text): "media"
   - `foto` (File): Seleccionar tu imagen

5. **Enviar la solicitud**

## Método 4: Usando Node.js (script)

Si prefieres usar el script de Node.js con una imagen real:

1. Edita `scripts/testWithFile.js` y cambia la línea 97 para usar tu imagen:

```javascript
const testImagePath = path.join(__dirname, '..', 'ruta', 'a', 'tu', 'imagen.jpg');
```

2. Ejecuta:

```bash
node scripts/testWithFile.js
```

## Verificar que Funcionó

Después de subir la imagen, deberías recibir una respuesta como:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Reporte con imagen real",
    "foto_url": "https://tu-proyecto.supabase.co/storage/v1/object/public/reportes-fotos/...",
    "foto_path": "reportes-fotos/..."
  }
}
```

Puedes copiar la `foto_url` y abrirla en tu navegador para verificar que la imagen se subió correctamente.

## Solución de Problemas

### Error: "Bucket no encontrado"

Necesitas crear el bucket en Supabase:
1. Ve a tu proyecto en Supabase Dashboard
2. Ve a Storage
3. Crea un nuevo bucket llamado: `reportes-fotos`
4. Configúralo como público o con políticas RLS

### Error: "Formato no permitido"

Solo se permiten imágenes en formato: jpg, jpeg, png, gif, webp

### Error: "Archivo muy grande"

El tamaño máximo permitido es 5MB. Comprime o redimensiona tu imagen.

### Error: "No se pudo autenticar"

Asegúrate de tener un usuario registrado o usa el script que crea uno automáticamente.









