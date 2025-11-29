# Guía: Subir Código a GitHub

## 📋 Requisitos Previos

1. **Cuenta en GitHub**: [https://github.com](https://github.com) (crea una si no tienes)
2. **Git instalado**: Verifica con `git --version`

## 🚀 Opción 1: Si NO tienes Git inicializado (Primera vez)

### Paso 1: Inicializar Git

```bash
# En la raíz del proyecto (SIRGM)
git init
```

### Paso 2: Agregar todos los archivos

```bash
git add .
```

### Paso 3: Hacer el primer commit

```bash
git commit -m "Initial commit: Proyecto SIRGM completo"
```

### Paso 4: Crear repositorio en GitHub

1. Ve a [https://github.com](https://github.com)
2. Clic en el **"+"** (arriba a la derecha) → **"New repository"**
3. Configura:
   - **Repository name**: `SIRGM` (o el nombre que prefieras)
   - **Description**: "Sistema de Gestión de Reportes y Mantenimiento"
   - **Visibility**: Público o Privado (tú decides)
   - **NO marques** "Initialize with README" (ya tienes código)
4. Clic en **"Create repository"**

### Paso 5: Conectar y subir

GitHub te mostrará comandos. Ejecuta estos (reemplaza `TU_USUARIO`):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/SIRGM.git

# Renombrar la rama principal a main (si es necesario)
git branch -M main

# Subir el código
git push -u origin main
```

Te pedirá usuario y contraseña de GitHub. Si usas autenticación de dos factores, necesitarás un **Personal Access Token** en lugar de la contraseña.

## 🔐 Crear Personal Access Token (Si lo necesitas)

1. GitHub → **Settings** (tu perfil) → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Selecciona permisos: `repo` (todos los permisos de repositorio)
5. **Generate token**
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como contraseña cuando Git te la pida

## 🚀 Opción 2: Si YA tienes Git inicializado

### Verificar estado actual

```bash
git status
```

### Si hay cambios sin commitear

```bash
# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### Si no tienes el remoto configurado

```bash
# Agregar repositorio remoto
git remote add origin https://github.com/TU_USUARIO/SIRGM.git

# Subir
git push -u origin main
```

## 📝 Comandos Útiles

### Ver estado de Git

```bash
git status
```

### Ver commits anteriores

```bash
git log
```

### Ver repositorios remotos configurados

```bash
git remote -v
```

### Cambiar URL del remoto

```bash
git remote set-url origin https://github.com/TU_USUARIO/NUEVO_NOMBRE.git
```

## ✅ Checklist

- [ ] Git inicializado (`git init`)
- [ ] Archivos agregados (`git add .`)
- [ ] Primer commit hecho (`git commit`)
- [ ] Repositorio creado en GitHub
- [ ] Repositorio remoto agregado (`git remote add`)
- [ ] Código subido (`git push`)

## 🎯 Pasos Rápidos (Resumen)

```bash
# 1. Inicializar (solo primera vez)
git init
git add .
git commit -m "Initial commit"

# 2. Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/SIRGM.git
git branch -M main
git push -u origin main
```

## 💡 Notas Importantes

1. **El archivo `.gitignore`** ya está configurado para ignorar:
   - `node_modules/`
   - `.env` (variables de entorno sensibles)
   - `dist/`, `build/`
   - `uploads/`, `logs/`

2. **NUNCA subas**:
   - Archivos `.env` con credenciales reales
   - `node_modules/`
   - Archivos de configuración local

3. **Sí sube**:
   - Código fuente
   - `.gitignore`
   - `package.json`
   - Documentación (`.md`)

## 🐛 Solución de Problemas

### Error: "remote origin already exists"

```bash
# Ver repositorios remotos
git remote -v

# Cambiar URL
git remote set-url origin https://github.com/TU_USUARIO/SIRGM.git
```

### Error: "failed to push some refs"

```bash
# Primero descarga cambios remotos
git pull origin main --allow-unrelated-histories

# Luego sube
git push -u origin main
```

### Error: "authentication failed"

- Usa un **Personal Access Token** en lugar de contraseña
- O configura SSH keys para GitHub

---

¡Listo para subir tu código! 🚀

Si tienes problemas, comparte el error y te ayudo a resolverlo.


