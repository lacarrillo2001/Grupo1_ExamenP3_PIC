import type { LineaInvestigacion } from "../types/lineaInvestigacio";

const API_URL = "http://localhost:3000/api/lineas_investigacion";

export const getLineasInvestigacion = async (): Promise<LineaInvestigacion[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener líneas de investigación");
  return await res.json();
};

export const getLineaInvestigacionById = async (id: number): Promise<LineaInvestigacion> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener la línea de investigación");
  return await res.json();
};

export const createLineaInvestigacion = async (data: Omit<LineaInvestigacion, "id">): Promise<LineaInvestigacion> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear la línea de investigación");
  return await res.json();
};

export const updateLineaInvestigacion = async (id: number, data: Omit<LineaInvestigacion, "id">): Promise<LineaInvestigacion> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar la línea de investigación");
  return await res.json();
};

export const deleteLineaInvestigacion = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la línea de investigación");
};
