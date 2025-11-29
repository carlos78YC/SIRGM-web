# Script para probar la subida de fotos
$baseUrl = "http://localhost:3000"

Write-Host "=== Prueba de Subida de Fotos ===" -ForegroundColor Cyan
Write-Host ""

# 1. Registrar o hacer login
Write-Host "1. Autenticando..." -ForegroundColor Blue
$email = "test-foto-$(Get-Date -Format 'yyyyMMddHHmmss')@ejemplo.com"
$password = "Password123"

# Intentar registrar
$registerBody = @{
    email = $email
    password = $password
    nombre = "Test"
    apellido = "Foto"
    rol = "alumno"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    $token = $registerResponse.data.token
    Write-Host "   OK - Usuario registrado: $email" -ForegroundColor Green
} catch {
    # Si falla, intentar login con un usuario existente
    Write-Host "   Intentando login..." -ForegroundColor Yellow
    $loginBody = @{
        email = "test-20251117202401@ejemplo.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
        $token = $loginResponse.data.token
        Write-Host "   OK - Login exitoso" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: No se pudo autenticar" -ForegroundColor Red
        exit 1
    }
}

# 2. Crear una imagen de prueba simple (PNG de 1x1 pixel en base64)
Write-Host "2. Creando imagen de prueba..." -ForegroundColor Blue
$testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$testImageBytes = [Convert]::FromBase64String($testImageBase64)
$testImagePath = "$env:TEMP\test-image-$(Get-Date -Format 'yyyyMMddHHmmss').png"

try {
    [System.IO.File]::WriteAllBytes($testImagePath, $testImageBytes)
    Write-Host "   OK - Imagen creada: $testImagePath" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: No se pudo crear la imagen" -ForegroundColor Red
    exit 1
}

# 3. Crear reporte con foto usando multipart/form-data
Write-Host "3. Subiendo reporte con foto..." -ForegroundColor Blue

# PowerShell necesita usar una forma especial para multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"titulo`""
$bodyLines += ""
$bodyLines += "Reporte con foto de prueba"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"descripcion`""
$bodyLines += ""
$bodyLines += "Este es un reporte de prueba que incluye una imagen subida desde PowerShell"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"ubicacion`""
$bodyLines += ""
$bodyLines += "Edificio de Pruebas, Piso 1"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"prioridad`""
$bodyLines += ""
$bodyLines += "media"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"foto`"; filename=`"test-image.png`""
$bodyLines += "Content-Type: image/png"
$bodyLines += ""
$bodyLines += [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString([System.IO.File]::ReadAllBytes($testImagePath))
$bodyLines += "--$boundary--"

$body = $bodyLines -join $LF
$bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $bodyBytes
    Write-Host "   OK - Reporte creado con foto!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Detalles del reporte:" -ForegroundColor Yellow
    Write-Host "   - ID: $($response.data.id)" -ForegroundColor Gray
    Write-Host "   - Titulo: $($response.data.titulo)" -ForegroundColor Gray
    Write-Host "   - Estado: $($response.data.estado)" -ForegroundColor Gray
    if ($response.data.foto_url) {
        Write-Host "   - Foto URL: $($response.data.foto_url)" -ForegroundColor Gray
        Write-Host "   - Foto Path: $($response.data.foto_path)" -ForegroundColor Gray
    } else {
        Write-Host "   - Foto: No se subio (verifica el bucket en Supabase)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Mensaje: $($errorJson.message)" -ForegroundColor Red
        if ($errorJson.error) {
            Write-Host "   Error detallado: $($errorJson.error)" -ForegroundColor Red
            if ($errorJson.error -like "*Bucket*") {
                Write-Host ""
                Write-Host "   IMPORTANTE: Necesitas crear el bucket 'reportes-fotos' en Supabase Storage" -ForegroundColor Yellow
                Write-Host "   1. Ve a tu proyecto en Supabase Dashboard" -ForegroundColor Yellow
                Write-Host "   2. Ve a Storage" -ForegroundColor Yellow
                Write-Host "   3. Crea un nuevo bucket llamado: reportes-fotos" -ForegroundColor Yellow
                Write-Host "   4. Configuralo como publico o con politicas RLS" -ForegroundColor Yellow
            }
        }
    }
}

# Limpiar archivo temporal
if (Test-Path $testImagePath) {
    Remove-Item $testImagePath
    Write-Host ""
    Write-Host "   Archivo temporal eliminado" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prueba completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""











