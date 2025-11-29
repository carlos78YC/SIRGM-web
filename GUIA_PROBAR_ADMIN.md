# Guía para Probar el Módulo Administrativo

## 📋 Requisitos Previos

1. **Backend corriendo** en `http://localhost:3000`
2. **Frontend corriendo** (normalmente en `http://localhost:5173` o el puerto que use Vite)
3. **Usuario con rol `admin`** en la base de datos

---

## 🚀 Paso 1: Verificar que el Backend Esté Corriendo

```bash
# En la raíz del proyecto (SIRGM)
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
```

---

## 🚀 Paso 2: Iniciar el Frontend

```bash
# En la carpeta frontend
cd frontend
npm run dev
```

Deberías ver algo como:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 👤 Paso 3: Crear un Usuario Admin (si no existe)

Si no tienes un usuario admin, puedes crearlo de varias formas:

### Opción A: Usando el script existente

```bash
# En la raíz del proyecto
.\crear-usuarios-admin.ps1
```

### Opción B: Usando una petición directa al backend

```bash
# PowerShell
$body = @{
    email = "admin@test.com"
    password = "admin123"
    nombre = "Admin"
    apellido = "Sistema"
    rol = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Opción C: Directamente en la base de datos

Si tienes acceso a Supabase, puedes ejecutar:

```sql
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, activo)
VALUES (
    'admin@test.com',
    '$2a$10$...', -- Hash de bcrypt para 'admin123'
    'Admin',
    'Sistema',
    'admin',
    true
);
```

**Nota**: Para generar el hash de bcrypt, puedes usar Node.js:
```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));
```

---

## 🔐 Paso 4: Acceder al Panel de Administración

1. Abre tu navegador y ve a: `http://localhost:5173/admin/login`
2. Ingresa las credenciales del usuario admin:
   - **Email**: `admin@test.com` (o el que hayas creado)
   - **Contraseña**: `admin123` (o la que hayas usado)
3. Haz clic en "Iniciar Sesión"

**Resultado esperado**: Deberías ser redirigido a `/admin/users` y ver el panel de administración.

---

## ✅ Paso 5: Probar la Gestión de Usuarios

### 5.1 Ver Lista de Usuarios

**Acción**: Al acceder a `/admin/users`, deberías ver una tabla con todos los usuarios.

**Qué verificar**:
- ✅ La tabla muestra: ID, Email, Nombre, Apellido, Rol, Estado, Fecha Creación
- ✅ Los roles tienen colores diferentes (badges)
- ✅ Los estados muestran "Activo" o "Inactivo"

### 5.2 Crear un Nuevo Usuario

**Pasos**:
1. Haz clic en el botón **"+ Crear Usuario"**
2. Llena el formulario:
   - Email: `test@example.com`
   - Contraseña: `test123`
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Rol: `alumno`
   - Activo: ✅ (marcado)
3. Haz clic en **"Crear"**

**Resultado esperado**:
- ✅ El modal se cierra
- ✅ El nuevo usuario aparece en la tabla
- ✅ Mensaje de éxito (si está implementado)

**Pruebas de validación**:
- ❌ Intenta crear un usuario sin email → Debe mostrar error
- ❌ Intenta crear un usuario con contraseña corta (< 6 caracteres) → Debe mostrar error
- ❌ Intenta crear un usuario con email duplicado → Debe mostrar error

### 5.3 Editar un Usuario

**Pasos**:
1. En la tabla, haz clic en el botón **✏️** (editar) de cualquier usuario
2. Modifica algunos campos (por ejemplo, cambia el nombre o el rol)
3. Haz clic en **"Actualizar"**

**Resultado esperado**:
- ✅ El modal se cierra
- ✅ Los cambios se reflejan en la tabla
- ✅ El email NO se puede editar (está deshabilitado)

**Nota**: La contraseña es opcional en edición. Si no la llenas, no se actualizará.

### 5.4 Eliminar un Usuario

**Pasos**:
1. En la tabla, haz clic en el botón **🗑️** (eliminar) de un usuario
2. Se abrirá un modal de confirmación
3. Haz clic en **"Eliminar"**

**Resultado esperado**:
- ✅ El modal se cierra
- ✅ El usuario desaparece de la tabla

**Pruebas de seguridad**:
- ❌ Intenta eliminar tu propio usuario admin → Debe mostrar error "No puedes eliminar tu propia cuenta"

---

## 📊 Paso 6: Probar la Exportación de Datos

### 6.1 Exportar Usuarios

**Pasos**:
1. Ve a `/admin/export` (o haz clic en "📊 Exportar Datos" en el menú)
2. Haz clic en **"📥 Descargar CSV"** en la tarjeta "Exportar Usuarios"

**Resultado esperado**:
- ✅ Se descarga un archivo `usuarios.csv`
- ✅ El archivo se puede abrir en Excel/Google Sheets
- ✅ Contiene todas las columnas: ID, Email, Nombre, Apellido, Rol, Activo, Fecha Creación
- ✅ Los caracteres especiales (tildes, ñ) se muestran correctamente (UTF-8)

### 6.2 Exportar Reportes

**Pasos**:
1. En la misma página (`/admin/export`)
2. Haz clic en **"📥 Descargar CSV"** en la tarjeta "Exportar Reportes"

