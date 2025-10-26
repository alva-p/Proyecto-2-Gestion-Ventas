export type Invoice = {
  id: number;
  numero_factura: string;
  cliente_nombre: string;
  cliente_documento: string;
  tipo: 'A' | 'B' | 'C';
  fecha_emision: string;
  venta: {
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
};

export type InvoiceListItem = {
  id: number;
  numero_factura: string;
  cliente_nombre: string;
  cliente_documento: string;
  tipo: 'A' | 'B' | 'C';
  fecha_emision: string;
  importe_total: number;
};
