# Guía Completa: Instalar Git y Subir Código a GitHub

## 📦 Paso 1: Instalar Git

### Opción A: Instalar Git para Windows (Recomendado)

1. **Descargar Git**:
   - Ve a: [https://git-scm.com/download/win](https://git-scm.com/download/win)
   - Descarga la última versión (se descarga automáticamente)

2. **Instalar Git**:
   - Ejecuta el instalador descargado
   - Sigue el asistente de instalación (puedes dejar las opciones por defecto)
   - Completa la instalación

3. **Verificar instalación**:
   - Abre una nueva terminal PowerShell
   - Ejecuta: `git --version`
   - Deberías ver algo como: `git version 2.x.x`

### Opción B: Instalar con GitHub Desktop (Más fácil)

1. **Descargar GitHub Desktop**:
   - Ve a: [https://desktop.github.com](https://desktop.github.com)
   - Descarga e instala GitHub Desktop

2. **Ventajas**:
   - Interfaz gráfica fácil de usar
   - Git incluido
   - No necesitas usar comandos

## 🚀 Paso 2: Crear Cuenta en GitHub

1. Ve a: [https://github.com](https://github.com)
2. Clic en **"Sign up"**
3. Completa el formulario
4. Verifica tu email

## 📤 Paso 3: Subir Código a GitHub

### Opción A: Usando GitHub Desktop (Más Fácil)

1. **Abrir GitHub Desktop**
2. **Iniciar sesión** con tu cuenta de GitHub
3. **File** → **Add Local Repository**
4. Selecciona la carpeta `C:\Users\Carlos\SIRGM`
5. Si te dice que no es un repositorio Git:
   - Clic en **"create a repository"**
   - Nombre: `SIRGM`
   - Deja las otras opciones como están
6. **Commit** (arriba a la izquierda):
   - Título: "Initial commit: Proyecto SIRGM"
   - Descripción: "Sistema completo de gestión de reportes"
   - Clic en **"Commit to main"**
7. **Publish repository** (arriba):
   - Marca si quieres que sea privado
   - Clic en **"Publish repository"**

¡Listo! Tu código estará en GitHub.

### Opción B: Usando Comandos (Más Control)

1. **Abrir PowerShell** en la carpeta del proyecto:
   ```powershell
   cd C:\Users\Carlos\SIRGM
   ```

2. **Configurar Git** (solo primera vez):
   ```powershell
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-email@ejemplo.com"
   ```

3. **Inicializar repositorio**:
   ```powershell
   git init
   ```

4. **Agregar archivos**:
   ```powershell
   git add .
   ```

5. **Hacer commit**:
   ```powershell
   git commit -m "Initial commit: Proyecto SIRGM completo"
   ```

6. **Crear repositorio en GitHub**:
   - Ve a [github.com](https://github.com)
   - Clic en **"+"** → **"New repository"**
   - Nombre: `SIRGM`
   - **NO marques** "Initialize with README"
   - Clic en **"Create repository"**

7. **Conectar y subir** (reemplaza `TU_USUARIO`):
   ```powershell
   git remote add origin https://github.com/TU_USUARIO/SIRGM.git
   git branch -M main
   git push -u origin main
   ```

8. **Autenticación**:
   - Te pedirá usuario y contraseña
   - Usuario: tu usuario de GitHub
   - Contraseña: necesitarás un **Personal Access Token** (ver abajo)

## 🔐 Crear Personal Access Token (Para autenticación)

1. GitHub → Tu perfil → **Settings**
2. **Developer settings** (al final del menú izquierdo)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Configura:
   - **Note**: "Token para SIRGM"
   - **Expiration**: Elige cuánto tiempo (90 días recomendado)
   - **Select scopes**: Marca `repo` (todos los permisos de repositorio)
6. **Generate token**
7. **IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez)
8. Úsalo como contraseña cuando Git te la pida

## ✅ Verificar que Funcionó

1. Ve a tu perfil en GitHub: `https://github.com/TU_USUARIO`
2. Deberías ver el repositorio `SIRGM`
3. Clic en él y verifica que todos tus archivos estén ahí

## 📝 Archivos que NO se Suben (Gracias al .gitignore)

Tu proyecto ya tiene un `.gitignore` que evita subir:
- ✅ `node_modules/` (muy pesado)
- ✅ `.env` (variables sensibles)
- ✅ `dist/`, `build/`
- ✅ `uploads/`, `logs/`

## 🔄 Actualizar Código en GitHub (Siguientes Veces)

### Con GitHub Desktop:
1. Haz tus cambios
2. Abre GitHub Desktop
3. Verás los cambios listados
4. Escribe un mensaje de commit
5. Clic en **"Commit to main"**
6. Clic en **"Push origin"** (arriba)

### Con Comandos:
```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

## 🎯 Resumen Rápido

1. ✅ Instalar Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. ✅ Crear cuenta: [https://github.com](https://github.com)
3. ✅ Usar GitHub Desktop (más fácil) o comandos
4. ✅ Subir código

## 💡 Recomendación

**Para principiantes**: Usa **GitHub Desktop** - es mucho más fácil y visual.

**Para más control**: Usa comandos Git directamente.

---

¡Listo! Sigue estos pasos y tu código estará en GitHub en minutos. 🚀

Si tienes problemas, comparte el error y te ayudo.


