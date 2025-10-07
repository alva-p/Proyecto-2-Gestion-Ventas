import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Linea } from './entities/linea.entity';
import { CreateLineaDto } from './dto/create-linea.dto';

@Injectable()
export class LineaService {
  constructor(
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
  ) {}

  findAll() {
    return this.lineaRepository.find({ relations: ['marca'] });
  }

  findOne(id: number) {
    return this.lineaRepository.findOne({ where: { id }, relations: ['marca'] });
  }

  create(createLineaDto: CreateLineaDto) {
    const nuevaLinea = this.lineaRepository.create(createLineaDto);
    return this.lineaRepository.save(nuevaLinea);
  }

  


  remove(id: number) {
    return this.lineaRepository.delete(id);
  }
}
