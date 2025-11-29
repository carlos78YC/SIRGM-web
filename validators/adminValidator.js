const { body, param } = require('express-validator');

const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 255 })
    .withMessage('El nombre no puede exceder 255 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ max: 255 })
    .withMessage('El apellido no puede exceder 255 caracteres'),
  body('rol')
    .optional()
    .isIn(['alumno', 'docente', 'admin', 'mantenimiento'])
    .withMessage('El rol debe ser uno de: alumno, docente, admin, mantenimiento')
];

const updateUserValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El nombre no puede exceder 255 caracteres'),
  body('apellido')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El apellido no puede exceder 255 caracteres'),
  body('rol')
    .optional()
    .isIn(['alumno', 'docente', 'admin', 'mantenimiento'])
    .withMessage('El rol debe ser uno de: alumno, docente, admin, mantenimiento'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser verdadero o falso')
];

const deleteUserValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator
};




