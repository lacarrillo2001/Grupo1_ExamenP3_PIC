import type { Grupo } from "../types/grupo";

const API_URL = "http://localhost:3000/api/grupos";

export const getGrupos = async (): Promise<Grupo[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener grupos");
  return await res.json();
};

export const getGrupoById = async (id: number): Promise<Grupo> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener el grupo");
  return await res.json();
};

export const createGrupo = async (data: Omit<Grupo, "id">): Promise<Grupo> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear el grupo");
  return await res.json();
};

export const updateGrupo = async (id: number, data: Omit<Grupo, "id">): Promise<Grupo> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar el grupo");
  return await res.json();
};

export const deleteGrupo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el grupo");
};

// Especial: listar grupos con info completa (fn_listar_grupos)
export const listarGruposEnriquecidos = async (): Promise<any[]> => {
  const res = await fetch(`${API_URL}/enriquecidos`);
  if (!res.ok) throw new Error("Error al listar grupos enriquecidos");
  return await res.json();
};

// Especial: obtener miembros de un grupo (fn_grupo_miembros)
export const getMiembrosGrupo = async (grupoId: number): Promise<any[]> => {
  const res = await fetch(`${API_URL}/${grupoId}/miembros`);
  if (!res.ok) throw new Error("Error al obtener miembros del grupo");
  return await res.json();
};

// Especial: sincronizar todos los grupos (fn_sync_todos)
export const syncTodosGrupos = async (): Promise<number> => {
  const res = await fetch(`${API_URL}/sync_todos`, { method: "POST" });
  if (!res.ok) throw new Error("Error al sincronizar grupos");
  return await res.json();
};
