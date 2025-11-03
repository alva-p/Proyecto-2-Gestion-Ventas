import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaRepository } from './marca.repository';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(MarcaRepository)
    private readonly marcaRepository: MarcaRepository,
  ) {}

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    const existe = await this.marcaRepository.findByName(createMarcaDto.nombre);

    if (existe) {
      throw new ConflictException(`La marca "${createMarcaDto.nombre}" ya existe.`);
    }

    const marca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(marca);
  }

  async findAll(): Promise<Marca[]> {
    return this.marcaRepository.findAllWithLineas();
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) throw new NotFoundException(`No se encontró la marca con ID ${id}`);
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);
    Object.assign(marca, updateMarcaDto);
    return this.marcaRepository.save(marca);
  }

  async remove(id: number): Promise<{ message: string }> {
    const marca = await this.findOne(id);
    await this.marcaRepository.remove(marca);
    return { message: `La marca "${marca.nombre}" fue eliminada correctamente.` };
  }
}
