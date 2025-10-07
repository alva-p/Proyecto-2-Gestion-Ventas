import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Linea } from 'src/linea/entities/linea.entity';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';    
import { Producto } from 'src/producto/entities/producto.entity';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Linea, (linea) => linea.marca)
  lineas: Linea[];

  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}