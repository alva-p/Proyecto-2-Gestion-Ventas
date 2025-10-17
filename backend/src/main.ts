import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppDataSource } from './data-source'; // 👈 importa tu DataSource

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173', // dirección de tu Vite
    credentials: true,
  };
  app.enableCors(corsOptions);

  // 🧱 Inicializar conexión TypeORM
  await AppDataSource.initialize();
  // 🚀 Correr migraciones automáticamente
  await AppDataSource.runMigrations();
  console.log('✅ Migraciones aplicadas automáticamente');

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
