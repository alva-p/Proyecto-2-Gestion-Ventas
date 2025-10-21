// frontend/src/services/marcaService.ts
import API from "../index";
import type { Marca } from "../types/Marca";

export const getMarcas = async (): Promise<Marca[]> => {
  const response = await API.get<Marca[]>("/marca");
  return response.data;
};

export interface CreateMarcaDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateMarcaDTO extends Partial<CreateMarcaDTO> {}

export const createMarca = async (data: CreateMarcaDTO): Promise<Marca> => {
  const response = await API.post<Marca>("/marca", data);
  return response.data;
};

export const updateMarca = async (id: number, data: UpdateMarcaDTO): Promise<Marca> => {
  const response = await API.patch<Marca>(`/marca/${id}`, data);
  return response.data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await API.delete(`/marca/${id}`);
};
