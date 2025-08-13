import Asignacion from '../models/Asignacion.js';

/**
 * Crea asignación (investigador, línea, disponibilidad) y sincroniza grupo.
 * Body: { investigador_id, linea_id, disponibilidad_id, umbral? }
 */
export async function assign(req, res) {
  try {
    const { investigador_id, linea_id, disponibilidad_id, umbral = 3 } = req.body;
    if (!investigador_id || !linea_id || !disponibilidad_id)
      return res.status(400).json({ message: 'investigador_id, linea_id y disponibilidad_id son requeridos' });

    const out = await Asignacion.assignAndSync({ investigador_id, linea_id, disponibilidad_id, umbral });
    res.status(201).json({ message: 'Asignado y sincronizado', ...out });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/**
 * Elimina asignación y sincroniza el grupo de esa combinación.
 * Body: { investigador_id, linea_id, disponibilidad_id, umbral? }
 */
export async function unassign(req, res) {
  try {
    const { investigador_id, linea_id, disponibilidad_id, umbral = 3 } = req.body;
    if (!investigador_id || !linea_id || !disponibilidad_id)
      return res.status(400).json({ message: 'investigador_id, linea_id y disponibilidad_id son requeridos' });

    const out = await Asignacion.unassignAndSync({ investigador_id, linea_id, disponibilidad_id, umbral });
    res.json({ message: 'Desasignado y sincronizado', ...out });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** Recalcula todos los grupos desde la tabla intermedia. Query: ?umbral=3 */
export async function resyncAll(req, res) {
  try {
    const umbral = Number(req.query.umbral ?? 3);
    const out = await Asignacion.resyncAll(umbral);
    res.json({ message: 'Recalculado', ...out });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
