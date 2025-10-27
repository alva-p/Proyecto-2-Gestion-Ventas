// backend/src/factura/entities/factura.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Venta } from '../../venta/entities/venta.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Venta, (venta) => venta.factura, { // Asumimos que agregarás 'factura' a Venta
    eager: true, // Carga la venta automáticamente al consultar la factura
    nullable: false, // Una factura NO puede existir sin una venta
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  numero_factura: string;

  @Column({ type: 'varchar', length: 255 })
  cliente_nombre: string;

  @Column({ type: 'varchar', length: 255 })
  cliente_documento: string;

  @Column({ type: 'char', length: 1, nullable: false, default: 'B' })
  tipo: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_emision: Date;
}
