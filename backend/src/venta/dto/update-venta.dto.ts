import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto';
import { IsArray, IsInt, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductoVentaDto } from './producto-venta.dto';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {
  @IsOptional()
  @IsInt()
  usuario_id?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVentaDto)
  productos?: ProductoVentaDto[];
  
  @IsOptional()
  @IsNumber()
  importe_total?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
