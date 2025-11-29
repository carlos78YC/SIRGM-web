# Script para probar la subida de una imagen REAL
# Uso: .\test-imagen-real.ps1 -RutaImagen "C:\ruta\a\tu\imagen.jpg"
# O simplemente: .\test-imagen-real.ps1 (buscará una imagen en ubicaciones comunes)

param(
    [string]$RutaImagen = ""
)

$baseUrl = "http://localhost:3000"

Write-Host "=== Prueba de Subida de Imagen Real ===" -ForegroundColor Cyan
Write-Host ""

# 1. Buscar o validar la imagen
Write-Host "1. Buscando imagen..." -ForegroundColor Blue

if ([string]::IsNullOrEmpty($RutaImagen)) {
    # Buscar en ubicaciones comunes
    $ubicacionesComunes = @(
        "$env:USERPROFILE\Pictures",
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\Downloads",
        "$PSScriptRoot"
    )
    
    $extensiones = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp")
    
    $imagenEncontrada = $null
    foreach ($ubicacion in $ubicacionesComunes) {
        if (Test-Path $ubicacion) {
            foreach ($ext in $extensiones) {
                $imagenes = Get-ChildItem -Path $ubicacion -Filter $ext -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($imagenes) {
                    $imagenEncontrada = $imagenes.FullName
                    break
                }
            }
            if ($imagenEncontrada) { break }
        }
    }
    
    if ($imagenEncontrada) {
        $RutaImagen = $imagenEncontrada
        Write-Host "   Imagen encontrada: $RutaImagen" -ForegroundColor Green
    } else {
        Write-Host "   No se encontró ninguna imagen automáticamente." -ForegroundColor Yellow
        Write-Host "   Por favor, especifica la ruta de la imagen:" -ForegroundColor Yellow
        Write-Host "   .\test-imagen-real.ps1 -RutaImagen `"C:\ruta\a\tu\imagen.jpg`"" -ForegroundColor Yellow
        exit 1
    }
} else {
    if (-not (Test-Path $RutaImagen)) {
        Write-Host "   ERROR: La imagen no existe en: $RutaImagen" -ForegroundColor Red
        exit 1
    }
    Write-Host "   Usando imagen: $RutaImagen" -ForegroundColor Green
}

# Validar que sea una imagen válida
$extensionesPermitidas = @(".jpg", ".jpeg", ".png", ".gif", ".webp")
$extension = [System.IO.Path]::GetExtension($RutaImagen).ToLower()
if ($extensionesPermitidas -notcontains $extension) {
    Write-Host "   ERROR: Formato no permitido. Usa: jpg, jpeg, png, gif o webp" -ForegroundColor Red
    exit 1
}

# Verificar tamaño (máximo 5MB)
$fileInfo = Get-Item $RutaImagen
$tamanoMB = [math]::Round($fileInfo.Length / 1MB, 2)
if ($fileInfo.Length -gt 5MB) {
    Write-Host "   ADVERTENCIA: La imagen es muy grande ($tamanoMB MB). Máximo permitido: 5MB" -ForegroundColor Yellow
    Write-Host "   Continuando de todas formas..." -ForegroundColor Yellow
} else {
    Write-Host "   Tamaño: $tamanoMB MB" -ForegroundColor Gray
}

# 2. Autenticación
Write-Host "2. Autenticando..." -ForegroundColor Blue
$email = "test-imagen-$(Get-Date -Format 'yyyyMMddHHmmss')@ejemplo.com"
$password = "Password123"

# Intentar registrar
$registerBody = @{
    email = $email
    password = $password
    nombre = "Test"
    apellido = "Imagen"
    rol = "alumno"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    $token = $registerResponse.data.token
    Write-Host "   OK - Usuario registrado: $email" -ForegroundColor Green
} catch {
    # Si falla, intentar login con un usuario existente
    Write-Host "   Intentando login con usuario existente..." -ForegroundColor Yellow
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
        Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 3. Subir reporte con imagen
Write-Host "3. Subiendo reporte con imagen..." -ForegroundColor Blue

# Obtener el nombre del archivo
$nombreArchivo = [System.IO.Path]::GetFileName($RutaImagen)

# Determinar Content-Type
$contentType = switch ($extension) {
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png" { "image/png" }
    ".gif" { "image/gif" }
    ".webp" { "image/webp" }
    default { "image/jpeg" }
}

# Crear multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"titulo`""
$bodyLines += ""
$bodyLines += "Reporte con imagen real - $nombreArchivo"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"descripcion`""
$bodyLines += ""
$bodyLines += "Este es un reporte de prueba que incluye una imagen real: $nombreArchivo ($tamanoMB MB)"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"ubicacion`""
$bodyLines += ""
$bodyLines += "Prueba con imagen real"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"prioridad`""
$bodyLines += ""
$bodyLines += "media"
$bodyLines += "--$boundary"
$bodyLines += "Content-Disposition: form-data; name=`"foto`"; filename=`"$nombreArchivo`""
$bodyLines += "Content-Type: $contentType"
$bodyLines += ""

# Leer el archivo de imagen
try {
    $imagenBytes = [System.IO.File]::ReadAllBytes($RutaImagen)
    $imagenString = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($imagenBytes)
    $bodyLines += $imagenString
} catch {
    Write-Host "   ERROR: No se pudo leer la imagen: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$bodyLines += "--$boundary--"

$body = $bodyLines -join $LF
$bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    Write-Host "   Enviando solicitud..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $bodyBytes
    
    Write-Host "   ✅ Reporte creado con imagen!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Detalles del reporte:" -ForegroundColor Yellow
    Write-Host "   - ID: $($response.data.id)" -ForegroundColor Gray
    Write-Host "   - Título: $($response.data.titulo)" -ForegroundColor Gray
    Write-Host "   - Estado: $($response.data.estado)" -ForegroundColor Gray
    Write-Host "   - Ubicación: $($response.data.ubicacion)" -ForegroundColor Gray
    if ($response.data.foto_url) {
        Write-Host "   - Foto URL: $($response.data.foto_url)" -ForegroundColor Cyan
        Write-Host "   - Foto Path: $($response.data.foto_path)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   🌐 Puedes ver la imagen en: $($response.data.foto_url)" -ForegroundColor Green
    } else {
        Write-Host "   - Foto: No se subió (verifica el bucket en Supabase)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "   Mensaje: $($errorJson.message)" -ForegroundColor Red
            if ($errorJson.error) {
                Write-Host "   Error detallado: $($errorJson.error)" -ForegroundColor Red
                if ($errorJson.error -like "*Bucket*") {
                    Write-Host ""
                    Write-Host "   ⚠️  IMPORTANTE: Necesitas crear el bucket 'reportes-fotos' en Supabase Storage" -ForegroundColor Yellow
                    Write-Host "   1. Ve a tu proyecto en Supabase Dashboard" -ForegroundColor Yellow
                    Write-Host "   2. Ve a Storage" -ForegroundColor Yellow
                    Write-Host "   3. Crea un nuevo bucket llamado: reportes-fotos" -ForegroundColor Yellow
                    Write-Host "   4. Configúralo como público o con políticas RLS" -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "   Respuesta del servidor: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prueba completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

