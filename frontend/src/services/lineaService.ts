// frontend/src/services/lineaService.ts
import API from "../index";
import type { Linea } from "../types/Linea";

export const getLineas = async (): Promise<Linea[]> => {
  const { data } = await API.get<Linea[]>("/lineas");
  return data;
};

export const createLinea = async (linea: {
  nombre: string;
  descripcion?: string;
  marcaId: number;
  estado?: boolean;
  }): Promise<Linea> => {
  const {data} = await API.post<Linea>("/lineas", linea);
  return data;
};

export const updateLinea = async (
  id: number, 
  linea: {
    nombre?: string;
    descripcion?: string;
    marcaId: number;
    estado?: boolean;
  }
): Promise<Linea> => {
  const { data } = await API.patch<Linea>(`/lineas/${id}`, linea);
  return data;
};

export const deleteLinea = async (id: number): Promise<void> => {
  await API.delete(`/lineas/${id}`);
};