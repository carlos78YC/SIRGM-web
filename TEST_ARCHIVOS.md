# Guía para Probar Endpoints con Archivos

## Opción 1: Usar el Script de Prueba Automatizado

### Requisitos
```bash
npm install form-data
```

### Ejecutar
```bash
node scripts/testWithFile.js
```

Este script:
- Crea un archivo de imagen de prueba
- Hace login automáticamente
- Sube el reporte con la imagen
- Limpia los archivos temporales

## Opción 2: Usar cURL (Línea de Comandos)

### 1. Primero, obtener un token de autenticación

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alumno@ejemplo.com\",\"password\":\"Password123\"}"
```

Guarda el token de la respuesta (campo `data.token`).

### 2. Crear reporte con archivo

```bash
# Reemplaza YOUR_TOKEN con el token obtenido
# Reemplaza /ruta/a/tu/imagen.jpg con la ruta a tu imagen

curl -X POST http://localhost:3000/reportes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "titulo=Fuga de agua" \
  -F "descripcion=Descripción del problema" \
  -F "ubicacion=Edificio A, Piso 2" \
  -F "prioridad=alta" \
  -F "foto=@/ruta/a/tu/imagen.jpg"
```

### Ejemplo completo (Windows PowerShell)

```powershell
# 1. Login y guardar token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"alumno@ejemplo.com","password":"Password123"}'

$token = $loginResponse.data.token

# 2. Crear reporte con archivo
$formData = @{
    titulo = "Fuga de agua"
    descripcion = "Descripción del problema"
    ubicacion = "Edificio A, Piso 2"
    prioridad = "alta"
    foto = Get-Item "C:\ruta\a\tu\imagen.jpg"
}

Invoke-RestMethod -Uri "http://localhost:3000/reportes" `
  -Method POST `
  -Headers @{Authorization = "Bearer $token"} `
  -Form $formData
```

## Opción 3: Usar Postman

### Configuración

1. **Crear una nueva petición POST** a `http://localhost:3000/reportes`

2. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN` (obtenido del login)

3. **Body:**
   - Seleccionar `form-data`
   - Agregar los siguientes campos:
     - `titulo` (Text): "Fuga de agua"
     - `descripcion` (Text): "Descripción del problema"
     - `ubicacion` (Text): "Edificio A, Piso 2"
     - `prioridad` (Text): "alta"
     - `foto` (File): Seleccionar una imagen

4. **Enviar la petición**

### Colección de Postman

Puedes crear una colección con estas peticiones:

1. **Login**
   - Method: POST
   - URL: `http://localhost:3000/auth/register` o `/auth/login`
   - Body (raw JSON):
   ```json
   {
     "email": "alumno@ejemplo.com",
     "password": "Password123"
   }
   ```

2. **Crear Reporte con Archivo**
   - Method: POST
   - URL: `http://localhost:3000/reportes`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data (como se describe arriba)

## Opción 4: Usar HTTPie (si está instalado)

```bash
# Login
http POST http://localhost:3000/auth/login \
  email=alumno@ejemplo.com \
  password=Password123

# Crear reporte con archivo (usar el token obtenido)
http POST http://localhost:3000/reportes \
  Authorization:"Bearer YOUR_TOKEN" \
  titulo="Fuga de agua" \
  descripcion="Descripción" \
  ubicacion="Edificio A" \
  prioridad="alta" \
  foto@/ruta/a/imagen.jpg
```

## Validaciones de Archivos

El servidor valida:
- **Tipos permitidos:** jpeg, jpg, png, gif, webp
- **Tamaño máximo:** 5MB
- **Campo requerido:** `foto` (opcional, pero si se envía debe ser válido)

## Notas

- El archivo se sube temporalmente y luego se mueve a Supabase Storage
- La URL pública del archivo se devuelve en la respuesta como `foto_url`
- Si no envías un archivo, el reporte se crea sin foto (campo opcional)












