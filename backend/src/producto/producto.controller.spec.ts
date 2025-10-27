import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Producto } from './entities/producto.entity';

describe('ProductoController', () => {
  let controller: ProductoController;
  let service: ProductoService;

  const mockProducto: Producto = {
    id: 1,
    nombre: 'Producto Test',
    descripcion: 'Descripción test',
    precio: 1000,
    stock: 50,
    estado: true,
    linea: { id: 1, nombre: 'Línea Test' } as any,
    proveedores: [],
    venta: [],
  };

  const mockProductoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: mockProductoService,
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    service = module.get<ProductoService>(ProductoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un producto con lineaId y DTO', async () => {
      const lineaId = 1;
      const dto = {
        nombre: 'Producto Test',
        descripcion: 'Descripción test',
        precio: 1000,
        stock: 50,
        lineaId: 1,
      } as CreateProductoDto;

      mockProductoService.create.mockResolvedValue(mockProducto);

      const result = await controller.create(lineaId, dto);

      expect(result).toEqual(mockProducto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('debe propagar errores del servicio', async () => {
      const lineaId = 1;
      const dto = {
        nombre: 'Producto Test',
        descripcion: 'Descripción test',
        precio: 1000,
        stock: 50,
        lineaId: 1,
      } as CreateProductoDto;

      const error = new Error('Error al crear producto');
      mockProductoService.create.mockRejectedValue(error);

      await expect(controller.create(lineaId, dto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('debe retornar un array de productos', async () => {
      const productos = [mockProducto];
      mockProductoService.findAll.mockResolvedValue(productos);

      const result = await controller.findAll();

      expect(result).toEqual(productos);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío si no hay productos', async () => {
      mockProductoService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('debe retornar un producto por ID', async () => {
      const id = 1;
      mockProductoService.findOne.mockResolvedValue(mockProducto);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockProducto);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe propagar el error si el producto no existe', async () => {
      const id = 999;
      const error = new Error('Producto no encontrado');
      mockProductoService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(id)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('debe actualizar un producto', async () => {
      const id = 1;
      const dto: Partial<CreateProductoDto> = {
        nombre: 'Producto Actualizado',
        precio: 1500,
      };
      const updatedProducto = { ...mockProducto, ...dto };

      mockProductoService.update.mockResolvedValue(updatedProducto);

      const result = await controller.update(id, dto);

      expect(result).toEqual(updatedProducto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('debe propagar el error si el producto no existe', async () => {
      const id = 999;
      const dto: Partial<CreateProductoDto> = { nombre: 'Test' };
      const error = new Error('Producto no encontrado');

      mockProductoService.update.mockRejectedValue(error);

      await expect(controller.update(id, dto)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('debe eliminar un producto y retornar mensaje de éxito', async () => {
      const id = 1;
      const response = { message: 'Producto eliminado correctamente' };

      mockProductoService.remove.mockResolvedValue(response);

      const result = await controller.remove(id);

      expect(result).toEqual(response);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('debe propagar el error si el producto no existe', async () => {
      const id = 999;
      const error = new Error('Producto no encontrado');

      mockProductoService.remove.mockRejectedValue(error);

      await expect(controller.remove(id)).rejects.toThrow(error);
    });
  });
});