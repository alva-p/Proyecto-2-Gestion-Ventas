import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { UsersModule } from './users/users.module';
import { VentasModule } from './ventas/ventas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductoModule, ProveedorModule, UsersModule, VentasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
