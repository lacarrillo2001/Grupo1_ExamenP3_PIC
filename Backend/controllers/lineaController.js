import Linea from '../models/Linea.js';

export async function getAll(req, res) {
  try {
    res.json(await Linea.getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getById(req, res) {
  try {
    const row = await Linea.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function create(req, res) {
  try {
    const { nombre, area } = req.body;
    if (!nombre || !area) return res.status(400).json({ message: 'nombre y area son requeridos' });
    const row = await Linea.create({ nombre, area });
    res.status(201).json(row);
  } catch (e) {
    // Posible UNIQUE violation en nombre
    res.status(500).json({ error: e.message });
  }
}

export async function update(req, res) {
  try {
    const { nombre, area } = req.body;
    const row = await Linea.update(req.params.id, { nombre, area });
    if (!row) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const row = await Linea.remove(req.params.id);
    if (!row) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json({ message: 'Línea eliminada', row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
