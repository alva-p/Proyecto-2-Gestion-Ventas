// src/marcas/marca.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Marca)
export class MarcaRepository extends Repository<Marca> {
  // 🔹 Obtener todas las marcas con sus líneas
  async findAllWithLineas(): Promise<Marca[]> {
    return this.find({
      relations: ['lineas'],
      order: { id: 'ASC' },
    });
  }

  // 🔹 Buscar marca por nombre
  async findByName(nombre: string): Promise<Marca | null> {
    return this.findOne({ where: { nombre }, relations: ['lineas'] });
  }

  // 🔹 Buscar marca por ID
  async findById(id: number): Promise<Marca | null> {
    return this.findOne({ where: { id }, relations: ['lineas'] });
  }
}
