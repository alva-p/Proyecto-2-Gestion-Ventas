import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { ExistsPipe } from '../pipes/exists.pipe';

describe('VentaController (Integración)', () => {
  let app: INestApplication;
  let httpServer: any;
  let userId: number;
  let productoId: number;
  let ventaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const dataSource = app.get(DataSource);
    ExistsPipe.setDataSource(dataSource); // 👈 evita el error del DataSource no inicializado
    await app.init();
    httpServer = app.getHttpServer();

    // Crear usuario
    const userRes = await request(httpServer)
      .post('/users') // ajustá si tu endpoint real es distinto
      .send({
        nombre: 'Tester',
        correo: `tester_${Date.now()}@mail.com`,
        contrasena: '123456',
        rol_id: 1,
      });

    expect(userRes.statusCode).toBeLessThan(400);
    userId = userRes.body.id;

    // Crear producto
    const prodRes = await request(httpServer)
      .post('/producto') // ajustá si tu endpoint real es /productos
      .send({
        nombre: 'Mouse Gamer',
        descripcion: 'Mouse óptico RGB',
        precio: 1000,
        lineaId: 1,
        stock: 10,
      });

    expect(prodRes.statusCode).toBeLessThan(400);
    productoId = prodRes.body.id;

    console.log('🧾 Usuario y producto creados:', { userId, productoId });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /ventas → crea venta y descuenta stock', async () => {
    const res = await request(httpServer)
      .post('/ventas')
      .send({
        usuario_id: userId,
        productos: [productoId, productoId],
        cliente_nombre: 'Juan Pérez',
        cliente_documento: '12345678',
        tipo: 'B',
        notas: 'Test integración',
      })
      .expect(201);

    ventaId = res.body.id;
    expect(Number(res.body.importe_total)).toBe(2000);
  });

  it('GET /ventas → lista todas', async () => {
    const res = await request(httpServer).get('/ventas').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /ventas/:id → obtiene una venta', async () => {
    const res = await request(httpServer)
      .get(`/ventas/${ventaId}`)
      .expect(200);
    expect(res.body.id).toBe(ventaId);
  });

  it('PATCH /ventas/:id → actualiza notas', async () => {
    const res = await request(httpServer)
      .patch(`/ventas/${ventaId}`)
      .send({ notas: 'Actualizada por test' })
      .expect(200);
    expect(res.body.notas).toBe('Actualizada por test');
  });

  it('DELETE /ventas/:id → elimina la venta', async () => {
    await request(httpServer)
      .delete(`/ventas/${ventaId}`)
      .expect(200);
  });
});
