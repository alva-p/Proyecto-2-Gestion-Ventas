import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Linea } from 'src/linea/entities/linea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Linea, Proveedor])],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
