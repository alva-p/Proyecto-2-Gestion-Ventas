// src/types/Linea.ts
import type { Marca } from "./Marca";

export interface Linea {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  marcaId: number;
  marca?: Marca;
  productosCount?: number;
}
