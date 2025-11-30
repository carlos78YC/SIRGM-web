# Estructura del Proyecto

```
SIRGM/
│
├── config/                    # Configuraciones
│   ├── database.js           # Configuración de PostgreSQL (Supabase)
│   └── supabase.js           # Cliente de Supabase para Storage
│
├── controllers/              # Controladores (lógica de negocio)
│   ├── authController.js     # Registro y login
│   └── reporteController.js  # CRUD de reportes
│
├── database/                 # Base de datos
│   ├── migrations/           # Scripts SQL de migración
│   │   ├── 001_create_users_table.sql
│   │   └── 002_create_reportes_table.sql
│   └── runMigrations.js     # Script para ejecutar migraciones
│
├── middleware/               # Middleware de Express
│   ├── auth.js              # Autenticación JWT y autorización
│   ├── errorHandler.js      # Manejo centralizado de errores
│   └── upload.js            # Configuración de Multer para uploads
│
├── models/                   # Modelos de datos (ORM)
│   ├── User.js              # Modelo de Usuario
│   └── Reporte.js           # Modelo de Reporte
│
├── routes/                   # Definición de rutas
│   ├── authRoutes.js        # Rutas de autenticación
│   └── reporteRoutes.js     # Rutas de reportes
│
├── services/                 # Servicios externos
│   └── storageService.js    # Servicio de Supabase Storage
│
├── utils/                    # Utilidades y helpers
│   └── validationHandler.js # Manejador de errores de validación
│
├── validators/               # Validadores de express-validator
│   ├── authValidator.js     # Validaciones de auth
│   └── reporteValidator.js  # Validaciones de reportes
│
├── uploads/                  # Directorio temporal de uploads
│   └── temp/                # (se crea automáticamente)
│
├── .env                      # Variables de entorno (no versionado)
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Dependencias y scripts
├── server.js                # Punto de entrada de la aplicación
├── README.md                # Documentación principal
├── API_EXAMPLES.md          # Ejemplos de uso de la API
└── ESTRUCTURA.md            # Este archivo
```

## Flujo de Petición

1. **Cliente** → `server.js` (Express)
2. **server.js** → `routes/` (Define rutas)
3. **routes/** → `middleware/` (Autenticación, validación)
4. **middleware/** → `validators/` (Validación de datos)
5. **validators/** → `controllers/` (Lógica de negocio)
6. **controllers/** → `models/` (Acceso a BD)
7. **models/** → `config/database.js` (PostgreSQL)
8. **controllers/** → `services/` (Supabase Storage)
9. **Respuesta** → Cliente

## Características Implementadas

✅ **Autenticación**
- Registro de usuarios con roles
- Login con JWT
- Middleware de autenticación
- Autorización por roles

✅ **Reportes**
- Crear reporte (con/sin foto)
- Listar reportes (con filtros)
- Obtener reporte por ID
- Actualizar estado de reporte

✅ **Storage**
- Subida de fotos a Supabase Storage
- Validación de tipos de archivo
- Límite de tamaño (5MB)

✅ **Validaciones**
- Express-validator en todos los endpoints
- Validación de roles
- Validación de estados y prioridades

✅ **Base de Datos**
- PostgreSQL con Supabase
- Migraciones SQL
- Modelos con Pool de conexiones

✅ **Seguridad**
- Contraseñas hasheadas (bcrypt)
- Tokens JWT
- Validación de permisos por rol

## Próximos Pasos

1. Configurar variables de entorno en `.env`
2. Ejecutar migraciones: `npm run migrate`
3. Instalar dependencias: `npm install`
4. Iniciar servidor: `npm run dev`
5. Probar endpoints con Postman o similar
















