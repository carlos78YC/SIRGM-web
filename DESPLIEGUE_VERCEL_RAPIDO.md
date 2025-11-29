# 🚀 Desplegar Dashboard en Vercel - Guía Rápida

## ⚡ Pasos Rápidos (5 minutos)

### 1. Preparar el Código
- ✅ Asegúrate de que tu código esté en GitHub/GitLab/Bitbucket
- ✅ El archivo `vercel.json` ya está creado en `frontend/`

### 2. Conectar con Vercel

**Opción A: Desde el Dashboard (Recomendado)**
1. Ve a [vercel.com](https://vercel.com) y haz login
2. Clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio
4. Configura:
   - **Framework Preset**: Vite (auto-detectado)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Variables de Entorno

En **Settings** → **Environment Variables**, agrega:

```
VITE_API_URL = https://tu-backend-url.com
```

**Importante**: Reemplaza con la URL real de tu backend desplegado.

### 4. Desplegar

1. Clic en **"Deploy"**
2. Espera 1-3 minutos
3. ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

## 🔧 Configuración del Backend (CORS)

Asegúrate de que tu backend permita requests desde Vercel:

```javascript
// En server.js
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo
    'https://tu-proyecto.vercel.app' // Producción
  ]
};
app.use(cors(corsOptions));
```

## 📋 Checklist

- [ ] Código en GitHub/GitLab
- [ ] Proyecto conectado con Vercel
- [ ] `VITE_API_URL` configurada
- [ ] Backend permite CORS desde Vercel
- [ ] Deploy exitoso

## 📖 Documentación Completa

Ver `GUIA_DESPLIEGUE_VERCEL.md` para más detalles.


