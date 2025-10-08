import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateLineaDto {
    nombre: string;
    descripcion: string;
    marcaId: number;
}
