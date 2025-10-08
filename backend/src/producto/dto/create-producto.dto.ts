import { IsString, IsNumber, IsOptional, IsEnum, IsPositive, Min, IsBoolean} from 'class-validator';  

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  lineaId: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  proveedorId?: number[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
