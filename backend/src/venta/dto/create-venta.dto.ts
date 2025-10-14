import { IsArray, IsInt, IsOptional, IsString, IsNumber} from 'class-validator';

export class CreateVentaDto {
  @IsInt()
  usuario_id: number; 

  @IsArray()
  productos: number[]; 

  @IsNumber()
  importe_total: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
