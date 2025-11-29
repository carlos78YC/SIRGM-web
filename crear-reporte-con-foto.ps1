# Script para crear un reporte con foto
# Uso: .\crear-reporte-con-foto.ps1 [ruta-de-la-imagen]

param(
    [Parameter(Mandatory=$false)]
    [string]$FotoPath
)

$baseUrl = "http://localhost:3000"
$configFile = "$PSScriptRoot\.crear-reporte-config.json"

# Colores para la consola
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Blue }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

Write-Info "=== Crear Reporte con Foto ===" 
Write-Host ""

# Cargar configuración guardada o solicitar credenciales
if (Test-Path $configFile) {
    $config = Get-Content $configFile | ConvertFrom-Json
    $Email = $config.email
    Write-Success "   [OK] Email cargado: $Email"
    Write-Host "   Ingresa tu contraseña: " -NoNewline -ForegroundColor Yellow
    $Password = Read-Host
} else {
    Write-Info "Primera vez: Configurando credenciales..."
    $Email = Read-Host "Ingresa tu email"
    Write-Host "Ingresa tu contraseña: " -NoNewline -ForegroundColor Yellow
    $Password = Read-Host
    
    # Guardar solo el email (no la contraseña por seguridad)
    $config = @{
        email = $Email
    } | ConvertTo-Json
    $config | Out-File $configFile -Encoding UTF8
    Write-Success "   [OK] Email guardado para proximas veces"
}

# 2. Hacer login
Write-Info "1. Iniciando sesión..."
try {
    $loginBody = @{
        email = $Email
        password = $Password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"

    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Success "   [OK] Login exitoso"
        Write-Host "   Usuario: $($loginResponse.data.user.email)" -ForegroundColor Cyan
    } else {
        Write-Error "   [ERROR] Error en login: $($loginResponse.message)"
        exit 1
    }
} catch {
    Write-Error "   [ERROR] Error al hacer login: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Error "   Detalles: $($_.ErrorDetails.Message)"
    }
    exit 1
}

# 3. Solicitar solo la ruta de la imagen
Write-Host ""
Write-Info "Selecciona la imagen de una de estas formas:"
Write-Host "  1. Arrastra y suelta el archivo en esta ventana" -ForegroundColor Cyan
Write-Host "  2. Usa el selector de archivos (se abrirá automáticamente)" -ForegroundColor Cyan
Write-Host "  3. Escribe o pega la ruta manualmente" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($FotoPath)) {
    # Intentar abrir selector de archivos
    Add-Type -AssemblyName System.Windows.Forms
    
    $openFileDialog = New-Object System.Windows.Forms.OpenFileDialog
    $openFileDialog.InitialDirectory = [Environment]::GetFolderPath('MyPictures')
    $openFileDialog.Filter = "Imágenes (*.jpg;*.jpeg;*.png;*.gif;*.webp)|*.jpg;*.jpeg;*.png;*.gif;*.webp|Todos los archivos (*.*)|*.*"
    $openFileDialog.Title = "Selecciona la imagen para el reporte"
    
    Write-Host "Buscando archivo..." -ForegroundColor Yellow
    
    if ($openFileDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $FotoPath = $openFileDialog.FileName
        Write-Success "   [OK] Archivo seleccionado: $([System.IO.Path]::GetFileName($FotoPath))"
    } else {
        # Si canceló el selector, pedir ruta manualmente
        Write-Host ""
        Write-Host "Ingresa la ruta del archivo (o arrastra y suelta aquí): " -NoNewline -ForegroundColor Yellow
        $FotoPath = Read-Host
        
        # Limpiar comillas si las copió o arrastró
        $FotoPath = $FotoPath.Trim('"').Trim("'").Trim()
    }
}

# Validar que el archivo existe
if (-not (Test-Path $FotoPath)) {
    Write-Error "   [ERROR] El archivo no existe: $FotoPath"
    exit 1
}

# Verificar que sea una imagen
$extension = [System.IO.Path]::GetExtension($FotoPath).ToLower()
$allowedExtensions = @('.jpg', '.jpeg', '.png', '.gif', '.webp')
if ($allowedExtensions -notcontains $extension) {
    Write-Error "   [ERROR] Formato no permitido. Usa: jpg, jpeg, png, gif o webp"
    exit 1
}

Write-Success "   [OK] Archivo encontrado: $([System.IO.Path]::GetFileName($FotoPath))"

# 4. Solicitar información del reporte
Write-Host ""
Write-Info "Ingresa la información del reporte:"
Write-Host ""

# Título
$Titulo = Read-Host "Título del reporte"
if ([string]::IsNullOrWhiteSpace($Titulo)) {
    $nombreArchivo = [System.IO.Path]::GetFileNameWithoutExtension($FotoPath)
    $Titulo = "Reporte: $nombreArchivo"
    Write-Warning "   Usando título por defecto: $Titulo"
}

Write-Host ""

