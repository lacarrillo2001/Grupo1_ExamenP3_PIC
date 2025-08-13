export interface Grupo {
  id: number;
  linea_id: number;
  disponibilidad_id: number;
  miembros: number;
  creado_en: string; // formato ISO desde PostgreSQL
  actualizado_en: string; // formato ISO
}