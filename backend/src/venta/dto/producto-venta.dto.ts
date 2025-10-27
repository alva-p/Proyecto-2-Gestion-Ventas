import { IsInt, IsNumber } from 'class-validator';

export class ProductoVentaDto {
  @IsInt()
  productoId: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
