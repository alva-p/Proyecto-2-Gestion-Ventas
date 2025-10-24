import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { Factura } from 'src/factura/entities/factura.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  // 👇 Relación N:N con Producto
  @ManyToMany(() => Producto, (productos) => productos.venta, { eager: true })
  @JoinTable({
    name: 'venta_producto', // 👈 nombre de la tabla intermedia
    joinColumn: { name: 'ventaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productoId', referencedColumnName: 'id' },
  })
  productos: Producto[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  importe_total: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  @OneToOne(() => Factura, (factura) => factura.venta, { nullable: true })
  factura: Factura; // Puede ser nula si la venta aún no se facturó
}
