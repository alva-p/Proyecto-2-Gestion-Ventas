import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Linea } from 'src/linea/entities/linea.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { Marca } from 'src/marcas/entities/marca.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @ManyToOne(() => Marca, { eager: true })
  marca: Marca;

  @ManyToOne(() => Linea, { eager: true })
  linea: Linea;

  @ManyToMany(() => Proveedor, (proveedor) => proveedor.productos)
  @JoinTable()
  proveedores: Proveedor[];

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  estado: boolean; // true = activo, false = inactivo
}
