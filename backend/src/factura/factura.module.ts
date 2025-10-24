import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { Venta } from 'src/venta/entities/venta.entity'; // <-- Importante
import { VentaModule } from 'src/venta/venta.module'; // <-- Importante
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura, 
      Venta, 
    ]),
    VentaModule, 
  ],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaModule],
})
export class FacturaModule {}