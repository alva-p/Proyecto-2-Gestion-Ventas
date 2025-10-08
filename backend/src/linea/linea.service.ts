import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Linea } from './entities/linea.entity';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

@Injectable()
export class LineaService {
  constructor(
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
  ) {}

  findAll() {
    return this.lineaRepository.find({ relations: ['marca', 'productos'] });
  }

  findOne(id: number) {
    return this.lineaRepository.findOne({ where: { id }, relations: ['marca', `productos`] });
  }

  create(createLineaDto: CreateLineaDto) {
    const nuevaLinea = this.lineaRepository.create(createLineaDto);
    return this.lineaRepository.save(nuevaLinea);
  }

  async update(id: number, updateLineaDto: UpdateLineaDto) {
    const linea = await this.lineaRepository.findOne({ where: { id } });
    if (!linea) {
      throw new NotFoundException(`La línea con ID ${id} no existe`);
    }

    Object.assign(linea, updateLineaDto);
    return this.lineaRepository.save(linea);
  }

  remove(id: number) {
    return this.lineaRepository.delete(id);
  }
}
