const storageService = require('../services/storageService');

/**
 * Subir un archivo a Supabase Storage
 * POST /upload
 * Body: multipart/form-data con campo 'file'
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Subir archivo a Supabase
    const uploadResult = await storageService.uploadFile(
      req.file.path,
      req.file.filename,
      req.body.folder || 'uploads'
    );

    res.json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: {
        url: uploadResult.url,
        path: uploadResult.path,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un archivo de Supabase Storage
 * DELETE /upload/:path
 */
const deleteFile = async (req, res, next) => {
  try {
    const { path: filePath } = req.params;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Ruta del archivo no proporcionada'
      });
    }

    const deleted = await storageService.deleteFile(filePath);

    if (deleted) {
      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el archivo'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  deleteFile
};









