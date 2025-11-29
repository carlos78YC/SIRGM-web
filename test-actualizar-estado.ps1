# Script para probar la actualización de estado de un reporte
# Uso: .\test-actualizar-estado.ps1 -ReporteId 1 -Estado "en_proceso" -Observaciones "Trabajando en ello"
# O simplemente: .\test-actualizar-estado.ps1 (te mostrará los reportes disponibles)

param(
    [int]$ReporteId = 0,
    [string]$Estado = "",
    [string]$Observaciones = ""
)

$baseUrl = "http://localhost:3000"

Write-Host "=== Prueba de Actualización de Estado ===" -ForegroundColor Cyan
Write-Host ""

# Estados válidos
$estadosValidos = @("pendiente", "en_proceso", "resuelto", "cerrado")

# 1. Autenticación (necesita ser admin o mantenimiento)
Write-Host "1. Autenticando..." -ForegroundColor Blue

# Intentar login con usuario admin o mantenimiento
$loginBody = @{
    email = "admin@ejemplo.com"
    password = "Password123"
} | ConvertTo-Json

$token = $null
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.data.token
    $rol = $loginResponse.data.user.rol
    Write-Host "   OK - Login exitoso como: $rol" -ForegroundColor Green
} catch {
    Write-Host "   Intentando con usuario mantenimiento..." -ForegroundColor Yellow
    $loginBody = @{
        email = "mantenimiento@ejemplo.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
        $token = $loginResponse.data.token
        $rol = $loginResponse.data.user.rol
        Write-Host "   OK - Login exitoso como: $rol" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: No se pudo autenticar" -ForegroundColor Red
        Write-Host "   Necesitas un usuario con rol 'admin' o 'mantenimiento'" -ForegroundColor Yellow
        Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Verificar que el rol tenga permisos
if ($rol -ne "admin" -and $rol -ne "mantenimiento") {
    Write-Host "   ERROR: Tu rol ($rol) no tiene permisos para actualizar estados" -ForegroundColor Red
    Write-Host "   Necesitas ser 'admin' o 'mantenimiento'" -ForegroundColor Yellow
    exit 1
}

# 2. Obtener lista de reportes
Write-Host "2. Obteniendo lista de reportes..." -ForegroundColor Blue

try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $reportesResponse = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method GET -Headers $headers
    $reportes = $reportesResponse.data
    
    if ($reportes.Count -eq 0) {
        Write-Host "   No hay reportes disponibles" -ForegroundColor Yellow
        Write-Host "   Crea un reporte primero usando test-simple.ps1 o test-imagen-real.ps1" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "   OK - Encontrados $($reportes.Count) reporte(s)" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Reportes disponibles:" -ForegroundColor Yellow
    foreach ($reporte in $reportes) {
        Write-Host "   - ID: $($reporte.id) | Título: $($reporte.titulo) | Estado: $($reporte.estado)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ERROR: No se pudieron obtener los reportes" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Si no se especificó ID, pedir al usuario
if ($ReporteId -eq 0) {
    Write-Host ""
    $ReporteId = Read-Host "   Ingresa el ID del reporte a actualizar"
    try {
        $ReporteId = [int]$ReporteId
    } catch {
        Write-Host "   ERROR: ID inválido" -ForegroundColor Red
        exit 1
    }
}

# Verificar que el reporte existe
$reporteSeleccionado = $reportes | Where-Object { $_.id -eq $ReporteId }
if (-not $reporteSeleccionado) {
    Write-Host "   ERROR: No se encontró el reporte con ID $ReporteId" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "   Reporte seleccionado:" -ForegroundColor Yellow
Write-Host "   - ID: $($reporteSeleccionado.id)" -ForegroundColor Gray
Write-Host "   - Título: $($reporteSeleccionado.titulo)" -ForegroundColor Gray
Write-Host "   - Estado actual: $($reporteSeleccionado.estado)" -ForegroundColor Gray

# 4. Si no se especificó estado, pedir al usuario
if ([string]::IsNullOrEmpty($Estado)) {
    Write-Host ""
    Write-Host "   Estados válidos: $($estadosValidos -join ', ')" -ForegroundColor Yellow
    $Estado = Read-Host "   Ingresa el nuevo estado"
}

# Validar estado
if ($estadosValidos -notcontains $Estado) {
    Write-Host "   ERROR: Estado inválido. Debe ser uno de: $($estadosValidos -join ', ')" -ForegroundColor Red
    exit 1
}

# 5. Si no se especificaron observaciones, preguntar si quiere agregar
if ([string]::IsNullOrEmpty($Observaciones)) {
    Write-Host ""
    $agregarObs = Read-Host "   ¿Deseas agregar observaciones? (s/n)"
    if ($agregarObs -eq "s" -or $agregarObs -eq "S") {
        $Observaciones = Read-Host "   Ingresa las observaciones"
    }
}

# 6. Actualizar estado
Write-Host ""
Write-Host "3. Actualizando estado del reporte..." -ForegroundColor Blue

$updateBody = @{
    estado = $Estado
}

if (-not [string]::IsNullOrEmpty($Observaciones)) {
    $updateBody.observaciones = $Observaciones
}

$updateBodyJson = $updateBody | ConvertTo-Json

try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/reportes/$ReporteId/estado" -Method PUT -Headers $headers -Body $updateBodyJson
    
    Write-Host "   ✅ Estado actualizado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Detalles del reporte actualizado:" -ForegroundColor Yellow
    Write-Host "   - ID: $($updateResponse.data.id)" -ForegroundColor Gray
    Write-Host "   - Título: $($updateResponse.data.titulo)" -ForegroundColor Gray
    Write-Host "   - Estado anterior: $($reporteSeleccionado.estado)" -ForegroundColor Gray
    Write-Host "   - Estado nuevo: $($updateResponse.data.estado)" -ForegroundColor Green
    if ($updateResponse.data.observaciones) {
        Write-Host "   - Observaciones: $($updateResponse.data.observaciones)" -ForegroundColor Gray
    }
    if ($updateResponse.data.cerrado_at) {
        Write-Host "   - Cerrado en: $($updateResponse.data.cerrado_at)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "   Mensaje: $($errorJson.message)" -ForegroundColor Red
            if ($errorJson.error) {
                Write-Host "   Error detallado: $($errorJson.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "   Respuesta del servidor: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prueba completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""









