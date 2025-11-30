# Solución al Error node:sea en Windows

## Problema

Error al iniciar Expo:
```
Error: ENOENT: no such file or directory, mkdir '...\mobile\.expo\metro\externals\node:sea'
```

## Causa

Este error ocurre porque:
1. Estás usando **Node.js 24.x** que introduce soporte para "Single Executable Applications" (SEA)
2. Expo intenta crear un directorio llamado `node:sea`
3. Windows **no permite** el carácter `:` en nombres de archivos/directorios
4. Esto causa que Expo falle al intentar crear el directorio

## Soluciones

### Solución 1: Usar Node.js 20.x (Recomendado)

La solución más simple es usar Node.js 20.x en lugar de 24.x:

#### Con nvm-windows:
```powershell
# Instalar Node.js 20
nvm install 20.11.0

# Usar Node.js 20
nvm use 20.11.0

# Verificar versión
node --version

# Reinstalar dependencias
cd mobile
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

#### Descargar Node.js 20.x manualmente:
1. Ve a https://nodejs.org/
2. Descarga la versión **20.x LTS**
3. Instálala
4. Reinicia PowerShell
5. Verifica: `node --version` (debe ser 20.x)

### Solución 2: Actualizar Expo (Puede no funcionar aún)

```powershell
cd mobile
npm install expo@latest
npm start
```

### Solución 3: Workaround Temporal

Ejecuta el script de solución:
```powershell
cd mobile
.\solucion-node-sea.ps1
npm start
```

**Nota:** Este workaround puede no funcionar completamente porque el problema está en el código de Expo.

## Verificar tu Versión de Node.js

```powershell
node --version
```

Si muestra `v24.x.x`, necesitas cambiar a Node.js 20.x.

## Instalar nvm-windows (Gestor de Versiones de Node)

Si no tienes nvm-windows:

1. Descarga desde: https://github.com/coreybutler/nvm-windows/releases
2. Instala `nvm-setup.exe`
3. Reinicia PowerShell
4. Usa los comandos de la Solución 1

## ¿Por qué Node.js 20.x?

- Node.js 20.x es la versión LTS (Long Term Support) actual
- Es más estable y compatible con la mayoría de herramientas
- Expo está optimizado para Node.js 18-20
- Node.js 24.x es muy reciente y algunas herramientas aún no lo soportan completamente

## Verificación Final

Después de cambiar a Node.js 20.x:

```powershell
cd mobile
npm start
```

Deberías ver:
```
Starting project at C:\Users\...\mobile
Metro waiting on exp://...
```

Sin errores de `node:sea`.

## Referencias

- [Expo GitHub Issues](https://github.com/expo/expo/issues)
- [Node.js Releases](https://nodejs.org/en/about/releases/)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)





