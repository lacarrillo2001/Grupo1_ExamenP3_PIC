// src/models/Grupo.js
import pool from '../config/db.js';

class Grupo {
  static async list() {
    const { rows } = await pool.query(`SELECT * FROM public.fn_listar_grupos()`);
    return rows;
  }
  static async miembros(grupo_id) {
    const { rows } = await pool.query(`SELECT * FROM public.fn_grupo_miembros($1)`, [grupo_id]);
    return rows;
  }
  static async resyncAll(umbral = 3) {
    const { rows } = await pool.query(`SELECT public.fn_sync_todos($1) AS total`, [umbral]);
    return rows[0];
  }
}

export default Grupo;
