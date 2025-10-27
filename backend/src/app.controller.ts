import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('saludo')
  getSaludo() {
    return { mensaje: 'Hola desde NestJS 👋' };
  }
}
