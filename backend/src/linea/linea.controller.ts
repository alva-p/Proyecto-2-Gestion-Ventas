import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';

@Controller('lineas')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Get()
  findAll() {
    return this.lineaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineaService.findOne(+id);
  }

  @Post()
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineaService.create(createLineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineaService.remove(+id);
  }
}

