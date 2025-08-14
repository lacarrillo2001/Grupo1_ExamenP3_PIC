import Disponibilidad from '../models/Disponibilidad.js';

export async function getAll(req, res) {
  try {
    res.json(await Disponibilidad.getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getById(req, res) {
  try {
    const row = await Disponibilidad.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function create(req, res) {
  try {
    const { franja_horaria, modalidad } = req.body;
    if (!franja_horaria || !modalidad)
      return res.status(400).json({ message: 'franja_horaria y modalidad son requeridos' });

    const row = await Disponibilidad.create({ franja_horaria, modalidad });
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function update(req, res) {
  try {
    const { franja_horaria, modalidad } = req.body;
    const row = await Disponibilidad.update(req.params.id, { franja_horaria, modalidad });
    if (!row) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const row = await Disponibilidad.remove(req.params.id);
    if (!row) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json({ message: 'Disponibilidad eliminada', row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
