# Inicio Rápido - SIRGM Mobile

## Pasos para comenzar

### 1. Instalar dependencias
```bash
cd mobile
npm install
```

### 2. Configurar URL del backend

Edita `src/config/api.js` y cambia la línea:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

**Para dispositivo físico:**
- Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
- Usa: `http://TU_IP:3000` (ejemplo: `http://192.168.1.100:3000`)

### 3. Iniciar el backend
Asegúrate de que el backend SIRGM esté corriendo en el puerto 3000.

### 4. Iniciar la app móvil
```bash
npm start
```

### 5. Escanear QR
- **iOS:** Abre Expo Go y escanea el QR
- **Android:** Abre la cámara y toca el enlace que aparece

## Prueba Rápida

1. **Registrar usuario:**
   - Toca "Regístrate"
   - Completa el formulario
   - Selecciona un rol (alumno, docente, mantenimiento)

2. **Crear reporte:**
   - Toca "Nuevo Reporte"
   - Completa título y descripción
   - Toma una foto o selecciona de galería
   - Usa GPS para ubicación automática
   - Toca "Crear Reporte"

3. **Ver reportes:**
   - Toca "Mis Reportes"
   - Filtra por estado
   - Toca un reporte para ver detalles

## Solución de Problemas Comunes

### "Network Error" o "Connection refused"
- Verifica que el backend esté corriendo
- Verifica la URL en `src/config/api.js`
- Si usas dispositivo físico, usa la IP local, no `localhost`

### La app no se conecta al backend
- Asegúrate de que el dispositivo y la computadora estén en la misma red WiFi
- Verifica el firewall de Windows (puede estar bloqueando el puerto 3000)

### Error al tomar foto
- Concede permisos de cámara cuando se soliciten
- En Android, verifica permisos en Configuración

### Error al obtener ubicación
- Concede permisos de ubicación
- Activa GPS en tu dispositivo

## Comandos Útiles

```bash
# Limpiar caché de Expo
expo start -c

# Ver logs
expo start --tunnel

# Reiniciar Metro bundler
# Presiona 'r' en la terminal donde corre expo
```

## Próximos Pasos

- Personaliza los colores en los archivos de estilos
- Agrega más funcionalidades según tus necesidades
- Configura notificaciones push para producción
- Crea builds de producción con EAS Build




