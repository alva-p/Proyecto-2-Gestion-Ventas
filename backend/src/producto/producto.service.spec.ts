import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Linea } from 'src/linea/entities/linea.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { ProveedorService } from 'src/proveedor/proveedor.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductoService', () => {
  let service: ProductoService;
  let productoRepo: Repository<Producto>;
  let lineaRepo: Repository<Linea>;
  let proveedorRepo: Repository<Proveedor>;
  let proveedorService: ProveedorService;

  const mockLinea = { id: 1, nombre: 'Línea Test' };
  const mockProveedor = { id: 1, nombre: 'Proveedor Test' };
  const mockProducto = {
    id: 1,
    nombre: 'Producto Test',
    descripcion: 'Descripción test',
    precio: 1000,
    stock: 50,
    estado: true,
    linea: mockLinea,
    proveedores: [],
    venta: [],
  };

  const mockProductoRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockLineaRepo = {
    findOne: jest.fn(),
  };

  const mockProveedorRepo = {
    findByIds: jest.fn(),
  };

  const mockProveedorService = {
    actualizarCantidadProductos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductoRepo,
        },
        {
          provide: getRepositoryToken(Linea),
          useValue: mockLineaRepo,
        },
        {
          provide: getRepositoryToken(Proveedor),
          useValue: mockProveedorRepo,
        },
        {
          provide: ProveedorService,
          useValue: mockProveedorService,
        },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    productoRepo = module.get<Repository<Producto>>(getRepositoryToken(Producto));
    lineaRepo = module.get<Repository<Linea>>(getRepositoryToken(Linea));
    proveedorRepo = module.get<Repository<Proveedor>>(getRepositoryToken(Proveedor));
    proveedorService = module.get<ProveedorService>(ProveedorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto válido', async () => {
      const dto = {
        nombre: 'Aceite 10W40',
        descripcion: 'Aceite sintético',
        precio: 1200.5,
        stock: 10,
        lineaId: 1,
      } as any;

      mockLineaRepo.findOne.mockResolvedValue(mockLinea);
      mockProductoRepo.create.mockReturnValue({ ...dto, linea: mockLinea, proveedores: [] });
      mockProductoRepo.save.mockResolvedValue({ ...dto, id: 1, linea: mockLinea, proveedores: [] });

      const result = await service.create(dto);

      expect(lineaRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(productoRepo.create).toHaveBeenCalled();
      expect(productoRepo.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('debería lanzar error si la línea no existe', async () => {
      const dto = {
        nombre: 'Producto sin línea',
        descripcion: 'Test',
        precio: 1000,
        stock: 5,
        lineaId: 999,
      } as any;

      mockLineaRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow('La línea con ID 999 no existe');
    });

    it('debería crear producto con proveedores', async () => {
      const dto = {
        nombre: 'Producto con proveedor',
        descripcion: 'Test',
        precio: 1000,
        stock: 10,
        lineaId: 1,
        proveedorId: [1],
      } as any;

      mockLineaRepo.findOne.mockResolvedValue(mockLinea);
      mockProveedorRepo.findByIds.mockResolvedValue([mockProveedor]);
      mockProductoRepo.create.mockReturnValue({ ...dto, linea: mockLinea, proveedores: [mockProveedor] });
      mockProductoRepo.save.mockResolvedValue({ ...dto, id: 1, linea: mockLinea, proveedores: [mockProveedor] });

      const result = await service.create(dto);

      expect(proveedorRepo.findByIds).toHaveBeenCalledWith([1]);
      expect(proveedorService.actualizarCantidadProductos).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('debería devolver una lista de productos', async () => {
      const productos = [mockProducto];
      mockProductoRepo.find.mockResolvedValue(productos);

      const result = await service.findAll();

      expect(productoRepo.find).toHaveBeenCalledWith({
        relations: ['linea', 'proveedores'],
      });
      expect(result.length).toBe(1);
      expect(result[0].nombre).toBe('Producto Test');
    });
  });

  describe('findOne', () => {
    it('debería devolver un producto por ID', async () => {
      mockProductoRepo.findOne.mockResolvedValue(mockProducto);

      const result = await service.findOne(1);

      expect(productoRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['linea', 'proveedores'],
      });
      expect(result).toEqual(mockProducto);
    });

    it('debería lanzar error si el producto no existe', async () => {
      mockProductoRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Producto 999 no encontrado');
    });
  });

  describe('update', () => {
    it('debería actualizar un producto existente', async () => {
      const dto = {
        nombre: 'Aceite Premium',
        precio: 1500,
      } as any;

      const productoActualizado = { ...mockProducto, ...dto };

      mockProductoRepo.findOne
        .mockResolvedValueOnce(mockProducto) // findOne en update
        .mockResolvedValueOnce(productoActualizado); // findOne después del save
      mockProductoRepo.save.mockResolvedValue(productoActualizado);

      const result = await service.update(1, dto);

      expect(result.nombre).toBe('Aceite Premium');
      expect(result.precio).toBe(1500);
    });

    it('debería lanzar error si el producto no existe', async () => {
      mockProductoRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar la línea si se proporciona lineaId', async () => {
      const dto = {
        lineaId: 2,
      } as any;

      const nuevaLinea = { id: 2, nombre: 'Nueva Línea' };
      const productoActualizado = { ...mockProducto, linea: nuevaLinea };

      mockProductoRepo.findOne
        .mockResolvedValueOnce(mockProducto)
        .mockResolvedValueOnce(productoActualizado);
      mockLineaRepo.findOne.mockResolvedValue(nuevaLinea);
      mockProductoRepo.save.mockResolvedValue(productoActualizado);

      const result = await service.update(1, dto);

      expect(lineaRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result.linea.id).toBe(2);
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto', async () => {
      mockProductoRepo.findOne.mockResolvedValue(mockProducto);
      mockProductoRepo.remove.mockResolvedValue(mockProducto);

      await service.remove(1);

      expect(productoRepo.findOne).toHaveBeenCalled();
      expect(productoRepo.remove).toHaveBeenCalledWith(mockProducto);
    });

    it('debería lanzar error si el producto no existe', async () => {
      mockProductoRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});

