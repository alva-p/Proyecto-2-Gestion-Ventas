import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Length } from 'class-validator';

export class CreateFacturaDto {
  @IsNotEmpty({ message: 'El ID de la venta no puede estar vacío' })
  @IsNumber({}, { message: 'El ID de la venta debe ser un número' })
  venta_id: number;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El número de factura debe tener entre 1 y 50 caracteres' })
  numero_factura?: string;

  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  @IsString()
  @Length(1, 255)
  cliente_nombre: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  cliente_documento?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['A', 'B', 'C'], { message: 'El tipo de factura debe ser A, B o C' })
  tipo: string;
}