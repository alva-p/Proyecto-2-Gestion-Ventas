// backend/src/marcas/marcas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { MarcasService } from './marcas.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaRepository } from './marca.repository';

describe('MarcasService', () => {
  let service: MarcasService;
  let repo: MarcaRepository;

  const mockMarca: Marca = {
    id: 1,
    nombre: 'Bosch',
    descripcion: 'Marca de autopartes premium',
    lineas: [],
  };

  const mockMarcaRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findAllWithLineas: jest.fn(),
    findByName: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcasService,
        {
          provide: getRepositoryToken(MarcaRepository),
          useValue: mockMarcaRepo,
        },
      ],
    }).compile();

    service = module.get<MarcasService>(MarcasService);
    repo = module.get<MarcaRepository>(getRepositoryToken(MarcaRepository));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 🔹 CREATE
  describe('create', () => {
    it('debe crear una marca con nombre único', async () => {
      const dto: CreateMarcaDto = { nombre: 'Castrol', descripcion: 'Lubricantes premium' };

      mockMarcaRepo.findByName.mockResolvedValue(null);
      mockMarcaRepo.create.mockReturnValue({ ...dto });
      mockMarcaRepo.save.mockResolvedValue({ id: 1, ...dto, lineas: [] });

      const result = await service.create(dto);

      expect(repo.findByName).toHaveBeenCalledWith(dto.nombre);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('debe lanzar error si el nombre ya existe', async () => {
      const dto: CreateMarcaDto = { nombre: 'Bosch', descripcion: 'Duplicado' };
      mockMarcaRepo.findByName.mockResolvedValue(mockMarca);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow('La marca "Bosch" ya existe.');
    });
  });

  // 🔹 FIND ALL
  describe('findAll', () => {
    it('debe devolver todas las marcas con sus líneas', async () => {
      const marcas = [
        { id: 1, nombre: 'Bosch', lineas: [] },
        { id: 2, nombre: 'Shell', lineas: [{ id: 1, nombre: 'Aceites' }] },
      ];
      mockMarcaRepo.findAllWithLineas.mockResolvedValue(marcas);

      const result = await service.findAll();

      expect(repo.findAllWithLineas).toHaveBeenCalled();
      expect(result).toEqual(marcas);
    });
  });

  // 🔹 FIND ONE
  describe('findOne', () => {
    it('debe devolver una marca por ID', async () => {
      const marca = { ...mockMarca, lineas: [] };
      mockMarcaRepo.findById.mockResolvedValue(marca);

      const result = await service.findOne(1);

      expect(repo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(marca);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockMarcaRepo.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // 🔹 UPDATE
  describe('update', () => {
    it('debe actualizar una marca existente', async () => {
      const dto: UpdateMarcaDto = { nombre: 'Bosch', descripcion: 'Actualizada' };
      const marcaActualizada = { ...mockMarca, ...dto };

      mockMarcaRepo.findById.mockResolvedValue(mockMarca);
      mockMarcaRepo.save.mockResolvedValue(marcaActualizada);

      const result = await service.update(1, dto);

      expect(result.descripcion).toBe('Actualizada');
      expect(repo.save).toHaveBeenCalled();
    });

    it('debe lanzar error si la marca no existe', async () => {
      mockMarcaRepo.findById.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // 🔹 REMOVE
  describe('remove', () => {
    it('debe eliminar una marca sin líneas', async () => {
      mockMarcaRepo.findById.mockResolvedValue(mockMarca);
      mockMarcaRepo.remove.mockResolvedValue(mockMarca);

      const result = await service.remove(1);

      expect(repo.findById).toHaveBeenCalledWith(1);
      expect(repo.remove).toHaveBeenCalledWith(mockMarca);
      expect(result).toEqual({ message: 'La marca "Bosch" fue eliminada correctamente.' });
    });

    it('debe lanzar error si la marca no existe', async () => {
      mockMarcaRepo.findById.mockResolvedValue(null);
      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});
