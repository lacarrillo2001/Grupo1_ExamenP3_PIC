// src/models/Linea.js
import pool from '../config/db.js';

class Linea {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM lineas_investigacion ORDER BY id');
    return rows;
  }
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM lineas_investigacion WHERE id=$1', [id]);
    return rows[0] || null;
  }
  static async create({ nombre, area }) {
    const q = `INSERT INTO lineas_investigacion (nombre, area) VALUES ($1,$2) RETURNING *`;
    const { rows } = await pool.query(q, [nombre, area]);
    return rows[0];
  }
  static async update(id, { nombre, area }) {
    const q = `UPDATE lineas_investigacion SET nombre=$2, area=$3 WHERE id=$1 RETURNING *`;
    const { rows } = await pool.query(q, [id, nombre, area]);
    return rows[0] || null;
  }
  static async remove(id) {
    const { rows } = await pool.query('DELETE FROM lineas_investigacion WHERE id=$1 RETURNING *', [id]);
    return rows[0] || null;
  }
}

export default Linea;
