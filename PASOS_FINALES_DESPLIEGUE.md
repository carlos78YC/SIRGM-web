# Pasos Finales para Completar el Despliegue

## ✅ Ya tienes:

1. ✅ Backend desplegado en Render: `https://sirgm-backend.onrender.com`
2. ✅ Código en GitHub: `carlos78YC/SIRGM-web`
3. ✅ Frontend listo para Vercel

## 🔧 Pasos Restantes:

### 1. Configurar Variable de Entorno en Vercel

1. Ve a [vercel.com](https://vercel.com) → Tu proyecto
2. **Settings** → **Environment Variables**
3. Agrega:
   ```
   Key: VITE_API_URL
   Value: https://sirgm-backend.onrender.com
   ```
4. Marca todas las opciones (Production, Preview, Development)
5. **Save**

### 2. Conectar Repositorio en Vercel

1. En Vercel, haz clic en **"Add New..."** → **"Project"**
2. Importa el repositorio: `carlos78YC/SIRGM-web`
3. Configura:
   - **Root Directory**: `frontend`
   - Framework: Vite (auto-detectado)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**

### 3. Verificar que Funciona

Una vez desplegado:

1. Ve a tu URL de Vercel (ej: `https://sirgm-web.vercel.app`)
2. Intenta hacer login
3. Si funciona, ¡listo!

## 📝 Resumen de URLs

- **Backend**: `https://sirgm-backend.onrender.com`
- **Frontend**: `https://tu-proyecto.vercel.app` (se te dará después del deploy)
- **Repositorio**: `https://github.com/carlos78YC/SIRGM-web`

## 🔄 Actualizar CORS en el Backend

Ya actualicé el código para permitir requests desde Vercel. Los cambios se subirán a GitHub y Render se actualizará automáticamente.

---

¡Casi terminamos! 🚀


