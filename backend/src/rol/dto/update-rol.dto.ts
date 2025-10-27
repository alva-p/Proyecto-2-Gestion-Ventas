import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { RoleName } from '../entities/rol.enum';

export class UpdateRolDto extends PartialType(CreateRolDto) {
  @IsOptional()
  @IsEnum(RoleName)
  nombre?: RoleName;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
