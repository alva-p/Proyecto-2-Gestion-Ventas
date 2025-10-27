// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExistsPipe } from './pipes/exists.pipe';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173', // dirección de tu Vite
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Pipe global de validación y transformación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina propiedades no declaradas en los DTOs
      forbidNonWhitelisted: true, // lanza error si llegan propiedades no esperadas
      transform: true,            // convierte tipos automáticamente (ej: "5" → 5)
      transformOptions: {
        enableImplicitConversion: true, // permite conversiones automáticas sin usar @Type()
      },
    }),
  );

  // Correr migraciones automáticamente
  const dataSource = app.get(DataSource);
  ExistsPipe.setDataSource(dataSource);
  await dataSource.runMigrations();
  console.log('✅ Migraciones aplicadas automáticamente');

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
