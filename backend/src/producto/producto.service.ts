import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto> {
    const nuevo = this.productoRepository.create(dto);
    return this.productoRepository.save(nuevo);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['marca', 'linea', 'proveedores'],
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['marca', 'linea', 'proveedores'],
    });
    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const actualizado = Object.assign(producto, dto);
    return this.productoRepository.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
