# 🔒 Cambios: Acceso Restringido al Dashboard

## Resumen

Se ha modificado el dashboard para que **solo permita el acceso a usuarios con roles "admin" o "mantenimiento"**. Los usuarios con roles "alumno" o "docente" no podrán acceder.

## ✅ Cambios Realizados

### 1. `ProtectedRoute.jsx`
- ✅ Agregada verificación de roles permitidos
- ✅ Muestra mensaje de "Acceso Denegado" si el usuario no tiene rol permitido
- ✅ Botón para cerrar sesión si el usuario intenta acceder sin permisos

### 2. `Login.jsx`
- ✅ Verificación del rol después del login exitoso
- ✅ Bloquea el acceso inmediatamente si el usuario no tiene rol permitido
- ✅ Muestra mensaje de error específico si no tiene permisos
- ✅ Actualizado el texto del footer: "Acceso exclusivo para personal administrativo y de mantenimiento"

### 3. `AuthContext.jsx`
- ✅ Validación del rol al cargar usuario desde localStorage
- ✅ Si el usuario guardado no tiene rol permitido, se limpia la sesión automáticamente
- ✅ Agregada función helper `hasAllowedRole()` para verificar permisos

## 🎯 Roles Permitidos

**✅ ACCESO PERMITIDO:**
- `admin` - Personal administrativo
- `mantenimiento` - Personal de mantenimiento

**❌ ACCESO DENEGADO:**
- `alumno` - Estudiantes
- `docente` - Docentes

## 🔍 Cómo Funciona

### Al Intentar Hacer Login:

1. Usuario ingresa email y contraseña
2. El sistema verifica las credenciales
3. Si el login es exitoso, se verifica el rol del usuario
4. Si el rol es "admin" o "mantenimiento" → ✅ Acceso permitido, redirige al dashboard
5. Si el rol es "alumno" o "docente" → ❌ Muestra error, no permite acceso

### Al Intentar Acceder a una Ruta Protegida:

1. Usuario intenta acceder a una ruta del dashboard
2. `ProtectedRoute` verifica si está autenticado
3. Si está autenticado, verifica el rol
4. Si tiene rol permitido → ✅ Muestra el contenido
5. Si no tiene rol permitido → ❌ Muestra página de "Acceso Denegado"

### Al Cargar la Aplicación:

1. Si hay un usuario guardado en localStorage
2. Se verifica su rol automáticamente
3. Si no tiene rol permitido → Se limpia la sesión automáticamente

## 🧪 Pruebas

### Prueba 1: Usuario Admin
```bash
Email: admin@ejemplo.com
Password: Password123
Rol: admin
Resultado: ✅ Acceso permitido
```

### Prueba 2: Usuario Mantenimiento
```bash
Email: mantenimiento@ejemplo.com
Password: Password123
Rol: mantenimiento
Resultado: ✅ Acceso permitido
```

### Prueba 3: Usuario Alumno
```bash
Email: alumno@ejemplo.com
Password: Password123
Rol: alumno
Resultado: ❌ Acceso denegado - Mensaje de error
```

### Prueba 4: Usuario Docente
```bash
Email: docente@ejemplo.com
Password: Password123
Rol: docente
Resultado: ❌ Acceso denegado - Mensaje de error
```

## 📝 Notas Importantes

1. **Seguridad en Backend**: El backend también tiene validaciones de roles. Estos cambios son una capa adicional de seguridad en el frontend.

2. **Mensajes al Usuario**: Los usuarios sin permisos verán mensajes claros explicando que no tienen acceso.

3. **Limpieza Automática**: Si un usuario con rol no permitido tiene una sesión guardada, se limpiará automáticamente al cargar la aplicación.

4. **Token JWT**: El token JWT sigue siendo válido, pero el frontend no permite el acceso al dashboard si el rol no es permitido.

## 🔄 Revertir Cambios

Si necesitas permitir acceso a otros roles en el futuro, simplemente modifica el array `allowedRoles` en:

1. `ProtectedRoute.jsx` (línea ~16)
2. `Login.jsx` (línea ~25)
3. `AuthContext.jsx` (líneas ~19 y ~52)

Cambia:
```javascript
const allowedRoles = ['admin', 'mantenimiento'];
```

Por ejemplo, para permitir también a docentes:
```javascript
const allowedRoles = ['admin', 'mantenimiento', 'docente'];
```






