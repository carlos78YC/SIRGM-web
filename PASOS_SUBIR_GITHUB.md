# 📤 Pasos para Subir tu Código a GitHub

## ✅ Ya tienes:
- ✅ Git instalado (versión 2.52.0)
- ✅ Git configurado (carlos78YC)
- ✅ Repositorio creado en GitHub

## 🚀 Sigue estos pasos:

### Paso 1: Inicializar Git en tu proyecto

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
git init
```

### Paso 2: Agregar todos los archivos

```powershell
git add .
```

### Paso 3: Hacer el primer commit

```powershell
git commit -m "Initial commit: Proyecto SIRGM completo"
```

### Paso 4: Conectar con tu repositorio de GitHub

**Primero, obtén la URL de tu repositorio:**
1. Ve a tu repositorio en GitHub
2. Clic en el botón verde **"Code"**
3. Copia la URL (HTTPS)

**Luego ejecuta (reemplaza con TU URL):**
```powershell
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

### Paso 5: Renombrar la rama principal

```powershell
git branch -M main
```

### Paso 6: Subir el código

```powershell
git push -u origin main
```

**Te pedirá autenticación:**
- Usuario: Tu usuario de GitHub
- Contraseña: Necesitas un **Personal Access Token** (ver abajo)

## 🔐 Crear Personal Access Token

1. Ve a GitHub → Tu perfil → **Settings**
2. **Developer settings** (abajo a la izquierda)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Configura:
   - **Note**: "Token para SIRGM"
   - **Expiration**: 90 días
   - **Select scopes**: ✅ `repo` (todos los permisos)
6. **Generate token**
7. **Copia el token** (empieza con `ghp_...`)
8. Úsalo como contraseña cuando Git te la pida

---

## 📝 Comandos Completos (Copia y Pega)

```powershell
# 1. Inicializar
git init

# 2. Agregar archivos
git add .

# 3. Commit
git commit -m "Initial commit: Proyecto SIRGM completo"

# 4. Conectar (REEMPLAZA CON TU URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 5. Renombrar rama
git branch -M main

# 6. Subir
git push -u origin main
```

¡Listo! 🎉

