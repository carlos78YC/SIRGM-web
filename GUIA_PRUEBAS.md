# Guía Rápida para Probar Endpoints

## 🚀 Inicio Rápido

### 1. Asegúrate de que el servidor esté corriendo

En una terminal:
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

### 2. Ejecuta las pruebas automatizadas

En otra terminal:
```bash
npm test
```

Este comando ejecutará todas las pruebas de endpoints automáticamente.

## 📋 Endpoints Disponibles

### Autenticación

- **POST** `/auth/register` - Registrar nuevo usuario
- **POST** `/auth/login` - Iniciar sesión

### Reportes (requieren autenticación)

- **POST** `/reportes` - Crear nuevo reporte (con o sin foto)
- **GET** `/reportes` - Listar reportes (con filtros opcionales)
- **GET** `/reportes/:id` - Obtener reporte por ID
- **PUT** `/reportes/:id/estado` - Actualizar estado (solo admin/mantenimiento)

### Salud

- **GET** `/health` - Verificar estado del servidor

## 🧪 Pruebas Incluidas

El script `testEndpoints.js` prueba:

1. ✅ Verificación de salud del servidor
2. ✅ Registro de usuario
3. ✅ Login de usuario
4. ✅ Protección de rutas (acceso sin token)
5. ✅ Validación de credenciales inválidas
6. ✅ Creación de reporte (sin archivo)
7. ✅ Listado de reportes
8. ✅ Obtención de reporte por ID
9. ✅ Actualización de estado

## 📁 Probar Subida de Archivos

### Opción 1: Script automatizado

```bash
# Instalar dependencia (solo la primera vez)
npm install form-data

# Ejecutar prueba
node scripts/testWithFile.js
```

### Opción 2: Usar herramientas externas

Ver `TEST_ARCHIVOS.md` para instrucciones detalladas con:
- cURL
- Postman
- PowerShell
- HTTPie

## 🔍 Ver Resultados

El script muestra:
- ✅ Pruebas exitosas (verde)
- ❌ Pruebas fallidas (rojo)
- ⚠️ Advertencias (amarillo)
- 📊 Resumen final con estadísticas

## 🐛 Solución de Problemas

### El servidor no responde

```bash
# Verifica que el servidor esté corriendo
curl http://localhost:3000/health

# O inicia el servidor
npm start
```

### Error de conexión a la base de datos

```bash
# Verifica la configuración
npm run test:config

# O ejecuta el diagnóstico
npm run diagnostico:db
```

### Error de autenticación

- Asegúrate de tener usuarios registrados en la base de datos
- Verifica que las credenciales en el script sean correctas
- El script intenta registrar un usuario si el login falla

### Error al subir archivos

- Verifica que `form-data` esté instalado: `npm install form-data`
- Revisa que Supabase Storage esté configurado correctamente
- Ver `TEST_ARCHIVOS.md` para alternativas

## 📝 Personalizar Pruebas

Puedes editar `scripts/testEndpoints.js` para:
- Cambiar credenciales de prueba
- Agregar más casos de prueba
- Modificar datos de reportes
- Probar diferentes roles de usuario

## 🔐 Credenciales de Prueba

El script usa estas credenciales por defecto:
- Email: `alumno@ejemplo.com`
- Password: `Password123`

Si el usuario no existe, el script intentará registrarlo automáticamente.

## 📚 Más Información

- `API_EXAMPLES.md` - Ejemplos detallados de cada endpoint
- `TEST_ARCHIVOS.md` - Guía para probar subida de archivos
- `GUIA_PRACTICA.md` - Guía práctica del proyecto








