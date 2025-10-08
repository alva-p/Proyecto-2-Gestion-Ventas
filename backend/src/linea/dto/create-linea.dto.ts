import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateLineaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  marcaId: number;

  @IsOptional()
  @IsString()
  estado?: string; 
}
