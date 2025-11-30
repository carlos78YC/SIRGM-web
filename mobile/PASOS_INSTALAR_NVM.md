# Pasos Detallados: Instalar nvm-windows y Node.js 20.x

## Paso 1: Descargar nvm-windows

1. **Se abrió automáticamente** la página de GitHub en tu navegador
2. Si no se abrió, ve a: https://github.com/coreybutler/nvm-windows/releases
3. Busca la sección **"Assets"** (haz clic para expandirla)
4. Descarga el archivo: **`nvm-setup.exe`** (NO el .zip)

## Paso 2: Instalar nvm-windows

1. **Busca el archivo** `nvm-setup.exe` en tu carpeta de Descargas
2. **Haz clic derecho** sobre el archivo
3. Selecciona **"Ejecutar como administrador"**
4. Si Windows pregunta permisos, haz clic en **"Sí"**
5. **Sigue el asistente de instalación:**
   - Acepta los términos de licencia
   - **Usa las rutas predeterminadas** (recomendado):
     - NVM: `C:\Users\<tu-usuario>\AppData\Roaming\nvm`
     - Node.js: `C:\Program Files\nodejs`
   - Haz clic en **"Instalar"**
   - Espera a que termine la instalación
   - Haz clic en **"Finalizar"**

## Paso 3: Cerrar y Reabrir PowerShell

**MUY IMPORTANTE:**
1. **Cierra completamente** todas las ventanas de PowerShell abiertas
2. **Abre una nueva ventana** de PowerShell
3. **O mejor aún:** Reinicia tu computadora (más seguro)

## Paso 4: Verificar que nvm Funciona

En la **nueva ventana** de PowerShell, ejecuta:

```powershell
nvm version
```

**Resultado esperado:** Deberías ver algo como `1.1.12` o similar

**Si aún no funciona:**
- Reinicia tu computadora
- O verifica que instalaste nvm correctamente

## Paso 5: Instalar Node.js 20.11.0

Una vez que `nvm version` funcione, ejecuta:

```powershell
nvm install 20.11.0
```

Esto descargará e instalará Node.js 20.11.0. Espera a que termine (puede tardar unos minutos).

## Paso 6: Usar Node.js 20.11.0

```powershell
nvm use 20.11.0
```

**Resultado esperado:** Deberías ver: `Now using node v20.11.0`

## Paso 7: Verificar Versión de Node.js

```powershell
node --version
```

**Resultado esperado:** Deberías ver `v20.11.0` (NO v24.x)

## Paso 8: Reinstalar Dependencias de Expo

```powershell
# Ir a la carpeta mobile
cd C:\Users\Carlos\SIRGM\mobile

# Eliminar node_modules antiguos
Remove-Item -Recurse -Force node_modules

# Reinstalar dependencias
npm install

# Iniciar Expo
npm start
```

## Comandos Útiles de nvm

```powershell
# Ver versiones instaladas
nvm list

# Ver versiones disponibles para instalar
nvm list available

# Instalar última versión de Node.js 20
nvm install 20

# Cambiar a otra versión
nvm use 20.11.0

# Desinstalar una versión
nvm uninstall 24.11.1
```

## Solución de Problemas

### "nvm no se reconoce" después de instalar
- **Solución 1:** Cierra y vuelve a abrir PowerShell
- **Solución 2:** Reinicia tu computadora
- **Solución 3:** Verifica que nvm esté instalado:
  ```powershell
  Test-Path "$env:APPDATA\nvm\nvm.exe"
  ```
  Si devuelve `True`, nvm está instalado pero PowerShell no lo encuentra. Reinicia.

### Error al instalar Node.js
- Ejecuta PowerShell como **Administrador**
- Verifica tu conexión a internet
- Intenta: `nvm install 20` (sin número específico)

### Node.js sigue siendo 24.x después de `nvm use 20`
- Verifica que ejecutaste `nvm use 20.11.0` correctamente
- Cierra y vuelve a abrir PowerShell
- Verifica: `node --version`

## Checklist Final

- [ ] nvm-windows instalado
- [ ] `nvm version` funciona
- [ ] Node.js 20.11.0 instalado
- [ ] `nvm use 20.11.0` ejecutado
- [ ] `node --version` muestra v20.11.0
- [ ] Dependencias de Expo reinstaladas
- [ ] `npm start` funciona sin errores

## ¿Listo?

Cuando hayas completado los pasos 1-3 (instalar nvm), avísame y te ayudo con los pasos 4-8.





