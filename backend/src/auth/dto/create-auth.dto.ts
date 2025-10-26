import { IsString, IsEmail, IsOptional, MinLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthDto {
	@IsString()
	@MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
	nombre: string;

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
