// src/models/Disponibilidad.js
import pool from '../config/db.js';

class Disponibilidad {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM disponibilidades ORDER BY id');
    return rows;
  }
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM disponibilidades WHERE id=$1', [id]);
    return rows[0] || null;
  }
  static async create({ franja_horaria, modalidad }) {
    const q = `INSERT INTO disponibilidades (franja_horaria, modalidad) VALUES ($1,$2) RETURNING *`;
    const { rows } = await pool.query(q, [franja_horaria, modalidad]);
    return rows[0];
  }
  static async update(id, { franja_horaria, modalidad }) {
    const q = `UPDATE disponibilidades SET franja_horaria=$2, modalidad=$3 WHERE id=$1 RETURNING *`;
    const { rows } = await pool.query(q, [id, franja_horaria, modalidad]);
    return rows[0] || null;
  }
  static async remove(id) {
    const { rows } = await pool.query('DELETE FROM disponibilidades WHERE id=$1 RETURNING *', [id]);
    return rows[0] || null;
  }
}

export default Disponibilidad;
