import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}

  // 🟢 Crear una nueva marca
  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    // Verificar si ya existe una marca con ese nombre
    const existe = await this.marcaRepository.findOne({
      where: { nombre: createMarcaDto.nombre },
    });

    if (existe) {
      throw new ConflictException(`La marca "${createMarcaDto.nombre}" ya existe.`);
    }

    const marca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(marca);
  }

  // 🟢 Listar todas las marcas (con sus líneas opcionalmente)
  async findAll(): Promise<Marca[]> {
    return this.marcaRepository.find({
      relations: ['lineas'], // carga las líneas asociadas
      order: { id: 'ASC' },
    });
  }

  // 🟢 Buscar una marca por ID
  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { id },
      relations: ['lineas'],
    });

    if (!marca) {
      throw new NotFoundException(`No se encontró la marca con ID ${id}`);
    }

    return marca;
  }

  // 🟢 Actualizar una marca
  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);

    Object.assign(marca, updateMarcaDto);
    return this.marcaRepository.save(marca);
  }

  // 🟢 Eliminar una marca
  async remove(id: number): Promise<{ message: string }> {
    const marca = await this.findOne(id);
    await this.marcaRepository.remove(marca);

    return { message: `La marca "${marca.nombre}" fue eliminada correctamente.` };
  }
}
