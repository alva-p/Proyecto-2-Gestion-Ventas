import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { Rol } from '../rol/entities/rol.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  // Creacion de Usuario con Rol (contraseña hasheada)
  async create(dto: CreateUserDto): Promise<User> {
    const rol = await this.rolRepository.findOne({ where: { id: dto.rol_id } });
    if (!rol) throw new BadRequestException(`Rol con ID ${dto.rol_id} no existe`);

    const existeCorreo = await this.userRepository.findOne({ where: { correo: dto.correo } });
    if (existeCorreo) throw new BadRequestException(`El correo ${dto.correo} ya está registrado`);

    const hash = await bcrypt.hash(dto.contrasena, 10);

    const nuevoUsuario = this.userRepository.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      correo: dto.correo,
      contrasena: hash,
      activo: dto.activo ?? true,
      rol, // Crear rol preterminado
    });

    return this.userRepository.save(nuevoUsuario);
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['rol'], order: { id: 'ASC' } });
  }
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['rol'] });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  //Actualiza los datos de un usuario (opcionalmente su rol y contraseña)
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.correo && dto.correo !== user.correo) {
      const existeCorreo = await this.userRepository.findOne({ where: { correo: dto.correo } });
      if (existeCorreo) throw new BadRequestException(`El correo ${dto.correo} ya está en uso`);
    }

    if (dto.contrasena) {
      dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
    }

    if (dto.rol_id) {
      const rol = await this.rolRepository.findOne({ where: { id: dto.rol_id } });
      if (!rol) throw new BadRequestException(`Rol con ID ${dto.rol_id} no existe`);
      user.rol = rol;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
