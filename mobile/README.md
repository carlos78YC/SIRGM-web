# SIRGM Mobile - Aplicación React Native con Expo

Aplicación móvil para el Sistema de Reportes de Gestión Municipal (SIRGM) desarrollada con React Native y Expo.

## Características

- ✅ Login y registro de usuarios
- ✅ Crear reportes con:
  - Categoría del problema
  - Descripción detallada
  - Ubicación (manual o GPS)
  - Foto tomada con la cámara o desde la galería
- ✅ Ver estado de reportes (pendiente, en proceso, resuelto, cerrado)
- ✅ Sistema de notificaciones locales
- ✅ Conexión con el backend SIRGM

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app en tu dispositivo móvil (iOS o Android) para desarrollo

## Instalación

1. **Navegar a la carpeta mobile:**
```bash
cd mobile
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar la URL del backend:**
   
   Edita el archivo `src/config/api.js` y cambia la constante `API_BASE_URL`:
   
   - Para desarrollo local con emulador: `http://localhost:3000`
   - Para dispositivo físico: `http://TU_IP_LOCAL:3000` (ej: `http://192.168.1.100:3000`)
   - Para producción: `https://tu-dominio.com`

   **Nota:** Para encontrar tu IP local en Windows:
   ```powershell
   ipconfig
   ```
   Busca "IPv4 Address" en la sección de tu adaptador de red.

4. **Iniciar el servidor de desarrollo:**
```bash
npm start
```

5. **Ejecutar en dispositivo:**
   - Escanea el código QR con la app Expo Go (iOS) o la cámara (Android)
   - O presiona `a` para Android o `i` para iOS si tienes un emulador

## Estructura del Proyecto

```
mobile/
├── App.js                    # Componente principal y navegación
├── app.json                  # Configuración de Expo
├── package.json              # Dependencias del proyecto
├── src/
│   ├── config/
│   │   └── api.js           # Configuración de Axios y API
│   ├── context/
│   │   ├── AuthContext.jsx  # Contexto de autenticación
│   │   └── NotificationContext.jsx  # Contexto de notificaciones
│   ├── screens/
│   │   ├── LoginScreen.js   # Pantalla de login
│   │   ├── RegisterScreen.js # Pantalla de registro
│   │   ├── HomeScreen.js    # Pantalla principal
│   │   ├── NuevoReporteScreen.js # Crear nuevo reporte
│   │   ├── MisReportesScreen.js # Lista de reportes
│   │   └── DetalleReporteScreen.js # Detalle de un reporte
│   └── services/
│       ├── authService.js   # Servicios de autenticación
│       └── reporteService.js # Servicios de reportes
```

## Pantallas

### LoginScreen
- Inicio de sesión con email y contraseña
- Navegación a registro

### RegisterScreen
- Registro de nuevos usuarios
- Campos: nombre, apellido, email, contraseña, rol

### HomeScreen
- Pantalla principal después del login
- Acceso rápido a crear reporte y ver reportes
- Información del usuario

### NuevoReporteScreen
- Formulario para crear reportes
- Categorías: Infraestructura, Limpieza, Seguridad, Electricidad, Plomería, Otro
- Prioridades: Baja, Media, Alta, Urgente
- Ubicación manual o GPS
- Tomar foto con cámara o seleccionar de galería

### MisReportesScreen
- Lista de todos los reportes del usuario
- Filtros por estado (Pendiente, En Proceso, Resuelto, Cerrado)
- Pull to refresh
- Navegación a detalle del reporte

### DetalleReporteScreen
- Vista detallada de un reporte
- Muestra toda la información: título, descripción, ubicación, foto, estado, prioridad

## Permisos Requeridos

La aplicación requiere los siguientes permisos:

- **Cámara:** Para tomar fotos de reportes
- **Ubicación:** Para geolocalizar reportes
- **Notificaciones:** Para recibir notificaciones sobre cambios de estado

Estos permisos se solicitan automáticamente cuando son necesarios.

## Notificaciones

La aplicación utiliza Expo Notifications para enviar notificaciones locales cuando:
- Se crea un reporte exitosamente
- El estado de un reporte cambia (futuro)

Las notificaciones funcionan tanto en iOS como en Android.

## Conexión con el Backend

La aplicación se conecta al backend SIRGM mediante las siguientes rutas:

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /reportes` - Obtener reportes
- `GET /reportes/:id` - Obtener un reporte
- `POST /reportes` - Crear reporte
- `PUT /reportes/:id` - Actualizar reporte
- `PUT /reportes/:id/estado` - Actualizar estado
- `DELETE /reportes/:id` - Eliminar reporte

Todas las rutas (excepto login y register) requieren autenticación JWT mediante el header `Authorization: Bearer <token>`.

## Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo
- Verifica que la URL en `src/config/api.js` sea correcta
- Si usas dispositivo físico, asegúrate de usar la IP local, no `localhost`
- Verifica que el dispositivo y la computadora estén en la misma red WiFi

### Error al tomar foto
- Verifica que hayas concedido permisos de cámara
- En iOS, los permisos se solicitan automáticamente
- En Android, verifica en Configuración > Apps > SIRGM > Permisos

### Error al obtener ubicación
- Verifica que hayas concedido permisos de ubicación
- Asegúrate de tener GPS activado
- En Android, verifica que la ubicación esté activada en Configuración

## Desarrollo

### Ejecutar en modo desarrollo
```bash
npm start
```

### Ejecutar en Android
```bash
npm run android
```

### Ejecutar en iOS
```bash
npm run ios
```

### Ejecutar en web (limitado)
```bash
npm run web
```

## Build para Producción

Para crear builds de producción, consulta la [documentación de Expo](https://docs.expo.dev/build/introduction/).

## Notas Importantes

- Esta aplicación está diseñada para funcionar con el backend SIRGM
- Asegúrate de que el backend esté configurado y corriendo antes de usar la app
- Las fotos se suben directamente al backend en formato multipart/form-data
- El token JWT se almacena localmente usando AsyncStorage

## Licencia

Este proyecto es parte del sistema SIRGM.





