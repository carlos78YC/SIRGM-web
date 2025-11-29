# Solución al Error 500 en Expo

## Problema

Al escanear el código QR, Expo Go muestra: **Error code: 500**

Este error generalmente significa que hay un problema en el código JavaScript que está causando que la app falle al cargar.

## Soluciones

### 1. Verificar los Logs en la Terminal

Cuando ejecutas `npm start`, deberías ver errores en la terminal de PowerShell. **Revisa esos errores** - te dirán exactamente qué está fallando.

### 2. Verificar que el Backend esté Corriendo

Asegúrate de que el backend SIRGM esté corriendo:

```powershell
# En otra terminal, en la carpeta raíz
cd C:\Users\Carlos\SIRGM
npm start
```

### 3. Verificar la URL del Backend

Abre `mobile/src/config/api.js` y verifica que la URL sea correcta:

```javascript
const API_BASE_URL = 'http://192.168.1.34:3000';
```

### 4. Limpiar Caché y Reinstalar

```powershell
cd C:\Users\Carlos\SIRGM\mobile
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
npm install --legacy-peer-deps
npm start --clear
```

### 5. Verificar Errores de Sintaxis

Revisa la terminal donde corre `npm start` - deberías ver errores específicos como:

- `Module not found: ...`
- `Cannot read property ...`
- `Unexpected token ...`

### 6. Probar con una App Mínima

Crea un archivo `App.js` simple para verificar que Expo funciona:

```javascript
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hola Mundo</Text>
    </View>
  );
}
```

Si esto funciona, el problema está en algún componente específico.

## Errores Comunes

### Error: "Cannot read property 'navigate' of undefined"

**Causa:** El componente no recibe `navigation` como prop.

**Solución:** Asegúrate de que todas las pantallas estén registradas en el Stack.Navigator.

### Error: "Module not found"

**Causa:** Falta una dependencia o hay un error en la importación.

**Solución:**
```powershell
npm install --legacy-peer-deps
```

### Error: "Network request failed"

**Causa:** El backend no está corriendo o la URL es incorrecta.

**Solución:** Verifica que el backend esté corriendo y la URL en `api.js`.

## Cómo Ver los Errores Detallados

1. **En la terminal de PowerShell** donde corre `npm start`, busca mensajes de error en rojo.

2. **En Expo Go**, toca el error para ver más detalles.

3. **En el navegador**, si abres la URL de Metro (generalmente `http://localhost:8081`), verás los errores en la consola.

## Próximos Pasos

1. **Revisa la terminal** donde corre `npm start` y copia los errores que veas.

2. **Comparte los errores** para que pueda ayudarte a solucionarlos específicamente.

3. **Verifica que el backend esté corriendo** en otra terminal.

## Comandos de Diagnóstico

```powershell
# Verificar versión de Node.js
node --version  # Debe ser 20.x

# Verificar que Expo esté instalado
npx expo --version

# Limpiar todo y reinstalar
cd C:\Users\Carlos\SIRGM\mobile
Remove-Item -Recurse -Force node_modules, .expo
npm install --legacy-peer-deps
npm start --clear
```



