import type { Disponibilidad } from "../types/disponibilidad";

const API_URL = "http://localhost:3000/api/disponibilidades";

export const getDisponibilidades = async (): Promise<Disponibilidad[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener disponibilidades");
  return await res.json();
};

export const getDisponibilidadById = async (id: number): Promise<Disponibilidad> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener la disponibilidad");
  return await res.json();
};

export const createDisponibilidad = async (data: Omit<Disponibilidad, "id">): Promise<Disponibilidad> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear la disponibilidad");
  return await res.json();
};

export const updateDisponibilidad = async (id: number, data: Omit<Disponibilidad, "id">): Promise<Disponibilidad> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar la disponibilidad");
  return await res.json();
};

export const deleteDisponibilidad = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la disponibilidad");
};
