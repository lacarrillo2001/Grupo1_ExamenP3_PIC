import type { Investigador } from "../types/investigador";

const API_URL = "http://localhost:3000/api/investigadores";

export const getInvestigadores = async (): Promise<Investigador[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener investigadores");
  return await res.json();
};

export const getInvestigadorById = async (id: number): Promise<Investigador> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener el investigador");
  return await res.json();
};

export const createInvestigador = async (data: Omit<Investigador, "id">): Promise<Investigador> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear el investigador");
  return await res.json();
};

export const updateInvestigador = async (id: number, data: Omit<Investigador, "id">): Promise<Investigador> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar el investigador");
  return await res.json();
};

export const deleteInvestigador = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el investigador");
};
