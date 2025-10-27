import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { Venta } from '../venta/entities/venta.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,

    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    const { venta_id, ...dtoData } = createFacturaDto;

    // Buscar la Venta y verificar si existe
    const venta = await this.ventaRepository.findOne({
      where: { id: venta_id },
      relations: ['factura'], // Cargamos la relación para ver si ya tiene una
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID #${venta_id} no encontrada.`);
    }

    // Asegurarse que esta venta no tenga ya una factura
    if (venta.factura) {
      throw new BadRequestException(
        `La Venta #${venta_id} ya ha sido facturada (Factura #${venta.factura.id}).`,
      );
    }

    // Buscar la última factura para generar el siguiente número
    const facturas = await this.facturaRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const ultimaFactura = facturas[0];
    
    const siguienteNumero = ultimaFactura
      ? (parseInt(ultimaFactura.numero_factura.split('-')[1]) + 1).toString().padStart(6, '0')
      : '000001';

    const numeroFactura = `FAC-${siguienteNumero}`;

    const nuevaFactura = this.facturaRepository.create({
      ...dtoData, // cliente_nombre, cliente_documento, tipo
      venta: venta, // Asignamos la entidad Venta completa
      numero_factura: numeroFactura,
    });
    return this.facturaRepository.save(nuevaFactura);
  }

  findAll(): Promise<Factura[]> {
    return this.facturaRepository.find({
      relations: ['venta', 'venta.productos', 'venta.usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id: id },
      relations: ['venta', 'venta.productos', 'venta.usuario'],
    });

    if (!factura) {
      throw new NotFoundException(`Factura con ID #${id} no encontrada.`);
    }
    return factura;
  }

  async update(
    id: number,
    updateFacturaDto: UpdateFacturaDto,
  ): Promise<Factura> {
    const factura = await this.findOne(id);
    this.facturaRepository.merge(factura, updateFacturaDto);

    return this.facturaRepository.save(factura);
  }

  async remove(id: number): Promise<Factura> {
    const factura = await this.findOne(id);
    return this.facturaRepository.remove(factura);
  }
  
}