**Resultado esperado**:
- ✅ Se descarga un archivo `reportes.csv`
- ✅ Contiene: ID, Usuario, Email Usuario, Título, Descripción, Ubicación, Estado, Prioridad, Fechas

---

## 🔒 Paso 7: Probar la Seguridad

### 7.1 Intentar Acceder Sin Autenticación

**Pasos**:
1. Cierra sesión o elimina el token del localStorage
2. Intenta acceder directamente a `http://localhost:5173/admin/users`

**Resultado esperado**:
- ✅ Debe redirigir automáticamente a `/admin/login`

### 7.2 Intentar Acceder con Usuario No-Admin

**Pasos**:
1. Inicia sesión con un usuario que NO sea admin (por ejemplo, rol `alumno` o `docente`)
2. Intenta acceder a `/admin/users`

**Resultado esperado**:
- ✅ Debe redirigir a `/admin/no-access`
- ✅ Muestra el mensaje "Acceso Denegado"

### 7.3 Probar las Rutas del Backend Directamente

**Sin token**:
```bash
# Debe retornar 401
Invoke-RestMethod -Uri "http://localhost:3000/admin/users" -Method GET
```

**Con token de usuario no-admin**:
```bash
# Primero obtén un token de un usuario no-admin
$loginBody = @{
    email = "alumno@test.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.data.token

# Intenta acceder a admin
# Debe retornar 403
Invoke-RestMethod -Uri "http://localhost:3000/admin/users" -Method GET -Headers @{Authorization = "Bearer $token"}
```

**Con token de admin**:
```bash
# Debe retornar 200 y la lista de usuarios
Invoke-RestMethod -Uri "http://localhost:3000/admin/users" -Method GET -Headers @{Authorization = "Bearer $token"}
```

---

## 🧪 Pruebas con Postman/Thunder Client

### Endpoints para Probar

1. **GET /admin/users**
   - Headers: `Authorization: Bearer <token_admin>`
   - Esperado: 200 con lista de usuarios

2. **POST /admin/users**
   - Headers: `Authorization: Bearer <token_admin>`, `Content-Type: application/json`
   - Body:
     ```json
     {
       "email": "nuevo@test.com",
       "password": "password123",
       "nombre": "Nuevo",
       "apellido": "Usuario",
       "rol": "alumno"
     }
     ```
   - Esperado: 201 con el usuario creado

3. **PUT /admin/users/:id**
   - Headers: `Authorization: Bearer <token_admin>`, `Content-Type: application/json`
   - Body:
     ```json
     {
       "nombre": "Actualizado",
       "rol": "docente"
     }
     ```
   - Esperado: 200 con el usuario actualizado

4. **DELETE /admin/users/:id**
   - Headers: `Authorization: Bearer <token_admin>`
   - Esperado: 200 con mensaje de éxito

5. **GET /admin/export/users**
   - Headers: `Authorization: Bearer <token_admin>`
   - Esperado: 200 con archivo CSV

6. **GET /admin/export/reportes**
   - Headers: `Authorization: Bearer <token_admin>`
   - Esperado: 200 con archivo CSV

---

## ✅ Checklist de Pruebas

### Funcionalidad
- [ ] Login admin funciona correctamente
- [ ] Se puede ver la lista de usuarios
- [ ] Se puede crear un nuevo usuario
- [ ] Se puede editar un usuario existente
- [ ] Se puede eliminar un usuario
- [ ] La validación de formularios funciona
- [ ] El modal de confirmación de eliminación aparece
- [ ] Se puede exportar usuarios a CSV
- [ ] Se puede exportar reportes a CSV
- [ ] Los archivos CSV se descargan correctamente

### Seguridad
- [ ] Sin token → redirige a login
- [ ] Usuario no-admin → redirige a /admin/no-access
- [ ] No se puede eliminar el propio usuario admin
- [ ] Las rutas del backend rechazan peticiones sin token
- [ ] Las rutas del backend rechazan peticiones de no-admin

### UI/UX
- [ ] El diseño es responsive
- [ ] Los mensajes de error se muestran correctamente
- [ ] Los estados de carga funcionan
- [ ] La navegación entre páginas funciona
- [ ] Los badges de rol y estado se muestran correctamente

---

## 🐛 Solución de Problemas

### Error: "Token no proporcionado"
- **Causa**: No estás enviando el token en las peticiones
- **Solución**: Verifica que el token se guarda en localStorage después del login

### Error: "No tienes permisos"
- **Causa**: El usuario no tiene rol `admin`
- **Solución**: Verifica el rol del usuario en la base de datos

### Error: "Usuario no encontrado"
- **Causa**: El ID del usuario no existe
- **Solución**: Verifica que el ID sea correcto

### El CSV no se descarga
- **Causa**: Problema con el manejo de blobs en el navegador
- **Solución**: Verifica la consola del navegador para errores

### Redirección infinita
- **Causa**: El hook `useAdminAuth` está causando loops
- **Solución**: Verifica que el usuario tenga el rol correcto y que el token sea válido

---

## 📝 Notas Adicionales

- Los archivos CSV incluyen BOM UTF-8 para compatibilidad con Excel
- Los valores en CSV están correctamente escapados (comillas, comas, saltos de línea)
- El email no se puede editar después de crear el usuario
- La contraseña es opcional al editar (solo se actualiza si se proporciona)
- El admin no puede eliminar su propia cuenta por seguridad

---

¡Listo para probar! 🎉




