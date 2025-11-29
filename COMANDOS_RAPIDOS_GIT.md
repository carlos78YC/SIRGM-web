# Comandos Rápidos para Subir a GitHub

## 🚀 Copia y Pega Estos Comandos

**Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con los valores reales de tu repositorio.**

```powershell
# 1. Ir a tu proyecto
cd C:\Users\Carlos\SIRGM

# 2. Inicializar Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer commit
git commit -m "Initial commit: Proyecto SIRGM completo"

# 5. Conectar con GitHub (REEMPLAZA LA URL CON LA TUYA)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Renombrar rama
git branch -M main

# 7. Subir código
git push -u origin main
```

## 📍 Para obtener la URL de tu repositorio:

1. Ve a tu repositorio en GitHub
2. Clic en el botón verde **"Code"**
3. Copia la URL que aparece (HTTPS)

## 🔐 Si te pide autenticación:

- **Usuario**: Tu usuario de GitHub
- **Contraseña**: Necesitas un **Personal Access Token**
  - GitHub → Settings → Developer settings → Personal access tokens
  - Generate new token (classic)
  - Marca `repo`
  - Copia el token y úsalo como contraseña

---

¡Listo! 🎉