# Descripción
$Descripcion = Read-Host "Descripción del problema"
if ([string]::IsNullOrWhiteSpace($Descripcion)) {
    $Descripcion = "Reporte generado desde imagen"
    Write-Warning "   Usando descripción por defecto"
}

Write-Host ""

# Ubicación
$Ubicacion = Read-Host "Ubicación (puede estar vacío)"
if ([string]::IsNullOrWhiteSpace($Ubicacion)) {
    $Ubicacion = "Sin ubicación especificada"
}

Write-Host ""

# Prioridad
Write-Host "Prioridad:" -ForegroundColor Cyan
Write-Host "  1. Baja" -ForegroundColor White
Write-Host "  2. Media" -ForegroundColor White
Write-Host "  3. Alta" -ForegroundColor White
Write-Host "  4. Urgente" -ForegroundColor White
Write-Host ""
$prioridadOp = Read-Host "Selecciona una opción (1-4) [Por defecto: 2]"
switch ($prioridadOp) {
    "1" { $Prioridad = "baja" }
    "2" { $Prioridad = "media" }
    "3" { $Prioridad = "alta" }
    "4" { $Prioridad = "urgente" }
    default { $Prioridad = "media" }
}

Write-Host ""
Write-Success "   Prioridad seleccionada: $Prioridad"

# 5. Mostrar resumen y crear reporte con foto
Write-Host ""
Write-Info "Resumen del reporte:"
Write-Host "   Título: $Titulo" -ForegroundColor Cyan
Write-Host "   Descripción: $Descripcion" -ForegroundColor Cyan
Write-Host "   Ubicación: $Ubicacion" -ForegroundColor Cyan
Write-Host "   Prioridad: $Prioridad" -ForegroundColor Cyan
Write-Host "   Imagen: $([System.IO.Path]::GetFileName($FotoPath))" -ForegroundColor Cyan
Write-Host ""
Write-Info "Creando reporte..."

try {
    Write-Host "   Enviando datos..." -ForegroundColor Cyan
    
    # Construir multipart/form-data manualmente (compatible con todas las versiones de PowerShell)
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    # Leer el archivo de imagen
    $imageBytes = [System.IO.File]::ReadAllBytes($FotoPath)
    $fileName = [System.IO.Path]::GetFileName($FotoPath)
    
    # Construir el body multipart como texto primero
    $bodyLines = @()
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"titulo`""
    $bodyLines += ""
    $bodyLines += $Titulo
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"descripcion`""
    $bodyLines += ""
    $bodyLines += $Descripcion
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"ubicacion`""
    $bodyLines += ""
    $bodyLines += $Ubicacion
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"prioridad`""
    $bodyLines += ""
    $bodyLines += $Prioridad
    $bodyLines += "--$boundary"
    $bodyLines += "Content-Disposition: form-data; name=`"foto`"; filename=`"$fileName`""
    $bodyLines += "Content-Type: image/$($extension.TrimStart('.'))"
    $bodyLines += ""
    
    # Convertir las líneas de texto a bytes
    $bodyText = $bodyLines -join $LF
    $textBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($bodyText)
    
    # Crear el body final combinando texto + imagen + cierre
    $memoryStream = New-Object System.IO.MemoryStream
    $memoryStream.Write($textBytes, 0, $textBytes.Length)
    $memoryStream.Write([System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($LF), 0, 2)
    $memoryStream.Write($imageBytes, 0, $imageBytes.Length)
    $closeBoundary = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes("$LF--$boundary--$LF")
    $memoryStream.Write($closeBoundary, 0, $closeBoundary.Length)
    
    $bodyBytes = $memoryStream.ToArray()
    $memoryStream.Close()
    
    # Headers
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    # Enviar petición
    $response = Invoke-RestMethod -Uri "$baseUrl/reportes" `
        -Method POST `
        -Headers $headers `
        -Body $bodyBytes

    if ($response.success) {
        Write-Success ""
        Write-Success "   [OK] Reporte creado exitosamente!"
        Write-Host ""
        Write-Host "   Detalles del reporte:" -ForegroundColor Cyan
        Write-Host "   ID: $($response.data.id)" -ForegroundColor White
        Write-Host "   Título: $($response.data.titulo)" -ForegroundColor White
        Write-Host "   Estado: $($response.data.estado)" -ForegroundColor White
        Write-Host "   Prioridad: $($response.data.prioridad)" -ForegroundColor White
        if ($response.data.foto_url) {
            Write-Host "   Foto URL: $($response.data.foto_url)" -ForegroundColor White
        }
        Write-Host ""
        Write-Success "   [OK] Reporte creado con exito!"
    } else {
        Write-Error "   [ERROR] Error al crear reporte: $($response.message)"
    }
} catch {
    Write-Error "   [ERROR] Error al crear reporte: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorDetails) {
            Write-Error "   Mensaje: $($errorDetails.message)"
        } else {
            Write-Error "   Detalles: $($_.ErrorDetails.Message)"
        }
    }
    exit 1
}

Write-Host ""
Write-Info "=== Completado ==="

