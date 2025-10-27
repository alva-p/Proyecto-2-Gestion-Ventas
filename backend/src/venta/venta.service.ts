import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { User } from '../users/entities/users.entity';
import { Producto } from '../producto/entities/producto.entity';
import { FacturaService } from '../factura/factura.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly facturaService: FacturaService,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { 
      usuario_id, 
      productos, 
      notas,
      cliente_nombre,
      cliente_documento,
      tipo
    } = createVentaDto;

    // Usuario
    const usuario = await this.userRepository.findOne({ where: { id: usuario_id } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);

    // Cantidades por producto (cuenta repeticiones)
    const cantidades: Record<number, number> = {};
    for (const id of productos) {
      cantidades[id] = (cantidades[id] ?? 0) + 1;
    }
    const uniqueIds = Object.keys(cantidades).map(Number);

    // Productos existentes
    const productosEncontrados = await this.productoRepository.find({
      where: { id: In(uniqueIds) },
    });
    if (productosEncontrados.length !== uniqueIds.length) {
      throw new NotFoundException('Uno o más productos no existen');
    }

    // Verificación de stock simple
    for (const p of productosEncontrados) {
      const qty = cantidades[p.id];
      if (p.stock < qty) {
        throw new BadRequestException(
          `Stock insuficiente para el producto "${p.nombre}". Stock: ${p.stock}, solicitado: ${qty}`
        );
      }
    }

    // Crear venta (relación ManyToMany guarda solo una vez cada producto)
    const venta = this.ventaRepository.create({
      usuario,
      productos: productosEncontrados,
      notas,
    });

    // Calcular importe_total (precio * cantidad)
    const total = productosEncontrados.reduce((acc, p) => {
      const qty = cantidades[p.id];
      return acc + Number(p.precio) * qty;
    }, 0);
    venta.importe_total = Number(total.toFixed(2));

    // Guardar la venta para obtener ID
    const ventaGuardada = await this.ventaRepository.save(venta);

    // Descontar stock y guardar productos (resta por cantidad solicitada)
    for (const p of productosEncontrados) {
      p.stock = p.stock - cantidades[p.id];
    }
    await this.productoRepository.save(productosEncontrados);

    // Generar factura
    await this.facturaService.create({
      venta_id: ventaGuardada.id,
      cliente_nombre,
      cliente_documento,
      tipo,
    });

    // Devolver la venta con datos frescos
    return this.findOne(ventaGuardada.id);
  }

  async findAll(): Promise<any[]> {
    return this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.productos', 'producto')
      .select([
        'venta.id',
        'venta.fecha',
        'venta.importe_total',
        'venta.notas',
        'usuario.id',
        'usuario.nombre',
        'usuario.correo',
        'producto.id',
        'producto.nombre',
        'producto.precio',
      ])
      .orderBy('venta.id', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<any> {
    const venta = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.productos', 'producto')
      .select([
        'venta.id',
        'venta.fecha',
        'venta.importe_total',
        'venta.notas',
        'usuario.id',
        'usuario.nombre',
        'usuario.correo',
        'producto.id',
        'producto.nombre',
        'producto.precio',
      ])
      .where('venta.id = :id', { id })
      .getOne();

    if (!venta) throw new NotFoundException(`Venta ${id} no encontrada`);
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    const { usuario_id, productos, notas } = updateVentaDto;

    if (usuario_id) {
      const nuevoUsuario = await this.userRepository.findOne({ where: { id: usuario_id } });
      if (!nuevoUsuario) {
        throw new NotFoundException(`Usuario con ID ${usuario_id} no encontrado`);
      }
      venta.usuario = nuevoUsuario;
    }

    if (productos && productos.length > 0) {
      const cantidades: Record<number, number> = {};
      for (const pid of productos) cantidades[pid] = (cantidades[pid] ?? 0) + 1;
      const uniqueIds = Object.keys(cantidades).map(Number);

      const productosEncontrados = await this.productoRepository.find({
        where: { id: In(uniqueIds) },
      });
      if (productosEncontrados.length !== uniqueIds.length) {
        throw new NotFoundException('Uno o más productos no existen');
      }

      // Nota: aquí no se modifica stock (solo en create).
      venta.productos = productosEncontrados;
      venta.importe_total = productosEncontrados.reduce((total, p) => {
        const qty = cantidades[p.id] ?? 1;
        return total + Number(p.precio) * qty;
      }, 0);
    }

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
