import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

@Controller('lineas')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Post()
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineaService.create(createLineaDto);
  }

  @Get()
  async findAll() {
    const lineas = await this.lineaService.findAll();
    // Agregamos la cantidad de productos a cada línea
    return lineas.map(linea => ({
      ...linea,
      cantidadProductos: linea.productos?.length || 0,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const linea = await this.lineaService.findOne(+id);
    if (!linea) {
      return { mensaje: `La línea con ID ${id} no existe` };
    }
    return {
      ...linea,
      cantidadProductos: linea.productos?.length || 0,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineaDto: UpdateLineaDto) {
    return this.lineaService.update(+id, updateLineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineaService.remove(+id);
  }
}


