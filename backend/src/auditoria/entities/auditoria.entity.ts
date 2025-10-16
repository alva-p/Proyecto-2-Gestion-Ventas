import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/users.entity';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: number;

  @Column({ type: 'varchar', length: 255 })
  accion: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @Column({ name: 'ip_origen', type: 'varchar', length: 45, nullable: true })
  ipOrigen: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  severidad: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string;
}
