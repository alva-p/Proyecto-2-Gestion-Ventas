// src/services/proveedorService.ts
import API from "../index";
import type { Proveedor } from "../types/Proveedor";

export const getProveedores = async (): Promise<Proveedor[]> => {
  const { data } = await API.get<Proveedor[]>("/proveedor");
  return data;
};

export const createProveedor = async (proveedor: {
  nombre: string;
  contactoNombre?: string;
  contactoEmail?: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  fechaRegistro?: Date;
  }): Promise<Proveedor> => {
    const { data } = await API.post<Proveedor>("/proveedor", proveedor);
  return data;
};

export const updateProveedor = async (
  id:number,
  proveedor: {
    nombre: string;
    contactoNombre?: string;
    contactoEmail?: string;
    telefono: string;
    direccion: string;
    estado: boolean;
    fechaRegistro?: Date;
  }): Promise<Proveedor> => {
    const { data } = await API.patch<Proveedor>(`/proveedor/${id}`, proveedor);
  return data;
};

export const deleteProveedor = async (id: number): Promise<void> => {
  await API.delete(`/proveedor/${id}`);
};