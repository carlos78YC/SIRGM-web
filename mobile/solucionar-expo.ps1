# Script para solucionar problemas comunes de Expo

Write-Host "🔧 Solucionando problemas de Expo..." -ForegroundColor Cyan

# Limpiar caché de Expo
Write-Host "`n1. Limpiando caché de Expo..." -ForegroundColor Yellow
if (Test-Path .expo) {
    Remove-Item -Recurse -Force .expo
    Write-Host "   ✓ Directorio .expo eliminado" -ForegroundColor Green
}

# Crear directorios necesarios
Write-Host "`n2. Creando directorios necesarios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path .expo\metro\externals | Out-Null
Write-Host "   ✓ Directorios creados" -ForegroundColor Green

# Limpiar caché de node_modules
Write-Host "`n3. Limpiando caché de node_modules..." -ForegroundColor Yellow
if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "   ✓ Caché de node_modules limpiada" -ForegroundColor Green
}

# Limpiar caché de Metro
Write-Host "`n4. Limpiando caché de Metro..." -ForegroundColor Yellow
if (Test-Path $env:TEMP\metro-*) {
    Remove-Item -Recurse -Force $env:TEMP\metro-* -ErrorAction SilentlyContinue
    Write-Host "   ✓ Caché de Metro limpiada" -ForegroundColor Green
}

Write-Host "`n✅ Limpieza completada!" -ForegroundColor Green
Write-Host "`nAhora puedes ejecutar: npm start" -ForegroundColor Cyan




