const Reporte = require('../models/Reporte');
const storageService = require('../services/storageService');

const createReporte = async (req, res, next) => {
  try {
    const { titulo, descripcion, ubicacion, prioridad } = req.body;
    const usuario_id = req.user.id;

    let foto_url = null;
    let foto_path = null;

    // Si hay archivo, subirlo a Supabase
    if (req.file) {
      try {
        const uploadResult = await storageService.uploadFile(
          req.file.path,
          req.file.filename
        );
        foto_url = uploadResult.url;
        foto_path = uploadResult.path;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al subir la foto',
          error: error.message
        });
      }
    }

    // IMPORTANTE: La app móvil NO envía prioridad
    // Si prioridad viene como undefined, null, o string vacío, NO enviarla al modelo
    // El modelo la convertirá a NULL explícitamente
    let prioridadValue = undefined;
    if (prioridad !== undefined && prioridad !== null && prioridad !== '') {
      // Solo asignar si viene un valor válido (desde la web, por ejemplo)
      prioridadValue = prioridad;
    }
    
    // Debug: Ver qué valor de prioridad estamos recibiendo
    console.log('[DEBUG createReporte] prioridad recibida:', prioridad);
    console.log('[DEBUG createReporte] prioridadValue:', prioridadValue);
    console.log('[DEBUG createReporte] tipo de prioridad:', typeof prioridad);

    // Crear reporte - prioridad será NULL si no se proporciona
    const reporte = await Reporte.create({
      usuario_id,
      titulo,
      descripcion,
      ubicacion,
      prioridad: prioridadValue, // undefined si no viene, el modelo lo convertirá a NULL
      foto_url,
      foto_path
    });
    
    // Debug: Ver qué prioridad se guardó
    console.log('[DEBUG createReporte] Reporte creado con prioridad:', reporte.prioridad);

    res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      data: reporte
    });
  } catch (error) {
    next(error);
  }
};

const getReportes = async (req, res, next) => {
  try {
    const { estado, prioridad, limit, offset } = req.query;
    const filters = {};

    // Solo admin y mantenimiento pueden ver todos los reportes
    // Los demás usuarios (alumno, docente) solo ven sus propios reportes
    if (req.user.rol !== 'admin' && req.user.rol !== 'mantenimiento') {
      filters.usuario_id = req.user.id;
    }

    if (estado) filters.estado = estado;
    if (prioridad) filters.prioridad = prioridad;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const reportes = await Reporte.findAll(filters);

    res.json({
      success: true,
      count: reportes.length,
      data: reportes
    });
  } catch (error) {
    next(error);
  }
};

const getReporteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findById(id);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos: solo el dueño, admin o mantenimiento pueden ver
    if (
      req.user.rol !== 'admin' &&
      req.user.rol !== 'mantenimiento' &&
      reporte.usuario_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este reporte'
      });
    }

    res.json({
      success: true,
      data: reporte
    });
  } catch (error) {
    next(error);
  }
};

const updateEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, observaciones, prioridad } = req.body;

    console.log('[DEBUG updateEstado] ID:', id);
    console.log('[DEBUG updateEstado] Estado recibido:', estado);
    console.log('[DEBUG updateEstado] Prioridad recibida:', prioridad);
    console.log('[DEBUG updateEstado] Observaciones recibidas:', observaciones);
    console.log('[DEBUG updateEstado] Usuario rol:', req.user?.rol);

    // Verificar que el reporte existe
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      console.log('[DEBUG updateEstado] Reporte no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    console.log('[DEBUG updateEstado] Reporte encontrado, prioridad actual:', reporte.prioridad);
    console.log('[DEBUG updateEstado] Estado actual:', reporte.estado);

    // Verificar permisos: solo admin y mantenimiento pueden actualizar estado
    if (req.user.rol !== 'admin' && req.user.rol !== 'mantenimiento') {
      console.log('[DEBUG updateEstado] Sin permisos, rol:', req.user.rol);
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar el estado del reporte'
      });
    }

    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];
    if (!estado || !estadosValidos.includes(estado)) {
      console.log('[DEBUG updateEstado] Estado inválido:', estado);
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    // Si el reporte no tiene prioridad y no se proporciona una, permitir el cambio de estado
    // pero sugerir establecer la prioridad (ya no es obligatorio)
    if (!reporte.prioridad && !prioridad) {
      console.log('[DEBUG updateEstado] Reporte sin prioridad, permitiendo cambio de estado');
    }

    // Si se proporciona prioridad, validarla
    if (prioridad) {
      const prioridadesValidas = ['baja', 'media', 'alta', 'urgente'];
      if (!prioridadesValidas.includes(prioridad)) {
        console.log('[DEBUG updateEstado] Prioridad inválida:', prioridad);
        return res.status(400).json({
          success: false,
          message: `La prioridad debe ser una de: ${prioridadesValidas.join(', ')}`
        });
      }
    }

    // Actualizar estado (y prioridad si se proporciona)
    console.log('[DEBUG updateEstado] Actualizando estado...');
    const reporteActualizado = await Reporte.updateEstado(id, estado, observaciones, prioridad);
    console.log('[DEBUG updateEstado] Estado actualizado exitosamente');

    res.json({
      success: true,
      message: 'Estado del reporte actualizado exitosamente',
      data: reporteActualizado
    });
  } catch (error) {
    console.error('[DEBUG updateEstado] Error:', error.message);
    console.error('[DEBUG updateEstado] Stack:', error.stack);
    next(error);
  }
};

