
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { Venta } from '../venta/entities/venta.entity'; // <-- Importante
import { VentaModule } from '../venta/venta.module'; // <-- Importante
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Factura, 
      Venta, 
    ]),
    forwardRef(() => VentaModule), 
  ],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaService],
})
export class FacturaModule {}