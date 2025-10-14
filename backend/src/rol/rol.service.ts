import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto): Promise<Rol> {
    const existe = await this.rolRepository.findOne({ where: { nombre: dto.nombre } });
    if (existe) {
      throw new BadRequestException(`El rol "${dto.nombre}" ya existe.`);
    }

    const rol = this.rolRepository.create(dto);
    return this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { id } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
    }
    return rol;
  }

  async update(id: number, dto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);

    if (dto.nombre && dto.nombre !== rol.nombre) {
      const existeNombre = await this.rolRepository.findOne({ where: { nombre: dto.nombre } });
      if (existeNombre) {
        throw new BadRequestException(`Ya existe un rol con el nombre "${dto.nombre}".`);
      }
    }

    Object.assign(rol, dto);
    return this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolRepository.remove(rol);
  }
}
