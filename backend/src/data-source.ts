import { DataSource } from 'typeorm';
import { Rol } from './rol/entities/rol.entity';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // OBLIGATORIO para Supabase
  },
  entities: [Rol],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // nunca usar true con migraciones
  extra: {
    max: 10,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  },
});
