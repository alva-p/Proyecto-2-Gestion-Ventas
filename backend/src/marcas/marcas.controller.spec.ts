// backend/src/marcas/marcas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MarcasController } from './marcas.controller';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { Marca } from './entities/marca.entity';

describe('MarcasController', () => {
  let controller: MarcasController;
  let service: MarcasService;

  const mockMarca: Marca = {
    id: 1,
    nombre: 'Bosch',
    descripcion: 'Marca de autopartes premium',
    lineas: [],
  };

  const mockMarcasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcasController],
      providers: [
        {
          provide: MarcasService,
          useValue: mockMarcasService,
        },
      ],
    }).compile();

    controller = module.get<MarcasController>(MarcasController);
    service = module.get<MarcasService>(MarcasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una marca con nombre único', async () => {
      const dto: CreateMarcaDto = {
        nombre: 'Bosch',
        descripcion: 'Marca de autopartes premium',
      };

      mockMarcasService.create.mockResolvedValue(mockMarca);

      const result = await controller.create(dto);

      expect(result).toEqual(mockMarca);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('debe propagar error si el nombre ya existe', async () => {
      const dto: CreateMarcaDto = {
        nombre: 'Bosch',
        descripcion: 'Duplicado',
      };

      const error = new Error('La marca "Bosch" ya existe.');
      mockMarcasService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('debe retornar un array de marcas con sus líneas', async () => {
      const marcas = [mockMarca];
      mockMarcasService.findAll.mockResolvedValue(marcas);

      const result = await controller.findAll();

      expect(result).toEqual(marcas);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar array vacío si no hay marcas', async () => {
      mockMarcasService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('debe retornar una marca por ID', async () => {
      mockMarcasService.findOne.mockResolvedValue(mockMarca);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockMarca);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe propagar error si la marca no existe', async () => {
      const error = new Error('No se encontró la marca con ID 999');
      mockMarcasService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('999')).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('debe actualizar una marca existente', async () => {
      const dto = {
        nombre: 'Bosch',
        descripcion: 'Descripción actualizada',
      } as UpdateMarcaDto;

      const marcaActualizada = { ...mockMarca, ...dto };
      mockMarcasService.update.mockResolvedValue(marcaActualizada);

      const result = await controller.update('1', dto);

      expect(result).toEqual(marcaActualizada);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('debe propagar error si la marca no existe', async () => {
      const dto = { nombre: 'Test' } as UpdateMarcaDto;
      const error = new Error('No se encontró la marca con ID 999');

      mockMarcasService.update.mockRejectedValue(error);

      await expect(controller.update('999', dto)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('debe eliminar una marca sin dependencias', async () => {
      const response = { message: 'La marca "Bosch" fue eliminada correctamente.' };
      mockMarcasService.remove.mockResolvedValue(response);

      const result = await controller.remove('1');

      expect(result).toEqual(response);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('debe propagar error si la marca tiene líneas asociadas', async () => {
      const error = new Error('No se puede eliminar la marca porque tiene líneas asociadas');
      mockMarcasService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
    });

    it('debe propagar error si la marca no existe', async () => {
      const error = new Error('No se encontró la marca con ID 999');
      mockMarcasService.remove.mockRejectedValue(error);

      await expect(controller.remove('999')).rejects.toThrow(error);
    });
  });
});
