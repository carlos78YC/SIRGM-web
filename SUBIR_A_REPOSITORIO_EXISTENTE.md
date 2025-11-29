# Subir Código a un Repositorio GitHub Existente

## 🎯 Ya tienes el repositorio creado en GitHub, ahora sigue estos pasos:

## Paso 1: Verificar si tienes Git instalado

Abre PowerShell y ejecuta:
```powershell
git --version
```

### Si dice "comando no reconocido":
👉 **Instala Git primero**: [https://git-scm.com/download/win](https://git-scm.com/download/win)

### Si muestra una versión (ej: `git version 2.x.x`):
✅ Continúa al Paso 2

## Paso 2: Configurar Git (Solo primera vez)

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## Paso 3: Inicializar Git en tu proyecto

```powershell
# Asegúrate de estar en la carpeta del proyecto
cd C:\Users\Carlos\SIRGM

# Inicializar Git
git init
```

## Paso 4: Agregar todos los archivos

```powershell
git add .
```

Esto agregará todos los archivos (menos los que están en `.gitignore`)

## Paso 5: Hacer el primer commit

```powershell
git commit -m "Initial commit: Proyecto SIRGM completo"
```

## Paso 6: Conectar con tu repositorio de GitHub

Necesitas la URL de tu repositorio. Debe verse así:
- `https://github.com/TU_USUARIO/NOMBRE_REPO.git`

Ejecuta (reemplaza con TU URL real):
```powershell
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

**Para obtener la URL:**
1. Ve a tu repositorio en GitHub
2. Clic en el botón verde **"Code"**
3. Copia la URL (HTTPS)

## Paso 7: Renombrar la rama principal

```powershell
git branch -M main
```

## Paso 8: Subir el código

```powershell
git push -u origin main
```

**Te pedirá autenticación:**
- **Usuario**: Tu usuario de GitHub
- **Contraseña**: Necesitas un **Personal Access Token** (no tu contraseña normal)

## 🔐 Crear Personal Access Token

Si no tienes un token:

1. Ve a GitHub → Tu perfil → **Settings**
2. **Developer settings** (abajo a la izquierda)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Configura:
   - **Note**: "Token para SIRGM"
   - **Expiration**: 90 días (o el que prefieras)
   - **Select scopes**: Marca ✅ `repo` (todos los permisos)
6. **Generate token**
7. **Copia el token** (empieza con `ghp_...`)
8. Úsalo como contraseña cuando Git te la pida

## ✅ Verificar que funcionó

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/TU_REPOSITORIO`
2. Deberías ver todos tus archivos ahí

## 📝 Comandos Completos (Copia y pega)

```powershell
# 1. Ir al proyecto
cd C:\Users\Carlos\SIRGM

# 2. Configurar Git (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# 3. Inicializar
git init

# 4. Agregar archivos
git add .

# 5. Hacer commit
git commit -m "Initial commit: Proyecto SIRGM completo"

# 6. Conectar con GitHub (REEMPLAZA LA URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 7. Renombrar rama
git branch -M main

# 8. Subir código
git push -u origin main
```

## 🐛 Si ya existe un repositorio remoto

Si obtienes error "remote origin already exists":

```powershell
# Ver repositorios remotos
git remote -v

# Cambiar la URL
git remote set-url origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

## 🔄 Actualizar código en el futuro

Cuando hagas cambios y quieras subirlos:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## 🎯 Resumen Rápido

1. ✅ Instalar Git (si no lo tienes)
2. ✅ `git init` en tu proyecto
3. ✅ `git add .`
4. ✅ `git commit -m "mensaje"`
5. ✅ `git remote add origin URL_DEL_REPO`
6. ✅ `git push -u origin main`

¿Necesitas ayuda con algún paso específico? 🤔


