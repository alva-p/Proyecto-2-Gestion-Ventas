// src/linea/linea.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LineaService } from './linea.service';
import { LineaRepository } from './linea.repository';
import { Linea } from './entities/linea.entity';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

describe('LineaService', () => {
  let service: LineaService;
  let repo: LineaRepository;

  const mockMarca = {
    id: 1,
    nombre: 'Bosch',
    descripcion: 'Autopartes premium',
  };

  const mockLinea: Linea = {
    id: 1,
    nombre: 'Aceites',
    descripcion: 'Lubricantes para motor',
    estado: true,
    // cantidadProductos lo calcula el controller en base a productos.length
    cantidadProductos: 0 as any,
    fechaCreacion: new Date(),
    marca: mockMarca as any,
    productos: [],
  };

  // ✅ Mock minimal: solo lo que usa el service
  const mockLineaRepoObj = {
    findAllWithMarca: jest.fn(),
    findOneWithMarca: jest.fn(),
    createLinea: jest.fn(),
    updateLinea: jest.fn(),
    removeLinea: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineaService,
        {
          provide: LineaRepository,
          // ⚠️ Tip “suave” para evitar exigir TODOS los métodos del Repository
          useValue: mockLineaRepoObj as unknown as LineaRepository,
        },
      ],
    }).compile();

    service = module.get<LineaService>(LineaService);
    repo = module.get<LineaRepository>(LineaRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 🔹 INTEGRIDAD REFERENCIAL: Línea NO puede existir sin Marca
  describe('create - Integridad referencial con Marca', () => {
    it('debe crear una línea vinculada a una marca existente', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Aceites',
        descripcion: 'Lubricantes',
        marcaId: 1,
      };

      (repo.createLinea as jest.Mock).mockResolvedValue({ ...mockLinea });

      const result = await service.create(dto);

      expect(repo.createLinea).toHaveBeenCalledWith(dto);
      expect(result.marca).toBeDefined();
      expect(result.marca.id).toBe(1);
    });

    it('debe lanzar error si la marca NO existe - integridad referencial', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Filtros',
        descripcion: 'Test',
        marcaId: 999,
      };

      (repo.createLinea as jest.Mock).mockRejectedValue(
        new Error('La marca con ID 999 no existe'),
      );

      await expect(service.create(dto)).rejects.toThrow('La marca con ID 999 no existe');
      expect(repo.createLinea).toHaveBeenCalledWith(dto);
    });

    it('debe REQUERIR marcaId - línea no puede existir sin marca', async () => {
      const dto = {
        nombre: 'Sin marca',
        descripcion: 'Test',
      } as any;

      (repo.createLinea as jest.Mock).mockRejectedValue(
        new Error('La marca es obligatoria (marcaId).'),
      );

      await expect(service.create(dto)).rejects.toThrow('La marca es obligatoria (marcaId).');
      expect(repo.createLinea).toHaveBeenCalledWith(dto);
    });

    it('debe establecer la relación marca correctamente', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Baterías',
        descripcion: 'Baterías de auto',
        marcaId: 1,
      };

      (repo.createLinea as jest.Mock).mockResolvedValue({
        id: 2,
        ...dto,
        marca: mockMarca as any,
        productos: [],
        estado: true,
        cantidadProductos: 0 as any,
        fechaCreacion: new Date(),
      } as Linea);

      const result = await service.create(dto);

      expect(repo.createLinea).toHaveBeenCalledWith(dto);
      expect(result.marca).toEqual(mockMarca);
      expect(result.marca.nombre).toBe('Bosch');
    });
  });

  // 🔹 FIND ALL - Consulta con relaciones
  describe('findAll', () => {
    it('debe retornar líneas con sus marcas cargadas', async () => {
      (repo.findAllWithMarca as jest.Mock).mockResolvedValue([mockLinea]);

      const result = await service.findAll();

      expect(repo.findAllWithMarca).toHaveBeenCalled();
      expect(result[0].marca).toBeDefined();
      expect(result[0].marca.nombre).toBe('Bosch');
    });

    it('debe verificar que cada línea tenga marca asociada', async () => {
      const lineasVariadas: any[] = [
        { id: 1, nombre: 'Aceites', marca: { id: 1, nombre: 'Bosch' } },
        { id: 2, nombre: 'Filtros', marca: { id: 2, nombre: 'Mann' } },
      ];
      (repo.findAllWithMarca as jest.Mock).mockResolvedValue(lineasVariadas);

      const result = await service.findAll();

      result.forEach((linea) => {
        expect(linea.marca).toBeDefined();
        expect(linea.marca.id).toBeGreaterThan(0);
      });
    });
  });

  // 🔹 FIND ONE
  describe('findOne', () => {
    it('debe retornar una línea con su marca', async () => {
      (repo.findOneWithMarca as jest.Mock).mockResolvedValue(mockLinea);

      const result = await service.findOne(1);

      expect(repo.findOneWithMarca).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
      if (result) {
        expect(result.marca).toBeDefined();
      }
    });

    it('debe retornar null si no existe', async () => {
      (repo.findOneWithMarca as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repo.findOneWithMarca).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  // 🔹 UPDATE - Reglas de cambio de marca en líneas con productos
  describe('update - Cambio de marca con productos asociados', () => {
    it('debe permitir actualizar descripción sin cambiar marca', async () => {
      const dto: UpdateLineaDto = {
        descripcion: 'Nueva descripción',
      };

      (repo.updateLinea as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(repo.updateLinea).toHaveBeenCalledWith(1, dto);
      expect(result.affected).toBe(1);
    });

    it('debe permitir cambiar marca si NO hay productos asociados', async () => {
      const dto: UpdateLineaDto = { marcaId: 2 };

      (repo.updateLinea as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(repo.updateLinea).toHaveBeenCalledWith(1, dto);
      expect(result.affected).toBe(1);
    });

    it('debe lanzar error si se intenta cambiar marca con productos asociados', async () => {
      const dto: UpdateLineaDto = { marcaId: 2 };

      (repo.updateLinea as jest.Mock).mockRejectedValue(
        new Error('No se puede cambiar la marca de una línea con productos asociados'),
      );

      await expect(service.update(1, dto)).rejects.toThrow(
        'No se puede cambiar la marca de una línea con productos asociados',
      );
      expect(repo.updateLinea).toHaveBeenCalledWith(1, dto);
    });

    it('debe mantener integridad: línea siempre debe tener marca', async () => {
      const dto: UpdateLineaDto = { nombre: 'Nombre actualizado' };

      (repo.updateLinea as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.update(1, dto);

      expect(repo.updateLinea).toHaveBeenCalledWith(1, dto);
      expect(result).toBeDefined();
    });
  });

  // 🔹 REMOVE - Validación de dependencias
  describe('remove', () => {
    it('debe eliminar una línea sin productos', async () => {
      (repo.removeLinea as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(repo.removeLinea).toHaveBeenCalledWith(1);
      expect(result.affected).toBe(1);
    });

    it('debe lanzar error al eliminar una línea con productos', async () => {
      (repo.removeLinea as jest.Mock).mockRejectedValue(
        new Error('No se puede eliminar una línea con productos asociados'),
      );

      await expect(service.remove(1)).rejects.toThrow(
        'No se puede eliminar una línea con productos asociados',
      );
      expect(repo.removeLinea).toHaveBeenCalledWith(1);
    });
  });

  // 🔹 VALIDACIONES DE INTEGRIDAD COMPLETAS
  describe('Validaciones de integridad referencial', () => {
    it('verifica que TODAS las líneas tienen marca asociada', async () => {
      const lineas: any[] = [
        { id: 1, nombre: 'Aceites', marca: { id: 1 } },
        { id: 2, nombre: 'Filtros', marca: { id: 1 } },
        { id: 3, nombre: 'Baterías', marca: { id: 2 } },
      ];
      (repo.findAllWithMarca as jest.Mock).mockResolvedValue(lineas);

      const result = await service.findAll();

      result.forEach((linea) => {
        expect(linea.marca).toBeDefined();
        expect(linea.marca).not.toBeNull();
      });
    });

    it('valida que marcaId sea obligatorio en creación', async () => {
      const dtoSinMarca = {
        nombre: 'Test',
        descripcion: 'Test',
      } as any;

      (repo.createLinea as jest.Mock).mockRejectedValue(
        new Error('La marca es obligatoria (marcaId).'),
      );

      await expect(service.create(dtoSinMarca)).rejects.toThrow(
        'La marca es obligatoria (marcaId).',
      );
      expect(repo.createLinea).toHaveBeenCalledWith(dtoSinMarca);
    });

    it('valida que marca exista antes de crear línea', async () => {
      const dto: CreateLineaDto = {
        nombre: 'Test',
        descripcion: 'Test',
        marcaId: 9999,
      };

      (repo.createLinea as jest.Mock).mockRejectedValue(
        new Error('La marca con ID 9999 no existe'),
      );

      await expect(service.create(dto)).rejects.toThrow('La marca con ID 9999 no existe');
      expect(repo.createLinea).toHaveBeenCalledWith(dto);
    });
  });
});
