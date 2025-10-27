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

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://proyecto-2-gestion-ventas.vercel.app',
  ];

  // Agregar FRONTEND_URL si está definida
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman) o desde orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
