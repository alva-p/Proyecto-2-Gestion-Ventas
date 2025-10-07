
import { CreateProductoDto } from './create-producto.dto';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
