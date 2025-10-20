// frontend/src/services/marcaService.ts
import API from "../index";
import type { Marca } from "../types/Marca";

export const getMarcas = async (): Promise<Marca[]> => {
  const response = await API.get<Marca[]>("/marca");
  return response.data;
};
