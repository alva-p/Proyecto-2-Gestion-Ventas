import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, name: 'contacto_nombre' })
  contactoNombre: string;

  @Column({ type: 'varchar', length: 100, name: 'contacto_email' })
  contactoEmail: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 150 })
  direccion: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'date', name: 'fecha_registro', default: () => 'CURRENT_DATE' })
  fechaRegistro: Date;

  @Column({ name: 'cantidad_productos', default: 0 })
  cantidadProductos: number;
  // 👇 Relación N:N con producto
  @ManyToMany(() => Producto, (producto) => producto.proveedores)
  productos: Producto[];
}
