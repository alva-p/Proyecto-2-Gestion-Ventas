import API from "../index";
import type { CreateVentaDto, Venta } from "../types/venta";

export const createVenta = async (data: CreateVentaDto): Promise<Venta> => {
  const res = await API.post<Venta>('/ventas', data);
  return res.data;
};

export const getVentas = async (): Promise<Venta[]> => {
  const res = await API.get<Venta[]>('/ventas');
  return res.data;
};

export const getVentaById = async (id: number): Promise<Venta> => {
  const res = await API.get<Venta>(`/ventas/${id}`);
  return res.data;
};

export const deleteVenta = async (id: number): Promise<void> => {
  await API.delete(`/ventas/${id}`);
};
