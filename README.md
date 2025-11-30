# SIRGM Backend

Backend para sistema de gestión de reportes con Node.js y Express.

## Características

- Autenticación con JWT
- Roles de usuario: alumno, docente, admin, mantenimiento
- CRUD de reportes
- Subida de fotos a Supabase Storage
- Validaciones con express-validator
- Base de datos PostgreSQL (Supabase)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con tus credenciales de Supabase

4. Ejecutar migraciones de base de datos (ver `database/migrations/`)

5. Iniciar servidor:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── config/          # Configuraciones (DB, Supabase)
├── controllers/     # Controladores de rutas
├── database/        # Migraciones y esquemas
├── middleware/      # Middleware (auth, validaciones, errores)
├── models/          # Modelos de datos
├── routes/          # Definición de rutas
├── services/        # Servicios (Supabase Storage, etc.)
├── utils/           # Utilidades (helpers)
├── validators/      # Validadores de express-validator
└── server.js        # Punto de entrada
```

## Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login de usuario

### Reportes
- `POST /reportes` - Crear reporte
- `GET /reportes` - Listar reportes
- `GET /reportes/:id` - Obtener reporte por ID
- `PUT /reportes/:id/estado` - Actualizar estado de reporte

## Roles

- **alumno**: Puede crear y ver sus propios reportes
- **docente**: Puede crear y ver reportes
- **admin**: Acceso completo
- **mantenimiento**: Puede actualizar estados y cerrar reportes
















