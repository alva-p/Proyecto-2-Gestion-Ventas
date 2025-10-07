import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'varchar', length: 20 })
  estado: string;

  @Column({ type: 'date', name: 'fecha_registro', default: () => 'CURRENT_DATE' })
  fechaRegistro: Date;
}
