import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoleName } from './rol.enum';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
  })
  nombre: RoleName;

  @Column({ nullable: true })
  descripcion?: string;
}
