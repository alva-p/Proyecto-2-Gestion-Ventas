import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto';
import { IsArray, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {
  @IsOptional()
  @IsInt()
  usuario_id?: number;

  @IsOptional()
  @IsArray()
  productos?: number[];
  
  @IsOptional()
  @IsNumber()
  importe_total?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
