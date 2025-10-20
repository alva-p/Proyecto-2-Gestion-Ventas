import { IsString, IsOptional } from 'class-validator';

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

    @IsString()
    estado: boolean;

    @IsOptional()
    fechaRegistro: Date;

}
