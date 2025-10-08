import { PartialType } from '@nestjs/mapped-types';
import { CreateLineaDto } from './create-linea.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateLineaDto extends PartialType(CreateLineaDto) {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  marcaId?: number;
}

