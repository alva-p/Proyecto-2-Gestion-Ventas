import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';
import { Linea } from './entities/linea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Linea])],
  controllers: [LineaController],
  providers: [LineaService],
})
export class LineaModule {}