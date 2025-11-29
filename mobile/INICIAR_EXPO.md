# Cómo Iniciar Expo Correctamente

## Problema: No veo el código QR

Si no ves el código QR, es probable que Expo esté corriendo en segundo plano. Necesitas ejecutarlo en una terminal visible.

## Solución: Iniciar Expo en una Terminal Normal

### Paso 1: Abrir PowerShell en la carpeta mobile

1. Abre una **nueva ventana de PowerShell**
2. Navega a la carpeta mobile:
   ```powershell
   cd C:\Users\Carlos\SIRGM\mobile
   ```

### Paso 2: Asegurarte de usar Node.js 20.x

```powershell
nvm use 20.11.0
node --version  # Debe mostrar v20.11.0
```

### Paso 3: Iniciar Expo

```powershell
npm start
```

O con limpieza de caché:
```powershell
npx expo start --clear
```

## ¿Qué deberías ver?

Después de unos segundos, deberías ver:

```
Starting project at C:\Users\Carlos\SIRGM\mobile

› Metro waiting on exp://192.168.1.34:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ████████████████████████████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████████████████████████████   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

## Si el Código QR No Aparece

### Opción 1: Usar URL Manual

Busca la línea que dice:
```
› Metro waiting on exp://192.168.1.34:8081
```

Puedes:
- **Android:** Abre Expo Go y escribe manualmente: `exp://192.168.1.34:8081`
- **iOS:** Abre Expo Go y escribe manualmente: `exp://192.168.1.34:8081`

### Opción 2: Usar Tunnel

Si el código QR no aparece o no puedes conectarte:

```powershell
npx expo start --tunnel
```

Esto crea un túnel que funciona incluso si no estás en la misma red WiFi.

### Opción 3: Verificar que el Backend esté Corriendo

Asegúrate de que el backend SIRGM esté corriendo en otra terminal:

```powershell
# En otra terminal, en la carpeta raíz del proyecto
cd C:\Users\Carlos\SIRGM
npm start
```

## Comandos Útiles en Expo

Mientras Expo está corriendo, puedes presionar:

- `a` - Abrir en Android
- `i` - Abrir en iOS simulator
- `w` - Abrir en navegador web
- `r` - Recargar la app
- `m` - Mostrar/ocultar menú
- `?` - Ver todos los comandos

## Solución de Problemas

### Error: "Port 8081 is being used"
```powershell
# Detener procesos de Node.js
Get-Process -Name node | Stop-Process -Force

# O usar otro puerto
npx expo start --port 8082
```

### Error: "Cannot find module"
```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### La app no se conecta al backend
- Verifica que el backend esté corriendo
- Verifica la URL en `src/config/api.js` (debe ser `http://192.168.1.34:3000`)
- Asegúrate de que el teléfono y la computadora estén en la misma red WiFi



