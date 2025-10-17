import { DataSource } from 'typeorm';
import { Rol } from './rol/entities/rol.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // OBLIGATORIO para Supabase
  },
  entities: [Rol],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // nunca usar true con migraciones
});
