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

  async findAll() {
    const lineas = await this.lineaRepository.find({ relations: ['marca', 'productos'] });
    // Agregamos el campo cantidadProductos de forma calculada
    return lineas.map((linea) => ({
      ...linea,
      cantidadProductos: linea.productos?.length || 0,
    }));
  }

  async findOne(id: number) {
    const linea = await this.lineaRepository.findOne({
      where: { id },
      relations: ['marca', 'productos'],
    });
    if (!linea) {
      throw new NotFoundException(`La línea con ID ${id} no existe`);
    }

    return {
      ...linea,
      cantidadProductos: linea.productos?.length || 0,
    };
  }

  async create(createLineaDto: CreateLineaDto) {
    const nuevaLinea = this.lineaRepository.create({
      ...createLineaDto,
      estado: createLineaDto.estado || 'activa',
      fechaCreacion: new Date(),
    });
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

  async remove(id: number): Promise<void> {
    const linea = await this.lineaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
  
    if (!linea) {
      throw new NotFoundException(`La línea con ID ${id} no existe`);
    }
  
    // No se elomina si tiene productos asociados 
    if (linea.productos && linea.productos.length > 0) {
      throw new Error('No se puede eliminar la línea porque tiene productos asociados');
    }
  
    await this.lineaRepository.remove(linea);
  }  
}
