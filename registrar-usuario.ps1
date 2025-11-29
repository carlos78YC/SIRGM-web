# Script para registrar un nuevo usuario
# Uso: .\registrar-usuario.ps1 -Email "usuario@ejemplo.com" -Password "Password123" -Nombre "Juan" -Apellido "Perez" -Rol "alumno"
# O simplemente: .\registrar-usuario.ps1 (modo interactivo)

param(
    [string]$Email = "",
    [string]$Password = "",
    [string]$Nombre = "",
    [string]$Apellido = "",
    [string]$Rol = ""
)

$baseUrl = "http://localhost:3000"

Write-Host "=== Registrar Nuevo Usuario ===" -ForegroundColor Cyan
Write-Host ""

# Modo interactivo si no se proporcionaron parámetros
if ([string]::IsNullOrEmpty($Email)) {
    Write-Host "Modo interactivo - Ingresa los datos del usuario:" -ForegroundColor Yellow
    Write-Host ""
    
    $Email = Read-Host "Email"
    $securePassword = Read-Host "Password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    $Nombre = Read-Host "Nombre"
    $Apellido = Read-Host "Apellido"
    
    Write-Host ""
    Write-Host "Roles disponibles:" -ForegroundColor Yellow
    Write-Host "  1. alumno" -ForegroundColor Gray
    Write-Host "  2. docente" -ForegroundColor Gray
    Write-Host "  3. admin" -ForegroundColor Gray
    Write-Host "  4. mantenimiento" -ForegroundColor Gray
    Write-Host ""
    
    $rolInput = Read-Host "Rol (1-4 o nombre)"
    
    switch ($rolInput) {
        "1" { $Rol = "alumno" }
        "2" { $Rol = "docente" }
        "3" { $Rol = "admin" }
        "4" { $Rol = "mantenimiento" }
        default { $Rol = $rolInput }
    }
}

# Validaciones
if ([string]::IsNullOrEmpty($Email)) {
    Write-Host "ERROR: El email es requerido" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($Password)) {
    Write-Host "ERROR: La contraseña es requerida" -ForegroundColor Red
    exit 1
}

if ($Password.Length -lt 6) {
    Write-Host "ERROR: La contraseña debe tener al menos 6 caracteres" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($Nombre)) {
    Write-Host "ERROR: El nombre es requerido" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($Apellido)) {
    Write-Host "ERROR: El apellido es requerido" -ForegroundColor Red
    exit 1
}

$rolesValidos = @("alumno", "docente", "admin", "mantenimiento")
if ([string]::IsNullOrEmpty($Rol) -or ($rolesValidos -notcontains $Rol.ToLower())) {
    Write-Host "ERROR: Rol inválido. Debe ser uno de: $($rolesValidos -join ', ')" -ForegroundColor Red
    exit 1
}

$Rol = $Rol.ToLower()

# Crear el cuerpo de la solicitud
$registerBody = @{
    email = $Email
    password = $Password
    nombre = $Nombre
    apellido = $Apellido
    rol = $Rol
} | ConvertTo-Json

Write-Host "Registrando usuario..." -ForegroundColor Blue
Write-Host "  Email: $Email" -ForegroundColor Gray
Write-Host "  Nombre: $Nombre $Apellido" -ForegroundColor Gray
Write-Host "  Rol: $Rol" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    
    if ($response.success) {
        Write-Host "✅ Usuario registrado exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Detalles del usuario:" -ForegroundColor Yellow
        Write-Host "  - ID: $($response.data.user.id)" -ForegroundColor Gray
        Write-Host "  - Email: $($response.data.user.email)" -ForegroundColor Gray
        Write-Host "  - Nombre: $($response.data.user.nombre) $($response.data.user.apellido)" -ForegroundColor Gray
        Write-Host "  - Rol: $($response.data.user.rol)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Token JWT:" -ForegroundColor Yellow
        Write-Host "  $($response.data.token)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Puedes usar este token para autenticarte en el dashboard o API" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ ERROR al registrar usuario" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "El email $Email ya está registrado" -ForegroundColor Yellow
        Write-Host "Intenta con otro email o usa el login en su lugar" -ForegroundColor Yellow
    } elseif ($_.ErrorDetails.Message) {
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Mensaje: $($errorJson.message)" -ForegroundColor Red
            if ($errorJson.errors) {
                Write-Host ""
                Write-Host "Errores de validación:" -ForegroundColor Yellow
                $errorJson.errors | ForEach-Object {
                    Write-Host "  - $($_.msg): $($_.param)" -ForegroundColor Red
                }
            }
        } catch {
            Write-Host "Respuesta del servidor: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Registro completado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

