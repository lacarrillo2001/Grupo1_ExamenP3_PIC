import Grupo from '../models/Grupo.js';

/** GET /grupos */
export async function list(req, res) {
  try {
    const rows = await Grupo.list();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** GET /grupos/:id/miembros */
export async function miembros(req, res) {
  try {
    const rows = await Grupo.miembros(req.params.id);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** POST /grupos/recalcular?umbral=3 (opcional: recalcular global también desde aquí) */
export async function resyncAll(req, res) {
  try {
    const umbral = Number(req.query.umbral ?? 3);
    const out = await Grupo.resyncAll(umbral);
    res.json({ message: 'Recalculado', ...out });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
