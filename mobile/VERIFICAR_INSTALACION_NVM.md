# Verificar Instalación de nvm-windows

## ¿nvm no se reconoce?

Si al ejecutar `nvm version` ves el error:
```
El término 'nvm' no se reconoce...
```

Significa que nvm-windows **aún no está instalado** o PowerShell no ha recargado las variables de entorno.

## Pasos para Instalar

### 1. Descargar nvm-windows

Si aún no lo has descargado:
- Ve a: https://github.com/coreybutler/nvm-windows/releases
- Descarga: `nvm-setup.exe` (de la última versión, sección "Assets")

### 2. Ejecutar el Instalador

1. **Busca el archivo** `nvm-setup.exe` en tu carpeta de Descargas
2. **Haz clic derecho** → **Ejecutar como administrador**
3. **Sigue el asistente:**
   - Acepta los términos
   - Usa las rutas predeterminadas (recomendado)
   - Completa la instalación

### 3. Cerrar y Reabrir PowerShell

**MUY IMPORTANTE:** Después de instalar:
1. **Cierra completamente** la ventana de PowerShell actual
2. **Abre una nueva ventana** de PowerShell
3. **O reinicia tu computadora** (más seguro)

### 4. Verificar Instalación

En la **nueva ventana** de PowerShell:

```powershell
nvm version
```

Deberías ver algo como: `1.1.12` o similar

## Si Aún No Funciona

### Opción A: Reiniciar Computadora
A veces Windows necesita un reinicio completo para actualizar las variables de entorno.

### Opción B: Verificar Instalación Manual

```powershell
# Verificar si nvm.exe existe
Test-Path "C:\Program Files\nvm\nvm.exe"

# O en AppData
Test-Path "$env:APPDATA\nvm\nvm.exe"
```

Si alguno devuelve `True`, nvm está instalado pero no está en el PATH.

### Opción C: Agregar al PATH Manualmente

Si nvm está instalado pero no funciona:

1. Busca dónde está instalado (generalmente `C:\Program Files\nvm`)
2. Agrega esa ruta al PATH del sistema
3. Reinicia PowerShell

## Alternativa: Instalar Node.js 20.x Directamente

Si nvm te da problemas, puedes instalar Node.js 20.x directamente:

1. Ve a: https://nodejs.org/
2. Descarga la versión **20.x LTS** (no la 24.x)
3. Instálala
4. Reinicia PowerShell
5. Verifica: `node --version` (debe ser 20.x)

Luego continúa con:
```powershell
cd mobile
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

## ¿Qué Prefieres?

1. **Continuar con nvm-windows** (más flexible para el futuro)
2. **Instalar Node.js 20.x directamente** (más simple, pero tendrás que desinstalar la 24.x primero)




