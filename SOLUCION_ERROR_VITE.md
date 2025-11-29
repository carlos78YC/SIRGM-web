# Solución: Error de Compatibilidad Vite y Node.js

## ❌ Problema
```
You are using Node.js 20.11.0. Vite requires Node.js version 20.19+ or 22.12+.
TypeError: crypto.hash is not a function
```

## 🔍 Causa
- **Node.js instalado**: 20.11.0
- **Vite requerido**: 7.2.4 (requiere Node.js 20.19+ o 22.12+)
- **Incompatibilidad**: La versión de Node.js es demasiado antigua para Vite 7

## ✅ Solución Aplicada: Downgrade de Vite

He actualizado `package.json` para usar versiones compatibles:
- **Vite**: 7.2.4 → **5.4.8** (compatible con Node.js 20.11.0)
- **@vitejs/plugin-react**: 5.1.1 → **4.3.1** (compatible)

## 📝 Pasos para Aplicar la Solución

1. **Eliminar node_modules y package-lock.json**:
```bash
cd frontend
rm -r node_modules
rm package-lock.json
```

2. **Reinstalar dependencias**:
```bash
npm install
```

3. **Ejecutar el servidor de desarrollo**:
```bash
npm run dev
```

## 🔄 Alternativa: Actualizar Node.js

Si prefieres usar Vite 7, necesitas actualizar Node.js:

### Opción 1: Usando nvm (Node Version Manager)

Si tienes `nvm` instalado:
```bash
# Instalar la última versión LTS de Node.js
nvm install --lts
nvm use --lts

# O instalar Node.js 22 específicamente
nvm install 22
nvm use 22
```

### Opción 2: Descargar desde nodejs.org

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Instala y reinicia la terminal
4. Verifica con: `node --version`

## 🎯 Versiones Compatibles

### Con Node.js 20.11.0 (Actual)
- ✅ Vite 5.x
- ✅ React 19.x
- ✅ React Router 7.x

### Con Node.js 20.19+ o 22.12+
- ✅ Vite 7.x
- ✅ React 19.x
- ✅ React Router 7.x

## 📌 Nota

La solución de downgrade a Vite 5 es **segura** y mantendrá todas las funcionalidades del proyecto. Vite 5 es estable y compatible con Node.js 20.11.0.


