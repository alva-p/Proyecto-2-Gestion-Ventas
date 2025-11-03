// src/linea/linea.repository.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Linea } from './entities/linea.entity';
import { Marca } from '../marcas/entities/marca.entity';
import { Producto } from '../producto/entities/producto.entity';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

@Injectable()
export class LineaRepository extends Repository<Linea> {
  constructor(private readonly dataSource: DataSource) {
    super(Linea, dataSource.createEntityManager());
  }

  // Helpers internos
  private marcaRepo() {
    return this.manager.getRepository(Marca);
  }

  private productoRepo() {
    return this.manager.getRepository(Producto);
  }

  // Consultas
  async findAllWithMarca(): Promise<Linea[]> {
    return this.find({ relations: ['marca', 'productos'] });
  }

  async findOneWithMarca(id: number): Promise<Linea | null> {
    return this.findOne({
      where: { id },
      relations: ['marca', 'productos'],
    });
  }

  async getCantidadProductos(lineaId: number): Promise<number> {
    return this.productoRepo().count({ where: { linea: { id: lineaId } } });
  }

  // Crear
  async createLinea(dto: CreateLineaDto): Promise<Linea> {
    const { marcaId, ...rest } = dto;

    if (!marcaId) {
      throw new BadRequestException('La marca es obligatoria (marcaId).');
    }

    const marca = await this.marcaRepo().findOne({ where: { id: marcaId } });
    if (!marca) {
      throw new NotFoundException(`La marca con ID ${marcaId} no existe`);
    }

    const entity = this.create({ ...rest, marca });
    return this.save(entity);
  }

  // Actualizar (con regla opcional de integridad)
  async updateLinea(id: number, dto: UpdateLineaDto): Promise<UpdateResult> {
    if (dto.marcaId !== undefined) {
      // (Opcional) impedir cambiar marca si hay productos asociados
      const productos = await this.getCantidadProductos(id);
      if (productos > 0) {
        throw new BadRequestException(
          'No se puede cambiar la marca de una línea con productos asociados',
        );
      }

      const marca = await this.marcaRepo().findOne({ where: { id: dto.marcaId } });
      if (!marca) {
        throw new NotFoundException(`La marca con ID ${dto.marcaId} no existe`);
      }

      // Reemplazar marcaId por la relación marca
      const { marcaId, ...rest } = dto;
      return this.update(id, { ...rest, marca });
    }

    return this.update(id, dto);
  }

  // Eliminar (con validación de dependencias)
  async removeLinea(id: number): Promise<DeleteResult> {
    const productos = await this.getCantidadProductos(id);
    if (productos > 0) {
      throw new BadRequestException('No se puede eliminar una línea con productos asociados');
    }
    return this.delete(id);
  }
}
