const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Todas las rutas requieren autenticación
router.use(authenticate);

// POST /upload - Subir un archivo
router.post(
  '/',
  upload.single('file'),
  uploadController.uploadFile
);

// DELETE /upload/:path - Eliminar un archivo
router.delete(
  '/:path',
  uploadController.deleteFile
);

module.exports = router;









