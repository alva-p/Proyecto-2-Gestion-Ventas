import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { User } from 'src/users/entities/users.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { usuario_id, productos, notas } = createVentaDto;

    const usuario = await this.userRepository.findOne({ where: { id: usuario_id } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);

    const productosEncontrados = await this.productoRepository.find({
      where: { id: In(productos) },
    });
    if (productosEncontrados.length !== productos.length)
      throw new NotFoundException('Uno o más productos no existen');

    const importe_total = productosEncontrados.reduce((total, producto) => {
      return total + Number(producto.precio);
    }, 0);

    const venta = this.ventaRepository.create({
      usuario,
      productos: productosEncontrados,
      importe_total,
      notas,
    });

    return this.ventaRepository.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['productos', 'usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) throw new NotFoundException(`Venta ${id} no encontrada`);
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    const { usuario_id, productos, notas } = updateVentaDto;

    //Actualizar usuario si cambia
    if (usuario_id) {
      const nuevoUsuario = await this.userRepository.findOne({ where: { id: usuario_id } });
      if (!nuevoUsuario) {
        throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);
      }
      venta.usuario = nuevoUsuario;
    }

    //Actualizar productos si se envían nuevos
    if (productos && productos.length > 0) {
      const productosEncontrados = await this.productoRepository.find({
        where: { id: In(productos) },
      });

      if (productosEncontrados.length !== productos.length) {
        throw new NotFoundException('Uno o más productos no existen');
      }

      venta.productos = productosEncontrados;

      // Calculo de importe_total
      venta.importe_total = productosEncontrados.reduce((total, producto) => {
        return total + Number(producto.precio);
      }, 0);
    }

    //Actualizar notas u otros campos
    if (notas !== undefined) {
      venta.notas = notas;
    }

    await this.ventaRepository.save(venta);
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const venta = await this.findOne(id);
    await this.ventaRepository.remove(venta);
  }
}
