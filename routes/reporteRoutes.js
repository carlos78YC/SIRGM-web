const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { authenticate } = require('../middleware/auth');
const { 
  createReporteValidator, 
  updateEstadoValidator,
  updatePrioridadValidator,
  getReporteValidator,
  updateReporteValidator,
  deleteReporteValidator
} = require('../validators/reporteValidator');
const handleValidationErrors = require('../utils/validationHandler');
const upload = require('../middleware/upload');

// Todas las rutas requieren autenticación
router.use(authenticate);

// POST /reportes - Crear reporte
router.post(
  '/',
  upload.single('foto'),
  createReporteValidator,
  handleValidationErrors,
  reporteController.createReporte
);

// GET /reportes - Obtener todos los reportes
router.get('/', reporteController.getReportes);

// GET /reportes/:id - Obtener un reporte por ID
router.get(
  '/:id',
  getReporteValidator,
  handleValidationErrors,
  reporteController.getReporteById
);

// PUT /reportes/:id - Actualizar reporte
router.put(
  '/:id',
  upload.single('foto'),
  updateReporteValidator,
  handleValidationErrors,
  reporteController.updateReporte
);

// PUT /reportes/:id/estado - Actualizar estado del reporte
router.put(
  '/:id/estado',
  updateEstadoValidator,
  handleValidationErrors,
  reporteController.updateEstado
);

// PUT /reportes/:id/prioridad - Establecer prioridad del reporte
router.put(
  '/:id/prioridad',
  updatePrioridadValidator,
  handleValidationErrors,
  reporteController.updatePrioridad
);

// DELETE /reportes/:id - Eliminar reporte
router.delete(
  '/:id',
  deleteReporteValidator,
  handleValidationErrors,
  reporteController.deleteReporte
);

module.exports = router;







