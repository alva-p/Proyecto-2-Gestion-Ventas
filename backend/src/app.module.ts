// backend/src/app.module.ts
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,
      host: !process.env.DATABASE_URL ? process.env.DB_HOST : undefined,
      port: !process.env.DATABASE_URL ? parseInt(process.env.DB_PORT || '6543', 10) : undefined,
      username: !process.env.DATABASE_URL ? process.env.DB_USER : undefined,
      password: !process.env.DATABASE_URL ? process.env.DB_PASS : undefined,
      database: !process.env.DATABASE_URL ? process.env.DB_NAME : undefined,
      entities: [Producto, Proveedor, User, Venta, Rol, Auditoria, Linea, Marca],
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 5,
      },
    }),

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
