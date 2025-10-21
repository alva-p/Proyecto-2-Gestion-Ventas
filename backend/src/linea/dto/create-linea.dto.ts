import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateLineaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  marcaId: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}