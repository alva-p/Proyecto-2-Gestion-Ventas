import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import { RoleName } from '../rol/entities/rol.enum';
import { LoginAuthDto } from './dto/login-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    // Validar campos obligatorios para registro
    if (!createAuthDto.nombre) {
      throw new BadRequestException('El nombre es obligatorio para el registro');
    }

    // Busca el rol admin en la base de datos
    const rolAdmin = await this.usersService['rolRepository'].findOne({
      where: { nombre: RoleName.Admin },
    });
    if (!rolAdmin) throw new BadRequestException('No existe el rol administrador');

    const user = await this.usersService.create({
      nombre: createAuthDto.nombre,
      correo: createAuthDto.correo,
      contrasena: createAuthDto.contrasena,
      rol_id: rolAdmin.id, // fuerza el rol admin
      activo: true,
    });
    return { message: 'Usuario registrado correctamente', user };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService['userRepository'].findOne({
      where: { correo: loginAuthDto.correo },
      relations: ['rol'],
    });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const isMatch = await bcrypt.compare(loginAuthDto.contrasena, user.contrasena);
    if (!isMatch) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: user.id, correo: user.correo, rol: user.rol.nombre };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user };
  }

  // Método temporal de ayuda para hashear contraseñas
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
