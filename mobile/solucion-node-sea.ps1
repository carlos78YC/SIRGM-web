# Solución para el error node:sea en Windows con Node.js 24.x
# Este script crea los directorios necesarios antes de que Expo intente crearlos

Write-Host "🔧 Solucionando error node:sea..." -ForegroundColor Cyan

$baseDir = Get-Location
$expoDir = Join-Path $baseDir ".expo\metro\externals"

# Asegurar que el directorio base existe
if (-not (Test-Path $expoDir)) {
    New-Item -ItemType Directory -Force -Path $expoDir | Out-Null
    Write-Host "   ✓ Directorio .expo\metro\externals creado" -ForegroundColor Green
}

# Crear directorio node-sea (sin los dos puntos)
# Expo intentará crear "node:sea" pero Windows no lo permite
# Creamos "node-sea" como workaround
$nodeSeaDir = Join-Path $expoDir "node-sea"
if (-not (Test-Path $nodeSeaDir)) {
    New-Item -ItemType Directory -Force -Path $nodeSeaDir | Out-Null
    Write-Host "   ✓ Directorio node-sea creado" -ForegroundColor Green
}

# También intentar crear con el nombre exacto que Expo espera (puede fallar, pero lo intentamos)
# En Windows, los dos puntos se reemplazan automáticamente
try {
    $nodeColonSea = Join-Path $expoDir "node`:`sea"
    # Esto fallará en Windows, pero lo intentamos
} catch {
    # Esperado - Windows no permite : en nombres de archivos
}

Write-Host "`n✅ Preparación completada!" -ForegroundColor Green
Write-Host "`n💡 Solución alternativa: Usar Node.js 20.x en lugar de 24.x" -ForegroundColor Yellow
Write-Host "   Puedes usar nvm-windows para cambiar de versión:" -ForegroundColor Yellow
Write-Host "   nvm install 20.11.0" -ForegroundColor Cyan
Write-Host "   nvm use 20.11.0" -ForegroundColor Cyan




