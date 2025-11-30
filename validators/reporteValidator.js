const { body, param } = require('express-validator');

const createReporteValidator = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('ubicacion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La ubicación no puede exceder 255 caracteres'),
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('La prioridad debe ser: baja, media, alta o urgente')
];

const updateEstadoValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero'),
  body('estado')
    .isIn(['pendiente', 'en_proceso', 'resuelto', 'cerrado'])
    .withMessage('El estado debe ser: pendiente, en_proceso, resuelto o cerrado'),
  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('La prioridad debe ser: baja, media, alta o urgente')
];

const updatePrioridadValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero'),
  body('prioridad')
    .notEmpty()
    .withMessage('La prioridad es requerida')
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('La prioridad debe ser: baja, media, alta o urgente')
];

const getReporteValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero')
];

const updateReporteValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero'),
  body('titulo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía')
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('ubicacion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La ubicación no puede exceder 255 caracteres'),
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'urgente'])
    .withMessage('La prioridad debe ser: baja, media, alta o urgente')
];

const deleteReporteValidator = [
  param('id')
    .isInt()
    .withMessage('El ID debe ser un número entero')
];

module.exports = {
  createReporteValidator,
  updateEstadoValidator,
  updatePrioridadValidator,
  getReporteValidator,
  updateReporteValidator,
  deleteReporteValidator
};







