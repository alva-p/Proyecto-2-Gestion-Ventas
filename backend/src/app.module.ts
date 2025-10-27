import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos de tu aplicación
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { UsersModule } from './users/users.module';
import { VentaModule } from './venta/venta.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './rol/rol.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { LineaModule } from './linea/linea.module';
import { MarcasModule } from './marcas/marcas.module';

// Entidades (control manual opcional)
import { Producto } from './producto/entities/producto.entity';
import { Proveedor } from './proveedor/entities/proveedor.entity';
import { User } from './users/entities/users.entity';
import { Venta } from './venta/entities/venta.entity';
import { Rol } from './rol/entities/rol.entity';
import { Auditoria } from './auditoria/entities/auditoria.entity';
import { Linea } from './linea/entities/linea.entity';
import { Marca } from './marcas/entities/marca.entity';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    // ✅ Carga global del ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false, // usa .env localmente; Render usa variables de entorno
    }),

    // ✅ Conexión estable para Supabase (puerto 6543 con pooler)
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ✅ conexión unificada
  entities: [
    Producto,
    Proveedor,
    User,
    Venta,
    Rol,
    Auditoria,
    Linea,
    Marca,
  ],
  autoLoadEntities: true,
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // ❗ mantenelo en false para no perder datos
  ssl: {
    rejectUnauthorized: false, // ⚡ necesario para Supabase/Render
  },
  extra: {
    max: 10, // conexiones simultáneas
    connectionTimeoutMillis: 30000, // 30 segundos
    idleTimeoutMillis: 10000, // 10 segundos
    keepAlive: true, // mantiene conexión activa
    keepAliveInitialDelayMillis: 10000,
  },
  logging: true, // 👀 opcional: te ayuda a ver en logs si la conexión se hace correctamente
}),


    // 🔹 Módulos de tu aplicación
    ProductoModule,
    ProveedorModule,
    UsersModule,
    VentaModule,
    AuthModule,
    RolesModule,
    AuditoriaModule,
    LineaModule,
    MarcasModule,
    FacturaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
