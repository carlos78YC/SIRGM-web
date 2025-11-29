const pool = require('../config/database');

class Reporte {
  static async create(reporteData) {
    const { usuario_id, titulo, descripcion, ubicacion, prioridad, foto_url, foto_path } = reporteData;
    
    const query = `
      INSERT INTO reportes (usuario_id, titulo, descripcion, ubicacion, prioridad, foto_url, foto_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      usuario_id,
      titulo,
      descripcion,
      ubicacion || null,
      prioridad || 'media',
      foto_url || null,
      foto_path || null
    ]);
    
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT 
        r.*,
        u.nombre as usuario_nombre,
        u.apellido as usuario_apellido,
        u.email as usuario_email
      FROM reportes r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;

    if (filters.usuario_id) {
      query += ` AND r.usuario_id = $${paramCount++}`;
      values.push(filters.usuario_id);
    }

    if (filters.estado) {
      query += ` AND r.estado = $${paramCount++}`;
      values.push(filters.estado);
    }

    if (filters.prioridad) {
      query += ` AND r.prioridad = $${paramCount++}`;
      values.push(filters.prioridad);
    }

    query += ` ORDER BY r.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        r.*,
        u.nombre as usuario_nombre,
        u.apellido as usuario_apellido,
        u.email as usuario_email
      FROM reportes r
      INNER JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateEstado(id, estado, observaciones = null) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    updates.push(`estado = $${paramCount++}`);
    values.push(estado);

    if (observaciones) {
      updates.push(`observaciones = $${paramCount++}`);
      values.push(observaciones);
    }

    if (estado === 'cerrado') {
      updates.push(`cerrado_at = CURRENT_TIMESTAMP`);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE reportes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.titulo) {
      fields.push(`titulo = $${paramCount++}`);
      values.push(updates.titulo);
    }
    if (updates.descripcion) {
      fields.push(`descripcion = $${paramCount++}`);
      values.push(updates.descripcion);
    }
    if (updates.ubicacion) {
      fields.push(`ubicacion = $${paramCount++}`);
      values.push(updates.ubicacion);
    }
    if (updates.prioridad) {
      fields.push(`prioridad = $${paramCount++}`);
      values.push(updates.prioridad);
    }
    if (updates.foto_url) {
      fields.push(`foto_url = $${paramCount++}`);
      values.push(updates.foto_url);
    }
    if (updates.foto_path) {
      fields.push(`foto_path = $${paramCount++}`);
      values.push(updates.foto_path);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE reportes 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM reportes WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Reporte;















