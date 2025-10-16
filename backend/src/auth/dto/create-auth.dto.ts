import { IsString, IsEmail, IsOptional, MinLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthDto {
	@IsOptional()
	@IsString()
	nombre?: string;

	@IsOptional()
	@IsString()
	telefono?: string;

	@IsEmail()
	correo: string;

	@IsString()
	@MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
	contrasena: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	rol_id?: number;
}
