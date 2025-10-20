// src/types/Producto.ts
import type { Linea } from "./Linea";
import type { Proveedor } from "./Proveedor";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  linea: Linea;
  lineaId?: number;
  proveedores: Proveedor[];
}
