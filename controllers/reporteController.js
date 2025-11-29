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

    // Crear reporte
    const reporte = await Reporte.create({
      usuario_id,
      titulo,
      descripcion,
      ubicacion,
      prioridad,
      foto_url,
      foto_path
    });

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
    const { estado, observaciones } = req.body;

    // Verificar que el reporte existe
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos: solo admin y mantenimiento pueden actualizar estado
    if (req.user.rol !== 'admin' && req.user.rol !== 'mantenimiento') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar el estado del reporte'
      });
    }

    // Actualizar estado
    const reporteActualizado = await Reporte.updateEstado(id, estado, observaciones);

    res.json({
      success: true,
      message: 'Estado del reporte actualizado exitosamente',
      data: reporteActualizado
    });
  } catch (error) {
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

    // Verificar permisos: solo el dueño o admin pueden actualizar
    if (req.user.rol !== 'admin' && reporte.usuario_id !== req.user.id) {
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
  updateReporte,
  deleteReporte
};







