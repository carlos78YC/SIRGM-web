# Guía: Instalar nvm-windows y Node.js 20.x

## Paso 1: Descargar nvm-windows

1. **Abre tu navegador** y ve a:
   ```
   https://github.com/coreybutler/nvm-windows/releases
   ```

2. **Descarga el archivo más reciente:**
   - Busca la sección "Assets" en la última versión
   - Descarga: `nvm-setup.exe` (NO el .zip, el .exe es más fácil)

## Paso 2: Instalar nvm-windows

1. **Ejecuta `nvm-setup.exe`** que acabas de descargar
2. **Sigue el asistente de instalación:**
   - Acepta los términos
   - Usa las rutas predeterminadas (o personaliza si quieres)
   - Completa la instalación

3. **IMPORTANTE:** Cierra y vuelve a abrir PowerShell después de instalar

## Paso 3: Verificar instalación

Abre una **nueva ventana de PowerShell** y ejecuta:

```powershell
nvm version
```

Deberías ver algo como: `1.1.12` (o la versión que instalaste)

## Paso 4: Instalar Node.js 20.x

```powershell
nvm install 20.11.0
```

Esto descargará e instalará Node.js 20.11.0

## Paso 5: Usar Node.js 20.x

```powershell
nvm use 20.11.0
```

## Paso 6: Verificar versión

```powershell
node --version
```

Deberías ver: `v20.11.0` (o similar)

## Paso 7: Reinstalar dependencias de Expo

```powershell
cd mobile
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

## Comandos Útiles de nvm

```powershell
# Ver versiones instaladas
nvm list

# Instalar una versión específica
nvm install 20.11.0

# Usar una versión específica
nvm use 20.11.0

# Ver versión actual
node --version

# Desinstalar una versión
nvm uninstall 24.11.1
```

## Solución de Problemas

### "nvm no se reconoce como comando"
- Cierra y vuelve a abrir PowerShell
- Si persiste, reinicia tu computadora
- Verifica que nvm esté en el PATH

### Error al instalar Node.js
- Ejecuta PowerShell como Administrador
- Verifica tu conexión a internet
- Intenta: `nvm install 20` (sin número específico)

### Quiere volver a Node.js 24.x
```powershell
nvm use 24.11.1
```

Pero recuerda: Expo no funcionará correctamente con Node.js 24.x debido al error de `node:sea`.





