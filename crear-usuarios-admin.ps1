# Script para crear usuarios admin y mantenimiento
# Uso: .\crear-usuarios-admin.ps1

$baseUrl = "http://localhost:3000"

Write-Host "=== Crear Usuarios Admin y Mantenimiento ===" -ForegroundColor Cyan
Write-Host ""

# Usuarios a crear
$usuarios = @(
    @{
        email = "admin@ejemplo.com"
        password = "Password123"
        nombre = "Admin"
        apellido = "Sistema"
        rol = "admin"
    },
    @{
        email = "mantenimiento@ejemplo.com"
        password = "Password123"
        nombre = "Mantenimiento"
        apellido = "Tecnico"
        rol = "mantenimiento"
    }
)

$usuariosCreados = 0
$usuariosExistentes = 0
$errores = 0

foreach ($usuario in $usuarios) {
    Write-Host "Registrando $($usuario.rol): $($usuario.email)..." -ForegroundColor Blue
    
    $registerBody = @{
        email = $usuario.email
        password = $usuario.password
        nombre = $usuario.nombre
        apellido = $usuario.apellido
        rol = $usuario.rol
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
        
        if ($response.success) {
            Write-Host "   ✅ Usuario $($usuario.rol) creado exitosamente" -ForegroundColor Green
            Write-Host "      - ID: $($response.data.user.id)" -ForegroundColor Gray
            Write-Host "      - Email: $($response.data.user.email)" -ForegroundColor Gray
            Write-Host "      - Rol: $($response.data.user.rol)" -ForegroundColor Gray
            $usuariosCreados++
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            Write-Host "   ⚠️  El usuario $($usuario.email) ya existe" -ForegroundColor Yellow
            $usuariosExistentes++
        } else {
            Write-Host "   ❌ Error al crear usuario: $($_.Exception.Message)" -ForegroundColor Red
            if ($_.ErrorDetails.Message) {
                try {
                    $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
                    Write-Host "      Mensaje: $($errorJson.message)" -ForegroundColor Red
                } catch {
                    Write-Host "      Respuesta: $($_.ErrorDetails.Message)" -ForegroundColor Red
                }
            }
            $errores++
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumen:" -ForegroundColor Yellow
Write-Host "  - Usuarios creados: $usuariosCreados" -ForegroundColor Green
Write-Host "  - Usuarios existentes: $usuariosExistentes" -ForegroundColor Yellow
Write-Host "  - Errores: $errores" -ForegroundColor $(if ($errores -gt 0) { "Red" } else { "Gray" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($usuariosCreados -gt 0 -or $usuariosExistentes -gt 0) {
    Write-Host "Credenciales de acceso:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Admin:" -ForegroundColor Cyan
    Write-Host "  Email: admin@ejemplo.com" -ForegroundColor Gray
    Write-Host "  Password: Password123" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Mantenimiento:" -ForegroundColor Cyan
    Write-Host "  Email: mantenimiento@ejemplo.com" -ForegroundColor Gray
    Write-Host "  Password: Password123" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ahora puedes usar test-actualizar-estado.ps1 para probar la actualización de estados" -ForegroundColor Green
}









