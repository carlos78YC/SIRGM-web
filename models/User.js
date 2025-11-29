const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, nombre, apellido, rol } = userData;
    
    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO usuarios (email, password_hash, nombre, apellido, rol)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, nombre, apellido, rol, created_at
    `;
    
    const result = await pool.query(query, [email, passwordHash, nombre, apellido, rol]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, nombre, apellido, rol, activo, created_at FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.nombre) {
      fields.push(`nombre = $${paramCount++}`);
      values.push(updates.nombre);
    }
    if (updates.apellido) {
      fields.push(`apellido = $${paramCount++}`);
      values.push(updates.apellido);
    }
    if (updates.rol) {
      fields.push(`rol = $${paramCount++}`);
      values.push(updates.rol);
    }
    if (updates.activo !== undefined) {
      fields.push(`activo = $${paramCount++}`);
      values.push(updates.activo);
    }
    if (updates.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE usuarios 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, nombre, apellido, rol, activo, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, email, nombre, apellido, rol, activo, created_at, updated_at
      FROM usuarios
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;












