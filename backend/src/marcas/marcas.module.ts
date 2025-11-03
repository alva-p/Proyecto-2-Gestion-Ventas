import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { Marca } from './entities/marca.entity';
import { MarcaRepository } from './marca.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Marca, MarcaRepository])],
  controllers: [MarcasController],
  providers: [MarcasService],
  exports: [MarcasService, TypeOrmModule],
})
export class MarcasModule {}
