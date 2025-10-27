import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { Venta } from './entities/venta.entity';
import { User } from '../users/entities/users.entity';
import { Producto } from '../producto/entities/producto.entity';
import { FacturaModule } from '../factura/factura.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([Venta, User, Producto]),
        forwardRef(() => FacturaModule), // 👈 Importamos el módulo de Factura
    ],
  controllers: [VentaController],
  providers: [VentaService],
  exports: [VentaService],
})
export class VentaModule {}
