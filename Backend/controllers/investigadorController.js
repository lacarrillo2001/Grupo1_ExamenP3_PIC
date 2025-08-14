import  Investigador from '../models/Investigador.js';

export async function getAll(req, res) {
  try {
    const rows = await Investigador.getAll();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getById(req, res) {
  try {
    const row = await Investigador.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function create(req, res) {
  try {
    const { nombre, apellido, departamento, experiencia } = req.body;
    if (!nombre || !apellido || !departamento || experiencia == null)
      return res.status(400).json({ message: 'nombre, apellido, departamento, experiencia son requeridos' });

    const row = await Investigador.create({ nombre, apellido, departamento, experiencia });
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function update(req, res) {
  try {
    const { nombre, apellido, departamento, experiencia } = req.body;
    const row = await Investigador.update(req.params.id, { nombre, apellido, departamento, experiencia });
    if (!row) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function remove(req, res) {
  try {
    const row = await Investigador.remove(req.params.id);
    if (!row) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json({ message: 'Investigador eliminado', row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
