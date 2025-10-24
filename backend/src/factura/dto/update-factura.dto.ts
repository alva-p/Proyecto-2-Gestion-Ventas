import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class UpdateFacturaDto {

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El número de factura debe tener entre 1 y 50 caracteres' })
  numero_factura?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  cliente_nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  cliente_documento?: string;

  @IsOptional()
  @IsString()
  @IsIn(['A', 'B', 'C'], { message: 'El tipo de factura debe ser A, B o C' })
  tipo?: string;
}