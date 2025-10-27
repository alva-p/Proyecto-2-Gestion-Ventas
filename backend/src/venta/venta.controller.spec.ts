import { Test, TestingModule } from '@nestjs/testing';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';

describe('VentaController', () => {
  let controller: VentaController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaController],
      providers: [{ provide: VentaService, useValue: service }],
    }).compile();

    controller = module.get<VentaController>(VentaController);
  });

  it('POST /ventas → create', async () => {
    const dto = { usuario_id: 1, productos: [2], cliente_nombre: 'X', cliente_documento: '1', tipo: 'B' } as any;
    service.create.mockResolvedValue({ id: 10 });
    await expect(controller.create(dto)).resolves.toEqual({ id: 10 });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('GET /ventas → findAll', async () => {
    service.findAll.mockResolvedValue([{ id: 1 }]);
    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('GET /ventas/:id → findOne', async () => {
    service.findOne.mockResolvedValue({ id: 5 });
    await expect(controller.findOne('5')).resolves.toEqual({ id: 5 });
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('PATCH /ventas/:id → update', async () => {
    const dto = { notas: 'ok' } as any;
    service.update.mockResolvedValue({ id: 3, notas: 'ok' });
    await expect(controller.update('3', dto)).resolves.toEqual({ id: 3, notas: 'ok' });
    expect(service.update).toHaveBeenCalledWith(3, dto);
  });

  it('DELETE /ventas/:id → remove', async () => {
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove('9')).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(9);
  });
});
