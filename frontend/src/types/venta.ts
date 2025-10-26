export type CreateVentaDto = {
  usuario_id: number;
  productos: number[];
  importe_total: number;
  notas?: string;
  cliente_nombre: string;
  cliente_documento: string;
  tipo: 'A' | 'B' | 'C';
};

export type Venta = {
  id: number;
  fecha: string;
  importe_total: number;
  notas?: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
  };
  productos: Array<{
    id: number;
    nombre: string;
    precio: number;
    codigo?: string;
    descripcion?: string;
  }>;
};
