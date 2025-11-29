const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { createUserValidator, updateUserValidator, deleteUserValidator } = require('../validators/adminValidator');
const handleValidationErrors = require('../utils/validationHandler');

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate);
router.use(authorize('admin'));

// Rutas de usuarios
router.get('/users', adminController.getUsers);
router.post('/users', createUserValidator, handleValidationErrors, adminController.createUser);
router.put('/users/:id', updateUserValidator, handleValidationErrors, adminController.updateUser);
router.delete('/users/:id', deleteUserValidator, handleValidationErrors, adminController.deleteUser);

// Rutas de exportación
router.get('/export/users', adminController.exportUsers);
router.get('/export/reportes', adminController.exportReportes);

module.exports = router;




