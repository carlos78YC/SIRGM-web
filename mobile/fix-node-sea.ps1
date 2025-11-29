# Script para solucionar el problema de node:sea en Windows
# Este es un workaround para el bug de Expo con Node.js 24.x

Write-Host "🔧 Aplicando fix para node:sea..." -ForegroundColor Cyan

$expoDir = ".expo\metro\externals"
$nodeSeaDir = "$expoDir\node-sea"

# Crear directorio con nombre válido para Windows
if (-not (Test-Path $nodeSeaDir)) {
    New-Item -ItemType Directory -Force -Path $nodeSeaDir | Out-Null
    Write-Host "   ✓ Directorio node-sea creado" -ForegroundColor Green
} else {
    Write-Host "   ✓ Directorio node-sea ya existe" -ForegroundColor Green
}

# Crear un archivo placeholder para evitar el error
$placeholderFile = "$nodeSeaDir\.gitkeep"
if (-not (Test-Path $placeholderFile)) {
    New-Item -ItemType File -Force -Path $placeholderFile | Out-Null
    Write-Host "   ✓ Archivo placeholder creado" -ForegroundColor Green
}

Write-Host "`n✅ Fix aplicado!" -ForegroundColor Green
Write-Host "`nNota: Este es un workaround temporal." -ForegroundColor Yellow
Write-Host "El problema se solucionará cuando Expo actualice su compatibilidad con Node.js 24.x" -ForegroundColor Yellow




