import { PartialType } from '@nestjs/mapped-types';
import { CreateLineaDto } from './create-linea.dto';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateLineaDto extends PartialType(CreateLineaDto) {
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsNumber()
  marcaId?: number;
}

