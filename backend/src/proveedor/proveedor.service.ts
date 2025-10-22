import { Injectable } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}
  
  async create(dto: CreateProveedorDto): Promise<Proveedor> {
    const nuevo = this.proveedorRepository.create(dto);
    return this.proveedorRepository.save(nuevo);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository
      .createQueryBuilder('proveedor') // SELECT * FROM proveedor AS proveedor;
      .leftJoinAndSelect('proveedor.productos', 'producto') // LEFT JOIN producto AS producto ON producto.proveedorId = proveedor.id
      .select([
        'proveedor.id',
        'proveedor.nombre',
        'proveedor.contactoNombre',
        'proveedor.contactoEmail',
        'proveedor.telefono',
        'proveedor.direccion',
        'proveedor.estado',
        'proveedor.fechaRegistro',
        'producto.id',
        'producto.nombre',
        'producto.precio',
        'producto.stock',
        'producto.estado'
      ])
      .orderBy('proveedor.id', 'ASC')
      .getMany();
  }
  

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!proveedor) throw new NotFoundException(`Proveedor ${id} no encontrado`);
    return proveedor;
  }

  async update(id: number, dto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    const actualizado = Object.assign(proveedor, dto);
    return this.proveedorRepository.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }

  async actualizarCantidadProductos(proveedorId: number): Promise<void> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id: proveedorId },
      relations: ['productos'],
    });

    if (proveedor) {
      proveedor.cantidadProductos = proveedor.productos.length;
      await this.proveedorRepository.save(proveedor);
    }
  }

}
