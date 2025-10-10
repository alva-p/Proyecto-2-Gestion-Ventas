import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { UsersModule } from './users/users.module';
import { VentaModule } from './venta/venta.module';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { LineaModule } from './linea/linea.module';
import { MarcasModule } from './marcas/marcas.module';

// (Opcional) importaciones de entidades si querés mantener control manual
import { Producto } from './producto/entities/producto.entity';
import { Proveedor } from './proveedor/entities/proveedor.entity';
import { User } from './users/entities/users.entity';
import { Venta } from './venta/entities/venta.entity';
import { Rol } from './rol/entities/rol.entity';
import { Auditoria } from './auditoria/entities/auditoria.entity';
import { Linea } from './linea/entities/linea.entity';
import { Marca } from './marcas/entities/marca.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false, // ✅ en local usa .env; en Render se ignora automáticamente
    }),

    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Producto, Proveedor, User, Venta, Rol, Auditoria, Linea, Marca],
  autoLoadEntities: true,
  synchronize: false,
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 3,                    // menos conexiones simultáneas
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 2000,   // cierra las inactivas rápido
    keepAlive: false,          // no mantiene conexiones persistentes
    statement_timeout: 10000,  // evita queries largas
  },
}),


    // Módulos de tu aplicación
    ProductoModule,
    ProveedorModule,
    UsersModule,
    VentaModule,
    AuthModule,
    RolModule,
    AuditoriaModule,
    LineaModule,
    MarcasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
