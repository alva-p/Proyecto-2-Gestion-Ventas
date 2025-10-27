import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExistsPipe } from './pipes/exists.pipe';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  // ✅ CORS simple - permite todos los orígenes
  app.enableCors();

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

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${port}`);
}
bootstrap();
