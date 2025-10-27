import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';
import { Linea } from './entities/linea.entity';
import { Marca } from '../marcas/entities/marca.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Linea, Marca, Producto])],
  controllers: [LineaController],
  providers: [LineaService],
})
export class LineaModule {}
