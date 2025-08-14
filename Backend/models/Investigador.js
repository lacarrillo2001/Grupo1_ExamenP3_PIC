import { query } from '../config/db.js';

class Investigador {
  static async getAll() {
    const { rows } = await query('SELECT * FROM investigadores ORDER BY id');
    return rows;
  }
  static async getById(id) {
    const { rows } = await query('SELECT * FROM investigadores WHERE id=$1', [id]);
    return rows[0] || null;
  }
  static async create({ nombre, apellido, departamento, experiencia }) {
    const sql = `
      INSERT INTO public.investigadores (nombre, apellido, departamento, experiencia)
      VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await query(sql, [nombre, apellido, departamento, experiencia]);
    return rows[0];
  }
  static async update(id, { nombre, apellido, departamento, experiencia }) {
    const sql = `
      UPDATE public.investigadores
         SET nombre=$2, apellido=$3, departamento=$4, experiencia=$5
       WHERE id=$1 RETURNING *`;
    const { rows } = await query(sql, [id, nombre, apellido, departamento, experiencia]);
    return rows[0] || null;
  }
  static async remove(id) {
    const { rows } = await query('DELETE FROM investigadores WHERE id=$1 RETURNING *', [id]);
    return rows[0] || null;
  }
}
export default Investigador;
