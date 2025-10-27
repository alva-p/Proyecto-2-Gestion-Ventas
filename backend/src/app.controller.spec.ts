// app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /api/saludo', () => {
    it('debería devolver el saludo en JSON', () => {
      expect(appController.getSaludo()).toEqual({ mensaje: 'Hola desde NestJS 👋' });
    });
  });
});
