# Script para verificar los cambios realizados
# Uso: .\verificar-cambios.ps1

Write-Host "=== Verificacion de Cambios ===" -ForegroundColor Cyan
Write-Host ""

# Colores
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Blue }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

# 1. Verificar Backend
Write-Info "1. Verificando backend..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "   [OK] Backend funcionando en puerto 3000"
    } else {
        Write-Error "   [ERROR] Backend no responde correctamente"
    }
} catch {
    Write-Error "   [ERROR] Backend no esta corriendo en puerto 3000"
    Write-Warning "   Inicia el backend con: npm start"
}

Write-Host ""

# 2. Verificar Frontend
Write-Info "2. Verificando frontend..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Success "   [OK] Frontend funcionando en puerto 5173"
    } else {
        Write-Error "   [ERROR] Frontend no responde correctamente"
    }
} catch {
    Write-Error "   [ERROR] Frontend no esta corriendo en puerto 5173"
    Write-Warning "   Inicia el frontend con: cd frontend && npm run dev"
}

Write-Host ""

# 3. Verificar configuracion UTF-8 en HTML
Write-Info "3. Verificando configuracion UTF-8..."

if (Test-Path "frontend/index.html") {
    $htmlContent = Get-Content "frontend/index.html" -Raw
    
    $checks = @{
        "charset UTF-8" = $htmlContent -match 'charset="UTF-8"|charset=UTF-8'
        "Content-Type UTF-8" = $htmlContent -match 'Content-Type.*UTF-8'
        "lang es" = $htmlContent -match 'lang="es"'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Success "   [OK] $($check.Key) configurado"
        } else {
            Write-Error "   [ERROR] Falta configurar: $($check.Key)"
        }
    }
} else {
    Write-Error "   [ERROR] No se encuentra frontend/index.html"
}

Write-Host ""

# 4. Verificar cambios en AuthContext
Write-Info "4. Verificando mejoras en mensajes de error..."

if (Test-Path "frontend/src/context/AuthContext.jsx") {
    $authContent = Get-Content "frontend/src/context/AuthContext.jsx" -Raw
    
    $checks = @{
        "Mensaje de credenciales invalidas" = $authContent -match 'no coinciden|Credenciales'
        "Manejo de errores 401" = $authContent -match 'status.*401|401'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Success "   [OK] $($check.Key) implementado"
        } else {
            Write-Warning "   [!] $($check.Key) - revisar"
        }
    }
} else {
    Write-Error "   [ERROR] No se encuentra AuthContext.jsx"
}

Write-Host ""

# 5. Verificar configuracion UTF-8 en CSS
Write-Info "5. Verificando configuracion UTF-8 en CSS..."

if (Test-Path "frontend/src/index.css") {
    $cssContent = Get-Content "frontend/src/index.css" -Raw
    
    if ($cssContent -match '@charset "UTF-8"|@charset "utf-8"') {
        Write-Success "   [OK] Charset UTF-8 configurado en CSS"
    } else {
        Write-Warning "   [!] Charset UTF-8 no encontrado en CSS (puede estar implícito)"
    }
} else {
    Write-Warning "   [!] No se encuentra index.css"
}

Write-Host ""

# Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Info "Resumen de verificacion:"
Write-Host ""
Write-Host "Para probar manualmente:" -ForegroundColor Yellow
Write-Host "  1. Abre: http://localhost:5173" -ForegroundColor White
Write-Host "  2. Intenta login con credenciales incorrectas" -ForegroundColor White
Write-Host "  3. Verifica que aparezca el mensaje:" -ForegroundColor White
Write-Host "     'El email o la contraseña no coinciden...'" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Prueba escribir caracteres especiales (ñ, acentos)" -ForegroundColor White
Write-Host "  5. Verifica que se muestren correctamente" -ForegroundColor White
Write-Host ""
Write-Host "Ver guia completa en: VERIFICAR_CAMBIOS.md" -ForegroundColor Cyan
Write-Host ""





