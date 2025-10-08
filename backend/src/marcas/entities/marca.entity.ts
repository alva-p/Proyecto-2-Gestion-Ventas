//marca.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Linea } from 'src/linea/entities/linea.entity';

@Entity('marca')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Linea, (linea) => linea.marca)
  lineas: Linea[];
}