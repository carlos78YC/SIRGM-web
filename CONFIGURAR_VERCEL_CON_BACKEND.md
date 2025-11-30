# Configurar Vercel con el Backend de Render

## ✅ Backend Desplegado

Tu backend está funcionando en:
**https://sirgm-backend.onrender.com**

## 🔧 Paso 1: Configurar Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel: [https://vercel.com](https://vercel.com)
2. Selecciona tu proyecto **SIRGM-web**
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **"Add New"**
5. Agrega:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://sirgm-backend.onrender.com`
   - **Environment**: Marca todas (Production, Preview, Development)
6. Haz clic en **"Save"**

## 🔄 Paso 2: Re-desplegar el Frontend

Después de agregar la variable de entorno:

1. Ve a la pestaña **"Deployments"**
2. Encuentra el último deployment
3. Haz clic en los **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
   - O simplemente haz un nuevo push a GitHub y Vercel se actualizará automáticamente

## 🔒 Paso 3: Actualizar CORS en el Backend (Opcional pero Recomendado)

Para mayor seguridad, actualiza el backend para permitir solo tu dominio de Vercel:

1. **Actualiza `server.js`** en tu proyecto local:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo local
    'https://sirgm-web.vercel.app', // Producción (reemplaza con tu URL real)
    'https://*.vercel.app' // Cualquier subdominio de Vercel
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

2. **Haz commit y push**:
```bash
git add server.js
git commit -m "Actualizar CORS para Vercel"
git push
```

3. **Render se actualizará automáticamente** desde GitHub

## ✅ Verificar que Funciona

1. Ve a tu frontend desplegado en Vercel
2. Intenta hacer login
3. Si funciona, ¡todo está bien configurado!

---

¡Listo! Tu aplicación completa debería estar funcionando en producción. 🎉


