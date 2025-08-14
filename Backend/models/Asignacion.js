import { query } from '../config/db.js';

class Asignacion {
  static async assignAndSync({ investigador_id, linea_id, disponibilidad_id, umbral = 3 }) {
    const { rows } = await query(
      'SELECT ventas.fn_asignar_y_sync($1,$2,$3,$4) AS grupo_id',
      [investigador_id, linea_id, disponibilidad_id, umbral]
    );
    return rows[0]; // { grupo_id: number | null }
  }

  static async unassignAndSync({ investigador_id, linea_id, disponibilidad_id, umbral = 3 }) {
    await query(
      `DELETE FROM public.investigador_linea_disponibilidad
        WHERE investigador_id=$1 AND linea_id=$2 AND disponibilidad_id=$3`,
      [investigador_id, linea_id, disponibilidad_id]
    );
    const { rows } = await query(
      'SELECT public.fn_sync_grupo($1,$2,$3) AS grupo_id',
      [linea_id, disponibilidad_id, umbral]
    );
    return rows[0];
  }

  static async resyncAll(umbral = 3) {
    const { rows } = await query('SELECT public.fn_sync_todos($1) AS total', [umbral]);
    return rows[0]; // { total }
  }
}
export default Asignacion;
