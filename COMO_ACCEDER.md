# 🌐 Cómo Acceder al Dashboard y Backend

## ⚠️ Importante: Dos Servidores Diferentes

### 🔹 Backend (Puerto 3000)
- **URL**: `http://localhost:3000`
- **Propósito**: API REST (solo responde JSON)
- **No tiene interfaz web**: Es solo para peticiones HTTP

### 🔹 Frontend/Dashboard (Puerto 5173)
- **URL**: `http://localhost:5173`
- **Propósito**: Interfaz web del dashboard
- **Tiene interfaz visual**: Aquí es donde trabajas

---

## 🚀 Acceso Correcto

### Para Usar el Dashboard:

1. **Abre tu navegador**
2. **Ve a**: `http://localhost:5173` ⬅️ **ESTE ES EL DASHBOARD**
3. Verás la página de Login
4. Inicia sesión con tus credenciales

### Para Probar la API Backend:

1. Usa herramientas como:
   - **Postman**
   - **Thunder Client** (extensión VS Code)
   - **curl** desde terminal
   - O prueba en el navegador estas URLs:

#### ✅ Rutas Disponibles del Backend:

- **Health Check**: `http://localhost:3000/health`
  - Debe responder: `{"success":true,"message":"Servidor funcionando correctamente"}`

- **Login**: `http://localhost:3000/auth/login` (POST)
- **Registro**: `http://localhost:3000/auth/register` (POST)
- **Reportes**: `http://localhost:3000/reportes` (GET/POST)
- **Reporte por ID**: `http://localhost:3000/reportes/:id` (GET)

---

## 🔍 Verificación Rápida

### 1. Verificar Backend (Puerto 3000)
Abre en tu navegador:
```
http://localhost:3000/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-11-26T22:47:14.492Z"
}
```

✅ Si ves esto → El backend está funcionando

---

### 2. Verificar Frontend/Dashboard (Puerto 5173)
Abre en tu navegador:
```
http://localhost:5173
```

Deberías ver:
- Página de Login del dashboard
- Formulario de email y contraseña

✅ Si ves esto → El frontend está funcionando

---

## 🎯 Resumen

| Componente | Puerto | URL | Qué Es |
|------------|--------|-----|--------|
| **Backend API** | 3000 | `http://localhost:3000` | Solo API JSON |
| **Dashboard Frontend** | 5173 | `http://localhost:5173` | Interfaz web |

---

## ❓ Problemas Comunes

### "Ruta no encontrada" en localhost:3000
✅ **Esto es NORMAL**. El backend no tiene página de inicio, es solo una API.

**Solución**: 
- Para usar el dashboard → Ve a `http://localhost:5173`
- Para probar la API → Usa `/health` o herramientas como Postman

### "No se puede conectar" en localhost:5173
❌ El frontend no está corriendo.

**Solución**:
```bash
cd frontend
npm run dev
```

### Error de CORS
❌ El backend puede estar rechazando peticiones.

**Solución**: Verifica que el backend esté corriendo y que `cors` esté habilitado.

---

## 📝 Pasos para Empezar

1. ✅ Backend corriendo en puerto 3000
2. ✅ Frontend corriendo en puerto 5173
3. ✅ Abre navegador en `http://localhost:5173`
4. ✅ Haz login con usuario admin o mantenimiento
5. ✅ ¡Listo! Ya puedes usar el dashboard






