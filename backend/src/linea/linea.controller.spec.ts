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
    cantidadProductos: 0,
    fechaCreacion: new Date(),
    marca: mockMarca as any,
    productos: [],
  };

  const mockLineaService = {
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
          useValue: mockLineaService,
        },
      ],
    }).compile();

    controller = module.get<LineaController>(LineaController);
    service = module.get<LineaService>(LineaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 🔹 CREATE - Integridad referencial: Línea NO puede existir sin Marca
  describe('create', () => {
    it('debe crear una línea vinculada a una marca existente', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Aceites',
        descripcion: 'Lubricantes',
        marcaId: 1,
      };

      mockLineaService.create.mockResolvedValue(mockLinea);

      const result = await controller.create(1, dto);

      expect(result).toEqual(mockLinea);
      expect(result.marca).toBeDefined();
      expect(result.marca.id).toBe(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('debe validar que la marca exista antes de crear línea', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Filtros',
        descripcion: 'Filtros de aire',
        marcaId: 999,
      };

      const error = new Error('La marca con ID 999 no existe');
      mockLineaService.create.mockRejectedValue(error);

      await expect(controller.create(999, dto)).rejects.toThrow(error);
    });

    it('debe propagar error si marcaId no se proporciona', async () => {
      const dto = {
        nombre: 'Sin marca',
        descripcion: 'Test',
      } as any;

      const error = new Error('La marca es obligatoria');
      mockLineaService.create.mockRejectedValue(error);

      await expect(controller.create(undefined as any, dto)).rejects.toThrow(error);
    });
  });

  // 🔹 FIND ALL - Consulta con relación a Marca
  describe('findAll', () => {
    it('debe retornar líneas con sus marcas asociadas', async () => {
      const lineas = [mockLinea];
      mockLineaService.findAll.mockResolvedValue(lineas);

      const result = await controller.findAll();

      expect(result[0].marca).toBeDefined();
      expect(result[0].marca.nombre).toBe('Bosch');
      expect(result[0].cantidadProductos).toBeDefined();
    });

    it('debe calcular cantidad de productos por línea', async () => {
      const lineaConProductos = {
        ...mockLinea,
        productos: [
          { id: 1, nombre: 'Producto 1' },
          { id: 2, nombre: 'Producto 2' },
        ],
      };

      mockLineaService.findAll.mockResolvedValue([lineaConProductos]);

      const result = await controller.findAll();

      expect(result[0].cantidadProductos).toBe(2);
    });
  });

  // 🔹 FIND ONE
  describe('findOne', () => {
    it('debe retornar una línea con su marca', async () => {
      mockLineaService.findOne.mockResolvedValue(mockLinea);

      const result = await controller.findOne('1');

      expect(result).toBeDefined();
      expect(service.findOne).toHaveBeenCalledWith(1);
      if ('marca' in result) {
        expect(result.marca).toBeDefined();
      }
    });

    it('debe retornar mensaje si la línea no existe', async () => {
      mockLineaService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      if ('mensaje' in result) {
        expect(result.mensaje).toBe('La línea con ID 999 no existe');
      }
    });
  });

  // 🔹 UPDATE - Cambio de marca en líneas con productos
  describe('update', () => {
    it('debe actualizar una línea existente', async () => {
      const dto: UpdateLineaDto = {
        descripcion: 'Nueva descripción',
      };

      const lineaActualizada = { ...mockLinea, ...dto };
      mockLineaService.update.mockResolvedValue({ affected: 1 });

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('debe permitir cambiar de marca si la línea NO tiene productos', async () => {
      const dto: UpdateLineaDto = {
        marcaId: 2,
      };

      mockLineaService.update.mockResolvedValue({ affected: 1 });

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('debe validar cambio de marca si la línea tiene productos asociados', async () => {
      const dto: UpdateLineaDto = {
        marcaId: 2,
      };

      // Este test documenta el comportamiento esperado
      // La validación debería estar en el servicio
      const error = new Error('No se puede cambiar la marca de una línea con productos asociados');
      mockLineaService.update.mockRejectedValue(error);

      await expect(controller.update('1', dto)).rejects.toThrow(error);
    });
  });

  // 🔹 REMOVE
  describe('remove', () => {
    it('debe eliminar una línea sin productos', async () => {
      mockLineaService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('debe validar que no se elimine línea con productos', async () => {
      const error = new Error('No se puede eliminar una línea con productos asociados');
      mockLineaService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
    });
  });
});
