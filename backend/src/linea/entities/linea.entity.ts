//linea.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Marca } from '../../marcas/entities/marca.entity';
import { Producto } from '../../producto/entities/producto.entity';
import { BlobOptions } from 'buffer';

@Entity('linea')
export class Linea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ name: 'cantidad_productos', default: 0 })
  cantidadProductos: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @ManyToOne(() => Marca, (marca) => marca.lineas, { eager: true })
  @JoinColumn({ name: 'marcaId' })
  marca: Marca;

  @OneToMany(() => Producto, (producto) => producto.linea)
  productos: Producto[];
}
