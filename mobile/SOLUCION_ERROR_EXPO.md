# Solución al Error de Expo

## Error Común
```
Error: ENOENT: no such file or directory, mkdir 'C:\Users\...\mobile\.expo\metro\externals\node:sea'
```

Este error ocurre cuando Expo no puede crear los directorios necesarios.

## Solución Rápida

### Opción 1: Usar el script de limpieza (Recomendado)
```powershell
cd mobile
npm run clean
npm start
```

### Opción 2: Limpieza manual
```powershell
cd mobile

# Eliminar directorio .expo
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Crear directorios necesarios
New-Item -ItemType Directory -Force -Path .expo\metro\externals

# Limpiar caché
npx expo start --clear
```

### Opción 3: Reinstalar dependencias (Si las anteriores no funcionan)
```powershell
cd mobile

# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
npm install
npm start
```

## Prevención

El script `package.json` ahora incluye `--clear` por defecto en `npm start`, lo que limpia la caché automáticamente.

## Si el problema persiste

1. **Verifica permisos:**
   - Asegúrate de tener permisos de escritura en la carpeta `mobile`
   - Ejecuta PowerShell como administrador si es necesario

2. **Verifica la versión de Node.js:**
   ```powershell
   node --version
   ```
   - Debe ser Node.js 14 o superior

3. **Verifica la versión de Expo CLI:**
   ```powershell
   npx expo --version
   ```

4. **Reinstala Expo CLI globalmente:**
   ```powershell
   npm install -g expo-cli@latest
   ```

## Comandos Útiles

- `npm start` - Inicia Expo con limpieza de caché
- `npm run start:normal` - Inicia Expo sin limpiar caché
- `npm run clean` - Ejecuta el script de limpieza completo





