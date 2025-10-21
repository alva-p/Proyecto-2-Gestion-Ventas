// frontend/src/services/marcaService.ts
import API from "../index";
import type { Marca } from "../types/Marca";

export const getMarcas = async (): Promise<Marca[]> => {
  const { data } = await API.get<Marca[]>("/marca");
  return data;
};

export const createMarca = async (marca: Omit<Marca, "id">): Promise<Marca> => {
  const { data } = await API.post<Marca>("/marca", marca);
  return data;
};

export const updateMarca = async (id: number, marca: Partial<Marca>): Promise<Marca> => {
  const { data } = await API.patch<Marca>(`/marca/${id}`, marca);
  return data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await API.delete(`/marca/${id}`);
};
