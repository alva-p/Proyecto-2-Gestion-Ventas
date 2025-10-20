// src/services/productService.ts
import API from "../index";
import type { Producto } from "../types/Producto";


export const getProductos = async (): Promise<Producto[]> => {
  const res = await API.get<Producto[]>('/producto');
  return res.data;
};

export const createProducto = async (
  data: Omit<Producto, "id" | "linea" | "proveedores"> & {
    lineaId: number;
    proveedorId?: number[];
  }
): Promise<Producto> => {
  const res = await API.post<Producto>('/producto', data);
  return res.data;
};

export const updateProducto = async (
  id: number,
  data: Partial<Omit<Producto, "id" | "linea" | "proveedores">> & {
    lineaId?: number;
    proveedorId?: number[];
  }
): Promise<Producto> => {
  const res = await API.patch<Producto>(`/producto/${id}`, data);
  return res.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await API.delete(`/producto/${id}`);
};
