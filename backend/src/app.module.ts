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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '6543', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
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
      synchronize: true,
      ssl: { rejectUnauthorized: false },
      extra: { max: 5,
        connectionTimeoutMillis: 5000, // espera corta
        idleTimeoutMillis: 2000, // corta inactivas rápido
        keepAlive: false, // no mantiene sockets abiertos
        statement_timeout: 10000, // mata queries muy largas
       },
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
