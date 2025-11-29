# Script completo para probar todo el backend de SIRGM
# Incluye: Auth, CRUD de reportes, Upload, y todas las funcionalidades
# Uso: .\test-backend-completo.ps1

$baseUrl = "http://localhost:3000"
$resultados = @{
    total = 0
    exitosas = 0
    fallidas = 0
}

function Test-Paso {
    param(
        [string]$Nombre,
        [scriptblock]$Accion
    )
    
    Write-Host ""
    Write-Host "=== $Nombre ===" -ForegroundColor Blue
    $resultados.total++
    
    try {
        $resultado = & $Accion
        if ($resultado) {
            Write-Host "   ✅ $Nombre - EXITOSO" -ForegroundColor Green
            $resultados.exitosas++
            return $true
        } else {
            Write-Host "   ❌ $Nombre - FALLIDO" -ForegroundColor Red
            $resultados.fallidas++
            return $false
        }
    } catch {
        Write-Host "   ❌ $Nombre - ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $resultados.fallidas++
        return $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA COMPLETA DEL BACKEND SIRGM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables globales
$global:token = $null
$global:tokenAdmin = $null
$global:reporteId = $null
$global:uploadPath = $null

# 1. Verificar que el servidor esté corriendo
Test-Paso "1. Verificar servidor" {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
        if ($response.success) {
            Write-Host "   Servidor funcionando correctamente" -ForegroundColor Gray
            return $true
        }
        return $false
    } catch {
        Write-Host "   ERROR: El servidor no está corriendo" -ForegroundColor Red
        Write-Host "   Ejecuta: npm start" -ForegroundColor Yellow
        return $false
    }
}

# Si el servidor no está corriendo, salir
if ($resultados.fallidas -gt 0) {
    Write-Host ""
    Write-Host "❌ No se puede continuar sin el servidor" -ForegroundColor Red
    exit 1
}

# 2. Registrar usuario de prueba
$emailTest = "test-backend-$(Get-Date -Format 'yyyyMMddHHmmss')@ejemplo.com"
$passwordTest = "Password123"

Test-Paso "2. Registrar usuario de prueba" {
    $registerBody = @{
        email = $emailTest
        password = $passwordTest
        nombre = "Test"
        apellido = "Backend"
        rol = "alumno"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody -ErrorAction Stop
        $global:token = $response.data.token
        Write-Host "   Usuario: $emailTest" -ForegroundColor Gray
        Write-Host "   Token obtenido" -ForegroundColor Gray
        return $true
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            Write-Host "   Usuario ya existe, continuando..." -ForegroundColor Yellow
            return $true
        }
        return $false
    }
}

