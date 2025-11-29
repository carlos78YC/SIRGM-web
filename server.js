const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');
const utf8Handler = require('./middleware/utf8Handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads', 'temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
// Configurar CORS para permitir requests desde Vercel y localhost
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo local
    'https://sirgm-web.vercel.app', // Producción Vercel (se actualizará automáticamente)
    /https:\/\/.*\.vercel\.app$/, // Cualquier subdominio de Vercel
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(utf8Handler); // Asegurar UTF-8 en todas las respuestas

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/auth', authRoutes);
app.use('/reportes', reporteRoutes);
app.use('/upload', uploadRoutes);
app.use('/admin', adminRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;







