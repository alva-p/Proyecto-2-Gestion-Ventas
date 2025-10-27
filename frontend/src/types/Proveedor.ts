// src/types/Proveedor.ts
import type { Producto } from "./Producto";

export interface Proveedor {
  id: number;
  nombre: string;
  contactoNombre: string;
  contactoEmail: string;
  direccion: string;
  telefono: string;
  estado: boolean;            
  fechaRegistro?: Date;     
  cantidadProductos: number;
  productos?: Producto[];     
}
