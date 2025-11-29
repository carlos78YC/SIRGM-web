# Guía: Desplegar Dashboard SIRGM en Vercel

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: [https://vercel.com](https://vercel.com) (puedes usar GitHub, GitLab o email)
2. **Código en Git**: Tu proyecto debe estar en GitHub, GitLab o Bitbucket
3. **Backend desplegado o accesible**: Necesitas la URL de tu backend API

## 🚀 Opción 1: Desplegar desde Vercel Dashboard (Recomendado)

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en GitHub/GitLab/Bitbucket
2. El frontend debe estar en la carpeta `frontend/` o en la raíz del repositorio

### Paso 2: Conectar con Vercel

1. Ve a [https://vercel.com](https://vercel.com) y haz login
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar el Proyecto

**Configuración básica:**

- **Framework Preset**: `Vite` (se detecta automáticamente)
- **Root Directory**: `frontend` (si el frontend está en esa carpeta)
- **Build Command**: `npm run build` (ya configurado)
- **Output Directory**: `dist` (ya configurado)
- **Install Command**: `npm install` (ya configurado)

### Paso 4: Variables de Entorno

Agrega las siguientes variables de entorno en Vercel:

1. En la configuración del proyecto, ve a **"Settings"** → **"Environment Variables"**
2. Agrega:

```
VITE_API_URL = https://tu-backend-url.com
```

**Ejemplo:**
- Si tu backend está en Render: `https://tu-app.onrender.com`
- Si tu backend está en Railway: `https://tu-app.up.railway.app`
- Si es local para pruebas: `http://localhost:3000` (no recomendado para producción)

### Paso 5: Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el proceso (1-3 minutos)
3. ¡Listo! Tu app estará disponible en una URL como: `https://tu-proyecto.vercel.app`

## 🚀 Opción 2: Desplegar desde CLI (Avanzado)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Navegar al Frontend

```bash
cd frontend
```

### Paso 4: Desplegar

```bash
vercel
```

Sigue las instrucciones:
- ¿Set up and deploy? **Yes**
- ¿Which scope? Selecciona tu cuenta
- ¿Link to existing project? **No** (primera vez) o **Yes** (siguientes veces)
- ¿What's your project's name? `sirgm-dashboard`
- ¿In which directory is your code located? `./` o `frontend`
- **Override settings?** No (usa la configuración del vercel.json)

### Paso 5: Configurar Variables de Entorno

```bash
vercel env add VITE_API_URL
```

Ingresa el valor cuando se solicite (ej: `https://tu-backend.com`)

### Paso 6: Desplegar a Producción

```bash
vercel --prod
```

## 🔧 Configuración Adicional

### Configurar Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains** en Vercel
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

### Configuración de CORS en el Backend

Asegúrate de que tu backend permita solicitudes desde tu dominio de Vercel:

```javascript
// En tu backend (server.js o similar)
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo
    'https://tu-proyecto.vercel.app', // Producción Vercel
    'https://tu-dominio.com' // Dominio personalizado
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

## 📝 Estructura de Archivos Necesaria

Asegúrate de tener estos archivos en tu proyecto:

```
frontend/
├── vercel.json          ← Configuración de Vercel (ya creado)
├── package.json         ← Scripts de build
├── vite.config.js       ← Configuración de Vite
└── src/
    └── services/
        └── api.js       ← Usa VITE_API_URL
```

## 🔍 Verificar que Funciona

1. **Después del despliegue**, visita tu URL de Vercel
2. **Abre la consola del navegador** (F12)
3. Verifica que:
   - No haya errores de conexión al backend
   - Las peticiones se hagan a la URL correcta (VITE_API_URL)
   - La aplicación cargue correctamente

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución**: Asegúrate de que todas las dependencias estén en `package.json`:
```bash
cd frontend
npm install
```

### Error: "404 Not Found" al navegar

**Solución**: El archivo `vercel.json` ya incluye un rewrite para React Router:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Las variables de entorno no funcionan

**Solución**: 
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el deployment después de agregar variables
- Las variables se inyectan en build time, no runtime

### Error de CORS

**Solución**: Agrega tu dominio de Vercel a la lista de orígenes permitidos en tu backend:
```javascript
app.use(cors({
  origin: ['https://tu-proyecto.vercel.app']
}));
```

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Vite](https://vitejs.dev/)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Checklist Final

- [ ] Código subido a GitHub/GitLab/Bitbucket
- [ ] Proyecto conectado con Vercel
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] Backend configurado para aceptar requests desde Vercel (CORS)
- [ ] Build exitoso en Vercel
- [ ] Aplicación funcionando en producción

---

¡Listo para desplegar! 🚀

Si tienes problemas durante el despliegue, comparte el error y te ayudo a resolverlo.


