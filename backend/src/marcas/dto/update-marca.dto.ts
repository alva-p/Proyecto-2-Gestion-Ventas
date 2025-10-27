import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {
    
@IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
