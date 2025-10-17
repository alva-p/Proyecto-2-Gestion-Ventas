
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  // Ruta temporal para hashear contraseñas (ELIMINAR EN PRODUCCIÓN)
  @Post('hash-password')
  async hashPassword(@Body() body: { password: string }) {
    const hash = await this.authService.hashPassword(body.password);
    return { 
      originalPassword: body.password,
      hashedPassword: hash,
      message: 'Copia el hashedPassword y actualízalo en Supabase en la columna contrasena'
    };
  }
}
