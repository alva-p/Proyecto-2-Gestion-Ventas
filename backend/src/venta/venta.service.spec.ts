// 
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { VentaService } from './venta.service';
import { Venta } from './entities/venta.entity';
import { User } from '../users/entities/users.entity';
import { Producto } from '../producto/entities/producto.entity';
import { FacturaService } from '../factura/factura.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Helpers de mock
function createMockRepo<T extends object>() {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}

describe('VentaService', () => {
  let service: VentaService;
  let ventaRepo: jest.Mocked<Repository<Venta>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let productoRepo: jest.Mocked<Repository<Producto>>;
  let facturaService: { create: jest.Mock };

  beforeEach(async () => {
    ventaRepo = createMockRepo<Venta>();
    userRepo = createMockRepo<User>();
    productoRepo = createMockRepo<Producto>();
    facturaService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentaService,
        { provide: getRepositoryToken(Venta), useValue: ventaRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Producto), useValue: productoRepo },
        { provide: FacturaService, useValue: facturaService },
      ],
    }).compile();

    service = module.get<VentaService>(VentaService);
  });

  const makeQB = <T>(data: T) => {
    const qb: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(data),
      getMany: jest.fn().mockResolvedValue(data),
    };
    return qb;
  };

  it('create: descuenta stock con cantidades repetidas y calcula importe_total', async () => {
    // DTO con productos [2,2,3]
    const dto = {
      usuario_id: 1,
      productos: [2, 2, 3],
      notas: 'VENDI!!!',
      cliente_nombre: 'Cliente X',
      cliente_documento: '123',
      tipo: 'A',
    };

    // Usuario existente
    userRepo.findOne.mockResolvedValue({ id: 1, nombre: 'alva', correo: 'allva@gmail.com' } as any);

    // Productos (id 2 y 3) con stock suficiente
    const p2 = { id: 2, nombre: 'Iphone 16 pro max', precio: 1150000, stock: 10 } as any;
    const p3 = { id: 3, nombre: 'Zapatillas Nike Air Max', precio: 125000, stock: 5 } as any;
    productoRepo.find.mockResolvedValue([p2, p3]);

    // Venta save devuelve id
    ventaRepo.create.mockImplementation((v: any) => v);
    ventaRepo.save.mockImplementation(async (v: any) => ({ ...v, id: 35 }));

    // findOne (post guardado) mediante QB
    const ventaFinal = {
      id: 35,
      importe_total: 1150000 * 2 + 125000,
      notas: 'VENDI!!!',
      usuario: { id: 1, nombre: 'alva', correo: 'allva@gmail.com' },
      productos: [
        { id: 2, nombre: 'Iphone 16 pro max', precio: 1150000 },
        { id: 3, nombre: 'Zapatillas Nike Air Max', precio: 125000 },
      ],
      fecha: new Date(),
    } as any;
    ventaRepo.createQueryBuilder.mockReturnValue(makeQB(ventaFinal));

    // Factura OK
    facturaService.create.mockResolvedValue({ id: 99 });

    const venta = await service.create(dto);

    // Total correcto
    expect(venta.importe_total).toBe(2425000);

    // Stock descontado (2 de p2, 1 de p3)
    expect(productoRepo.save).toHaveBeenCalledWith([
      expect.objectContaining({ id: 2, stock: 8 }),
      expect.objectContaining({ id: 3, stock: 4 }),
    ]);

    // Factura creada con venta_id
    expect(facturaService.create).toHaveBeenCalledWith({
      venta_id: 35,
      cliente_nombre: 'Cliente X',
      cliente_documento: '123',
      tipo: 'A',
    });
  });

  it('create: lanza error si falta usuario', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({
        usuario_id: 999,
        productos: [1],
        cliente_nombre: 'X',
        cliente_documento: '1',
        tipo: 'B',
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create: lanza error si algún producto no existe', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1 } as any);
    productoRepo.find.mockResolvedValue([]); // ninguno
    await expect(
      service.create({
        usuario_id: 1,
        productos: [10],
        cliente_nombre: 'X',
        cliente_documento: '1',
        tipo: 'B',
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create: rechaza por stock insuficiente', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1 } as any);
    const p = { id: 2, nombre: 'Prod', precio: 100, stock: 0 } as any;
    productoRepo.find.mockResolvedValue([p]);
    await expect(
      service.create({
        usuario_id: 1,
        productos: [2],
        cliente_nombre: 'X',
        cliente_documento: '1',
        tipo: 'C',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('findOne: devuelve venta', async () => {
    const venta = { id: 7 } as any;
    ventaRepo.createQueryBuilder.mockReturnValue(makeQB(venta));
    await expect(service.findOne(7)).resolves.toEqual(venta);
  });

  it('findAll: devuelve array', async () => {
    const ventas = [{ id: 1 }, { id: 2 }] as any;
    const qb = makeQB(ventas);
    // findAll usa orderBy
    qb.orderBy = jest.fn().mockReturnThis();
    ventaRepo.createQueryBuilder.mockReturnValue(qb);
    await expect(service.findAll()).resolves.toEqual(ventas);
  });

  it('update: cambia notas y recalcula total con nuevos productos (sin tocar stock)', async () => {
    // Mock de findOne interno del servicio (usa QB)
    const original = {
      id: 10,
      usuario: { id: 1 },
      productos: [],
      notas: null,
      importe_total: 0,
    } as any;
    ventaRepo.createQueryBuilder.mockReturnValueOnce(makeQB(original)); // first findOne in update()

    // Nuevos productos
    const p1 = { id: 1, precio: 100 } as any;
    const p2 = { id: 2, precio: 50 } as any;
    productoRepo.find.mockResolvedValue([p1, p2]); // productos [1,2,2] => total 100 + 50*2 = 200

    ventaRepo.save.mockResolvedValue({ ...original, notas: 'Nueva', importe_total: 200, productos: [p1, p2] });
    // findOne al final de update()
    const finalVenta = { ...original, notas: 'Nueva', importe_total: 200, productos: [p1, p2] };
    ventaRepo.createQueryBuilder.mockReturnValueOnce(makeQB(finalVenta));

    const out = await service.update(10, { productos: [1, 2, 2], notas: 'Nueva' } as any);

    expect(out.importe_total).toBe(200);
    expect(productoRepo.save).not.toHaveBeenCalled(); // stock NO se toca en update
  });

  it('remove: elimina la venta', async () => {
    // findOne previo
    const venta = { id: 77 } as any;
    ventaRepo.createQueryBuilder.mockReturnValue(makeQB(venta));
    await service.remove(77);
    expect(ventaRepo.remove).toHaveBeenCalledWith(venta);
  });
});
