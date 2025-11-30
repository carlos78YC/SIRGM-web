# Solución: Puerto 3000 en Uso

## Error
```
Error: listen EADDRINUSE: address already in use :::3000
```

Este error significa que el puerto 3000 ya está siendo usado por otro proceso.

## Solución Rápida

### Opción 1: Detener el Proceso (Recomendado)

```powershell
# Encontrar el proceso que usa el puerto 3000
netstat -ano | findstr :3000

# Detener el proceso (reemplaza PID con el número que aparezca)
Stop-Process -Id PID -Force
```

### Opción 2: Detener Todos los Procesos de Node.js

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Opción 3: Usar Otro Puerto

Si necesitas mantener el proceso actual, puedes cambiar el puerto del backend:

1. Edita `server.js` y cambia:
   ```javascript
   const PORT = process.env.PORT || 3001; // Cambiar a 3001
   ```

2. O crea un archivo `.env` con:
   ```
   PORT=3001
   ```

3. Actualiza `mobile/src/config/api.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.34:3001';
   ```

## Verificar que el Puerto Está Libre

```powershell
netstat -ano | findstr :3000
```

Si no muestra nada, el puerto está libre.

## Iniciar el Backend

Una vez que el puerto esté libre:

```powershell
cd C:\Users\Carlos\SIRGM
npm start
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
```

## Prevenir el Problema

Para evitar que esto pase en el futuro:

1. **Siempre detén el servidor** con `Ctrl+C` antes de cerrar la terminal
2. **Verifica que no haya procesos** corriendo antes de iniciar:
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue
   ```

## Script Automático

Puedes crear un script `iniciar-backend.ps1`:

```powershell
# Detener procesos de Node.js
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Iniciar backend
cd C:\Users\Carlos\SIRGM
npm start
```




