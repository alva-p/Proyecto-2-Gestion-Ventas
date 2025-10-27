import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RoleName } from '../entities/rol.enum';

export class CreateRolDto {
  @IsEnum(RoleName, { message: 'El nombre del rol no es válido' })
  nombre: RoleName;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
