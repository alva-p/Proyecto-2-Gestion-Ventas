import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Marca } from 'src/marcas/entities/marca.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class Linea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: 'activo' })
  estado: string;

  @Column({ name: 'cantidad_productos', default: 0 })
  cantidadProductos: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @ManyToOne(() => Marca, (marca) => marca.lineas)
  marca: Marca;

  @OneToMany(() => Producto, (producto) => producto.linea)
  productos: Producto[];
}
