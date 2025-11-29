# SIRGM Dashboard - Frontend

Dashboard React para el Sistema de Gestión de Reportes y Mantenimiento (SIRGM).

## Características

- 🔐 **Autenticación JWT** - Login seguro para técnicos y administradores
- 📋 **Tabla de Reportes** - Vista completa con filtros por estado y prioridad
- 📊 **Vista Detalle** - Información completa del reporte con imágenes
- 🔧 **Gestión de Estados** - Cambio de estado y observaciones (admin/mantenimiento)
- 📈 **Estadísticas** - Dashboard con métricas y tiempos promedio

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y configurar la URL del backend:
```
VITE_API_URL=http://localhost:3000
```

## Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

## Build

Crear build de producción:
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Login.jsx     # Página de login
│   ├── Layout.jsx     # Layout principal con sidebar
│   ├── ReportesTable.jsx  # Tabla de reportes
│   └── ReporteDetail.jsx  # Vista detalle
├── pages/            # Páginas principales
│   └── Stats.jsx     # Página de estadísticas
├── context/          # Context API
│   └── AuthContext.jsx  # Contexto de autenticación
├── services/         # Servicios API
│   └── api.js        # Cliente API y servicios
└── App.jsx           # Componente principal con routing
```

## Uso

### Login

Usa las credenciales de un usuario con rol `admin` o `mantenimiento`:

- Email: `admin@ejemplo.com`
- Password: `Password123`

O crea usuarios usando el script `crear-usuarios-admin.ps1` en el backend.

### Navegación

- **Reportes**: Ver todos los reportes con filtros
- **Estadísticas**: Dashboard con métricas y gráficos
- **Detalle**: Click en "Ver" en cualquier reporte para ver detalles completos

### Funcionalidades

- **Filtros**: Filtrar reportes por estado y prioridad
- **Cambio de Estado**: Solo admin y mantenimiento pueden cambiar estados
- **Imágenes**: Ver imágenes adjuntas en el detalle del reporte
- **Estadísticas**: Métricas en tiempo real de todos los reportes

## Tecnologías

- React 19
- React Router DOM
- Axios
- Vite

## Notas

- El backend debe estar corriendo en `http://localhost:3000` (o la URL configurada en `.env`)
- Se requiere autenticación JWT para todas las rutas excepto `/login`
- Las imágenes se cargan desde Supabase Storage