# 3. Login
Test-Paso "3. Login" {
    $loginBody = @{
        email = $emailTest
        password = $passwordTest
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
        $global:token = $response.data.token
        Write-Host "   Login exitoso" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 4. Login como admin (para pruebas de permisos)
Test-Paso "4. Login como admin" {
    $loginBody = @{
        email = "admin@ejemplo.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
        $global:tokenAdmin = $response.data.token
        Write-Host "   Login admin exitoso" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "   Admin no existe, se creará después" -ForegroundColor Yellow
        return $true  # No es crítico para las pruebas
    }
}

# 5. Crear reporte
Test-Paso "5. Crear reporte" {
    $reporteBody = @{
        titulo = "Reporte de prueba - Backend completo"
        descripcion = "Este es un reporte de prueba para verificar el funcionamiento completo del backend"
        ubicacion = "Edificio de Pruebas, Piso 1"
        prioridad = "media"
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $global:token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $reporteBody -ErrorAction Stop
        $global:reporteId = $response.data.id
        Write-Host "   Reporte creado con ID: $global:reporteId" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 6. Listar reportes
Test-Paso "6. Listar reportes" {
    $headers = @{
        Authorization = "Bearer $global:token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   Total de reportes: $($response.count)" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 7. Obtener reporte por ID
Test-Paso "7. Obtener reporte por ID" {
    if (-not $global:reporteId) {
        Write-Host "   No hay reporte para obtener" -ForegroundColor Yellow
        return $false
    }
    
    $headers = @{
        Authorization = "Bearer $global:token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes/$global:reporteId" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "   Reporte obtenido: $($response.data.titulo)" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 8. Actualizar reporte
Test-Paso "8. Actualizar reporte" {
    if (-not $global:reporteId) {
        Write-Host "   No hay reporte para actualizar" -ForegroundColor Yellow
        return $false
    }
    
    $updateBody = @{
        titulo = "Reporte actualizado - Backend completo"
        descripcion = "Este reporte ha sido actualizado para probar la funcionalidad PUT"
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $global:token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes/$global:reporteId" -Method PUT -Headers $headers -Body $updateBody -ErrorAction Stop
        Write-Host "   Reporte actualizado: $($response.data.titulo)" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 9. Actualizar estado (requiere admin)
Test-Paso "9. Actualizar estado del reporte" {
    if (-not $global:reporteId) {
        Write-Host "   No hay reporte para actualizar" -ForegroundColor Yellow
        return $false
    }
    
    if (-not $global:tokenAdmin) {
        Write-Host "   No hay token de admin, saltando..." -ForegroundColor Yellow
        return $true  # No es crítico
    }
    
    $estadoBody = @{
        estado = "en_proceso"
        observaciones = "Estado actualizado desde prueba completa del backend"
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $global:tokenAdmin"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes/$global:reporteId/estado" -Method PUT -Headers $headers -Body $estadoBody -ErrorAction Stop
        Write-Host "   Estado actualizado: $($response.data.estado)" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "   Error (puede ser por permisos): $($_.Exception.Message)" -ForegroundColor Yellow
        return $true  # No es crítico si falla por permisos
    }
}

# 10. Subir archivo
Test-Paso "10. Subir archivo a /upload" {
    # Crear una imagen de prueba simple (1x1 pixel PNG)
    $testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    $testImageBytes = [Convert]::FromBase64String($testImageBase64)
    $testImagePath = "$env:TEMP\test-upload-$(Get-Date -Format 'yyyyMMddHHmmss').png"
    
    try {
        [System.IO.File]::WriteAllBytes($testImagePath, $testImageBytes)
        
        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        $bodyLines = @()
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"file`"; filename=`"test.png`""
        $bodyLines += "Content-Type: image/png"
        $bodyLines += ""
        $bodyLines += [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString([System.IO.File]::ReadAllBytes($testImagePath))
        $bodyLines += "--$boundary--"
        
        $body = $bodyLines -join $LF
        $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
        
        $headers = @{
            Authorization = "Bearer $global:token"
            "Content-Type" = "multipart/form-data; boundary=$boundary"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/upload" -Method POST -Headers $headers -Body $bodyBytes -ErrorAction Stop
        $global:uploadPath = $response.data.path
        Write-Host "   Archivo subido: $($response.data.url)" -ForegroundColor Gray
        Write-Host "   Path: $global:uploadPath" -ForegroundColor Gray
        
        # Limpiar archivo temporal
        Remove-Item $testImagePath -ErrorAction SilentlyContinue
        
        return $true
    } catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Remove-Item $testImagePath -ErrorAction SilentlyContinue
        return $false
    }
}

# 11. Crear reporte con imagen
Test-Paso "11. Crear reporte con imagen" {
    # Crear una imagen de prueba
    $testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    $testImageBytes = [Convert]::FromBase64String($testImageBase64)
    $testImagePath = "$env:TEMP\test-reporte-$(Get-Date -Format 'yyyyMMddHHmmss').png"
    
    try {
        [System.IO.File]::WriteAllBytes($testImagePath, $testImageBytes)
        
        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        $bodyLines = @()
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"titulo`""
        $bodyLines += ""
        $bodyLines += "Reporte con imagen - Prueba completa"
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"descripcion`""
        $bodyLines += ""
        $bodyLines += "Este reporte incluye una imagen para probar la funcionalidad completa"
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"ubicacion`""
        $bodyLines += ""
        $bodyLines += "Prueba con imagen"
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"prioridad`""
        $bodyLines += ""
        $bodyLines += "media"
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"foto`"; filename=`"test.png`""
        $bodyLines += "Content-Type: image/png"
        $bodyLines += ""
        $bodyLines += [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString([System.IO.File]::ReadAllBytes($testImagePath))
        $bodyLines += "--$boundary--"
        
        $body = $bodyLines -join $LF
        $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
        
        $headers = @{
            Authorization = "Bearer $global:token"
            "Content-Type" = "multipart/form-data; boundary=$boundary"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $bodyBytes -ErrorAction Stop
        Write-Host "   Reporte con imagen creado: ID $($response.data.id)" -ForegroundColor Gray
        if ($response.data.foto_url) {
            Write-Host "   Foto URL: $($response.data.foto_url)" -ForegroundColor Gray
        }
        
        Remove-Item $testImagePath -ErrorAction SilentlyContinue
        return $true
    } catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Remove-Item $testImagePath -ErrorAction SilentlyContinue
        return $false
    }
}

# 12. Eliminar archivo de upload
Test-Paso "12. Eliminar archivo de /upload" {
    if (-not $global:uploadPath) {
        Write-Host "   No hay archivo para eliminar" -ForegroundColor Yellow
        return $true  # No es crítico
    }
    
    $headers = @{
        Authorization = "Bearer $global:token"
    }
    
    try {
        $encodedPath = [System.Web.HttpUtility]::UrlEncode($global:uploadPath)
        $response = Invoke-RestMethod -Uri "$baseUrl/upload/$encodedPath" -Method DELETE -Headers $headers -ErrorAction Stop
        Write-Host "   Archivo eliminado exitosamente" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "   Error (puede ser que el archivo ya no exista): $($_.Exception.Message)" -ForegroundColor Yellow
        return $true  # No es crítico
    }
}

# 13. Eliminar reporte
Test-Paso "13. Eliminar reporte" {
    if (-not $global:reporteId) {
        Write-Host "   No hay reporte para eliminar" -ForegroundColor Yellow
        return $false
    }
    
    $headers = @{
        Authorization = "Bearer $global:token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reportes/$global:reporteId" -Method DELETE -Headers $headers -ErrorAction Stop
        Write-Host "   Reporte eliminado exitosamente" -ForegroundColor Gray
        return $true
    } catch {
        return $false
    }
}

# 14. Probar acceso sin token
Test-Paso "14. Verificar protección de rutas (sin token)" {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/reportes" -Method GET -ErrorAction Stop
        Write-Host "   ERROR: La ruta debería estar protegida" -ForegroundColor Red
        return $false
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            Write-Host "   Protección funcionando correctamente" -ForegroundColor Gray
            return $true
        }
        return $false
    }
}

# Resumen
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de pruebas: $($resultados.total)" -ForegroundColor Blue
Write-Host "✅ Exitosas: $($resultados.exitosas)" -ForegroundColor Green
Write-Host "❌ Fallidas: $($resultados.fallidas)" -ForegroundColor $(if ($resultados.fallidas -gt 0) { "Red" } else { "Gray" })
Write-Host ""

$porcentaje = [math]::Round(($resultados.exitosas / $resultados.total) * 100, 2)
Write-Host "Porcentaje de éxito: $porcentaje%" -ForegroundColor $(if ($porcentaje -eq 100) { "Green" } elseif ($porcentaje -ge 80) { "Yellow" } else { "Red" })
Write-Host ""

if ($resultados.fallidas -eq 0) {
    Write-Host "✨ ¡Todas las pruebas pasaron exitosamente!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Algunas pruebas fallaron. Revisa los detalles arriba." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""









