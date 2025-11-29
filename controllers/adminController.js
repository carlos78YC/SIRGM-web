const User = require('../models/User');
const Reporte = require('../models/Reporte');

// Listar todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Crear usuario
const createUser = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, rol } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    const newUser = await User.create({
      email,
      password,
      nombre,
      apellido,
      rol: rol || 'alumno'
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // No permitir actualizar la contraseña desde aquí (se debe hacer con endpoint específico)
    delete updates.password;
    delete updates.password_hash;

    const updatedUser = await User.update(id, updates);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el propio usuario admin
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    const deletedUser = await User.delete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Función auxiliar para escapar valores CSV
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Exportar usuarios a CSV
const exportUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    
    // Crear CSV
    const csvHeader = 'ID,Email,Nombre,Apellido,Rol,Activo,Fecha Creación\n';
    const csvRows = users.map(user => {
      return [
        user.id,
        escapeCsvValue(user.email),
        escapeCsvValue(user.nombre),
        escapeCsvValue(user.apellido),
        escapeCsvValue(user.rol),
        user.activo ? 'Sí' : 'No',
        escapeCsvValue(user.created_at)
      ].join(',');
    }).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
    res.send('\ufeff' + csv); // BOM para UTF-8
  } catch (error) {
    next(error);
  }
};

// Exportar reportes a CSV
const exportReportes = async (req, res, next) => {
  try {
    const reportes = await Reporte.findAll();
    
    // Crear CSV
    const csvHeader = 'ID,Usuario,Email Usuario,Título,Descripción,Ubicación,Estado,Prioridad,Fecha Creación,Fecha Actualización\n';
    const csvRows = reportes.map(reporte => {
      const usuario = `${reporte.usuario_nombre || ''} ${reporte.usuario_apellido || ''}`.trim();
      return [
        reporte.id,
        escapeCsvValue(usuario),
        escapeCsvValue(reporte.usuario_email || ''),
        escapeCsvValue(reporte.titulo || ''),
        escapeCsvValue(reporte.descripcion || ''),
        escapeCsvValue(reporte.ubicacion || ''),
        escapeCsvValue(reporte.estado || 'pendiente'),
        escapeCsvValue(reporte.prioridad || 'media'),
        escapeCsvValue(reporte.created_at || ''),
        escapeCsvValue(reporte.updated_at || '')
      ].join(',');
    }).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=reportes.csv');
    res.send('\ufeff' + csv); // BOM para UTF-8
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  exportUsers,
  exportReportes
};

