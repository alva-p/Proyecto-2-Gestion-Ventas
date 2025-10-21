// frontend/src/services/lineaService.ts
import API from "../index";
import type { Linea } from "../types/Linea";

export const getLineas = async (): Promise<Linea[]> => {
  const response = await API.get<Linea[]>("/lineas");
  return response.data;
};

export interface CreateLineaDTO {
  nombre: string;
  descripcion?: string;
  estado?: boolean;
  marcaId: number;
}

export interface UpdateLineaDTO extends Partial<CreateLineaDTO> {}

export const createLinea = async (data: CreateLineaDTO): Promise<Linea> => {
  const response = await API.post<Linea>("/lineas", data);
  return response.data;
};

export const updateLinea = async (id: number, data: UpdateLineaDTO): Promise<Linea> => {
  const response = await API.patch<Linea>(`/lineas/${id}`, data);
  return response.data;
};

export const deleteLinea = async (id: number): Promise<void> => {
  await API.delete(`/lineas/${id}`);
};
