import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { ExistsPipe } from '../pipes/exists.pipe';
import { Linea } from '../linea/entities/linea.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Producto } from './entities/producto.entity';

describe('Producto (Integración)', () => {
  let app: INestApplication;
  let httpServer: any;
  let lineaCreada: Linea;
  let proveedorCreado: Proveedor;
  let productoCreado: Producto;
  let marcaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const dataSource = app.get(DataSource);
    ExistsPipe.setDataSource(dataSource);
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Debería crear una marca base', async () => {
    const res = await request(httpServer)
      .post('/marca')
      .send({ nombre: 'Marca Test'})
      .expect(201);

    marcaId = res.body.id;
    expect(marcaId).toBeDefined();
  });

  it('Debería crear una línea base (dependencia)', async () => {
    const res = await request(httpServer)
      // 👇 cambia a /lineas si tu controlador usa plural
      .post('/lineas')
      .send({
        nombre: 'Línea Test',
        descripcion: 'Descripción línea test',
        marcaId,
      })
      .expect(201);

    lineaCreada = res.body;
    expect(lineaCreada).toHaveProperty('id');
  });

  it('Debería crear un proveedor base', async () => {
    const res = await request(httpServer)
      .post('/proveedor')
      .send({
        nombre: 'Proveedor Test',
        contactoNombre: 'Juan Pérez',
        contactoEmail: 'juan@test.com',
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
        estado: true,
      })
      .expect(201);

    proveedorCreado = res.body;
    expect(proveedorCreado).toHaveProperty('id');
  });

  it('Debería crear un producto válido con línea y proveedor', async () => {
    expect(lineaCreada).toBeDefined();
    expect(proveedorCreado).toBeDefined();

    const dto = {
      nombre: 'Aceite 10W40',
      descripcion: 'Aceite sintético',
      precio: 1200.5,
      stock: 15,
      lineaId: lineaCreada.id,
      proveedorId: [proveedorCreado.id],
    };

    const res = await request(httpServer).post('/producto').send(dto).expect(201);
    productoCreado = res.body;

    expect(productoCreado).toHaveProperty('id');
    expect(productoCreado.linea.id).toBe(lineaCreada.id);
    expect(productoCreado.proveedores[0].id).toBe(proveedorCreado.id);
  });

  it('Debería listar todos los productos', async () => {
    const res = await request(httpServer).get('/producto').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Debería obtener un producto por ID', async () => {
    const res = await request(httpServer)
      .get(`/producto/${productoCreado.id}`)
      .expect(200);

    expect(res.body.id).toBe(productoCreado.id);
  });

  it('Debería actualizar el producto', async () => {
    const res = await request(httpServer)
      .patch(`/producto/${productoCreado.id}`)
      .send({ nombre: 'Aceite Premium', stock: 25 })
      .expect(200);

    expect(res.body.nombre).toBe('Aceite Premium');
    expect(res.body.stock).toBe(25);
  });

  it('Debería eliminar el producto', async () => {
    await request(httpServer).delete(`/producto/${productoCreado.id}`).expect(200);
  });
});
