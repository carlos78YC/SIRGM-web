# Script simplificado para probar todos los endpoints
$baseUrl = "http://localhost:3000"
$email = "test-$(Get-Date -Format 'yyyyMMddHHmmss')@ejemplo.com"
$password = "Password123"

Write-Host "Iniciando pruebas..." -ForegroundColor Cyan
Write-Host ""

# 1. Registrar usuario
Write-Host "1. Registrando usuario..." -ForegroundColor Blue
$registerBody = @{
    email = $email
    password = $password
    nombre = "Juan"
    apellido = "Perez"
    rol = "alumno"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "   OK - Usuario registrado: $email" -ForegroundColor Green
    $token = $registerResponse.data.token
    $userId = $registerResponse.data.user.id
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Login
Write-Host "2. Haciendo login..." -ForegroundColor Blue
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "   OK - Login exitoso" -ForegroundColor Green
    $token = $loginResponse.data.token
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Crear reporte 1
Write-Host "3. Creando reporte 1..." -ForegroundColor Blue
$reporte1 = @{
    titulo = "Fuga de agua en el bano"
    descripcion = "Hay una fuga constante de agua en el bano del segundo piso"
    ubicacion = "Edificio A, Segundo piso, Bano 2"
    prioridad = "alta"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $reporteResponse1 = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $reporte1
    $reporteId1 = $reporteResponse1.data.id
    Write-Host "   OK - Reporte creado con ID: $reporteId1" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Crear reporte 2
Write-Host "4. Creando reporte 2..." -ForegroundColor Blue
$reporte2 = @{
    titulo = "Luz fundida en el pasillo"
    descripcion = "La luz del pasillo principal no funciona"
    ubicacion = "Edificio B, Pasillo principal"
    prioridad = "media"
} | ConvertTo-Json

try {
    $reporteResponse2 = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method POST -Headers $headers -Body $reporte2
    $reporteId2 = $reporteResponse2.data.id
    Write-Host "   OK - Reporte creado con ID: $reporteId2" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Listar reportes
Write-Host "5. Listando reportes..." -ForegroundColor Blue
$getHeaders = @{
    Authorization = "Bearer $token"
}

try {
    $listResponse = Invoke-RestMethod -Uri "$baseUrl/reportes" -Method GET -Headers $getHeaders
    Write-Host "   OK - Total de reportes: $($listResponse.count)" -ForegroundColor Green
    foreach ($r in $listResponse.data) {
        Write-Host "      - ID $($r.id): $($r.titulo) [$($r.estado)]" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Ver reporte especifico
if ($reporteId1) {
    Write-Host "6. Obteniendo reporte $reporteId1..." -ForegroundColor Blue
    try {
        $detalleResponse = Invoke-RestMethod -Uri "$baseUrl/reportes/$reporteId1" -Method GET -Headers $getHeaders
        Write-Host "   OK - Reporte obtenido: $($detalleResponse.data.titulo)" -ForegroundColor Green
        Write-Host "      Ubicacion: $($detalleResponse.data.ubicacion)" -ForegroundColor Gray
        Write-Host "      Prioridad: $($detalleResponse.data.prioridad)" -ForegroundColor Gray
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 7. Listar con filtros
Write-Host "7. Listando reportes con filtros..." -ForegroundColor Blue
$filterUrl = "$baseUrl/reportes?estado=pendiente"
try {
    $filteredResponse = Invoke-RestMethod -Uri $filterUrl -Method GET -Headers $getHeaders
    Write-Host "   OK - Reportes pendientes: $($filteredResponse.count)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Email de prueba: $email" -ForegroundColor Yellow
if ($token) {
    Write-Host "Token: $token" -ForegroundColor Yellow
}
Write-Host ""











