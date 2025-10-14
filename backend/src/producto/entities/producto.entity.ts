//producto.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Linea } from 'src/linea/entities/linea.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Venta } from 'src/venta/entities/venta.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @ManyToOne(() => Linea, (linea) => linea.productos, { eager: true })
  @JoinColumn({ name: 'lineaId' }) // 👈 crea FK lineaId → linea.id
  linea: Linea;

  // 👇 Relación N:N con proveedor
  @ManyToMany(() => Proveedor, (proveedor) => proveedor.productos, { eager: true })
  @JoinTable({
    name: 'producto_proveedores', // 👈 nombre de la tabla intermedia
    joinColumn: { name: 'productoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'proveedorId', referencedColumnName: 'id' },
  })
  proveedores: Proveedor[];

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  estado: boolean; // true = activo, false = inactivo

  // 👇 Relación N:N con Venta
  @ManyToMany(() => Venta, (venta) => venta.productos)
  venta: Venta[];
}
