import { IsArray, IsInt, IsOptional, IsString, IsNumber, IsNotEmpty, Length, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductoVentaDto } from './producto-venta.dto';

export class CreateVentaDto {
  @IsInt()
  usuario_id: number; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVentaDto)
  productos: ProductoVentaDto[];

  @IsOptional()
  @IsString()
  notas?: string;

  // Datos adicionales para factura
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  @IsString()
  @Length(1, 255)
  cliente_nombre: string;

  @IsString()
  @Length(1, 50)
  cliente_documento: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['A', 'B', 'C'], { message: 'El tipo de factura debe ser A, B o C' })
  tipo: string;
}
