# Configurar Conexión con el Backend

## Tu IP Local Detectada

Tu dirección IP local es: **192.168.1.34**

## Configuración según tu dispositivo

### Opción 1: Dispositivo Físico (Teléfono Real)
Si vas a usar la app en tu teléfono físico conectado a la misma red WiFi:

**Archivo:** `mobile/src/config/api.js`
```javascript
const API_BASE_URL = 'http://192.168.1.34:3000';
```

### Opción 2: Emulador Android
Si usas el emulador de Android Studio:

**Archivo:** `mobile/src/config/api.js`
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000';
```

### Opción 3: Emulador iOS (Simulador)
Si usas el simulador de iOS:

**Archivo:** `mobile/src/config/api.js`
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

## Pasos para Configurar

1. **Abre el archivo:** `mobile/src/config/api.js`

2. **Cambia la línea 5** según tu caso:
   - Dispositivo físico → `'http://192.168.1.34:3000'`
   - Emulador Android → `'http://10.0.2.2:3000'`
   - Emulador iOS → `'http://localhost:3000'`

3. **Guarda el archivo**

4. **Reinicia Expo:**
   - Presiona `r` en la terminal donde corre Expo, o
   - Detén Expo (Ctrl+C) y vuelve a ejecutar `npm start`

## Verificar que el Backend está Accesible

### Desde tu computadora:
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/health
```

### Desde tu teléfono (misma red WiFi):
1. Abre el navegador en tu teléfono
2. Ve a: `http://192.168.1.34:3000/health`
3. Deberías ver una respuesta JSON

## Solución de Problemas

### Error: "Network Error" o "Connection refused"

**Causa 1:** El backend no está corriendo
- Solución: Inicia el backend con `npm start` en la carpeta raíz del proyecto

**Causa 2:** Firewall bloqueando el puerto
- Solución Windows:
  1. Abre "Firewall de Windows Defender"
  2. Configuración avanzada
  3. Reglas de entrada
  4. Nueva regla → Puerto → TCP → 3000 → Permitir conexión

**Causa 3:** IP incorrecta
- Solución: Verifica tu IP con `ipconfig` y actualiza el archivo

**Causa 4:** Dispositivo y computadora en redes diferentes
- Solución: Asegúrate de que ambos estén en la misma red WiFi

### Error: "Timeout"

**Causa:** El backend tarda mucho en responder
- Solución: Aumenta el timeout en `api.js`:
```javascript
timeout: 30000, // 30 segundos
```

## Cambiar IP Automáticamente

Si tu IP cambia frecuentemente, puedes crear un script que detecte la IP automáticamente, pero por ahora la configuración manual es más simple y confiable.

## Notas Importantes

- La IP `192.168.1.34` es tu IP en la red local
- Si cambias de red WiFi, tu IP puede cambiar
- Si tu IP cambia, actualiza el archivo `api.js` con la nueva IP
- Para encontrar tu IP nuevamente: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)




