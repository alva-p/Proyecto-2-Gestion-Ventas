export class Venta {}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.venta, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Producto, (producto) => producto.venta, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
