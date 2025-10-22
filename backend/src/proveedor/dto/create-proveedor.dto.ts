import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProveedorDto {
    @IsString()
    nombre: string;

    @IsString()
    contactoNombre: string;

    @IsString()
    contactoEmail: string;

    @IsString()
    telefono: string;

    @IsString()
    direccion: string;

    @IsBoolean()
    estado: boolean;

    @IsOptional()
    fechaRegistro: Date;
}
