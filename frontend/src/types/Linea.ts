// src/types/Linea.ts
import type { Marca } from "./Marca";
import type { Producto } from "./Producto";

export interface Linea {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  marcaId: number;
  marca?: Marca;
  cantidadProductos: number;
  fechaCreacion?: Date;
  productos?: Producto[];
}
