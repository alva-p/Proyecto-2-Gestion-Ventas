// src/linea/linea.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { LineaRepository } from './linea.repository';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

@Injectable()
export class LineaService {
  constructor(private readonly lineaRepo: LineaRepository) {}

  findAll() {
    return this.lineaRepo.findAllWithMarca();
  }

  async findOne(id: number) {
    const linea = await this.lineaRepo.findOneWithMarca(id);
    return linea ?? null;
  }

  create(dto: CreateLineaDto) {
    return this.lineaRepo.createLinea(dto);
  }

  update(id: number, dto: UpdateLineaDto) {
    return this.lineaRepo.updateLinea(id, dto);
  }

  remove(id: number) {
    return this.lineaRepo.removeLinea(id);
  }
}
