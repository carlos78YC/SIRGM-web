# 🔧 Configurar Frontend en Vercel con Backend de Render

## ✅ Estado Actual

- ✅ **Backend**: Funcionando en `https://sirgm-backend.onrender.com`
- ⏳ **Frontend**: Necesita configurarse para conectarse al backend

---

## 📋 Paso 1: Configurar Variable de Entorno en Vercel

El frontend necesita saber la URL del backend. Para esto, debes configurar la variable `VITE_API_URL` en Vercel.

### Pasos:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto del frontend (`sirgm-web` o similar)
3. Ve a **Settings → Environment Variables**
4. Haz clic en **"Add New"** o busca si ya existe `VITE_API_URL`
5. Configura la variable:

   - **Key**: `VITE_API_URL`
   - **Value**: `https://sirgm-backend.onrender.com`
   - **Environment**: Selecciona todas las opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (opcional)

6. Haz clic en **"Save"**

---

## 📋 Paso 2: Re-desplegar el Frontend

Después de agregar la variable, necesitas re-desplegar el frontend:

### Opción A: Re-desplegar automáticamente

Vercel puede detectar los cambios automáticamente si tienes conectado GitHub.

### Opción B: Re-desplegar manualmente

1. Ve a la pestaña **"Deployments"** en Vercel
2. Encuentra el último deployment
3. Haz clic en los tres puntos (⋯) → **"Redeploy"**
4. Espera a que termine (1-2 minutos)

---

## ✅ Paso 3: Verificar que Funciona

Después de re-desplegar, verifica que el frontend pueda conectarse al backend:

1. Abre tu sitio en Vercel (ej: `https://sirgm-web.vercel.app`)
2. Intenta hacer login o cualquier acción que requiera el backend
3. Abre las **Herramientas de Desarrollador** (F12) → **Console**
4. Verifica que no haya errores de conexión

---

## 🔍 Cómo Verificar la Configuración

### En el código del frontend:

El frontend ya está configurado para usar esta variable en `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Si `VITE_API_URL` está configurada, usará esa URL. Si no, usará `localhost:3000` (solo para desarrollo local).

---

## 🐛 Solución de Problemas

### Error: "Network Error" o "Failed to fetch"

1. Verifica que la variable `VITE_API_URL` esté configurada correctamente en Vercel
2. Verifica que el valor sea exactamente: `https://sirgm-backend.onrender.com` (sin barra al final)
3. Asegúrate de haber re-desplegado después de agregar la variable

### Error: CORS

Si ves errores de CORS, verifica que el backend tenga configurado CORS para permitir tu dominio de Vercel. El backend ya debería tener esto configurado, pero verifica en `server.js` que incluya tu dominio de Vercel.

### Verificar en Vercel Build Logs

1. Ve a **Deployments** → Último deployment → **"Build Logs"**
2. Verifica que no haya errores durante el build
3. Busca si `VITE_API_URL` aparece en los logs (Vite la inyecta durante el build)

---

## 📝 Variables de Entorno para Vercel

Resumen de lo que deberías tener en Vercel:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | `https://sirgm-backend.onrender.com` | URL del backend en Render |

**IMPORTANTE**: 
- ✅ Las variables que empiezan con `VITE_` son expuestas al código del frontend
- ✅ Vercel las inyecta durante el build
- ✅ Después de cambiar variables, necesitas re-desplegar

---

## ✅ Checklist Final

- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] Valor: `https://sirgm-backend.onrender.com`
- [ ] Frontend re-desplegado después de agregar la variable
- [ ] Verificado que no hay errores en la consola del navegador
- [ ] Probado hacer login o alguna acción que requiera el backend

---

**Después de configurar `VITE_API_URL` y re-desplegar, tu frontend debería estar completamente conectado al backend.** 🚀

