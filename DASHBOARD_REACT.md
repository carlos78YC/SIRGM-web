# Dashboard React - SIRGM

Dashboard completo para gestionar reportes del sistema SIRGM.

## 🚀 Inicio Rápido

### 1. Iniciar el Backend

En la raíz del proyecto:
```bash
npm start
```

El backend debe estar corriendo en `http://localhost:3000`

### 2. Iniciar el Frontend

En una nueva terminal, navega a la carpeta frontend:
```bash
cd frontend
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

### 3. Crear Usuarios Admin (si no los tienes)

En la raíz del proyecto:
```powershell
.\crear-usuarios-admin.ps1
```

Esto creará:
- **Admin**: `admin@ejemplo.com` / `Password123`
- **Mantenimiento**: `mantenimiento@ejemplo.com` / `Password123`

## 📋 Características del Dashboard

### Login
- Página de inicio de sesión para técnicos y administradores
- Autenticación JWT
- Redirección automática si no estás autenticado

### Tabla de Reportes
- Vista completa de todos los reportes
- **Filtros**:
  - Por estado (pendiente, en_proceso, resuelto, cerrado)
  - Por prioridad (baja, media, alta, urgente)
- Información visible:
  - ID, Título, Usuario, Ubicación
  - Prioridad y Estado con badges de colores
  - Fecha de creación
  - Botón para ver detalles

### Vista Detalle
- Información completa del reporte
- **Imágenes**: Visualización de fotos adjuntas
- **Cambio de Estado**: 
  - Solo disponible para admin y mantenimiento
  - Modal para cambiar estado y agregar observaciones
- Información del usuario que creó el reporte
- Fechas de creación, actualización y cierre

### Estadísticas
- **Métricas principales**:
  - Total de reportes
  - Contadores por estado
  - Tiempos promedio por estado
- **Gráficos**:
  - Distribución por prioridad (barras)
  - Distribución por estado (barras)
- Actualización en tiempo real

## 🎨 Diseño

- **Sidebar**: Navegación lateral con menú
- **Responsive**: Adaptado para móviles y tablets
- **Colores**: 
  - Pendiente: Amarillo
  - En Proceso: Azul
  - Resuelto: Verde
  - Cerrado: Gris
- **Prioridades**:
  - Baja: Azul claro
  - Media: Naranja claro
  - Alta: Rojo claro
  - Urgente: Rojo intenso

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Si el backend está en otro puerto o dominio, ajusta esta URL.

## 📱 Uso

1. **Iniciar sesión**:
   - Ve a `http://localhost:5173`
   - Usa las credenciales de admin o mantenimiento
   
2. **Ver reportes**:
   - La página principal muestra todos los reportes
   - Usa los filtros para encontrar reportes específicos
   - Click en "Ver" para ver detalles

3. **Cambiar estado**:
   - Abre un reporte
   - Click en "Cambiar Estado"
   - Selecciona el nuevo estado
   - Agrega observaciones (opcional)
   - Guarda

4. **Ver estadísticas**:
   - Click en "Estadísticas" en el menú lateral
   - Ve métricas y gráficos en tiempo real

## 🛠️ Tecnologías

- **React 19**: Framework principal
- **Vite**: Build tool y dev server
- **React Router DOM**: Routing
- **Axios**: Cliente HTTP
- **Context API**: Gestión de estado de autenticación

## 📂 Estructura

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Login.jsx
│   │   ├── Layout.jsx
│   │   ├── ReportesTable.jsx
│   │   └── ReporteDetail.jsx
│   ├── pages/          # Páginas principales
│   │   └── Stats.jsx
│   ├── context/         # Context API
│   │   └── AuthContext.jsx
│   ├── services/        # Servicios API
│   │   └── api.js
│   ├── App.jsx          # App principal
│   └── main.jsx         # Entry point
├── .env.example         # Ejemplo de variables de entorno
└── README.md            # Documentación del frontend
```

## ⚠️ Notas Importantes

- El backend debe estar corriendo antes de iniciar el frontend
- Solo usuarios con rol `admin` o `mantenimiento` pueden cambiar estados
- Las imágenes se cargan desde Supabase Storage
- El token JWT se guarda en localStorage
- La sesión se mantiene hasta hacer logout o expirar el token

## 🐛 Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la variable `VITE_API_URL` en `.env`

### No puedo cambiar estados
- Verifica que tu usuario tenga rol `admin` o `mantenimiento`
- Usa el script `crear-usuarios-admin.ps1` para crear usuarios con permisos

### Las imágenes no se cargan
- Verifica que el bucket de Supabase esté configurado correctamente
- Revisa que las URLs de las imágenes sean accesibles públicamente

## 📝 Próximas Mejoras

- [ ] Búsqueda de reportes por texto
- [ ] Paginación en la tabla
- [ ] Exportar reportes a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Asignación de técnicos a reportes
- [ ] Historial de cambios de estado









