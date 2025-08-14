import type { InvestigadorLineaDisponibilidad } from "../types/investigadorLineaDisponibilidad";

const API_URL = "http://localhost:3000/api/ild";

export const getAsignaciones = async (): Promise<InvestigadorLineaDisponibilidad[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener asignaciones");
  return await res.json();
};

export const createAsignacion = async (data: InvestigadorLineaDisponibilidad): Promise<number> => {
  const res = await fetch(`${API_URL}/asignar_y_sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al asignar y sincronizar");
  return await res.json(); // Devuelve el grupo_id o null
};

export const deleteAsignacion = async (investigador_id: number, linea_id: number, disponibilidad_id: number): Promise<void> => {
  const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ investigador_id, linea_id, disponibilidad_id })
  });
  if (!res.ok) throw new Error("Error al eliminar la asignación");
};
