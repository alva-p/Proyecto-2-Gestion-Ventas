import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Linea } from 'src/linea/entities/linea.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto> {
    const { lineaId, proveedorId, ...resto } = dto;
    // Buscar la línea
    const linea = await this.lineaRepository.findOne({ where: { id: lineaId } });
    if (!linea) throw new NotFoundException(`La línea con ID ${lineaId} no existe`);
    // Buscar los proveedores si se enviaron
    let proveedores: Proveedor[] = [];
    if (proveedorId && proveedorId.length > 0) {
      proveedores = await this.proveedorRepository.findByIds(proveedorId);
      if (proveedores.length === 0)
        throw new NotFoundException(`Ninguno de los proveedores existe`);
    }
    // Crear el producto con las relaciones
    const nuevo = this.productoRepository.create({
      ...resto,
      linea,
      proveedores,
    });
    return this.productoRepository.save(nuevo);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['linea', 'proveedores'],
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['linea', 'proveedores'],
    });
    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    // Desestructuramos los posibles cambios
    const { lineaId, proveedorId, ...resto } = dto;
  
    // Si viene lineaId, buscamos la nueva línea
    if (lineaId) {
      const nuevaLinea = await this.lineaRepository.findOne({ where: { id: lineaId } });
      if (!nuevaLinea) throw new NotFoundException(`La línea con ID ${lineaId} no existe`);
      producto.linea = nuevaLinea;
    }
  
    // Si vienen proveedores, los buscamos
    if (proveedorId && proveedorId.length > 0) {
      const nuevosProveedores = await this.proveedorRepository.findByIds(proveedorId);
      producto.proveedores = nuevosProveedores;
    }
  
    // Asignamos los demás campos
    Object.assign(producto, resto);
  
    const actualizado = await this.productoRepository.save(producto);
  
    // Volvemos a traer el producto con todas sus relaciones actualizadas
    return (await this.productoRepository.findOne({
      where: { id: actualizado.id },
      relations: ['linea', 'proveedores'],
    }))!;    
  }
  

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
