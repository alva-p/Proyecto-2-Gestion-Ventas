import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { ExistsPipe } from '../pipes/exists.pipe';

@Controller('lineas')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Post()
  create(
    @Body('marcaId', ExistsPipe.for('Marca')) marcaId: number,
    @Body() dto: CreateLineaDto,
  ) {
    // Marca validada automáticamente
    return this.lineaService.create(dto);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineaService.remove(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineaDto: UpdateLineaDto) {
  return this.lineaService.update(+id, updateLineaDto);
}
}


