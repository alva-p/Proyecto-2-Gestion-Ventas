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
    return this.lineaRepository.find({ relations: ['marca'] });
  }

  findOne(id: number) {
    return this.lineaRepository.findOne({ where: { id }, relations: ['marca'] });
  }

  async create(createLineaDto: CreateLineaDto) {
    const { marcaId, ...resto } = createLineaDto;
  
    // Buscar la marca correspondiente
    const marca = await this.lineaRepository.manager.findOne('Marca', { where: { id: marcaId } });
  
    if (!marca) {
      throw new Error(`La marca con ID ${marcaId} no existe`);
    }
  
    // Crear la nueva línea vinculada a la marca
    const nuevaLinea = this.lineaRepository.create({
      ...resto,
      marca,
    });
  
    return this.lineaRepository.save(nuevaLinea);
  }

  update(id: number, updateLineaDto: UpdateLineaDto) {
    return this.lineaRepository.update(id, updateLineaDto);
  }

  remove(id: number) {
    return this.lineaRepository.delete(id);
  }
}
