// src/services/proveedorService.ts
import API from "../index";
import type { Proveedor } from "../types/Proveedor";

export const getProveedores = async (): Promise<Proveedor[]> => {
  const res = await API.get<Proveedor[]>("/proveedor");
  return res.data;
};
