import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExistsPipe } from './pipes/exists.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Correr migraciones automáticamente
  const dataSource = app.get(DataSource);
  ExistsPipe.setDataSource(dataSource);
  await dataSource.runMigrations();
  console.log('✅ Migraciones aplicadas automáticamente');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on http://0.0.0.0:${port}`);
}
bootstrap();
