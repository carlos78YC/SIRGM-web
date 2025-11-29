# Cómo Registrar Usuarios Nuevos

Hay varias formas de registrar usuarios nuevos en el sistema SIRGM:

## Método 1: Script de PowerShell (Recomendado)

### Modo Interactivo

Ejecuta el script sin parámetros y te pedirá todos los datos:

```powershell
.\registrar-usuario.ps1
```

El script te pedirá:
- Email
- Password (se oculta mientras escribes)
- Nombre
- Apellido
- Rol (1=alumno, 2=docente, 3=admin, 4=mantenimiento)

### Modo con Parámetros

Puedes pasar todos los datos directamente:

```powershell
.\registrar-usuario.ps1 -Email "juan@ejemplo.com" -Password "Password123" -Nombre "Juan" -Apellido "Perez" -Rol "alumno"
```

### Ejemplos

**Registrar un alumno:**
```powershell
.\registrar-usuario.ps1 -Email "alumno1@ejemplo.com" -Password "Password123" -Nombre "María" -Apellido "García" -Rol "alumno"
```

**Registrar un docente:**
```powershell
.\registrar-usuario.ps1 -Email "docente1@ejemplo.com" -Password "Password123" -Nombre "Carlos" -Apellido "López" -Rol "docente"
```

**Registrar un admin:**
```powershell
.\registrar-usuario.ps1 -Email "admin2@ejemplo.com" -Password "Password123" -Nombre "Ana" -Apellido "Martínez" -Rol "admin"
```

**Registrar un técnico de mantenimiento:**
```powershell
.\registrar-usuario.ps1 -Email "tecnico1@ejemplo.com" -Password "Password123" -Nombre "Pedro" -Apellido "Sánchez" -Rol "mantenimiento"
```

## Método 2: Usando cURL

```powershell
$body = @{
    email = "usuario@ejemplo.com"
    password = "Password123"
    nombre = "Juan"
    apellido = "Perez"
    rol = "alumno"
} | ConvertTo-Json

curl.exe -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d $body
```

## Método 3: Usando PowerShell Invoke-RestMethod

```powershell
$registerBody = @{
    email = "usuario@ejemplo.com"
    password = "Password123"
    nombre = "Juan"
    apellido = "Perez"
    rol = "alumno"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $registerBody
```

## Método 4: Usando Postman o Insomnia

1. **Método**: POST
2. **URL**: `http://localhost:3000/auth/register`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (JSON):
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Perez",
  "rol": "alumno"
}
```

## Roles Disponibles

- **alumno**: Usuario básico, puede crear y ver sus propios reportes
- **docente**: Similar a alumno, puede crear y ver sus propios reportes
- **admin**: Acceso completo, puede ver todos los reportes y cambiar estados
- **mantenimiento**: Puede ver todos los reportes y cambiar estados

## Requisitos de Validación

### Email
- Debe ser un email válido
- No puede estar duplicado

### Password
- Mínimo 6 caracteres
- Debe contener al menos:
  - Una letra mayúscula
  - Una letra minúscula
  - Un número

### Nombre y Apellido
- Mínimo 2 caracteres
- Máximo 50 caracteres
- No pueden estar vacíos

### Rol
- Debe ser uno de: `alumno`, `docente`, `admin`, `mantenimiento`

## Respuesta Exitosa

Cuando el registro es exitoso, recibirás:

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Perez",
      "rol": "alumno"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

El **token** se puede usar para autenticarse en el dashboard o en las llamadas a la API.

## Errores Comunes

### Email ya registrado (409)
```
El email ya está registrado
```
**Solución**: Usa otro email o haz login en su lugar

### Contraseña inválida
```
La contraseña debe contener al menos una mayúscula, una minúscula y un número
```
**Solución**: Usa una contraseña que cumpla los requisitos

### Rol inválido
```
El rol debe ser: alumno, docente, admin o mantenimiento
```
**Solución**: Usa uno de los roles válidos

## Crear Múltiples Usuarios

Puedes crear un script para registrar varios usuarios a la vez:

```powershell
$usuarios = @(
    @{ email = "alumno1@ejemplo.com"; password = "Password123"; nombre = "Alumno"; apellido = "Uno"; rol = "alumno" },
    @{ email = "alumno2@ejemplo.com"; password = "Password123"; nombre = "Alumno"; apellido = "Dos"; rol = "alumno" },
    @{ email = "docente1@ejemplo.com"; password = "Password123"; nombre = "Docente"; apellido = "Uno"; rol = "docente" }
)

foreach ($usuario in $usuarios) {
    Write-Host "Registrando $($usuario.email)..." -ForegroundColor Blue
    $body = $usuario | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -ContentType "application/json" -Body $body
        Write-Host "✅ $($usuario.email) registrado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

## Notas Importantes

- El servidor backend debe estar corriendo en `http://localhost:3000`
- Los usuarios con rol `admin` o `mantenimiento` pueden cambiar estados de reportes
- Los usuarios con rol `alumno` o `docente` solo pueden ver sus propios reportes
- El token JWT expira según la configuración del backend (por defecto 7 días)