const updatePrioridad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { prioridad } = req.body;

    console.log('[DEBUG updatePrioridad] ID:', id);
    console.log('[DEBUG updatePrioridad] Prioridad recibida:', prioridad);
    console.log('[DEBUG updatePrioridad] Usuario rol:', req.user?.rol);

    // Verificar que el reporte existe
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      console.log('[DEBUG updatePrioridad] Reporte no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    console.log('[DEBUG updatePrioridad] Reporte encontrado, prioridad actual:', reporte.prioridad);

    // Verificar permisos: solo admin y mantenimiento pueden establecer prioridad
    if (req.user.rol !== 'admin' && req.user.rol !== 'mantenimiento') {
      console.log('[DEBUG updatePrioridad] Sin permisos, rol:', req.user.rol);
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para establecer la prioridad del reporte'
      });
    }

    // Validar que prioridad sea válida
    if (!prioridad || !['baja', 'media', 'alta', 'urgente'].includes(prioridad)) {
      console.log('[DEBUG updatePrioridad] Prioridad inválida:', prioridad);
      return res.status(400).json({
        success: false,
        message: 'La prioridad debe ser: baja, media, alta o urgente'
      });
    }

    // Actualizar prioridad
    console.log('[DEBUG updatePrioridad] Actualizando prioridad a:', prioridad);
    const reporteActualizado = await Reporte.updatePrioridad(id, prioridad);
    console.log('[DEBUG updatePrioridad] Prioridad actualizada, nueva prioridad:', reporteActualizado?.prioridad);

    res.json({
      success: true,
      message: 'Prioridad del reporte actualizada exitosamente',
      data: reporteActualizado
    });
  } catch (error) {
    console.error('[DEBUG updatePrioridad] Error:', error.message);
    console.error('[DEBUG updatePrioridad] Stack:', error.stack);
    next(error);
  }
};

const updateReporte = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, ubicacion, prioridad } = req.body;

    // Verificar que el reporte existe
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos: solo el dueño, admin o mantenimiento pueden actualizar
    // El personal de mantenimiento puede actualizar cualquier reporte (especialmente prioridad)
    if (req.user.rol !== 'admin' && req.user.rol !== 'mantenimiento' && reporte.usuario_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este reporte'
      });
    }

    // Preparar actualizaciones
    const updates = {};
    if (titulo) updates.titulo = titulo;
    if (descripcion) updates.descripcion = descripcion;
    if (ubicacion !== undefined) updates.ubicacion = ubicacion;
    if (prioridad) updates.prioridad = prioridad;

    // Si hay archivo nuevo, subirlo y actualizar foto
    if (req.file) {
      try {
        // Si había una foto anterior, eliminarla
        if (reporte.foto_path) {
          await storageService.deleteFile(reporte.foto_path);
        }

        const uploadResult = await storageService.uploadFile(
          req.file.path,
          req.file.filename
        );
        updates.foto_url = uploadResult.url;
        updates.foto_path = uploadResult.path;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al subir la nueva foto',
          error: error.message
        });
      }
    }

    // Actualizar reporte
    const reporteActualizado = await Reporte.update(id, updates);

    if (!reporteActualizado) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    res.json({
      success: true,
      message: 'Reporte actualizado exitosamente',
      data: reporteActualizado
    });
  } catch (error) {
    next(error);
  }
};

const deleteReporte = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el reporte existe
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos: solo el dueño o admin pueden eliminar
    if (req.user.rol !== 'admin' && reporte.usuario_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este reporte'
      });
    }

    // Si tiene foto, eliminarla de storage
    if (reporte.foto_path) {
      await storageService.deleteFile(reporte.foto_path);
    }

    // Eliminar reporte
    await Reporte.delete(id);

    res.json({
      success: true,
      message: 'Reporte eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReporte,
  getReportes,
  getReporteById,
  updateEstado,
  updatePrioridad,
  updateReporte,
  deleteReporte
};







