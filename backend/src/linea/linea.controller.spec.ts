// src/linea/linea.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LineaController } from './linea.controller';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { Linea } from './entities/linea.entity';

describe('LineaController', () => {
  let controller: LineaController;
  let service: LineaService;

  const mockMarca = {
    id: 1,
    nombre: 'Bosch',
    descripcion: 'Autopartes',
  };

  const mockLinea: Linea = {
    id: 1,
    nombre: 'Aceites',
    descripcion: 'Lubricantes para motor',
    estado: true,
    // cantidadProductos lo calcula el controller según productos.length
    cantidadProductos: 0 as any,
    fechaCreacion: new Date(),
    marca: mockMarca as any,
    productos: [],
  };

  const mockLineaServiceObj = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineaController],
      providers: [
        {
          provide: LineaService,
          useValue: mockLineaServiceObj as unknown as LineaService,
        },
      ],
    }).compile();

    controller = module.get<LineaController>(LineaController);
    service = module.get<LineaService>(LineaService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 🔹 CREATE
  describe('create', () => {
    it('debe crear una línea vinculada a una marca existente', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Aceites',
        descripcion: 'Lubricantes',
        marcaId: 1,
      };

      (service.create as jest.Mock).mockResolvedValue(mockLinea);

      const result = await controller.create(1, dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockLinea);
      if ('mensaje' in result) fail('No debería devolver mensaje en creación correcta');
      expect(result.marca).toBeDefined();
      expect(result.marca.id).toBe(1);
    });

    it('debe validar que la marca exista antes de crear línea', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Filtros',
        descripcion: 'Filtros de aire',
        marcaId: 999,
      };

      const error = new Error('La marca con ID 999 no existe');
      (service.create as jest.Mock).mockRejectedValue(error);

      await expect(controller.create(999, dto)).rejects.toThrow(error);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('debe propagar error si marcaId no se proporciona', async () => {
      const dto = {
        nombre: 'Sin marca',
        descripcion: 'Test',
      } as any;

      const error = new Error('La marca es obligatoria');
      (service.create as jest.Mock).mockRejectedValue(error);

      await expect(controller.create(undefined as any, dto)).rejects.toThrow(error);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  // 🔹 FIND ALL
  describe('findAll', () => {
    it('debe retornar líneas con sus marcas asociadas', async () => {
      (service.findAll as jest.Mock).mockResolvedValue([mockLinea]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result[0].marca).toBeDefined();
      expect(result[0].marca.nombre).toBe('Bosch');
      expect(result[0].cantidadProductos).toBeDefined();
    });

    it('debe calcular cantidad de productos por línea', async () => {
      const lineaConProductos: Linea = {
        ...mockLinea,
        productos: [
          { id: 1, nombre: 'Producto 1' } as any,
          { id: 2, nombre: 'Producto 2' } as any,
        ],
      };

      (service.findAll as jest.Mock).mockResolvedValue([lineaConProductos]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result[0].cantidadProductos).toBe(2);
    });
  });

  // 🔹 FIND ONE
  describe('findOne', () => {
    it('debe retornar una línea con su marca y cantidadProductos calculada', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockLinea);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      // 🔐 Type guard para acceder a cantidadProductos sin error de TS
      if ('mensaje' in result) {
        fail('Se esperaba una línea, no un mensaje');
      } else {
        expect(result).toBeDefined();
        expect(result.marca).toBeDefined();
        expect(result.cantidadProductos).toBe(0);
      }
    });

    it('debe retornar mensaje si la línea no existe', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(service.findOne).toHaveBeenCalledWith(999);
      if ('mensaje' in result) {
        expect(result.mensaje).toBe('La línea con ID 999 no existe');
      } else {
        fail('Se esperaba un objeto con mensaje cuando la línea no existe');
      }
    });
  });

  // 🔹 UPDATE
  describe('update', () => {
    it('debe actualizar una línea existente (ejemplo: descripción)', async () => {
      const dto: UpdateLineaDto = { descripcion: 'Nueva descripción' };

      (service.update as jest.Mock).mockResolvedValue({ affected: 1 });

      await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('debe permitir cambiar de marca si la línea NO tiene productos (service valida)', async () => {
      const dto: UpdateLineaDto = { marcaId: 2 };

      (service.update as jest.Mock).mockResolvedValue({ affected: 1 });

      await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('debe propagar error si la línea tiene productos y se intenta cambiar marca', async () => {
      const dto: UpdateLineaDto = { marcaId: 2 };
      const error = new Error('No se puede cambiar la marca de una línea con productos asociados');

      (service.update as jest.Mock).mockRejectedValue(error);

      await expect(controller.update('1', dto)).rejects.toThrow(error);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  // 🔹 REMOVE
  describe('remove', () => {
    it('debe eliminar una línea sin productos', async () => {
      (service.remove as jest.Mock).mockResolvedValue({ affected: 1 });

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('debe propagar error si se intenta eliminar una línea con productos', async () => {
      const error = new Error('No se puede eliminar una línea con productos asociados');
      (service.remove as jest.Mock).mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
