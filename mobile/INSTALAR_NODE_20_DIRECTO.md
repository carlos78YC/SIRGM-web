# Instalar Node.js 20.x Directamente (Sin nvm)

## Pasos

### 1. Descargar Node.js 20.x LTS

1. Ve a: https://nodejs.org/
2. **IMPORTANTE:** Descarga la versión **20.x LTS** (NO la 24.x)
3. Busca el botón que dice "20.x LTS" o "Recommended For Most Users"
4. Descarga el instalador `.msi` para Windows

### 2. Desinstalar Node.js 24.x (Opcional pero Recomendado)

1. Ve a **Configuración de Windows** → **Aplicaciones**
2. Busca "Node.js"
3. Haz clic en **Desinstalar**
4. Esto evitará conflictos

### 3. Instalar Node.js 20.x

1. Ejecuta el instalador `.msi` que descargaste
2. Sigue el asistente:
   - Acepta los términos
   - Usa las opciones predeterminadas
   - Asegúrate de que "Add to PATH" esté marcado
   - Completa la instalación

### 4. Verificar Instalación

**Cierra y vuelve a abrir PowerShell**, luego:

```powershell
node --version
```

Deberías ver: `v20.11.0` o similar (NO v24.x)

### 5. Reinstalar Dependencias de Expo

```powershell
cd C:\Users\Carlos\SIRGM\mobile
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

## Ventajas de Esta Opción

- ✅ Más simple y directo
- ✅ No necesitas nvm
- ✅ Funciona inmediatamente
- ✅ Menos pasos

## Desventajas

- ❌ Si necesitas cambiar entre versiones de Node.js, tendrás que desinstalar/reinstalar
- ❌ No puedes tener múltiples versiones instaladas al mismo tiempo

## ¿Cuándo Usar Esta Opción?

- Si solo necesitas Node.js 20.x para este proyecto
- Si no planeas cambiar de versión frecuentemente
- Si prefieres simplicidad sobre flexibilidad





