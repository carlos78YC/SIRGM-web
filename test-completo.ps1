# Script para probar todos los endpoints de la API
Write-Host "🚀 Iniciando pruebas completas de la API..." -ForegroundColor Cyan
Write-Host ""

# Configuración
$baseUrl = "http://localhost:3000"
$email = "test-$(Get-Date -Format 'yyyyMMddHHmmss')@ejemplo.com"
$password = "Password123"

Write-Host "📧 Email de prueba: $email" -ForegroundColor Yellow
Write-Host ""

# ============================================
# PASO 1: Registrar un usuario
# ============================================
Write-Host "=== 1. Registrando usuario ===" -ForegroundColor Blue
try {
    $registerBody = @{
        email = $email
        password = $password
        nombre = "Juan"
        apellido = "Pérez"
        rol = "alumno"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody

    Write-Host "✅ Usuario registrado exitosamente" -ForegroundColor Green
    $token = $registerResponse.data.token
    $userId = $registerResponse.data.user.id
    Write-Host "   ID: $userId" -ForegroundColor Gray
    if ($token) {
        Write-Host "   Token: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al registrar usuario: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# ============================================
# PASO 2: Login (por si acaso)
# ============================================
Write-Host "=== 2. Haciendo login ===" -ForegroundColor Blue
try {
    $loginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    Write-Host "✅ Login exitoso" -ForegroundColor Green
    $token = $loginResponse.data.token
    if ($token) {
        Write-Host "   Token actualizado: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al hacer login: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# ============================================
# PASO 3: Crear un reporte (SIN foto)
# ============================================
Write-Host "=== 3. Creando reporte sin foto ===" -ForegroundColor Blue
try {
    $reporteBody = @{
        titulo = "Fuga de agua en el baño"
        descripcion = "Hay una fuga constante de agua en el baño del segundo piso que necesita reparación urgente"
        ubicacion = "Edificio A, Segundo piso, Baño 2"
        prioridad = "alta"
    } | ConvertTo-Json

    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $reporteResponse = Invoke-RestMethod -Uri "$baseUrl/reportes" `
        -Method POST `
        -Headers $headers `
        -Body $reporteBody

    Write-Host "✅ Reporte creado exitosamente" -ForegroundColor Green
    $reporteId = $reporteResponse.data.id
    Write-Host "   ID del reporte: $reporteId" -ForegroundColor Gray
    Write-Host "   Título: $($reporteResponse.data.titulo)" -ForegroundColor Gray
    Write-Host "   Estado: $($reporteResponse.data.estado)" -ForegroundColor Gray
    Write-Host "   Prioridad: $($reporteResponse.data.prioridad)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear reporte: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# ============================================
# PASO 4: Listar reportes
# ============================================
Write-Host "=== 4. Listando reportes ===" -ForegroundColor Blue
try {
    $headers = @{
        Authorization = "Bearer $token"
    }

    $listResponse = Invoke-RestMethod -Uri "$baseUrl/reportes" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ Reportes obtenidos exitosamente" -ForegroundColor Green
    Write-Host "   Total de reportes: $($listResponse.count)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Reportes:" -ForegroundColor Yellow
    foreach ($reporte in $listResponse.data) {
        $info = "   - ID: $($reporte.id) - $($reporte.titulo) - Estado: $($reporte.estado) - Prioridad: $($reporte.prioridad)"
        Write-Host $info -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar reportes: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# ============================================
# PASO 5: Ver un reporte específico
# ============================================
Write-Host "=== 5. Obteniendo reporte específico (ID: $reporteId) ===" -ForegroundColor Blue
try {
    $headers = @{
        Authorization = "Bearer $token"
    }

    $detalleResponse = Invoke-RestMethod -Uri "$baseUrl/reportes/$reporteId" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ Reporte obtenido exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Detalles del reporte:" -ForegroundColor Yellow
    Write-Host "   - ID: $($detalleResponse.data.id)" -ForegroundColor Gray
    Write-Host "   - Título: $($detalleResponse.data.titulo)" -ForegroundColor Gray
    Write-Host "   - Descripción: $($detalleResponse.data.descripcion)" -ForegroundColor Gray
    Write-Host "   - Ubicación: $($detalleResponse.data.ubicacion)" -ForegroundColor Gray
    Write-Host "   - Estado: $($detalleResponse.data.estado)" -ForegroundColor Gray
    Write-Host "   - Prioridad: $($detalleResponse.data.prioridad)" -ForegroundColor Gray
    Write-Host "   - Creado por: $($detalleResponse.data.usuario_nombre) $($detalleResponse.data.usuario_apellido)" -ForegroundColor Gray
    Write-Host "   - Fecha: $($detalleResponse.data.created_at)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener reporte: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# ============================================
# PASO 6: Crear otro reporte con diferentes parámetros
# ============================================
Write-Host "=== 6. Creando segundo reporte (prioridad media) ===" -ForegroundColor Blue
try {
    $reporteBody2 = @{
        titulo = "Luz fundida en el pasillo"
        descripcion = "La luz del pasillo principal no funciona desde hace varios días"
        ubicacion = "Edificio B, Pasillo principal, Planta baja"
        prioridad = "media"
    } | ConvertTo-Json

    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $reporteResponse2 = Invoke-RestMethod -Uri "$baseUrl/reportes" `
        -Method POST `
        -Headers $headers `
        -Body $reporteBody2

    Write-Host "✅ Segundo reporte creado exitosamente" -ForegroundColor Green
    Write-Host "   ID del reporte: $($reporteResponse2.data.id)" -ForegroundColor Gray
    Write-Host "   Título: $($reporteResponse2.data.titulo)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear segundo reporte: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# PASO 7: Listar reportes con filtros
# ============================================
Write-Host "=== 7. Listando reportes con filtros ===" -ForegroundColor Blue
try {
    $headers = @{
        Authorization = "Bearer $token"
    }

    $filterUrl = "$baseUrl/reportes?estado=pendiente`&prioridad=alta"
    $filteredResponse = Invoke-RestMethod -Uri $filterUrl `
        -Method GET `
        -Headers $headers

    Write-Host "✅ Reportes filtrados obtenidos exitosamente" -ForegroundColor Green
    Write-Host "   Total de reportes filtrados: $($filteredResponse.count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar reportes filtrados: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# RESUMEN FINAL
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor Yellow
Write-Host "   - Usuario registrado: $email" -ForegroundColor Gray
Write-Host "   - Login exitoso" -ForegroundColor Gray
Write-Host "   - Reportes creados: 2" -ForegroundColor Gray
Write-Host "   - Endpoints probados: 5" -ForegroundColor Gray
Write-Host ""
if ($token) {
    Write-Host "💡 Token guardado (util para mas pruebas):" -ForegroundColor Yellow
    Write-Host "   $token" -ForegroundColor Gray
    Write-Host ""
}

